import { Link } from "react-router";
import { ArrowRight, Music } from "lucide-react";
import { useContentPage } from "../../hooks/useContentPage";
import { EditableText } from "../../misc/EditableText";

const GREEN = "#3fb950";
const BLUE = "#58a6ff";
const PURPLE = "#a78bfa";
const ORANGE = "#f0883e";

// ─── Content Type ──────────────────────────────────────────────────────────────

type ShirDerekhContent = {
  title: string;
  subtitle: string;
  program_description: string;
  target_audience: string;
  domains: {
    num: number;
    name: string;
    instrument: string;
    question_count: number;
    questions: string[];
  }[];
  open_questions: string[];
  assessment_tools: {
    name: string;
    hebrew_name: string;
    description: string;
    questions_count: number;
  }[];
  implementation_notes: string[];
};

// ─── Domain accent colors ──────────────────────────────────────────────────────

const DOMAIN_COLORS = [GREEN, BLUE, PURPLE, ORANGE];

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

// ─── Component ────────────────────────────────────────────────────────────────

export function ClinicShirDerekh() {
  const { content, isPending, updateField } =
    useContentPage<ShirDerekhContent>("clinic/shir-derekh");

  if (isPending) {
    return <div className="p-8 text-center text-muted-foreground">טוען...</div>;
  }

  return (
    <div className="flex flex-col gap-6 mt-1" dir="rtl">
      {/* Back link */}
      <Link
        to="/clinic"
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
      >
        <ArrowRight className="h-4 w-4" />
        קליניקה פרטית
      </Link>

      {/* Header */}
      <div className="flex items-center gap-3">
        <Music className="h-6 w-6" style={{ color: GREEN }} />
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

      {/* Program Overview */}
      <div className="rounded-lg border bg-card p-5 space-y-4">
        <h2 className="text-sm font-semibold">תיאור התוכנית</h2>

        <HighlightBox color={GREEN}>
          <EditableText
            value={content.program_description}
            onSave={(v) => updateField("program_description", v)}
            multiline
            rows={3}
          />
        </HighlightBox>

        <div className="space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            אוכלוסיית יעד
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <EditableText
              value={content.target_audience}
              onSave={(v) => updateField("target_audience", v)}
              multiline
              rows={2}
            />
          </p>
        </div>
      </div>

      {/* Assessment Domains */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold">תחומי הערכה — שאלון (20 שאלות כמותיות)</h2>

        {(content.domains ?? []).map((domain, i) => {
          const color = DOMAIN_COLORS[i] ?? GREEN;
          return (
            <div
              key={i}
              className="rounded-lg border bg-card overflow-hidden"
              style={{ borderTopColor: color, borderTopWidth: 3 }}
            >
              {/* Domain Header */}
              <div className="flex items-center gap-3 px-5 py-3 border-b">
                <div
                  className="flex items-center justify-center h-7 w-7 rounded-full text-xs font-bold shrink-0"
                  style={{ backgroundColor: `${color}20`, color: color }}
                >
                  {domain.num}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">
                    <EditableText
                      value={domain.name}
                      onSave={(v) => updateField(`domains.${i}.name`, v)}
                    />
                  </p>
                  <p className="text-xs" style={{ color: color }}>
                    <EditableText
                      value={domain.instrument}
                      onSave={(v) => updateField(`domains.${i}.instrument`, v)}
                    />
                  </p>
                </div>
                <span
                  className="text-xs rounded-full px-2 py-0.5 shrink-0"
                  style={{ backgroundColor: `${color}15`, color: color }}
                >
                  {domain.question_count} שאלות
                </span>
              </div>

              {/* Questions */}
              <div className="px-5 py-3 space-y-2">
                {(domain.questions ?? []).map((q, j) => (
                  <div key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span
                      className="shrink-0 mt-0.5 text-xs font-medium w-4"
                      style={{ color: color }}
                    >
                      {j + 1}.
                    </span>
                    <span className="leading-relaxed">
                      <EditableText
                        value={q}
                        onSave={(v) => updateField(`domains.${i}.questions.${j}`, v)}
                      />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Open Questions */}
      <SectionCard title="שאלות פתוחות (חלק ב׳ — 4 שאלות)">
        <div className="space-y-3">
          {(content.open_questions ?? []).map((q, i) => (
            <div key={i} className="flex items-start gap-3">
              <span
                className="shrink-0 mt-0.5 h-5 w-5 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: `${GREEN}20`, color: GREEN }}
              >
                {i + 1}
              </span>
              <p className="text-sm text-muted-foreground leading-relaxed">
                <EditableText
                  value={q}
                  onSave={(v) => updateField(`open_questions.${i}`, v)}
                  multiline
                  rows={2}
                />
              </p>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Recommended Tools */}
      <div className="rounded-lg border bg-card p-5 space-y-4">
        <h2 className="text-sm font-semibold">כלי הערכה פסיכולוגיים מומלצים</h2>

        <div className="grid gap-3">
          {(content.assessment_tools ?? []).map((tool, i) => (
            <div
              key={i}
              className="rounded-md border bg-muted/30 px-4 py-3 space-y-1"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">
                    <EditableText
                      value={tool.name}
                      onSave={(v) => updateField(`assessment_tools.${i}.name`, v)}
                    />
                  </span>
                  <span className="text-xs text-muted-foreground">
                    (<EditableText
                      value={tool.hebrew_name}
                      onSave={(v) => updateField(`assessment_tools.${i}.hebrew_name`, v)}
                    />)
                  </span>
                </div>
                <span
                  className="text-xs rounded-full px-2 py-0.5 shrink-0"
                  style={{ backgroundColor: `${GREEN}15`, color: GREEN }}
                >
                  {tool.questions_count} פריטים
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                <EditableText
                  value={tool.description}
                  onSave={(v) => updateField(`assessment_tools.${i}.description`, v)}
                  multiline
                  rows={2}
                />
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Implementation Notes */}
      <SectionCard title="הנחיות יישום — Google Forms">
        <div className="space-y-1.5">
          {(content.implementation_notes ?? []).map((note, i) => (
            <BulletItem key={i}>
              <EditableText
                value={note}
                onSave={(v) => updateField(`implementation_notes.${i}`, v)}
              />
            </BulletItem>
          ))}
        </div>
      </SectionCard>

      {/* Scale Reference */}
      <div
        className="rounded-lg border px-5 py-4 space-y-2"
        style={{ borderColor: `${GREEN}30`, backgroundColor: `${GREEN}08` }}
      >
        <p className="text-xs font-semibold" style={{ color: GREEN }}>
          סקאלת ניקוד
        </p>
        <div className="grid grid-cols-5 gap-2 text-center">
          {[
            { val: 1, label: "כמעט אף פעם" },
            { val: 2, label: "לעיתים רחוקות" },
            { val: 3, label: "לפעמים" },
            { val: 4, label: "לעיתים קרובות" },
            { val: 5, label: "כמעט תמיד" },
          ].map((s) => (
            <div key={s.val} className="rounded border bg-card p-2 space-y-1">
              <div className="text-base font-bold" style={{ color: GREEN }}>
                {s.val}
              </div>
              <div className="text-xs text-muted-foreground leading-tight">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

ClinicShirDerekh.path = "/clinic/shir-derekh";
