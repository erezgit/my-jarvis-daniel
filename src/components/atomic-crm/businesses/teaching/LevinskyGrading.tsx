import { Link } from "react-router";
import { ClipboardCheck } from "lucide-react";
import { useContentPage } from "../../hooks/useContentPage";
import { EditableText } from "../../misc/EditableText";

const GREEN = "#3fb950";
const BLUE = "#58a6ff";
const ORANGE = "#f0883e";

// ─── Content Type ──────────────────────────────────────────────────────────────

type GradingContent = {
  title: string;
  subtitle: string;
  assignment_description: string;
  grading_scale: {
    min: number;
    max: number;
    note: string;
  };
  criteria: {
    name: string;
    description: string;
  }[];
  examples: {
    student: string;
    score: number;
    feedback: string;
  }[];
  notes: string[];
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

function ScoreBadge({ score }: { score: number }) {
  let color = GREEN;
  if (score <= 92) color = ORANGE;
  else if (score <= 95) color = BLUE;

  return (
    <span
      className="inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-semibold tabular-nums"
      style={{
        backgroundColor: `${color}20`,
        color: color,
        border: `1px solid ${color}50`,
      }}
    >
      {score}
    </span>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function LevinskyGrading() {
  const { content, isPending, updateField } =
    useContentPage<GradingContent>("teaching/grading");

  if (isPending) {
    return <div className="p-8 text-center text-muted-foreground">טוען...</div>;
  }

  return (
    <div className="flex flex-col gap-6 mt-1" dir="rtl">
      {/* Back link */}
      <Link
        to="/teaching"
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
      >
        <span className="text-base">←</span>
        לוינסקי — הוראה
      </Link>

      {/* Header */}
      <div className="flex items-center gap-3">
        <ClipboardCheck className="h-6 w-6" style={{ color: GREEN }} />
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

      {/* Assignment Description */}
      <HighlightBox color={GREEN}>
        <EditableText
          value={content.assignment_description}
          onSave={(v) => updateField("assignment_description", v)}
          multiline
          rows={4}
        />
      </HighlightBox>

      {/* ── Section: סקאלת ציונים ─────────────────────────────────── */}
      <SectionCard title="סקאלת ציונים">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">מינימום</span>
            <ScoreBadge score={content.grading_scale?.min ?? 90} />
          </div>
          <div className="text-muted-foreground/40">—</div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">מקסימום</span>
            <ScoreBadge score={content.grading_scale?.max ?? 98} />
          </div>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          <EditableText
            value={content.grading_scale?.note}
            onSave={(v) => updateField("grading_scale.note", v)}
            multiline
            rows={2}
          />
        </p>
      </SectionCard>

      {/* ── Section: קריטריוני בדיקה ─────────────────────────────── */}
      <div className="rounded-lg border bg-card p-5 space-y-4">
        <h2 className="text-sm font-semibold">קריטריוני בדיקה</h2>
        <div className="grid grid-cols-2 gap-3">
          {(content.criteria ?? []).map((criterion, i) => (
            <div
              key={i}
              className="rounded-md border bg-muted/30 px-4 py-3 space-y-1.5"
            >
              <div
                className="text-xs font-semibold"
                style={{ color: GREEN }}
              >
                <EditableText
                  value={criterion.name}
                  onSave={(v) => updateField(`criteria.${i}.name`, v)}
                />
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                <EditableText
                  value={criterion.description}
                  onSave={(v) => updateField(`criteria.${i}.description`, v)}
                  multiline
                  rows={3}
                />
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Section: רמות איכות ────────────────────────────────────── */}
      <div className="rounded-lg border bg-card p-5 space-y-3">
        <h2 className="text-sm font-semibold">רמות איכות — הרחבה סובייקטיבית</h2>
        <div className="space-y-2">
          <div
            className="flex items-start gap-3 rounded-md px-3 py-2"
            style={{ backgroundColor: `${GREEN}10`, borderRight: `3px solid ${GREEN}` }}
          >
            <ScoreBadge score={97} />
            <p className="text-xs text-muted-foreground leading-relaxed">
              מעולה (96–98): עומק רב, זכרונות ודימויים מפורטים, חיבור אישי עמוק
            </p>
          </div>
          <div
            className="flex items-start gap-3 rounded-md px-3 py-2"
            style={{ backgroundColor: `${BLUE}10`, borderRight: `3px solid ${BLUE}` }}
          >
            <ScoreBadge score={94} />
            <p className="text-xs text-muted-foreground leading-relaxed">
              טוב מאוד (93–95): הרחבה טובה, הזדהות חזקה, אולי חסר קצת עומק בזכרונות/דימויים
            </p>
          </div>
          <div
            className="flex items-start gap-3 rounded-md px-3 py-2"
            style={{ backgroundColor: `${ORANGE}10`, borderRight: `3px solid ${ORANGE}` }}
          >
            <ScoreBadge score={91} />
            <p className="text-xs text-muted-foreground leading-relaxed">
              טוב (90–92): הרחבה בסיסית, הזדהות כללית, חסר זכרונות/דימויים ספציפיים
            </p>
          </div>
        </div>
      </div>

      {/* ── Section: דוגמאות מעבודות שנבדקו ─────────────────────── */}
      <div className="rounded-lg border bg-card p-5 space-y-3">
        <h2 className="text-sm font-semibold">דוגמאות מעבודות שנבדקו</h2>
        <div className="space-y-2">
          {(content.examples ?? []).map((example, i) => {
            let borderColor = GREEN;
            if (example.score <= 92) borderColor = ORANGE;
            else if (example.score <= 95) borderColor = BLUE;

            return (
              <div
                key={i}
                className="flex items-start gap-3 rounded-md border bg-muted/20 px-4 py-3"
                style={{ borderRightColor: borderColor, borderRightWidth: "3px" }}
              >
                <div className="shrink-0">
                  <ScoreBadge score={example.score} />
                </div>
                <div className="flex-1 space-y-1 min-w-0">
                  <div className="text-xs font-medium">
                    <EditableText
                      value={example.student}
                      onSave={(v) => updateField(`examples.${i}.student`, v)}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <EditableText
                      value={example.feedback}
                      onSave={(v) => updateField(`examples.${i}.feedback`, v)}
                      multiline
                      rows={2}
                    />
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Section: טיפים לבדיקה ────────────────────────────────── */}
      <SectionCard title="טיפים לבדיקה מהירה">
        <div className="space-y-1.5">
          {(content.notes ?? []).map((note, i) => (
            <BulletItem key={i}>
              <EditableText
                value={note}
                onSave={(v) => updateField(`notes.${i}`, v)}
              />
            </BulletItem>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

LevinskyGrading.path = "/teaching/grading";
