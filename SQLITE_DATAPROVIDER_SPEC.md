# SQLite DataProvider Implementation Specification

## Overview

This document provides complete specifications for implementing a SQLite-based DataProvider as a drop-in replacement for the Supabase provider in the Atomic CRM template. The Atomic CRM uses react-admin (ra-core) with custom extensions for domain-specific functionality.

**Location:** `/Users/erezfern/Workspace/jarvis/my-jarvis/my-jarvis-template/src/components/atomic-crm/`

**Current Implementations:**
- **Supabase:** `providers/supabase/dataProvider.ts` (production)
- **FakeRest:** `providers/fakerest/dataProvider.ts` (dev/demo)

---

## Part 1: Core DataProvider Interface (ra-core)

The `DataProvider` from `ra-core` defines 12 core methods. Both Supabase and FakeRest implementations extend this:

### Required Core Methods

```typescript
interface DataProvider {
  // Read operations
  getList<T extends RaRecord = RaRecord>(
    resource: string,
    params: GetListParams
  ): Promise<GetListResult<T>>;

  getOne<T extends RaRecord = RaRecord>(
    resource: string,
    params: GetOneParams
  ): Promise<GetOneResult<T>>;

  getMany<T extends RaRecord = RaRecord>(
    resource: string,
    params: GetManyParams
  ): Promise<GetManyResult<T>>;

  getManyReference<T extends RaRecord = RaRecord>(
    resource: string,
    params: GetManyReferenceParams
  ): Promise<GetManyReferenceResult<T>>;

  // Write operations
  create<T extends RaRecord = RaRecord>(
    resource: string,
    params: CreateParams<T>
  ): Promise<CreateResult<T>>;

  update<T extends RaRecord = RaRecord>(
    resource: string,
    params: UpdateParams<T>
  ): Promise<UpdateResult<T>>;

  updateMany(
    resource: string,
    params: UpdateManyParams
  ): Promise<UpdateManyResult>;

  delete(
    resource: string,
    params: DeleteParams
  ): Promise<DeleteResult>;

  deleteMany(
    resource: string,
    params: DeleteManyParams
  ): Promise<DeleteManyResult>;
}
```

### Type Definitions

```typescript
// List operations
interface GetListParams {
  filter: Record<string, any>;
  sort: { field: string; order: "ASC" | "DESC" };
  pagination: { page: number; perPage: number };
  meta?: any;
}

interface GetListResult<T> {
  data: T[];
  total: number;
}

// Single record operations
interface GetOneParams {
  id: Identifier;
  meta?: any;
}

interface GetOneResult<T> {
  data: T;
}

// Multiple specific records
interface GetManyParams {
  ids: Identifier[];
  meta?: any;
}

interface GetManyResult<T> {
  data: T[];
}

// Reference (FK relationship)
interface GetManyReferenceParams {
  target: string; // e.g., "company_id"
  id: Identifier;
  filter: Record<string, any>;
  sort: { field: string; order: "ASC" | "DESC" };
  pagination: { page: number; perPage: number };
  meta?: any;
}

interface GetManyReferenceResult<T> {
  data: T[];
  total: number;
}

// Create
interface CreateParams<T> {
  data: T;
  meta?: any;
}

interface CreateResult<T> {
  data: T;
}

// Update
interface UpdateParams<T> {
  id: Identifier;
  data: Partial<T>;
  previousData: T;
  meta?: any;
}

interface UpdateResult<T> {
  data: T;
}

// Update Many
interface UpdateManyParams {
  ids: Identifier[];
  data: Record<string, any>;
  meta?: any;
}

interface UpdateManyResult {
  data?: Identifier[];
}

// Delete
interface DeleteParams {
  id: Identifier;
  meta?: any;
}

interface DeleteResult {
  data?: Record<string, any>;
}

// Delete Many
interface DeleteManyParams {
  ids: Identifier[];
  meta?: any;
}

interface DeleteManyResult {
  data?: Identifier[];
}

type Identifier = string | number;
type RaRecord = { id: Identifier } & Record<string, any>;
```

