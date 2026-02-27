import { useState } from "react";
import { Link } from "react-router";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Circle,
  Copy,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useContentPage } from "../../hooks/useContentPage";
import { EditableText } from "../../misc/EditableText";

const BLUE = "#58a6ff";
const ORANGE = "#f0883e";
const GREEN = "#3fb950";

// ─── Content Type ─────────────────────────────────────────────────────────────

type MunicipalityContent = {
  title: string;
  subtitle: string;
  contacts: { name: string; role: string; email: string; phone: string }[];
  meeting_next: string;
  meeting_status: string;
  meeting_note: string;
  active_tasks: {
    num: number;
    title: string;
    status: string;
    details: string;
    followup?: string;
    action_date?: string;
    bullets?: string[];
  }[];
  completed_tasks: { title: string; details: string }[];
  draft_email: string;
  meeting_history: {
    date: string;
    title: string;
    topics: string[];
    decisions: string[];
    followups: string[];
  }[];
};

// ─── Status Badge ─────────────────────────────────────────────────────────────

function statusStyle(status: string): { color: string; bg: string; border: string } {
  if (status === "הושלם") return { color: GREEN, bg: `${GREEN}18`, border: `${GREEN}40` };
  if (status === "ממתין" || status === "פולואפ") return { color: BLUE, bg: `${BLUE}18`, border: `${BLUE}40` };
  return { color: ORANGE, bg: `${ORANGE}18`, border: `${ORANGE}40` };
}

function StatusBadge({ status }: { status: string }) {
  const s = statusStyle(status);
  return (
    <span
      className="text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap"
      style={{ color: s.color, backgroundColor: s.bg }}
    >
      {status}
    </span>
  );
}

// ─── Task Card ────────────────────────────────────────────────────────────────

function borderColor(_status: string) {
  return "";
}

function TaskCard({
  num,
  title,
  status,
  details,
  followup,
  children,
  done = false,
}: {
  num: number | string;
  title: React.ReactNode;
  status: string;
  details: React.ReactNode;
  followup?: React.ReactNode;
  children?: React.ReactNode;
  done?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-card p-4",
        borderColor(status),
        done && "opacity-80"
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          {done ? (
            <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: GREEN }} />
          ) : (
            <Circle className="h-4 w-4 shrink-0 text-muted-foreground" />
          )}
          <span className="text-sm font-medium">
            {num}. {title}
          </span>
        </div>
        <StatusBadge status={status} />
      </div>
      <div className="text-sm text-muted-foreground space-y-1.5 mr-6">
        <p>{details}</p>
        {children}
        {followup && (
          <p className="text-xs" style={{ color: ORANGE }}>
            פולואפ: {followup}
          </p>
        )}
      </div>
    </div>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 text-sm text-muted-foreground">
      <span className="mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 bg-muted-foreground/50" />
      <span>{children}</span>
    </div>
  );
}

