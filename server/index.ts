import express from "express";
import cors from "cors";
import db, { initSchema } from "./db.js";
import { parseFilters } from "./filters.js";

const app = express();
const PORT = parseInt(process.env.API_PORT || "3001", 10);

app.use(cors());
app.use(express.json());

// =====================
// SSE — push data-change notifications to connected browsers
// =====================
const sseClients = new Set<import("express").Response>();

function broadcast(resource: string) {
  const msg = `data: ${JSON.stringify({ resource })}\n\n`;
  for (const client of sseClients) {
    client.write(msg);
  }
}

app.get("/api/events", (_req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });
  res.write("\n"); // flush headers
  sseClients.add(res);
  _req.on("close", () => sseClients.delete(res));
});

// Initialize database schema
initSchema();

// JSON columns that need parse/stringify
const JSON_COLUMNS: Record<string, string[]> = {
  contacts: [
    "email_jsonb",
    "phone_jsonb",
    "avatar",
    "tags",
    "client_preferences",
  ],
  companies: ["logo", "context_links"],
  members: ["avatar"],
  contact_notes: ["attachments"],
  orders: [],
  tasks: [],
  tags: [],
  kb_pages: [],
  page_content: ["content"],
};

// Tables that have summary views
const SUMMARY_VIEWS: Record<string, string> = {
  contacts: "contacts_summary",
  companies: "companies_summary",
  orders: "orders_summary",
};

// The actual writable table (strip _summary suffix)
function writableTable(resource: string): string {
  return resource.endsWith("_summary")
    ? resource.replace("_summary", "")
    : resource;
}

// Valid resources
const VALID_RESOURCES = new Set([
  "contacts",
  "companies",
  "orders",
  "contact_notes",
  "tasks",
  "members",
  "tags",
  "kb_pages",
  "page_content",
  "contacts_summary",
  "companies_summary",
  "orders_summary",
]);

function validateResource(resource: string): boolean {
  return VALID_RESOURCES.has(resource);
}

// Parse a row from SQLite, deserializing JSON columns
function parseRow(resource: string, row: any): any {
  if (!row) return row;
  const base = writableTable(resource);
  const jsonCols = JSON_COLUMNS[base] || [];
  const parsed = { ...row };
  for (const col of jsonCols) {
    if (parsed[col] && typeof parsed[col] === "string") {
      try {
        parsed[col] = JSON.parse(parsed[col]);
      } catch {
        // leave as string if parse fails
      }
    }
  }
  // Convert SQLite integer booleans to JS booleans
  if ("has_newsletter" in parsed)
    parsed.has_newsletter = Boolean(parsed.has_newsletter);
  if ("administrator" in parsed)
    parsed.administrator = Boolean(parsed.administrator);
  if ("disabled" in parsed) parsed.disabled = Boolean(parsed.disabled);
  return parsed;
}

// Serialize data for SQLite, stringifying JSON columns
function serializeData(
  resource: string,
  data: Record<string, any>
): Record<string, any> {
  const base = writableTable(resource);
  const jsonCols = JSON_COLUMNS[base] || [];
  const serialized = { ...data };

  // Remove id from data (it's auto-generated or used in WHERE)
  delete serialized.id;

  for (const col of jsonCols) {
    if (col in serialized && typeof serialized[col] !== "string") {
      serialized[col] = JSON.stringify(serialized[col]);
    }
  }

  // Convert booleans to integers for SQLite
  if ("has_newsletter" in serialized)
    serialized.has_newsletter = serialized.has_newsletter ? 1 : 0;
  if ("administrator" in serialized)
    serialized.administrator = serialized.administrator ? 1 : 0;
  if ("disabled" in serialized)
    serialized.disabled = serialized.disabled ? 1 : 0;

  return serialized;
}