---

## Part 2: CRM Custom Methods

Beyond the standard DataProvider, the Atomic CRM adds these custom methods (see `/src/components/atomic-crm/types.ts`):

```typescript
interface CrmDataProvider extends DataProvider {
  // Authentication & initialization
  signUp(data: SignUpData): Promise<{ id: string; email: string; password: string }>;
  isInitialized(): Promise<boolean>;
  updatePassword(id: Identifier): Promise<true>;

  // Members (team) management
  membersCreate(data: MemberFormData): Promise<Member>;
  membersUpdate(id: Identifier, data: Partial<Omit<MemberFormData, "password">>): Promise<Member>;

  // Business operations
  getActivityLog(companyId?: Identifier): Promise<Activity[]>;
  mergeContacts(sourceId: Identifier, targetId: Identifier): Promise<any>;
}
```

### Custom Type Definitions

```typescript
// Sign-up
type SignUpData = {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
};

// Member form
type MemberRole = 'admin' | 'manager' | 'member';

type MemberFormData = {
  avatar?: string;
  email: string;
  password?: string;
  first_name: string;
  last_name: string;
  role: MemberRole;
  administrator: boolean;
  disabled: boolean;
};

type Member = {
  id: Identifier;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  password?: string; // FakeRest only
  role: MemberRole;
  administrator: boolean;
  avatar?: RAFile;
  disabled?: boolean;
};
```

---

## Part 3: All Resources and Schemas

The Atomic CRM manages 8 main resources. Below are complete field definitions:

### 1. **contacts** (primary resource)

```typescript
type Contact = {
  id: Identifier;
  first_name: string;
  last_name: string;
  title: string;
  company_id?: Identifier | null;
  company_name?: string; // Denormalized, updated via lifecycle callbacks
  email_jsonb: EmailAndType[];
  phone_jsonb: PhoneNumberAndType[];

  // Profile
  avatar?: Partial<RAFile>;
  gender: string;
  background: string;
  linkedin_url?: string | null;
  tags: Identifier[];

  // Engagement tracking
  first_seen: string; // ISO date
  last_seen: string; // ISO date
  last_contact_at?: string | null;
  has_newsletter: boolean;
  nb_tasks?: number;

  // Lifecycle
  lifecycle_stage: string; // 'new_lead', 'active', 'returning', 'vip', 'inactive'
  status: string; // Set by latest contact_note.status
  lead_source?: string | null;

  // Lead pipeline (for leads only)
  activity_status: ActivityStatus; // 'none' | 'new' | 'no_answer' | 'lost_lead' | 'follow_up' | 'appointment_set' | 'purchase'
  qualification_status: QualificationStatus; // 'select' | 'qualified' | 'disqualified'
  readiness_to_book?: ReadinessToBook | null; // 'high' | 'medium' | 'low'
  lost_reason?: LostReason | null; // 'price' | 'product_fit' | 'distance' | 'solved_with_competitor' | 'timing' | 'other'

  // Personal info
  date_of_birth?: string | null;
  followup_date?: string | null;
  followup_prompt?: string | null;

  // UTM tracking
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_content?: string | null;
  utm_term?: string | null;

  // External integrations
  manychat_id?: string | null;
  lead_bio?: string | null;

  // Preferences
  client_preferences?: ClientPreferences;

  // Owner
  member_id?: Identifier | null;
};

type EmailAndType = {
  email: string;
  type: "Work" | "Home" | "Other";
};

type PhoneNumberAndType = {
  phone: string;
  type: "Work" | "Home" | "Other";
};

type ActivityStatus = 'none' | 'new' | 'no_answer' | 'lost_lead' | 'out_of_queue' | 'follow_up' | 'no_show' | 'appointment_cancelled' | 'appointment_set' | 'purchase';
type QualificationStatus = 'select' | 'qualified' | 'disqualified';
type ReadinessToBook = 'high' | 'medium' | 'low';
type LostReason = 'price' | 'product_fit' | 'distance' | 'solved_with_competitor' | 'timing' | 'other';

type ClientPreferences = {
  data?: Record<string, any>;
  liked?: Record<string, any>;
  persona?: Record<string, any>;
};
```

