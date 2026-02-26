import { useState } from "react";
import { Link } from "react-router";
import { ArrowRight, FileText, ChevronDown, ChevronUp } from "lucide-react";
import { useContentPage } from "../../hooks/useContentPage";
import { EditableText } from "../../misc/EditableText";

const BLUE = "#58a6ff";
const RED = "#f85149";
const YELLOW = "#e3b341";
const GREEN = "#3fb950";
const ORANGE = "#f0883e";

// ─── Content Type ──────────────────────────────────────────────────────────────

type MaterialsContent = {
  title: string;
  subtitle: string;
  qa_pairs: {
    question: string;
    answer: string;
  }[];
  writing_style: {
    selected: string;
    description: string;
    alternatives: {
      name: string;
      description: string;
    }[];
  };
  notation_solutions: {
    name: string;
    description: string;
    recommended: boolean;
  }[];
  improvements: {
    priority: string;
    color: string;
    items: string[];
  }[];
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

function BulletItem({ color, children }: { color?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 text-sm text-muted-foreground">
      <span
        className="shrink-0 mt-1.5 h-2 w-2 rounded-full"
        style={{ backgroundColor: color ?? "#6b7280" }}
      />
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

function QACard({
  question,
  answer,
  index,
  updateField,
}: {
  question: string;
  answer: string;
  index: number;
  updateField: (path: string, value: any) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <button
        type="button"
        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-sm font-medium hover:bg-accent transition-colors text-right"
        onClick={() => setOpen((v) => !v)}
        dir="rtl"
      >
        <span className="text-right flex-1">
          <EditableText
            value={question}
            onSave={(v) => updateField(`qa_pairs.${index}.question`, v)}
          />
        </span>
        {open ? (
          <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
        )}
      </button>
      {open && (
        <div
          className="px-4 pb-4 pt-1 text-sm text-muted-foreground leading-relaxed border-t bg-muted/30"
          dir="rtl"
        >
          <EditableText
            value={answer}
            onSave={(v) => updateField(`qa_pairs.${index}.answer`, v)}
            multiline
            rows={4}
          />
        </div>
      )}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function LevinskyMaterials() {
  const { content, isPending, updateField } =
    useContentPage<MaterialsContent>("teaching/materials");

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
        <ArrowRight className="h-4 w-4" />
        לוינסקי
      </Link>

      {/* Header */}
      <div className="flex items-center gap-3">
        <FileText className="h-6 w-6" style={{ color: BLUE }} />
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

      {/* ── Section: Course Q&A ─────────────────────────────────── */}
      <div className="rounded-lg border bg-card p-5 space-y-3">
        <h2 className="text-sm font-semibold">שאלות ותשובות — בניית הקורס</h2>
        <p className="text-xs text-muted-foreground">לחצו על שאלה לפתיחת התשובה</p>
        <div className="space-y-2">
          {(content.qa_pairs ?? []).map((pair, i) => (
            <QACard
              key={i}
              question={pair.question}
              answer={pair.answer}
              index={i}
              updateField={updateField}
            />
          ))}
        </div>
      </div>

      {/* ── Section: Writing Style ──────────────────────────────── */}
      <SectionCard title="סגנון כתיבה — בחירה סופית">
        <HighlightBox color={BLUE}>
          <p className="font-semibold mb-1">
            <EditableText
              value={content.writing_style?.selected}
              onSave={(v) => updateField("writing_style.selected", v)}
            />
          </p>
          <p className="text-sm" style={{ color: "inherit", opacity: 0.85 }}>
            <EditableText
              value={content.writing_style?.description}
              onSave={(v) => updateField("writing_style.description", v)}
              multiline
              rows={3}
            />
          </p>
        </HighlightBox>

        {(content.writing_style?.alternatives ?? []).length > 0 && (
          <div className="space-y-2 pt-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              סגנונות אחרים (לא נבחרו)
            </p>
            {(content.writing_style?.alternatives ?? []).map((alt, i) => (
              <div key={i} className="rounded-md bg-muted/40 px-3 py-2 space-y-0.5">
                <p className="text-xs font-semibold text-muted-foreground">
                  <EditableText
                    value={alt.name}
                    onSave={(v) => updateField(`writing_style.alternatives.${i}.name`, v)}
                  />
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <EditableText
                    value={alt.description}
                    onSave={(v) => updateField(`writing_style.alternatives.${i}.description`, v)}
                    multiline
                    rows={2}
                  />
                </p>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      {/* ── Section: Notation Solutions ─────────────────────────── */}
      <div className="rounded-lg border bg-card p-5 space-y-3">
        <h2 className="text-sm font-semibold">פתרונות הצגת תווים</h2>
        <div className="space-y-2">
          {(content.notation_solutions ?? []).map((sol, i) => (
            <div
              key={i}
              className="rounded-md border px-4 py-3 space-y-1"
              style={
                sol.recommended
                  ? {
                      borderColor: `${GREEN}50`,
                      backgroundColor: `${GREEN}08`,
                    }
                  : {}
              }
            >
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold">
                  <EditableText
                    value={sol.name}
                    onSave={(v) => updateField(`notation_solutions.${i}.name`, v)}
                  />
                </p>
                {sol.recommended && (
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{
                      color: GREEN,
                      backgroundColor: `${GREEN}20`,
                    }}
                  >
                    מומלץ
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                <EditableText
                  value={sol.description}
                  onSave={(v) => updateField(`notation_solutions.${i}.description`, v)}
                  multiline
                  rows={3}
                />
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Section: Improvements Checklist ─────────────────────── */}
      <div className="rounded-lg border bg-card p-5 space-y-4">
        <h2 className="text-sm font-semibold">רשימת תיקונים ושיפורים</h2>
        {(content.improvements ?? []).map((tier, i) => (
          <div key={i} className="space-y-2">
            <p
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: tier.color }}
            >
              <EditableText
                value={tier.priority}
                onSave={(v) => updateField(`improvements.${i}.priority`, v)}
              />
            </p>
            <div className="space-y-1.5">
              {(tier.items ?? []).map((item, j) => (
                <BulletItem key={j} color={tier.color}>
                  <EditableText
                    value={item}
                    onSave={(v) => updateField(`improvements.${i}.items.${j}`, v)}
                  />
                </BulletItem>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

LevinskyMaterials.path = "/teaching/materials";
