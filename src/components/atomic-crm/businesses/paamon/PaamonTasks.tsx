import { Link } from "react-router";
import { ArrowRight, ListChecks, CheckCircle2, Circle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useContentPage } from "../../hooks/useContentPage";
import { EditableText } from "../../misc/EditableText";

const BLUE = "#58a6ff";
const ORANGE = "#f0883e";
const PURPLE = "#a78bfa";
const GREEN = "#3fb950";
const RED = "#f85149";

// ─── Content Type ─────────────────────────────────────────────────────────────

type TasksContent = {
  title: string;
  subtitle: string;
  stats: { label: string; value: string }[];
  marketing_analysis: { label: string; text: string; note?: string }[];
  marketing_conclusion: string;
  weeks: {
    num: number;
    label: string;
    tasks: {
      id: string;
      title: string;
      priority: string;
      bullets: string[];
      sub_bullets?: string[];
    }[];
  }[];
  critical_groups: {
    name: string;
    day: string;
    time: string;
    enrolled: number;
    capacity: number;
    need: number;
    strategy: string;
  }[];
  summary: { label: string; value: string; sub: string }[];
  total_expected: string;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

type Priority = "urgent" | "medium" | "low" | "done";

function priorityBorderClass(priority: Priority) {
  if (priority === "done") return "opacity-80";
  return "";
}

function PriorityBadge({ priority }: { priority: Priority }) {
  const labels: Record<Priority, string> = {
    urgent: "דחוף",
    medium: "בינוני",
    low: "נמוך",
    done: "הושלם",
  };
  const colors: Record<Priority, string> = {
    urgent: RED,
    medium: ORANGE,
    low: BLUE,
    done: GREEN,
  };
  return (
    <span
      className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
      style={{ color: colors[priority], backgroundColor: `${colors[priority]}20` }}
    >
      {labels[priority]}
    </span>
  );
}

function TaskCard({
  id,
  title,
  priority,
  children,
}: {
  id: string;
  title: React.ReactNode;
  priority: Priority;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("rounded-lg border bg-card p-4", priorityBorderClass(priority))}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          {priority === "done" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: GREEN }} />
          ) : (
            <Circle className="h-4 w-4 shrink-0 text-muted-foreground" />
          )}
          <span className="text-sm font-medium">{id}. {title}</span>
        </div>
        <PriorityBadge priority={priority} />
      </div>
      <div className="text-sm text-muted-foreground space-y-1.5 mr-6">
        {children}
      </div>
    </div>
  );
}

function Bullet({ children, color }: { children: React.ReactNode; color?: string }) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-1.5 h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: color ?? "#6e7681" }} />
      <span>{children}</span>
    </div>
  );
}

function SubBullet({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 mr-4">
      <span className="mt-1.5 h-1 w-1 rounded-full shrink-0 bg-muted-foreground/40" />
      <span className="text-xs">{children}</span>
    </div>
  );
}