### 2. **contacts_summary** (virtual view, in FakeRest it's the same as contacts)

Used for list views. In Supabase, queries to "contacts" are redirected to "contacts_summary" view which provides optimized data loading. For SQLite, you have two options:

- **Option A:** Implement a view in SQLite that aggregates contact data
- **Option B:** Handle the redirect in the data provider (like Supabase does):
  ```typescript
  if (resource === "contacts_summary") {
    // Return contacts with relevant fields only
  }
  ```

### 3. **companies**

```typescript
type Company = {
  id: Identifier;
  name: string;
  logo: RAFile; // File object with src, title, path
  sector: string;
  size: 1 | 10 | 50 | 250 | 500;

  // Web presence
  linkedin_url: string;
  website: string;

  // Contact info
  phone_number: string;
  address: string;
  zipcode: string;
  city: string;
  state_abbr: string;
  country: string;

  // Business info
  description: string;
  revenue: string; // e.g., "$1M", "$10M", "$100M", "$1B"
  tax_identifier: string;

  // CRM fields
  created_at: string; // ISO date
  nb_contacts?: number; // Denormalized, updated via callbacks
  context_links?: string[];

  // Owner
  member_id?: Identifier | null;
};
```

### 4. **companies_summary** (virtual view)

Like contacts_summary, redirected in getList/getOne calls.

### 5. **orders**

```typescript
type OrderStatus = 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';

type Order = {
  id: Identifier;

  // Relations
  contact_id: Identifier;
  member_id?: Identifier | null;

  // Denormalized contact info (from orders_summary view)
  contact_first_name?: string;
  contact_last_name?: string;
  member_first_name?: string;
  member_last_name?: string;

  // Status
  status: OrderStatus;

  // Dates
  order_date: string; // ISO date
  expected_delivery?: string | null;
  completed_date?: string | null;
  created_at?: string;
  updated_at?: string;

  // Details
  order_number?: string | null;
  description?: string | null;

  // Financial
  total_amount?: number | null;
  open_balance?: number | null;
  notes?: string;
};
```

### 6. **orders_summary** (virtual view)

Redirected like other summaries. Should include denormalized contact/member names.

### 7. **contact_notes**

```typescript
type ContactNote = {
  id: Identifier;
  contact_id: Identifier;
  member_id: Identifier;

  text: string;
  status: string; // Also stored in Contact.status (latest note)
  date: string; // ISO date

  // Attachments (file uploads)
  attachments?: AttachmentNote[];
};

type AttachmentNote = RAFile;
```

### 8. **tasks**

```typescript
type Task = {
  id: Identifier;

  // Relations
  contact_id: Identifier;
  member_id?: Identifier;

  // Content
  type: string; // Task type from configuration
  text: string;

  // Dates
  due_date: string; // ISO date
  done_date?: string | null; // null = incomplete, ISO string = completed
};
```

**Lifecycle callback:** When a task is marked complete/incomplete, Contact.nb_tasks is updated.

### 9. **members** (team/staff)

```typescript
type Member = {
  id: Identifier;
  user_id: string;

  // Auth info
  email: string;
  password?: string; // FakeRest only, never in real implementation

  // Profile
  first_name: string;
  last_name: string;
  avatar?: RAFile;

  // Permissions
  role: MemberRole; // 'admin' | 'manager' | 'member'
  administrator: boolean; // Legacy field, kept for compat
  disabled?: boolean; // Soft delete
};
```

### 10. **tags**

```typescript
type Tag = {
  id: number;
  name: string;
  color: string;
};
```

### 11. **activities** (computed, not stored)

```typescript
type Activity = {
  id: Identifier;
  type: typeof CONTACT_CREATED | typeof CONTACT_NOTE_CREATED;
  date: string; // ISO date
  member_id?: Identifier;
} & (
  | {
      type: typeof CONTACT_CREATED;
      company_id: Identifier;
      contact: Contact;
    }
  | {
      type: typeof CONTACT_NOTE_CREATED;
      contactNote: ContactNote;
    }
);
```

