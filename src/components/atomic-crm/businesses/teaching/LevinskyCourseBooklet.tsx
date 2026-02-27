import { Link } from "react-router";
import {
  ArrowRight,
  BookOpen,
  Music,
  Piano,
  Guitar,
  GraduationCap,
  FileText,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";
import { useContentPage } from "../../hooks/useContentPage";
import { EditableText } from "../../misc/EditableText";

const PURPLE = "#a78bfa";
const BLUE = "#58a6ff";
const GREEN = "#3fb950";
const ORANGE = "#f0883e";
const RED = "#f85149";

// ─── Content Type ───────────────────────────────────────────────────────────

type CourseBookletContent = {
  title: string;
  subtitle: string;
  overview: {
    audience: string;
    duration: string;
    instruments: string;
    total_patterns: string;
  };
  parts: {
    num: string;
    title: string;
    description: string;
    sections: {
      title: string;
      items: string[];
    }[];
  }[];
  exam: {
    title: string;
    parts: {
      num: string;
      title: string;
      description: string;
    }[];
  };
  scales: string[];
  key_facts: {
    label: string;
    value: string;
  }[];
};

// ─── Helpers ────────────────────────────────────────────────────────────────

const PART_COLORS = [PURPLE, BLUE, GREEN, ORANGE];
const PART_ICONS = [Music, Piano, Guitar, FileText];

function PartIcon({ index }: { index: number }) {
  const Icon = PART_ICONS[index] ?? BookOpen;
  return <Icon className="h-5 w-5" style={{ color: PART_COLORS[index] }} />;
}

function BulletItem({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 text-sm text-muted-foreground">
      <span className="shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
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

function PartCard({
  part,
  index,
  partIndex,
  updateField,
}: {
  part: CourseBookletContent["parts"][number];
  index: number;
  partIndex: number;
  updateField: (path: string, value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const color = PART_COLORS[index] ?? PURPLE;

  return (
    <div
      className="rounded-lg border bg-card overflow-hidden"
      style={{ borderRightColor: color, borderRightWidth: 3 }}
    >
      {/* Header */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <PartIcon index={index} />
          <div className="text-right">
            <div className="text-xs text-muted-foreground">
              <EditableText
                value={part.num}
                onSave={(v) => updateField(`parts.${partIndex}.num`, v)}
              />
            </div>
            <div className="text-sm font-semibold">
              <EditableText
                value={part.title}
                onSave={(v) => updateField(`parts.${partIndex}.title`, v)}
              />
            </div>
          </div>
        </div>
        {open ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
        )}
      </button>

      {/* Expanded content */}
      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-border/50">
          <p className="text-sm text-muted-foreground leading-relaxed pt-3">
            <EditableText
              value={part.description}
              onSave={(v) =>
                updateField(`parts.${partIndex}.description`, v)
              }
              multiline
              rows={2}
            />
          </p>
          {(part.sections ?? []).map((section, si) => (
            <div key={si} className="space-y-1.5">
              <p
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color }}
              >
                <EditableText
                  value={section.title}
                  onSave={(v) =>
                    updateField(`parts.${partIndex}.sections.${si}.title`, v)
                  }
                />
              </p>
              {(section.items ?? []).map((item, ii) => (
                <BulletItem key={ii}>
                  <EditableText
                    value={item}
                    onSave={(v) =>
                      updateField(
                        `parts.${partIndex}.sections.${si}.items.${ii}`,
                        v
                      )
                    }
                  />
                </BulletItem>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Component ──────────────────────────────────────────────────────────────

export function LevinskyCourseBooklet() {
  const { content, isPending, updateField } =
    useContentPage<CourseBookletContent>("teaching/booklet");

  if (isPending) {
    return (
      <div className="p-8 text-center text-muted-foreground">טוען...</div>
    );
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
        <BookOpen className="h-6 w-6" style={{ color: PURPLE }} />
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

      {/* Course Overview */}
      <div className="rounded-lg border bg-card p-5 space-y-3">
        <h2 className="text-sm font-semibold flex items-center gap-2">
          <GraduationCap className="h-4 w-4" style={{ color: PURPLE }} />
          סקירת הקורס
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-md bg-muted/40 px-3 py-2 space-y-0.5">
            <p className="text-xs text-muted-foreground">קהל יעד</p>
            <p className="text-sm font-medium">
              <EditableText
                value={content.overview?.audience}
                onSave={(v) => updateField("overview.audience", v)}
              />
            </p>
          </div>
          <div className="rounded-md bg-muted/40 px-3 py-2 space-y-0.5">
            <p className="text-xs text-muted-foreground">היקף</p>
            <p className="text-sm font-medium">
              <EditableText
                value={content.overview?.duration}
                onSave={(v) => updateField("overview.duration", v)}
              />
            </p>
          </div>
          <div className="rounded-md bg-muted/40 px-3 py-2 space-y-0.5">
            <p className="text-xs text-muted-foreground">כלים נדרשים</p>
            <p className="text-sm font-medium">
              <EditableText
                value={content.overview?.instruments}
                onSave={(v) => updateField("overview.instruments", v)}
              />
            </p>
          </div>
          <div className="rounded-md bg-muted/40 px-3 py-2 space-y-0.5">
            <p className="text-xs text-muted-foreground">סה"כ תבניות ליווי</p>
            <p className="text-sm font-medium">
              <EditableText
                value={content.overview?.total_patterns}
                onSave={(v) => updateField("overview.total_patterns", v)}
              />
            </p>
          </div>
        </div>
      </div>

      {/* Scales quick-reference */}
      <div className="rounded-lg border bg-card p-5 space-y-3">
        <h2 className="text-sm font-semibold flex items-center gap-2">
          <Music className="h-4 w-4" style={{ color: PURPLE }} />
          8 הסולמות המז'וריים
        </h2>
        <div className="flex flex-wrap gap-2">
          {(content.scales ?? []).map((scale, i) => (
            <span
              key={i}
              className="rounded-full px-3 py-1 text-xs font-medium border"
              style={{
                borderColor: `${PURPLE}40`,
                backgroundColor: `${PURPLE}10`,
                color: PURPLE,
              }}
            >
              <EditableText
                value={scale}
                onSave={(v) => updateField(`scales.${i}`, v)}
              />
            </span>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          לכל סולם מז'ורי — הסולם המינורי המקביל שלו (סה"כ 16 סולמות)
        </p>
      </div>

      {/* Parts accordion */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold">חלקי החוברת</h2>
        {(content.parts ?? []).map((part, i) => (
          <PartCard
            key={i}
            part={part}
            index={i}
            partIndex={i}
            updateField={updateField}
          />
        ))}
      </div>

      {/* Exam structure */}
      <div className="rounded-lg border bg-card p-5 space-y-4">
        <h2 className="text-sm font-semibold flex items-center gap-2">
          <GraduationCap className="h-4 w-4" style={{ color: ORANGE }} />
          <EditableText
            value={content.exam?.title}
            onSave={(v) => updateField("exam.title", v)}
          />
        </h2>
        <div className="space-y-3">
          {(content.exam?.parts ?? []).map((ep, i) => (
            <div
              key={i}
              className="rounded-md border px-4 py-3 space-y-1"
              style={{
                borderColor: `${ORANGE}30`,
                backgroundColor: `${ORANGE}08`,
              }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded"
                  style={{ backgroundColor: `${ORANGE}20`, color: ORANGE }}
                >
                  <EditableText
                    value={ep.num}
                    onSave={(v) => updateField(`exam.parts.${i}.num`, v)}
                  />
                </span>
                <span className="text-sm font-semibold">
                  <EditableText
                    value={ep.title}
                    onSave={(v) => updateField(`exam.parts.${i}.title`, v)}
                  />
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                <EditableText
                  value={ep.description}
                  onSave={(v) =>
                    updateField(`exam.parts.${i}.description`, v)
                  }
                  multiline
                  rows={2}
                />
              </p>
            </div>
          ))}
        </div>
        <HighlightBox color={ORANGE}>
          פורמט: סרטון וידאו ~10 דקות | הערכה: עבר / לא עבר
        </HighlightBox>
      </div>

      {/* Key Facts */}
      <div className="rounded-lg border bg-card p-5 space-y-3">
        <h2 className="text-sm font-semibold">נתוני מפתח</h2>
        <div className="grid grid-cols-3 gap-3">
          {(content.key_facts ?? []).map((fact, i) => (
            <div
              key={i}
              className="rounded-md bg-muted/40 px-3 py-2 text-center space-y-0.5"
            >
              <p
                className="text-lg font-bold"
                style={{ color: PART_COLORS[i % PART_COLORS.length] }}
              >
                <EditableText
                  value={fact.value}
                  onSave={(v) => updateField(`key_facts.${i}.value`, v)}
                />
              </p>
              <p className="text-xs text-muted-foreground">
                <EditableText
                  value={fact.label}
                  onSave={(v) => updateField(`key_facts.${i}.label`, v)}
                />
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Success criteria */}
      <HighlightBox color={GREEN}>
        <p className="font-semibold mb-1">קריטריונים להצלחה (משקל שווה)</p>
        <div className="flex gap-4 flex-wrap text-sm">
          <span>דיוק קצבי</span>
          <span>•</span>
          <span>דיוק הרמוני</span>
          <span>•</span>
          <span>זרימה ומעבר בין אקורדים</span>
        </div>
      </HighlightBox>
    </div>
  );
}

LevinskyCourseBooklet.path = "/teaching/booklet";