function SectionHeader({ label, color, week }: { label: React.ReactNode; color?: string; week?: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-px flex-1 bg-border" />
      <div className="flex items-center gap-2">
        {week && color && (
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded"
            style={{ color, backgroundColor: `${color}20` }}
          >
            {week}
          </span>
        )}
        <span className="text-sm font-semibold">{label}</span>
      </div>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

// Stats color mapping by index: [BLUE, ORANGE, GREEN, RED, GREEN]
const STATS_COLORS = [BLUE, ORANGE, GREEN, RED, GREEN];

// Marketing analysis bullet colors by index: [BLUE, PURPLE, ORANGE]
const MARKETING_COLORS = [BLUE, PURPLE, ORANGE];

// Week header colors by index: [RED, ORANGE, BLUE]
const WEEK_COLORS = [RED, ORANGE, BLUE];

// ─── Component ────────────────────────────────────────────────────────────────

export function PaamonTasks() {
  const { content, isPending, updateField } =
    useContentPage<TasksContent>("paamon/tasks");

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
        <ListChecks className="h-6 w-6" style={{ color: ORANGE }} />
        <div>
          <h1 className="text-xl font-semibold">
            <EditableText
              value={content.title ?? ""}
              onSave={(v) => updateField("title", v)}
            />
          </h1>
          <p className="text-sm text-muted-foreground">
            <EditableText
              value={content.subtitle ?? ""}
              onSave={(v) => updateField("subtitle", v)}
            />
          </p>
        </div>
      </div>

      {/* ── Section 1: המצב ─────────────────────────────────────── */}
      <SectionHeader label="המצב הנוכחי" />

      <div className="grid grid-cols-2 gap-4">
        {/* Status stats */}
        <div className="rounded-lg border bg-card p-4 space-y-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">יעדים</p>
          <div className="space-y-2">
            {(content.stats ?? []).map((row, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  <EditableText
                    value={row.label ?? ""}
                    onSave={(v) => updateField(`stats.${i}.label`, v)}
                  />
                </span>
                <span className="font-medium" style={{ color: STATS_COLORS[i] ?? BLUE }}>
                  <EditableText
                    value={row.value ?? ""}
                    onSave={(v) => updateField(`stats.${i}.value`, v)}
                  />
                </span>
              </div>
            ))}
          </div>
          {/* Progress bar */}
          <div>
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>56 / 79</span>
              <span>53% → יעד 75%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted">
              <div className="h-2 rounded-full" style={{ width: "53%", backgroundColor: ORANGE }} />
            </div>
          </div>
        </div>

        {/* Marketing analysis */}
        <div className="rounded-lg border bg-card p-4 space-y-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">ניתוח שיווקי (דצמבר)</p>
          <div className="space-y-2">
            {(content.marketing_analysis ?? []).map((item, i) => (
              <Bullet key={i} color={MARKETING_COLORS[i] ?? BLUE}>
                <span>
                  <strong>
                    <EditableText
                      value={item.label ?? ""}
                      onSave={(v) => updateField(`marketing_analysis.${i}.label`, v)}
                    />
                  </strong>
                  {" "}
                  <EditableText
                    value={item.text ?? ""}
                    onSave={(v) => updateField(`marketing_analysis.${i}.text`, v)}
                  />
                  {item.note !== undefined && (
                    <span className="mr-1 text-xs" style={{ color: GREEN }}>
                      <EditableText
                        value={item.note}
                        onSave={(v) => updateField(`marketing_analysis.${i}.note`, v)}
                      />
                    </span>
                  )}
                </span>
              </Bullet>
            ))}
          </div>
          <div className="rounded bg-[#3fb95015] border border-[#3fb95030] p-2 text-xs" style={{ color: GREEN }}>
            <EditableText
              value={content.marketing_conclusion ?? ""}
              onSave={(v) => updateField("marketing_conclusion", v)}
              multiline
              rows={2}
            />
          </div>
        </div>
      </div>

      {/* ── Weeks ────────────────────────────────────────────────── */}
      {(content.weeks ?? []).map((week, wi) => {
        const weekColor = WEEK_COLORS[wi] ?? BLUE;
        return (
          <div key={wi} className="flex flex-col gap-3">
            <SectionHeader
              label={
                <EditableText
                  value={week.label ?? ""}
                  onSave={(v) => updateField(`weeks.${wi}.label`, v)}
                />
              }
              week={`שבוע ${week.num}`}
              color={weekColor}
            />

            <div className="space-y-3">
              {(week.tasks ?? []).map((task, ti) => {
                const priority = (task.priority ?? "medium") as Priority;
                return (
                  <TaskCard
                    key={ti}
                    id={task.id}
                    title={
                      <EditableText
                        value={task.title ?? ""}
                        onSave={(v) => updateField(`weeks.${wi}.tasks.${ti}.title`, v)}
                      />
                    }
                    priority={priority}
                  >
                    {(task.bullets ?? []).map((bullet, bi) => (
                      <Bullet key={bi}>
                        <EditableText
                          value={bullet}
                          onSave={(v) => updateField(`weeks.${wi}.tasks.${ti}.bullets.${bi}`, v)}
                        />
                      </Bullet>
                    ))}
                    {(task.sub_bullets ?? []).map((sb, si) => (
                      <SubBullet key={si}>
                        <EditableText
                          value={sb}
                          onSave={(v) => updateField(`weeks.${wi}.tasks.${ti}.sub_bullets.${si}`, v)}
                        />
                      </SubBullet>
                    ))}
                  </TaskCard>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* ── Section: קבוצות קריטיות ──────────────────────────────── */}
      <SectionHeader label="קבוצות קריטיות (0–2 תלמידים)" />

      <div className="grid grid-cols-2 gap-3">
        {(content.critical_groups ?? []).map((g, i) => {
          const isCritical = g.enrolled === 0;
          const color = isCritical ? RED : ORANGE;
          return (
            <div key={i} className="rounded-lg border bg-card p-3">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" style={{ color }} />
                  <span className="text-sm font-medium">
                    <EditableText
                      value={g.name ?? ""}
                      onSave={(v) => updateField(`critical_groups.${i}.name`, v)}
                    />
                  </span>
                </div>
                <span className="text-xs font-mono" style={{ color }}>
                  {g.enrolled}/{g.capacity}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                <span>{g.day} {g.time}</span>
                <span className="text-[#6e7681]">|</span>
                <span>
                  צריך: <strong style={{ color: RED }}>+{g.need}</strong>
                </span>
              </div>
              <div className="text-xs rounded bg-accent/40 px-2 py-1">
                <span className="text-muted-foreground">אסטרטגיה: </span>
                <EditableText
                  value={g.strategy ?? ""}
                  onSave={(v) => updateField(`critical_groups.${i}.strategy`, v)}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer summary */}
      <div className="rounded-lg border bg-card p-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          {(content.summary ?? []).map((s, i) => {
            const summaryColor = WEEK_COLORS[i] ?? BLUE;
            return (
              <div key={i}>
                <div className="text-xs text-muted-foreground">
                  <EditableText
                    value={s.label ?? ""}
                    onSave={(v) => updateField(`summary.${i}.label`, v)}
                  />
                </div>
                <div className="text-base font-bold mt-0.5" style={{ color: summaryColor }}>
                  <EditableText
                    value={s.value ?? ""}
                    onSave={(v) => updateField(`summary.${i}.value`, v)}
                  />
                </div>
                <div className="text-xs text-muted-foreground">
                  <EditableText
                    value={s.sub ?? ""}
                    onSave={(v) => updateField(`summary.${i}.sub`, v)}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-3 pt-3 border-t text-center">
          <span className="text-xs text-muted-foreground">סה"כ צפוי: </span>
          <span className="text-sm font-semibold" style={{ color: GREEN }}>
            <EditableText
              value={content.total_expected ?? ""}
              onSave={(v) => updateField("total_expected", v)}
            />
          </span>
        </div>
      </div>
    </div>
  );
}

PaamonTasks.path = "/paamon/tasks";