// =====================
// Fixed routes (must be before :resource wildcard)
// =====================

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// POST /api/custom/signup
app.post("/api/custom/signup", (req, res) => {
  try {
    const { email, password, first_name, last_name } = req.body;

    const result = db
      .prepare(
        `INSERT INTO members (email, password, first_name, last_name, role, administrator)
         VALUES (?, ?, ?, ?, 'admin', 1)`
      )
      .run(email, password, first_name, last_name);

    res.json({
      id: result.lastInsertRowid.toString(),
      email,
      password,
    });
  } catch (err: any) {
    console.error("POST /api/custom/signup error:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/custom/is-initialized
app.get("/api/custom/is-initialized", (_req, res) => {
  try {
    const row = db
      .prepare("SELECT COUNT(*) as count FROM members")
      .get() as { count: number };
    res.json({ initialized: row.count > 0 });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/custom/members-create
app.post("/api/custom/members-create", (req, res) => {
  try {
    const data = serializeData("members", req.body);
    const columns = Object.keys(data);
    const values = Object.values(data);
    const placeholders = columns.map(() => "?").join(", ");

    const result = db
      .prepare(
        `INSERT INTO members (${columns.join(", ")}) VALUES (${placeholders})`
      )
      .run(...values);

    const row = db
      .prepare("SELECT * FROM members WHERE id = ?")
      .get(result.lastInsertRowid);
    res.json(parseRow("members", row));
  } catch (err: any) {
    console.error("POST /api/custom/members-create error:", err);
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/custom/members-update/:id
app.patch("/api/custom/members-update/:id", (req, res) => {
  try {
    const { id } = req.params;
    const data = serializeData("members", req.body);
    const columns = Object.keys(data);
    const values = Object.values(data);

    if (columns.length > 0) {
      const sets = columns.map((col) => `${col} = ?`).join(", ");
      db.prepare(`UPDATE members SET ${sets} WHERE id = ?`).run(...values, id);
    }

    const row = db.prepare("SELECT * FROM members WHERE id = ?").get(id);
    if (!row) {
      return res.status(404).json({ error: "Not found" });
    }
    res.json(parseRow("members", row));
  } catch (err: any) {
    console.error("PATCH /api/custom/members-update error:", err);
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/custom/update-password/:id
app.patch("/api/custom/update-password/:id", (_req, res) => {
  try {
    // In single-user SQLite mode, password update is a no-op (no real auth)
    res.json(true);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/custom/merge-contacts
app.post("/api/custom/merge-contacts", (req, res) => {
  try {
    const { sourceId, targetId } = req.body;

    // Run merge in a transaction
    const merge = db.transaction(() => {
      const winner = db
        .prepare("SELECT * FROM contacts WHERE id = ?")
        .get(targetId) as any;
      const loser = db
        .prepare("SELECT * FROM contacts WHERE id = ?")
        .get(sourceId) as any;

      if (!winner || !loser) {
        throw new Error("Contact not found");
      }

      // Reassign tasks, notes, orders
      db.prepare("UPDATE tasks SET contact_id = ? WHERE contact_id = ?").run(targetId, sourceId);
      db.prepare("UPDATE contact_notes SET contact_id = ? WHERE contact_id = ?").run(targetId, sourceId);
      db.prepare("UPDATE orders SET contact_id = ? WHERE contact_id = ?").run(targetId, sourceId);

      // Merge JSON arrays
      const parse = (s: string) => { try { return JSON.parse(s || "[]"); } catch { return []; } };
      const mergedEmails = mergeArraysByKey(parse(winner.email_jsonb), parse(loser.email_jsonb), "email");
      const mergedPhones = mergeArraysByKey(parse(winner.phone_jsonb), parse(loser.phone_jsonb), "phone");
      const mergedTags = [...new Set([...parse(winner.tags), ...parse(loser.tags)])];

      db.prepare(
        `UPDATE contacts SET
          email_jsonb = ?, phone_jsonb = ?, tags = ?,
          avatar = COALESCE(?, avatar),
          gender = COALESCE(gender, ?),
          company_id = COALESCE(company_id, ?),
          company_name = COALESCE(company_name, ?),
          linkedin_url = COALESCE(linkedin_url, ?),
          background = COALESCE(background, ?)
        WHERE id = ?`
      ).run(
        JSON.stringify(mergedEmails), JSON.stringify(mergedPhones), JSON.stringify(mergedTags),
        loser.avatar, loser.gender, loser.company_id, loser.company_name,
        loser.linkedin_url, loser.background, targetId
      );

      db.prepare("DELETE FROM contacts WHERE id = ?").run(sourceId);
    });

    merge();
    res.json({ success: true });
  } catch (err: any) {
    console.error("POST /api/custom/merge-contacts error:", err);
    res.status(500).json({ error: err.message });
  }
});

// =====================
// KB Pages Endpoints
// =====================

// GET /api/kb_pages — list all, ordered by sort_order
app.get("/api/kb_pages", (_req, res) => {
  try {
    const rows = db.prepare("SELECT * FROM kb_pages ORDER BY sort_order ASC").all();
    const total = (rows as any[]).length;
    res.set("Content-Range", `kb_pages 0-${Math.max(total - 1, 0)}/${total}`);
    res.set("Access-Control-Expose-Headers", "Content-Range");
    res.json(rows);
  } catch (err: any) {
    console.error("GET /api/kb_pages error:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/kb_pages/:id — get one by id
app.get("/api/kb_pages/:id", (req, res) => {
  try {
    const { id } = req.params;
    const row = db.prepare("SELECT * FROM kb_pages WHERE id = ?").get(id);
    if (!row) {
      return res.status(404).json({ error: "Not found" });
    }
    res.json(row);
  } catch (err: any) {
    console.error("GET /api/kb_pages/:id error:", err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/kb_pages — create new
app.post("/api/kb_pages", (req, res) => {
  try {
    const { slug, title, icon, sort_order } = req.body;
    const result = db
      .prepare(
        "INSERT INTO kb_pages (slug, title, icon, sort_order) VALUES (?, ?, ?, ?)"
      )
      .run(slug, title, icon ?? "FileText", sort_order ?? 0);
    const row = db.prepare("SELECT * FROM kb_pages WHERE id = ?").get(result.lastInsertRowid);
    broadcast("kb_pages");
    res.status(201).json(row);
  } catch (err: any) {
    console.error("POST /api/kb_pages error:", err);
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/kb_pages/:id — update
app.put("/api/kb_pages/:id", (req, res) => {
  try {
    const { id } = req.params;
    const { slug, title, icon, sort_order } = req.body;

    const existing = db.prepare("SELECT * FROM kb_pages WHERE id = ?").get(id);
    if (!existing) {
      return res.status(404).json({ error: "Not found" });
    }

    db.prepare(
      `UPDATE kb_pages SET
        slug = COALESCE(?, slug),
        title = COALESCE(?, title),
        icon = COALESCE(?, icon),
        sort_order = COALESCE(?, sort_order),
        updated_at = datetime('now')
      WHERE id = ?`
    ).run(slug ?? null, title ?? null, icon ?? null, sort_order ?? null, id);

    const row = db.prepare("SELECT * FROM kb_pages WHERE id = ?").get(id);
    broadcast("kb_pages");
    res.json(row);
  } catch (err: any) {
    console.error("PUT /api/kb_pages/:id error:", err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/kb_pages/:id — delete
app.delete("/api/kb_pages/:id", (req, res) => {
  try {
    const { id } = req.params;
    const row = db.prepare("SELECT * FROM kb_pages WHERE id = ?").get(id);
    if (!row) {
      return res.status(404).json({ error: "Not found" });
    }
    db.prepare("DELETE FROM kb_pages WHERE id = ?").run(id);
    broadcast("kb_pages");
    res.json(row);
  } catch (err: any) {
    console.error("DELETE /api/kb_pages/:id error:", err);
    res.status(500).json({ error: err.message });
  }
});

// =====================
// Generic CRUD Endpoints (wildcard :resource — MUST come after fixed routes)
// =====================

// GET /api/:resource - getList
app.get("/api/:resource", (req, res) => {
  try {
    const { resource } = req.params;
    if (!validateResource(resource)) {
      return res.status(400).json({ error: `Invalid resource: ${resource}` });
    }

    // Parse query params
    const sort = req.query.sort
      ? JSON.parse(req.query.sort as string)
      : ["id", "ASC"];
    const range = req.query.range
      ? JSON.parse(req.query.range as string)
      : [0, 24];
    const filter = req.query.filter
      ? JSON.parse(req.query.filter as string)
      : {};

    // Use summary view for list operations
    const table = SUMMARY_VIEWS[resource] || resource;
    const [sortField, sortOrder] = sort;
    const [rangeStart, rangeEnd] = range;
    const limit = rangeEnd - rangeStart + 1;
    const offset = rangeStart;

    // Parse filters
    const { where, params } = parseFilters(filter);

    // Sanitize sort field (basic protection)
    const safeSortField = sortField.replace(/[^a-zA-Z0-9_]/g, "");
    const safeSortOrder = sortOrder === "DESC" ? "DESC" : "ASC";

    // Get total count
    const countResult = db
      .prepare(`SELECT COUNT(*) as total FROM ${table} WHERE ${where}`)
      .get(...params) as { total: number };

    // Get paginated data
    const rows = db
      .prepare(
        `SELECT * FROM ${table} WHERE ${where} ORDER BY ${safeSortField} ${safeSortOrder} LIMIT ? OFFSET ?`
      )
      .all(...params, limit, offset) as any[];

    const data = rows.map((row) => parseRow(resource, row));

    // Set headers for ra-data-simple-rest
    res.set(
      "Content-Range",
      `${resource} ${rangeStart}-${Math.min(rangeEnd, countResult.total - 1)}/${countResult.total}`
    );
    res.set("Access-Control-Expose-Headers", "Content-Range");
    res.json(data);
  } catch (err: any) {
    console.error("GET /api/:resource error:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/:resource/:id - getOne
app.get("/api/:resource/:id", (req, res) => {
  try {
    const { resource, id } = req.params;
    if (!validateResource(resource)) {
      return res.status(400).json({ error: `Invalid resource: ${resource}` });
    }

    // Use summary view for getOne too
    const table = SUMMARY_VIEWS[resource] || resource;

    const row = db.prepare(`SELECT * FROM ${table} WHERE id = ?`).get(id);
    if (!row) {
      return res.status(404).json({ error: "Not found" });
    }

    res.json(parseRow(resource, row));
  } catch (err: any) {
    console.error("GET /api/:resource/:id error:", err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/:resource - create
app.post("/api/:resource", (req, res) => {
  try {
    const { resource } = req.params;
    if (!validateResource(resource)) {
      return res.status(400).json({ error: `Invalid resource: ${resource}` });
    }

    const table = writableTable(resource);
    const data = serializeData(resource, req.body);
    const columns = Object.keys(data);
    const values = Object.values(data);

    if (columns.length === 0) {
      // Insert with defaults
      const result = db.prepare(`INSERT INTO ${table} DEFAULT VALUES`).run();
      const row = db
        .prepare(`SELECT * FROM ${table} WHERE id = ?`)
        .get(result.lastInsertRowid);
      return res.status(201).json(parseRow(resource, row));
    }

    const placeholders = columns.map(() => "?").join(", ");
    const result = db
      .prepare(
        `INSERT INTO ${table} (${columns.join(", ")}) VALUES (${placeholders})`
      )
      .run(...values);

    const row = db
      .prepare(`SELECT * FROM ${table} WHERE id = ?`)
      .get(result.lastInsertRowid);
    broadcast(resource);
    res.status(201).json(parseRow(resource, row));
  } catch (err: any) {
    console.error("POST /api/:resource error:", err);
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/:resource/:id - update
app.put("/api/:resource/:id", (req, res) => {
  try {
    const { resource, id } = req.params;
    if (!validateResource(resource)) {
      return res.status(400).json({ error: `Invalid resource: ${resource}` });
    }

    const table = writableTable(resource);
    const data = serializeData(resource, req.body);
    const columns = Object.keys(data);
    const values = Object.values(data);

    if (columns.length === 0) {
      const row = db.prepare(`SELECT * FROM ${table} WHERE id = ?`).get(id);
      return res.json(parseRow(resource, row));
    }

    const sets = columns.map((col) => `${col} = ?`).join(", ");
    db.prepare(`UPDATE ${table} SET ${sets} WHERE id = ?`).run(...values, id);

    const row = db.prepare(`SELECT * FROM ${table} WHERE id = ?`).get(id);
    if (!row) {
      return res.status(404).json({ error: "Not found" });
    }
    broadcast(resource);
    res.json(parseRow(resource, row));
  } catch (err: any) {
    console.error("PUT /api/:resource/:id error:", err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/:resource/:id - delete
app.delete("/api/:resource/:id", (req, res) => {
  try {
    const { resource, id } = req.params;
    if (!validateResource(resource)) {
      return res.status(400).json({ error: `Invalid resource: ${resource}` });
    }

    const table = writableTable(resource);

    const row = db.prepare(`SELECT * FROM ${table} WHERE id = ?`).get(id);
    if (!row) {
      return res.status(404).json({ error: "Not found" });
    }

    db.prepare(`DELETE FROM ${table} WHERE id = ?`).run(id);
    broadcast(resource);
    res.json(parseRow(resource, row));
  } catch (err: any) {
    console.error("DELETE /api/:resource/:id error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Bulk update: PUT /api/:resource (updateMany)
app.put("/api/:resource", (req, res) => {
  try {
    const { resource } = req.params;
    if (!validateResource(resource)) {
      return res.status(400).json({ error: `Invalid resource: ${resource}` });
    }

    const table = writableTable(resource);
    const { ids, data } = req.body;

    if (!Array.isArray(ids) || !data) {
      return res.status(400).json({ error: "ids and data required" });
    }

    const serialized = serializeData(resource, data);
    const columns = Object.keys(serialized);
    const values = Object.values(serialized);

    if (columns.length > 0) {
      const sets = columns.map((col) => `${col} = ?`).join(", ");
      const placeholders = ids.map(() => "?").join(",");
      db.prepare(
        `UPDATE ${table} SET ${sets} WHERE id IN (${placeholders})`
      ).run(...values, ...ids);
    }

    res.json(ids);
  } catch (err: any) {
    console.error("PUT /api/:resource (bulk) error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Bulk delete: DELETE /api/:resource (deleteMany)
app.delete("/api/:resource", (req, res) => {
  try {
    const { resource } = req.params;
    if (!validateResource(resource)) {
      return res.status(400).json({ error: `Invalid resource: ${resource}` });
    }

    const table = writableTable(resource);
    const ids = req.query.ids
      ? JSON.parse(req.query.ids as string)
      : req.body?.ids;

    if (!Array.isArray(ids)) {
      return res.status(400).json({ error: "ids required" });
    }

    const placeholders = ids.map(() => "?").join(",");
    db.prepare(`DELETE FROM ${table} WHERE id IN (${placeholders})`).run(
      ...ids
    );

    res.json(ids);
  } catch (err: any) {
    console.error("DELETE /api/:resource (bulk) error:", err);
    res.status(500).json({ error: err.message });
  }
});

function mergeArraysByKey(arr1: any[], arr2: any[], key: string): any[] {
  const map = new Map();
  for (const item of arr1) {
    if (item[key]) map.set(item[key], item);
  }
  for (const item of arr2) {
    if (item[key] && !map.has(item[key])) map.set(item[key], item);
  }
  return Array.from(map.values());
}

app.listen(PORT, () => {
  console.log(`SQLite API server running on http://localhost:${PORT}`);
  console.log(`Database: ${process.env.DATA_DIR || "data"}/crm.db`);
});
