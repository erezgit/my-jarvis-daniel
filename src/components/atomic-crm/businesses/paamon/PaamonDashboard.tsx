import { useState } from "react";
import { Link } from "react-router";
import {
  Music,
  ChevronDown,
  ChevronUp,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useContentPage } from "../../hooks/useContentPage";
import { EditableText } from "../../misc/EditableText";

const BLUE = "#58a6ff";
const GREEN = "#3fb950";
const ORANGE = "#f0883e";
const RED = "#f85149";

// ─── Content Types ─────────────────────────────────────────────────────────────

export type DashboardStudent = {
  name: string;
  age?: string;
  details: string;
  parent?: string;
  phone?: string;
  school: string;
};

export type DashboardGroup = {
  name: string;
  day: string;
  time: string;
  teacher: string;
  enrolled: number;
  capacity: number;
  students: DashboardStudent[];
  note?: string;
};

export type DashboardContent = {
  title: string;
  subtitle: string;
  staff: { name: string; role: string }[];
  groups: DashboardGroup[];
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function statusColor(enrolled: number, capacity: number) {
  const pct = enrolled / capacity;
  if (pct >= 0.85) return GREEN;
  if (pct >= 0.5) return ORANGE;
  return RED;
}

function GroupCard({
  group,
  gi,
  updateField,
}: {
  group: DashboardGroup;
  gi: number;
  updateField: (path: string, value: any) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const pct = (group.enrolled / group.capacity) * 100;
  const color = statusColor(group.enrolled, group.capacity);

  return (
    <div className="rounded-lg border bg-card p-3">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-right"
      >
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium">
            <EditableText
              value={group.name}
              onSave={(v) => updateField(`groups.${gi}.name`, v)}
            />
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono" style={{ color }}>
              {group.enrolled}/{group.capacity}
            </span>
            {group.students.length > 0 && (
              expanded
                ? <ChevronUp className="h-3 w-3 text-muted-foreground" />
                : <ChevronDown className="h-3 w-3 text-muted-foreground" />
            )}
          </div>
        </div>
        <div className="h-2 w-full rounded-full bg-muted mb-1.5">
          <div
            className="h-2 rounded-full transition-all"
            style={{ width: `${pct}%`, backgroundColor: color }}
          />
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            <EditableText
              value={group.time}
              onSave={(v) => updateField(`groups.${gi}.time`, v)}
            />
          </span>
          <span>
            <EditableText
              value={group.teacher}
              onSave={(v) => updateField(`groups.${gi}.teacher`, v)}
            />
          </span>
        </div>
      </button>

      {expanded && group.students.length > 0 && (
        <div className="mt-3 pt-3 border-t space-y-2">
          {group.students.map((s, si) => (
            <div key={`${s.name}-${si}`} className="rounded-lg bg-accent/40 p-2.5 text-xs">
              <div className="font-medium">
                {si + 1}.{" "}
                <EditableText
                  value={s.name}
                  onSave={(v) => updateField(`groups.${gi}.students.${si}.name`, v)}
                />
                {s.age !== undefined && (
                  <span className="text-muted-foreground">
                    {" ("}
                    <EditableText
                      value={s.age}
                      onSave={(v) => updateField(`groups.${gi}.students.${si}.age`, v)}
                    />
                    {")"}
                  </span>
                )}
              </div>
              <div className="text-muted-foreground mt-0.5">
                <EditableText
                  value={s.details}
                  onSave={(v) => updateField(`groups.${gi}.students.${si}.details`, v)}
                />
              </div>
              {s.parent !== undefined && (
                <div className="text-[#58a6ff] mt-0.5">
                  <EditableText
                    value={s.parent}
                    onSave={(v) => updateField(`groups.${gi}.students.${si}.parent`, v)}
                  />
                  {s.phone !== undefined && (
                    <span>
                      {" • "}
                      <EditableText
                        value={s.phone}
                        onSave={(v) => updateField(`groups.${gi}.students.${si}.phone`, v)}
                      />
                    </span>
                  )}
                </div>
              )}
              {s.school && (
                <div className="text-[#3fb950] mt-0.5 text-[11px]">
                  <EditableText
                    value={s.school}
                    onSave={(v) => updateField(`groups.${gi}.students.${si}.school`, v)}
                  />
                </div>
              )}
            </div>
          ))}
          {group.note && (
            <div className="rounded-lg bg-[#f0883e10] border border-[#f0883e30] p-2 text-xs text-[#f0883e]">
              <EditableText
                value={group.note}
                onSave={(v) => updateField(`groups.${gi}.note`, v)}
                multiline
                rows={2}
              />
            </div>
          )}
        </div>
      )}

      {!expanded && group.note && group.students.length === 0 && (
        <div className="mt-2 text-[11px] text-muted-foreground">
          <EditableText
            value={group.note}
            onSave={(v) => updateField(`groups.${gi}.note`, v)}
          />
        </div>
      )}
    </div>
  );
}

// ─── Staff color mapping by index ─────────────────────────────────────────────

const STAFF_COLORS = [BLUE, "#a78bfa", ORANGE, GREEN];

// ─── Component ────────────────────────────────────────────────────────────────

export function PaamonDashboard() {
  const { content, isPending, updateField } =
    useContentPage<DashboardContent>("paamon/dashboard");

  if (isPending) {
    return <div className="p-8 text-center text-muted-foreground">טוען...</div>;
  }

  const groups = content.groups ?? [];
  const staff = content.staff ?? [];

  const totalEnrolled = groups.reduce((s, g) => s + g.enrolled, 0);
  const totalCapacity = groups.reduce((s, g) => s + g.capacity, 0);
  const occupancyPct = Math.round((totalEnrolled / totalCapacity) * 100);
  const fullGroups = groups.filter((g) => g.enrolled >= g.capacity).length;
  const criticalGroups = groups.filter((g) => g.enrolled <= 2).length;

  const stats = [
    { label: "קבוצות", value: String(groups.length), color: BLUE },
    { label: "מקומות תפוסים", value: String(totalEnrolled), color: GREEN },
    { label: "תפוסה", value: `${occupancyPct}%`, color: ORANGE },
    { label: "מקומות פנויים", value: String(totalCapacity - totalEnrolled), color: RED },
  ];

  return (
    <div className="flex flex-col gap-6 mt-1">
      {/* Back link */}
      <Link to="/paamon" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit">
        <ArrowRight className="h-4 w-4" />
        מרכז פעמון
      </Link>

      {/* Header */}
      <div className="flex items-center gap-3">
        <Music className="h-6 w-6 text-[#58a6ff]" />
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

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg border bg-card p-4 text-center">
            <div className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick stats */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span><strong className={cn("text-[#3fb950]")}>{fullGroups}</strong> קבוצות מלאות</span>
        <span className="text-[#6e7681]">|</span>
        <span><strong className="text-[#f85149]">{criticalGroups}</strong> קריטיות (≤2 תלמידים)</span>
        <span className="text-[#6e7681]">|</span>
        <span>יעד: <strong className="text-[#58a6ff]">75%</strong> תפוסה (חסרים {Math.max(0, Math.ceil(totalCapacity * 0.75) - totalEnrolled)} תלמידים)</span>
      </div>

      {/* Groups by Day */}
      {(["sun", "mon"] as const).map((day) => {
        const dayGroups = groups
          .map((g, gi) => ({ g, gi }))
          .filter(({ g }) => g.day === day);
        const dayLabel = day === "sun" ? "יום ראשון" : "יום שני";
        const dayEnrolled = dayGroups.reduce((s, { g }) => s + g.enrolled, 0);
        const dayCap = dayGroups.reduce((s, { g }) => s + g.capacity, 0);
        return (
          <div key={day}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-medium">{dayLabel}</h2>
              <span className="text-xs text-muted-foreground">{dayEnrolled}/{dayCap} תלמידים</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {dayGroups.map(({ g, gi }) => (
                <GroupCard
                  key={`${g.name}-${g.time}-${gi}`}
                  group={g}
                  gi={gi}
                  updateField={updateField}
                />
              ))}
            </div>
          </div>
        );
      })}

      {/* Staff */}
      <div className="rounded-lg border bg-card p-5">
        <h2 className="text-sm font-medium mb-3">צוות</h2>
        <div className="grid grid-cols-4 gap-3">
          {staff.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: STAFF_COLORS[i] ?? BLUE }} />
              <span className="text-sm">
                <EditableText
                  value={s.name}
                  onSave={(v) => updateField(`staff.${i}.name`, v)}
                />
              </span>
              <span className="text-xs text-muted-foreground">
                {"— "}
                <EditableText
                  value={s.role}
                  onSave={(v) => updateField(`staff.${i}.role`, v)}
                />
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

PaamonDashboard.path = "/paamon/dashboard";