// ─── Copy Button ──────────────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md border transition-colors hover:bg-accent"
      style={{ color: copied ? GREEN : BLUE, borderColor: copied ? `${GREEN}40` : `${BLUE}40` }}
    >
      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
      {copied ? "הועתק!" : "העתק"}
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function PaamonMunicipality() {
  const { content, isPending, updateField } = useContentPage<MunicipalityContent>("paamon/municipality");

  if (isPending) {
    return <div className="p-8 text-center text-muted-foreground">טוען...</div>;
  }

  return (
    <div className="flex flex-col gap-6 mt-1" dir="rtl">
      {/* Back link */}
      <Link
        to="/paamon"
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
      >
        <ArrowRight className="h-4 w-4" />
        מרכז פעמון
      </Link>

      {/* Header */}
      <div className="flex items-center gap-3">
        <Building2 className="h-6 w-6" style={{ color: BLUE }} />
        <div>
          <h1 className="text-xl font-semibold">
            <EditableText
              value={content.title}
              onSave={(v) => updateField("title", v)}
            />
          </h1>
          <p className="text-sm text-muted-foreground">
            <EditableText
              value={content.subtitle}
              onSave={(v) => updateField("subtitle", v)}
            />
          </p>
        </div>
      </div>

      {/* Contact Cards */}
      <div className="grid grid-cols-2 gap-4">
        {(content.contacts ?? []).map((contact, i) => (
          <div
            key={i}
            className="rounded-lg border bg-card p-5 space-y-3"
            style={{ borderColor: `${BLUE}30` }}
          >
            <div className="flex items-center gap-2">
              <div
                className="h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                style={{ backgroundColor: `${BLUE}20`, color: BLUE }}
              >
                {(contact.name ?? "").charAt(0)}
              </div>
              <div>
                <div className="text-sm font-semibold">
                  <EditableText
                    value={contact.name}
                    onSave={(v) => updateField(`contacts.${i}.name`, v)}
                  />
                </div>
                <div className="text-xs text-muted-foreground">
                  <EditableText
                    value={contact.role}
                    onSave={(v) => updateField(`contacts.${i}.role`, v)}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-1.5 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-xs w-12 shrink-0">דוא"ל</span>
                <span className={contact.email === "[להשלים]" ? "text-muted-foreground italic text-xs" : ""}>
                  <EditableText
                    value={contact.email}
                    onSave={(v) => updateField(`contacts.${i}.email`, v)}
                  />
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-xs w-12 shrink-0">טלפון</span>
                <span className={contact.phone === "[להשלים]" ? "text-muted-foreground italic text-xs" : ""}>
                  <EditableText
                    value={contact.phone}
                    onSave={(v) => updateField(`contacts.${i}.phone`, v)}
                  />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Meeting Schedule */}
      <div
        className="rounded-lg border bg-card p-5 space-y-2"
        style={{ borderColor: `${ORANGE}40`, borderRightWidth: "4px", borderRightColor: ORANGE }}
      >
        <div className="text-sm font-semibold" style={{ color: ORANGE }}>
          פגישת מטה פעמון
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">הפגישה הבאה:</span>
          <span className="font-medium">
            <EditableText
              value={content.meeting_next}
              onSave={(v) => updateField("meeting_next", v)}
            />
          </span>
          <span
            className="text-[10px] px-1.5 py-0.5 rounded"
            style={{ color: ORANGE, backgroundColor: `${ORANGE}20` }}
          >
            <EditableText
              value={content.meeting_status}
              onSave={(v) => updateField("meeting_status", v)}
            />
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          <EditableText
            value={content.meeting_note}
            onSave={(v) => updateField("meeting_note", v)}
          />
        </p>
      </div>

      {/* Active Tasks */}
      <div>
        <h2 className="text-sm font-semibold mb-3">משימות פעילות</h2>
        <div className="space-y-3">
          {(content.active_tasks ?? []).map((task, i) => (
            <TaskCard
              key={i}
              num={task.num}
              title={
                <EditableText
                  value={task.title}
                  onSave={(v) => updateField(`active_tasks.${i}.title`, v)}
                />
              }
              status={task.status}
              details={
                <EditableText
                  value={task.details}
                  onSave={(v) => updateField(`active_tasks.${i}.details`, v)}
                  multiline
                  rows={2}
                />
              }
              followup={
                task.followup ? (
                  <EditableText
                    value={task.followup}
                    onSave={(v) => updateField(`active_tasks.${i}.followup`, v)}
                  />
                ) : undefined
              }
            >
              {task.action_date && (
                <p className="text-xs" style={{ color: BLUE }}>
                  <EditableText
                    value={task.action_date}
                    onSave={(v) => updateField(`active_tasks.${i}.action_date`, v)}
                  />
                </p>
              )}
              {task.bullets && task.bullets.length > 0 && (
                <div className="space-y-1 mt-1">
                  {task.bullets.map((bullet, j) => (
                    <Bullet key={j}>
                      <EditableText
                        value={bullet}
                        onSave={(v) => updateField(`active_tasks.${i}.bullets.${j}`, v)}
                      />
                    </Bullet>
                  ))}
                </div>
              )}
            </TaskCard>
          ))}
        </div>
      </div>

      {/* Completed Tasks */}
      <div>
        <h2 className="text-sm font-semibold mb-3">משימות שהושלמו</h2>
        <div className="space-y-3">
          {(content.completed_tasks ?? []).map((task, i) => (
            <TaskCard
              key={i}
              num="✓"
              title={
                <EditableText
                  value={task.title}
                  onSave={(v) => updateField(`completed_tasks.${i}.title`, v)}
                />
              }
              status="הושלם"
              details={
                <EditableText
                  value={task.details}
                  onSave={(v) => updateField(`completed_tasks.${i}.details`, v)}
                  multiline
                  rows={2}
                />
              }
              done
            />
          ))}
        </div>
      </div>

      {/* Draft Email */}
      <div className="rounded-lg border bg-card overflow-hidden">
        <div
          className="flex items-center justify-between px-4 py-3 border-b"
          style={{ borderColor: `${BLUE}30`, backgroundColor: `${BLUE}08` }}
        >
          <span className="text-sm font-semibold" style={{ color: BLUE }}>
            טיוטת מייל לפגישה
          </span>
          <CopyButton text={content.draft_email} />
        </div>
        <div className="p-4 text-sm text-muted-foreground leading-relaxed font-sans" dir="rtl">
          <EditableText
            value={content.draft_email}
            onSave={(v) => updateField("draft_email", v)}
            multiline
            rows={14}
          />
        </div>
      </div>

      {/* Meeting History */}
      <div>
        <h2 className="text-sm font-semibold mb-3">היסטוריית פגישות</h2>
        {(content.meeting_history ?? []).map((meeting, mi) => (
          <div key={mi} className="rounded-lg border bg-card overflow-hidden">
            {/* Meeting header */}
            <div
              className="px-4 py-3 border-b"
              style={{ borderColor: `${ORANGE}30`, backgroundColor: `${ORANGE}08` }}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">
                  <EditableText
                    value={meeting.date}
                    onSave={(v) => updateField(`meeting_history.${mi}.date`, v)}
                  />
                  {" — "}
                  <EditableText
                    value={meeting.title}
                    onSave={(v) => updateField(`meeting_history.${mi}.title`, v)}
                  />
                </span>
                <span
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{ color: GREEN, backgroundColor: `${GREEN}18` }}
                >
                  הושלם
                </span>
              </div>
            </div>

            <div className="p-4 space-y-4">
              {/* Topics discussed */}
              <div>
                <p
                  className="text-xs font-semibold uppercase tracking-wide mb-2"
                  style={{ color: BLUE }}
                >
                  נושאים שנדונו
                </p>
                <div className="space-y-1">
                  {(meeting.topics ?? []).map((item, ti) => (
                    <div key={ti} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="text-xs text-muted-foreground/50 w-4 shrink-0">{ti + 1}.</span>
                      <span>
                        <EditableText
                          value={item}
                          onSave={(v) => updateField(`meeting_history.${mi}.topics.${ti}`, v)}
                        />
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Decisions */}
              <div>
                <p
                  className="text-xs font-semibold uppercase tracking-wide mb-2"
                  style={{ color: ORANGE }}
                >
                  החלטות
                </p>
                <div className="space-y-1.5">
                  {(meeting.decisions ?? []).map((decision, di) => (
                    <div key={di} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 mt-0.5" style={{ color: GREEN }} />
                      <span>
                        <EditableText
                          value={decision}
                          onSave={(v) => updateField(`meeting_history.${mi}.decisions.${di}`, v)}
                        />
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Follow-ups */}
              <div
                className="rounded-md p-3 text-sm"
                style={{ backgroundColor: `${ORANGE}10`, borderColor: `${ORANGE}30`, border: "1px solid" }}
              >
                <p className="text-xs font-semibold mb-2" style={{ color: ORANGE }}>
                  פולואפים
                </p>
                <div className="space-y-1 text-muted-foreground">
                  {(meeting.followups ?? []).map((followup, fi) => (
                    <p key={fi}>
                      <EditableText
                        value={followup}
                        onSave={(v) => updateField(`meeting_history.${mi}.followups.${fi}`, v)}
                      />
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

PaamonMunicipality.path = "/paamon/municipality";
