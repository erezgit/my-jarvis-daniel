import { Link } from "react-router";
import { ArrowRight, Clock } from "lucide-react";
import { useContentPage } from "../../hooks/useContentPage";
import { EditableText } from "../../misc/EditableText";

const PURPLE = "#a78bfa";
const ORANGE = "#f0883e";

// ─── Content Type ──────────────────────────────────────────────────────────────

type WaitingListContent = {
  title: string;
  subtitle: string;
  total_waiting: number;
  info_title: string;
  info_text: string;
  students: {
    name: string;
    age: string;
    school: string;
    parent: string;
    phone: string;
    desired_group: string;
    status: string;
    reason: string;
  }[];
};

// ─── Component ────────────────────────────────────────────────────────────────

export function PaamonWaitingList() {
  const { content, isPending, updateField } =
    useContentPage<WaitingListContent>("paamon/waiting-list");

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
        <Clock className="h-6 w-6" style={{ color: PURPLE }} />
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

      {/* Summary stat */}
      <div className="rounded-lg border bg-card p-5 flex items-center gap-4">
        <div
          className="text-4xl font-bold"
          style={{ color: PURPLE }}
        >
          {String(content.total_waiting)}
        </div>
        <div>
          <div className="text-sm font-medium">תלמידים בהמתנה</div>
          <div className="text-xs text-muted-foreground">
            ממתינים לקבוצה מתאימה
          </div>
        </div>
      </div>

      {/* Info box */}
      <div
        className="rounded-lg border bg-card p-5 space-y-2"
        style={{ borderColor: `${PURPLE}40` }}
      >
        <div className="text-sm font-semibold" style={{ color: PURPLE }}>
          <EditableText
            value={content.info_title}
            onSave={(v) => updateField("info_title", v)}
          />
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          <EditableText
            value={content.info_text}
            onSave={(v) => updateField("info_text", v)}
            multiline
            rows={3}
          />
        </p>
      </div>

      {/* Student cards */}
      {(content.students ?? []).map((student, i) => (
        <div key={i} className="rounded-lg border bg-card p-5 space-y-4">
          {/* Student header */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-base font-semibold">
                <EditableText
                  value={student.name}
                  onSave={(v) => updateField(`students.${i}.name`, v)}
                />
              </div>
              <div className="text-xs text-muted-foreground">
                גיל{" "}
                <EditableText
                  value={student.age}
                  onSave={(v) => updateField(`students.${i}.age`, v)}
                />
              </div>
            </div>
            <span
              className="text-xs font-medium px-2 py-1 rounded-full"
              style={{ color: PURPLE, backgroundColor: `${PURPLE}20` }}
            >
              <EditableText
                value={student.status}
                onSave={(v) => updateField(`students.${i}.status`, v)}
              />
            </span>
          </div>

          {/* Details */}
          <div className="space-y-2">
            <div className="flex items-start gap-3 text-sm">
              <span className="text-muted-foreground shrink-0 w-28">בית ספר</span>
              <span className="font-medium">
                <EditableText
                  value={student.school}
                  onSave={(v) => updateField(`students.${i}.school`, v)}
                />
              </span>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <span className="text-muted-foreground shrink-0 w-28">הורה</span>
              <span className="font-medium">
                <EditableText
                  value={student.parent}
                  onSave={(v) => updateField(`students.${i}.parent`, v)}
                />
              </span>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <span className="text-muted-foreground shrink-0 w-28">טלפון</span>
              <span className="font-medium">
                <EditableText
                  value={student.phone}
                  onSave={(v) => updateField(`students.${i}.phone`, v)}
                />
              </span>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <span className="text-muted-foreground shrink-0 w-28">קבוצה רצויה</span>
              <span className="font-medium">
                <EditableText
                  value={student.desired_group}
                  onSave={(v) => updateField(`students.${i}.desired_group`, v)}
                />
              </span>
            </div>
          </div>

          {/* Reason box */}
          <div className="rounded-md bg-muted/40 px-4 py-3 text-sm">
            <div
              className="text-xs font-semibold mb-1"
              style={{ color: ORANGE }}
            >
              סיבה להמתנה
            </div>
            <p className="text-muted-foreground leading-relaxed">
              <EditableText
                value={student.reason}
                onSave={(v) => updateField(`students.${i}.reason`, v)}
                multiline
                rows={2}
              />
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

PaamonWaitingList.path = "/paamon/waiting-list";
