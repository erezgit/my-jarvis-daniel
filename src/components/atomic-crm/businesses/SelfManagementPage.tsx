import { useContentPage } from "../hooks/useContentPage";
import { EditableText } from "../misc/EditableText";
import { Target, Clock, Shield, TrendingUp } from "lucide-react";

const ORANGE = "#f0883e";
const RED = "#f85149";
const YELLOW = "#e3b341";
const GREEN = "#3fb950";
const BLUE = "#58a6ff";
const PURPLE = "#a78bfa";

// ─── Content Type ──────────────────────────────────────────────────────────────

type SelfManagementContent = {
  title: string;
  subtitle: string;
  principles: {
    title: string;
    description: string;
  }[];
  domains: {
    name: string;
    emoji: string;
    hours_per_week: string;
    priority: string;
  }[];
  daily_structure: {
    block: string;
    time: string;
    focus: string;
  }[];
  adhd_tools: string[];
  burnout_prevention: string[];
  boundaries: string[];
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border bg-card p-5 space-y-3">
      <h2 className="text-sm font-semibold">{title}</h2>
      {children}
    </div>
  );
}

function BulletItem({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 text-sm text-muted-foreground">
      <span className="shrink-0 mt-1 h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
      <span className="leading-relaxed">{children}</span>
    </div>
  );
}

function HighlightBox({
  children,
  color,
}: {
  children: React.ReactNode;
  color: string;
}) {
  return (
    <div
      className="rounded-lg border px-4 py-3 text-sm leading-relaxed"
      style={{
        borderColor: `${color}40`,
        backgroundColor: `${color}10`,
        color: color,
      }}
    >
      {children}
    </div>
  );
}

const PRINCIPLE_ICONS = [Target, Clock, Shield, TrendingUp];
const PRINCIPLE_COLORS = [ORANGE, BLUE, GREEN, PURPLE];

const DOMAIN_PRIORITY_COLORS: Record<string, string> = {
  קריטית: RED,
  קבועה: YELLOW,
  "בינוני-גבוה": YELLOW,
  "ממתינה לסמסטר": GREEN,
  "גבוהה למניעת שחיקה": BLUE,
  חשובה: PURPLE,
};

const DAILY_BLOCK_COLORS = [YELLOW, BLUE, GREEN, ORANGE];

// ─── Component ────────────────────────────────────────────────────────────────