**Computed via:** `getActivityLog()` merges recent contacts and contact_notes, sorted by date DESC, limited to 250 results.

---

## Part 4: Filter Syntax (@operator pattern)

The Atomic CRM uses PostgREST/Supabase filter syntax:

### Operators

| Operator | Syntax | Example | Meaning |
|----------|--------|---------|---------|
| Equals | `field@eq` | `status@eq` = "active" | field == value |
| Not Equals | `field@neq` | `status@neq` = "deleted" | field != value |
| Greater Than | `field@gt` | `nb_tasks@gt` = 5 | field > value |
| Greater or Equal | `field@gte` | `nb_tasks@gte` = 5 | field >= value |
| Less Than | `field@lt` | `revenue@lt` = "$1M" | field < value |
| Less or Equal | `field@lte` | `nb_tasks@lte` = 5 | field <= value |
| Is Null | `field@is` | `date_of_birth@is` = null | field IS NULL |
| Not Null | `field@not.is` | `avatar@not.is` = null | field IS NOT NULL |
| In Array | `field@in` | `status@in` = "(active,pending)" | field IN array |
| Contains Array | `field@cs` | `tags@cs` = "{1,2,3}" | array contains values |
| Or (search) | `@or` | `{"first_name@ilike": "john", "last_name@ilike": "john"}` | OR condition |
| Case-insensitive Like | `field@ilike` | `first_name@ilike` = "%john%" | ILIKE (PostgREST) |

### Full Text Search Example

From `supabase/dataProvider.ts`, the search filter `q` is transformed to:

```typescript
// Input: { q: "john" }
// Output for contacts:
{
  "@or": {
    "first_name@ilike": "john",
    "last_name@ilike": "john",
    "company_name@ilike": "john",
    "title@ilike": "john",
    "email_fts@ilike": "john",  // Full-text search field
    "phone_fts@ilike": "john"   // Full-text search field
  }
}
```

### FakeRest Filter Transformation

See `providers/fakerest/internal/transformFilter.ts` - maps @operators to FakeRest syntax:

- `field@eq` → `field_eq`
- `field@neq` → `field_neq`
- `field@gt` → `field_gt`
- `field@gte` → `field_gte`
- `field@lt` → `field_lt`
- `field@lte` → `field_lte`
- `field@is` → `field_eq` (null handling)
- `field@not.is` → `field_neq` (null handling)
- `field@in` → `field_eq_any` with parsed array
- `field@cs` → `field` (contains filter) with parsed array
- `@or` → `q` (search query)

---

## Part 5: Lifecycle Callbacks

The dataProvider is wrapped with `withLifecycleCallbacks()` from ra-core. These hooks run before/after CRUD operations:

```typescript
interface ResourceCallbacks<T> {
  resource: string;

  // Before operations (modify params)
  beforeCreate?: (params: CreateParams<T>, dataProvider: DataProvider) => Promise<CreateParams<T>>;
  beforeUpdate?: (params: UpdateParams<T>, dataProvider: DataProvider) => Promise<UpdateParams<T>>;
  beforeDelete?: (params: any, dataProvider: DataProvider) => Promise<any>;
  beforeSave?: (data: T, resource: string, params: any) => Promise<T>;
  beforeGetList?: (params: GetListParams) => Promise<GetListParams>;

  // After operations (modify results)
  afterCreate?: (result: CreateResult<T>, dataProvider: DataProvider) => Promise<CreateResult<T>>;
  afterUpdate?: (result: UpdateResult<T>, dataProvider: DataProvider) => Promise<UpdateResult<T>>;
  afterDelete?: (result: DeleteResult, dataProvider: DataProvider) => Promise<DeleteResult>;
  afterSave?: (data: T, resource: string, params: any) => Promise<T>;
  afterGetList?: (result: GetListResult<T>, dataProvider: DataProvider) => Promise<GetListResult<T>>;
  afterGetOne?: (result: GetOneResult<T>, dataProvider: DataProvider) => Promise<GetOneResult<T>>;
}
```