export function SelfManagementPage() {
  const { content, isPending, updateField } =
    useContentPage<SelfManagementContent>("self-management");

  if (isPending) {
    return <div className="p-8 text-center text-muted-foreground">טוען...</div>;
  }

  return (
    <div className="flex flex-col gap-6 mt-1" dir="rtl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Target className="h-6 w-6" style={{ color: ORANGE }} />
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

      {/* ── Section: עקרונות מנחים ────────────────────────────────── */}
      <div className="rounded-lg border bg-card p-5 space-y-4">
        <h2 className="text-sm font-semibold">עקרונות מנחים</h2>
        <div className="grid grid-cols-2 gap-3">
          {(content.principles ?? []).map((principle, i) => {
            const Icon = PRINCIPLE_ICONS[i] ?? Target;
            const color = PRINCIPLE_COLORS[i] ?? ORANGE;
            return (
              <div
                key={i}
                className="rounded-md border p-4 space-y-1.5"
                style={{ borderColor: `${color}30`, backgroundColor: `${color}08` }}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="flex items-center justify-center h-6 w-6 rounded-full text-xs font-bold"
                    style={{ backgroundColor: `${color}20`, color }}
                  >
                    {i + 1}
                  </span>
                  <Icon className="h-4 w-4" style={{ color }} />
                  <span className="text-sm font-semibold">
                    <EditableText
                      value={principle.title}
                      onSave={(v) => updateField(`principles.${i}.title`, v)}
                    />
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed pr-8">
                  <EditableText
                    value={principle.description}
                    onSave={(v) => updateField(`principles.${i}.description`, v)}
                    multiline
                    rows={2}
                  />
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Section: תחומי חיים ───────────────────────────────────── */}
      <div className="rounded-lg border bg-card p-5 space-y-4">
        <h2 className="text-sm font-semibold">תחומי חיים (לפי עומס משאבים)</h2>
        <div className="grid grid-cols-3 gap-3">
          {(content.domains ?? []).map((domain, i) => {
            const priorityColor = DOMAIN_PRIORITY_COLORS[domain.priority] ?? ORANGE;
            return (
              <div
                key={i}
                className="rounded-md border bg-muted/30 p-3 space-y-2"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{domain.emoji}</span>
                  <span className="text-sm font-semibold leading-tight">
                    <EditableText
                      value={domain.name}
                      onSave={(v) => updateField(`domains.${i}.name`, v)}
                    />
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <EditableText
                      value={domain.hours_per_week}
                      onSave={(v) => updateField(`domains.${i}.hours_per_week`, v)}
                    />
                  </div>
                  <span
                    className="inline-block text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{
                      backgroundColor: `${priorityColor}20`,
                      color: priorityColor,
                    }}
                  >
                    <EditableText
                      value={domain.priority}
                      onSave={(v) => updateField(`domains.${i}.priority`, v)}
                    />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Section: מבנה יום אידיאלי ────────────────────────────── */}
      <div className="rounded-lg border bg-card p-5 space-y-3">
        <h2 className="text-sm font-semibold">מבנה יום אידיאלי</h2>
        <div className="space-y-2">
          {(content.daily_structure ?? []).map((block, i) => {
            const color = DAILY_BLOCK_COLORS[i] ?? ORANGE;
            return (
              <div
                key={i}
                className="flex items-start gap-3 rounded-md p-3"
                style={{ backgroundColor: `${color}10`, borderRight: `3px solid ${color}` }}
              >
                <div className="min-w-[110px]">
                  <div className="text-xs font-semibold" style={{ color }}>
                    <EditableText
                      value={block.block}
                      onSave={(v) => updateField(`daily_structure.${i}.block`, v)}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <EditableText
                      value={block.time}
                      onSave={(v) => updateField(`daily_structure.${i}.time`, v)}
                    />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <EditableText
                    value={block.focus}
                    onSave={(v) => updateField(`daily_structure.${i}.focus`, v)}
                    multiline
                    rows={2}
                  />
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Bottom row: כלי ADHD + מניעת שחיקה + גבולות ────────── */}
      <div className="grid grid-cols-3 gap-4">
        {/* כלי ADHD */}
        <SectionCard title="כלים לריכוז (ADHD)">
          <div className="space-y-1.5">
            {(content.adhd_tools ?? []).map((tool, i) => (
              <BulletItem key={i}>
                <EditableText
                  value={tool}
                  onSave={(v) => updateField(`adhd_tools.${i}`, v)}
                />
              </BulletItem>
            ))}
          </div>
        </SectionCard>

        {/* מניעת שחיקה */}
        <SectionCard title="מניעת שחיקה">
          <div className="space-y-1.5">
            {(content.burnout_prevention ?? []).map((item, i) => (
              <BulletItem key={i}>
                <EditableText
                  value={item}
                  onSave={(v) => updateField(`burnout_prevention.${i}`, v)}
                />
              </BulletItem>
            ))}
          </div>
        </SectionCard>

        {/* גבולות זמן */}
        <SectionCard title="גבולות זמן קריטיים">
          <div className="space-y-1.5">
            {(content.boundaries ?? []).map((boundary, i) => (
              <BulletItem key={i}>
                <EditableText
                  value={boundary}
                  onSave={(v) => updateField(`boundaries.${i}`, v)}
                />
              </BulletItem>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Motivational footer */}
      <HighlightBox color={ORANGE}>
        <div className="text-center space-y-1">
          <p className="font-semibold">אתה לא צריך לעשות הכל לבד</p>
          <p className="text-sm opacity-80">האצל, בקש עזרה, ותן לעצמך אישור לא להיות מושלם. התקדמות על פני שלמות.</p>
        </div>
      </HighlightBox>
    </div>
  );
}

SelfManagementPage.path = "/self-management";