### Callbacks in Atomic CRM

**See `providers/fakerest/dataProvider.ts` lines 223-430:**

#### Members
- **beforeCreate:** Set default role to 'salesperson', sync administrator flag with role
- **afterSave:** Update current user in localStorage if the saved member is the current user
- **beforeDelete:** Reassign all their contacts/companies/notes to new member

#### Contacts
- **beforeCreate:** Download avatar from email, fetch and update company_name
- **afterCreate:** Increment company.nb_contacts
- **beforeUpdate:** Same avatar/company processing
- **afterDelete:** Decrement company.nb_contacts

#### Tasks
- **afterCreate:** Increment contact.nb_tasks
- **beforeUpdate:** Track if done_date changed
- **afterUpdate:** Update contact.nb_tasks based on whether task was marked done/undone
- **afterDelete:** Decrement contact.nb_tasks

#### Companies
- **beforeCreate:** Add created_at timestamp
- **beforeUpdate:** Process logo file upload
- **afterUpdate:** Update all related contact.company_name fields

#### Contact Notes
- **beforeSave:** Upload attachment files to bucket

---

## Part 6: FakeRest Architecture Overview

The FakeRest provider (`providers/fakerest/dataProvider.ts`) demonstrates the pattern for a local/in-memory implementation:

```typescript
// 1. Create base provider
const baseDataProvider = fakeRestDataProvider(generateData(), true, 300);

// 2. Wrap with custom methods
const dataProviderWithCustomMethod: CrmDataProvider = {
  ...baseDataProvider,

  // Override specific methods
  getActivityLog: async (...) => { ... },
  signUp: async (...) => { ... },
  membersCreate: async (...) => { ... },
  // ... other custom methods
};

// 3. Apply filter adapter (Supabase → FakeRest syntax)
withSupabaseFilterAdapter(dataProviderWithCustomMethod)

// 4. Wrap with lifecycle callbacks
withLifecycleCallbacks(adapter, callbacks)
```

### Data Generation

`dataGenerator/index.ts` creates the in-memory database:

```typescript
const db: Db = {
  members: Member[], // 6 members (Jane Doe + 5 random)
  companies: Company[], // 55 companies (default)
  contacts: Contact[], // 500 contacts (default)
  contact_notes: ContactNote[],
  tasks: Task[],
  tags: Tag[],
  orders: Order[],
};
```

Each generator (`members.ts`, `companies.ts`, `contacts.ts`, etc.) uses Faker.js to create realistic test data.

**Key insight:** The `finalize()` function sets each contact's status to the latest contact_note's status (no view needed in-memory).

---

## Part 7: What a SQLite Provider Must Implement

### File Structure

```typescript
// src/components/atomic-crm/providers/sqlite/dataProvider.ts

import type { DataProvider, Identifier, CreateParams, UpdateParams, GetListParams } from "ra-core";
import { withLifecycleCallbacks } from "ra-core";
import type { CrmDataProvider } from "../types";
import { lifecycleCallbacks } from "../commons/lifecycleCallbacks"; // Shared!

// 1. Create base provider (wrap your SQLite client)
const baseDataProvider = createSqliteProvider(sqliteClient);

// 2. Extend with CRM custom methods
const dataProviderWithMethods: CrmDataProvider = {
  ...baseDataProvider,

  async signUp(data: SignUpData) {
    // Hash password, create members row, return { id, email, password }
  },

  async membersCreate(data: MemberFormData) {
    // INSERT into members table
  },

  async membersUpdate(id: Identifier, data: Partial<Omit<MemberFormData, "password">>) {
    // UPDATE members table
  },

  async isInitialized() {
    // SELECT COUNT(*) FROM members, return total > 0
  },

  async updatePassword(id: Identifier) {
    // UPDATE members.password
  },

  async getActivityLog(companyId?: Identifier) {
    // SELECT from contacts and contact_notes, merge, sort by date DESC
  },

  async mergeContacts(sourceId: Identifier, targetId: Identifier) {
    // Merge contact data, update all references
  },
};

// 3. Apply filter transformation
const withFilters = withSqliteFilterAdapter(dataProviderWithMethods);

// 4. Apply lifecycle callbacks
export const dataProvider = withLifecycleCallbacks(
  withFilters,
  lifecycleCallbacks // Reuse from Supabase provider!
);
```

### Core Methods to Implement

All 12 DataProvider methods must work correctly:

```typescript
async getList(resource: string, params: GetListParams) {
  // 1. Parse filter (handle @eq, @neq, @in, @ilike, etc.)
  // 2. Build WHERE clause
  // 3. Add ORDER BY from sort
  // 4. Add LIMIT/OFFSET from pagination
  // 5. Execute SELECT
  // 6. Execute SELECT COUNT(*) for total
  // 7. Return { data, total }
}

async getOne(resource: string, params: any) {
  // 1. Handle _summary suffix (contacts_summary → contacts)
  // 2. SELECT * WHERE id = ?
  // 3. Return { data }
}

async getMany(resource: string, params: any) {
  // SELECT * WHERE id IN (?, ?, ...)
  // Return { data }
}

async getManyReference(resource: string, params: any) {
  // Like getList but filter by target FK field
  // SELECT * FROM resource WHERE {target} = ? LIMIT offset, limit
}

async create(resource: string, params: CreateParams) {
  // INSERT INTO resource VALUES (...)
  // Return { data: inserted_record_with_id }
}

async update(resource: string, params: UpdateParams) {
  // UPDATE resource SET ... WHERE id = ?
  // Return { data: updated_record }
}

async updateMany(resource: string, params: any) {
  // UPDATE resource SET ... WHERE id IN (?, ?, ...)
  // Return { data: ids } or undefined
}

async delete(resource: string, params: any) {
  // DELETE FROM resource WHERE id = ?
  // Return { data: deleted_record } or undefined
}

async deleteMany(resource: string, params: any) {
  // DELETE FROM resource WHERE id IN (?, ?, ...)
  // Return { data: ids } or undefined
}
```

### Filter Adapter

Create `src/components/atomic-crm/providers/sqlite/internal/transformFilter.ts`:

```typescript
export function withSqliteFilterAdapter<T extends DataProvider>(
  dataProvider: T,
): T {
  return {
    ...dataProvider,
    getList(resource, params) {
      return dataProvider.getList(removeSummarySuffix(resource), {
        ...params,
        filter: transformSqliteFilter(params.filter),
      });
    },
    // Similar for getMany, getManyReference
  };
}

function transformSqliteFilter(filter: Record<string, any>) {
  // Map PostgREST syntax to SQL WHERE clauses
  // field@eq → WHERE field = value
  // field@in → WHERE field IN (...)
  // field@ilike → WHERE field LIKE (case-insensitive)
  // etc.
}
```

### Summary View Handling

**Option A:** Create actual views in SQLite

```sql
CREATE VIEW contacts_summary AS
SELECT
  c.*,
  (SELECT COUNT(*) FROM tasks WHERE contact_id = c.id AND done_date IS NULL) as nb_tasks
FROM contacts c;

CREATE VIEW orders_summary AS
SELECT
  o.*,
  c.first_name as contact_first_name,
  c.last_name as contact_last_name,
  m.first_name as member_first_name,
  m.last_name as member_last_name
FROM orders o
LEFT JOIN contacts c ON o.contact_id = c.id
LEFT JOIN members m ON o.member_id = m.id;
```

**Option B:** Handle in the adapter

```typescript
function removeSummarySuffix(resource: string) {
  return resource.endsWith("_summary")
    ? resource.replace("_summary", "")
    : resource;
}
```

Then SQLite provider queries the base tables, and the adapter strips the `_summary` suffix.

### Custom Methods

These must be synchronous with your data model:

```typescript
async signUp({ email, password, first_name, last_name }: SignUpData) {
  // 1. Hash password (use bcrypt or similar)
  // 2. INSERT INTO members (email, password_hash, first_name, last_name, role, ...)
  // 3. Return { id, email, password: plain_password }

  // Note: The plain password is returned for immediate login, but stored hashed
}

async isInitialized() {
  // Check if any members exist
  const { data: members } = await this.getList("members", {
    filter: {},
    pagination: { page: 1, perPage: 1 },
    sort: { field: "id", order: "ASC" },
  });
  return members.length > 0;
}

async getActivityLog(companyId?: Identifier) {
  // 1. Query contacts (filtered by company_id if provided)
  // 2. Query contact_notes (filtered by contact_id if provided)
  // 3. Merge into Activity objects
  // 4. Sort by date DESC
  // 5. Limit to 250
  // Return Activity[]
}

async mergeContacts(sourceId: Identifier, targetId: Identifier) {
  // 1. Update contact_notes: contact_id = sourceId → targetId
  // 2. Update tasks: contact_id = sourceId → targetId
  // 3. Update orders: contact_id = sourceId → targetId
  // 4. DELETE FROM contacts WHERE id = sourceId
  // 5. Return merged_contact data
}
```

---

## Part 8: Key Differences from FakeRest to SQLite

| Aspect | FakeRest | SQLite |
|--------|----------|--------|
| **Data Store** | In-memory JavaScript object | Persistent database file |
| **Queries** | Array filter/map operations | SQL SELECT/WHERE/ORDER BY |
| **Transactions** | Manual (fake) | Native SQL transactions |
| **Relationships** | Manual joins in code | SQL JOINs |
| **Sorting** | Array.sort() | ORDER BY clause |
| **Pagination** | array.slice() | LIMIT/OFFSET |
| **Search** | String matching | SQL LIKE or FTS |
| **File uploads** | base64 in DB | File path references |
| **Persistence** | Lost on page reload | Persists across sessions |

---

## Part 9: Implementation Checklist

### Database Schema

- [ ] Create SQLite schema with 8 tables (members, companies, contacts, orders, contact_notes, tasks, tags, activities_view?)
- [ ] Add indexes on frequently queried columns (member_id, company_id, contact_id, created_at)
- [ ] Define foreign key constraints
- [ ] Create _summary views (or handle in adapter)

### DataProvider Implementation

- [ ] Implement all 12 core methods
- [ ] Implement 7 custom CRM methods
- [ ] Parse filter operators (@eq, @neq, @in, @ilike, @or, @cs, @is)
- [ ] Support sorting (ASC/DESC)
- [ ] Support pagination (LIMIT/OFFSET)
- [ ] Handle null values properly
- [ ] Handle array fields (JSON columns for tags, email_jsonb, phone_jsonb)

### Lifecycle Callbacks

- [ ] Reuse callbacks from existing dataProvider (copy references)
- [ ] Handle file uploads for contact_notes.attachments
- [ ] Handle file uploads for members.avatar
- [ ] Manage denormalized fields (company_name, nb_contacts, nb_tasks)
- [ ] Process contact avatars

### Testing

- [ ] Test each HTTP method (GET, POST, PATCH, DELETE)
- [ ] Test filter combinations (AND, OR, IN, LIKE)
- [ ] Test pagination and sorting
- [ ] Test lifecycle callbacks
- [ ] Test custom methods (signUp, isInitialized, etc.)
- [ ] Test with real contact data (CSV import)

### Integration

- [ ] Switch `App.tsx` to use SQLite provider instead of Supabase
- [ ] Test authentication flow (if SQLite stores credentials)
- [ ] Test activity log generation
- [ ] Test contact merge
- [ ] Verify no Supabase API calls remain

---

## Part 10: Example: Contacts getList Implementation

To illustrate, here's what a SQLite getList might look like:

```typescript
async getList(resource: string, params: GetListParams) {
  const { filter = {}, sort, pagination } = params;

  // 1. Handle summary suffix
  const actualResource = resource.endsWith("_summary")
    ? resource.replace("_summary", "")
    : resource;

  // 2. Transform PostgREST filters to SQL
  const whereClause = buildWhereClause(actualResource, filter);

  // 3. Build query
  let query = `SELECT * FROM ${actualResource}`;
  if (whereClause) {
    query += ` WHERE ${whereClause}`;
  }

  // 4. Add sorting
  if (sort) {
    query += ` ORDER BY ${sort.field} ${sort.order}`;
  }

  // 5. Add pagination
  const offset = ((pagination?.page || 1) - 1) * (pagination?.perPage || 10);
  query += ` LIMIT ${pagination?.perPage || 10} OFFSET ${offset}`;

  // 6. Execute
  const data = await this.db.all(query);

  // 7. Get total count
  let countQuery = `SELECT COUNT(*) as count FROM ${actualResource}`;
  if (whereClause) {
    countQuery += ` WHERE ${whereClause}`;
  }
  const { count } = await this.db.get(countQuery);

  return { data, total: count };
}

function buildWhereClause(resource: string, filter: Record<string, any>): string {
  const conditions: string[] = [];

  for (const [key, value] of Object.entries(filter)) {
    if (key.endsWith("@eq")) {
      const field = key.slice(0, -3);
      conditions.push(`${field} = '${escapeSql(value)}'`);
    } else if (key.endsWith("@neq")) {
      const field = key.slice(0, -4);
      conditions.push(`${field} != '${escapeSql(value)}'`);
    } else if (key.endsWith("@in")) {
      const field = key.slice(0, -3);
      const values = parseList(value); // "(1,2,3)" → [1,2,3]
      conditions.push(`${field} IN (${values.map(v => `'${escapeSql(v)}'`).join(",")})`);
    } else if (key.endsWith("@ilike")) {
      const field = key.slice(0, -6);
      conditions.push(`LOWER(${field}) LIKE LOWER('%${escapeSql(value)}%')`);
    }
    // ... handle other operators
  }

  return conditions.join(" AND ");
}
```

---

## Part 11: References

**Files to Study:**

1. **DataProvider signatures:**
   - `ra-core` package (npm)
   - Current: `node_modules/ra-core/dist/types.d.ts`

2. **Supabase implementation:**
   - `/src/components/atomic-crm/providers/supabase/dataProvider.ts` (lines 1-228)
   - Full text search adaptation (lines 230-258)

3. **FakeRest implementation:**
   - `/src/components/atomic-crm/providers/fakerest/dataProvider.ts` (lines 1-444)
   - Filter adapter: `/src/components/atomic-crm/providers/fakerest/internal/supabaseAdapter.ts`
   - Filter transform: `/src/components/atomic-crm/providers/fakerest/internal/transformFilter.ts`

4. **Lifecycle callbacks:**
   - `/src/components/atomic-crm/providers/fakerest/dataProvider.ts` (lines 223-430)

5. **All types:**
   - `/src/components/atomic-crm/types.ts`

6. **Usage example:**
   - `/src/components/atomic-crm/root/CRM.tsx` (lines 182-217)
   - `/src/App.tsx`

---

## Summary

A SQLite DataProvider for Atomic CRM must:

1. **Implement 12 core DataProvider methods** from ra-core (getList, getOne, create, update, delete, etc.)
2. **Add 7 custom CRM methods** (signUp, isInitialized, getActivityLog, mergeContacts, etc.)
3. **Support PostgREST filter syntax** (@eq, @neq, @in, @ilike, @or, @cs, @is)
4. **Handle 8 resources** with complete schemas (contacts, companies, orders, tasks, notes, members, tags, activities)
5. **Implement lifecycle callbacks** for denormalized field updates and file uploads
6. **Manage _summary views** (either as actual SQLite views or via adapter)
7. **Support pagination, sorting, and searching** at the SQL level
8. **Preserve JSON arrays** (email_jsonb, phone_jsonb, tags) as JSON columns
9. **Integrate with the auth provider** for user management
10. **Pass all existing tests** without requiring UI or component changes

The FakeRest implementation is the best reference because it shows how to extend the base DataProvider with CRM-specific methods while reusing the lifecycle callback system.
