import { useState } from "react";
import { Link } from "react-router";
import { ArrowRight, FileText, Copy, Check } from "lucide-react";
import { useContentPage } from "../../hooks/useContentPage";
import { EditableText } from "../../misc/EditableText";

const PURPLE = "#a78bfa";
const GREEN = "#3fb950";
const BLUE = "#58a6ff";

type TreatmentReportContent = {
  title: string;
  subtitle: string;
  meta: {
    period: string;
    status: string;
    confidentiality: string;
  };
  report_text: string;
  resources: string[];
  notes: string[];
};

function InfoRow({
  label,
  value,
  color,
  onSave,
}: {
  label: string;
  value: string;
  color?: string;
  onSave: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="text-muted-foreground shrink-0 w-36">{label}</span>
      <span className="font-medium" style={color ? { color } : undefined}>
        <EditableText value={value} onSave={onSave} className="font-medium" />
      </span>
    </div>
  );
}

function NoteItem({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 text-sm text-muted-foreground">
      <span
        className="shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: `${PURPLE}80` }}
      />
      <span className="leading-relaxed">{children}</span>
    </div>
  );
}

export function PaamonTreatmentReport() {
  const [copied, setCopied] = useState(false);
  const { content, isPending, updateField } =
    useContentPage<TreatmentReportContent>("paamon/treatment-report");

  if (isPending) {
    return (
      <div className="p-8 text-center text-muted-foreground">טוען...</div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(content.report_text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

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
        <FileText className="h-6 w-6" style={{ color: PURPLE }} />
        <div>
          <h1 className="text-xl font-semibold">
            <EditableText
              value={content.title}
              onSave={(v) => updateField("title", v)}
              className="text-xl font-semibold"
            />
          </h1>
          <p className="text-sm text-muted-foreground">
            <EditableText
              value={content.subtitle}
              onSave={(v) => updateField("subtitle", v)}
              className="text-sm text-muted-foreground"
            />
          </p>
        </div>
      </div>

      {/* Meta info */}
      <div
        className="rounded-lg border bg-card p-4 space-y-2"
        style={{ borderColor: `${PURPLE}30` }}
      >
        <InfoRow
          label="תקופת הטיפול"
          value={content.meta?.period ?? ""}
          color={PURPLE}
          onSave={(v) => updateField("meta.period", v)}
        />
        <InfoRow
          label="סטטוס"
          value={content.meta?.status ?? ""}
          color={GREEN}
          onSave={(v) => updateField("meta.status", v)}
        />
        <InfoRow
          label="סודיות"
          value={content.meta?.confidentiality ?? ""}
          color={BLUE}
          onSave={(v) => updateField("meta.confidentiality", v)}
        />
      </div>

      {/* Report document card */}
      <div
        className="rounded-lg border bg-card p-6 space-y-4"
        style={{ borderColor: `${PURPLE}25` }}
      >
        {/* Document header */}
        <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: `${PURPLE}20` }}>
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: PURPLE }}
            >
              דיווח טיפולי
            </p>
            <p className="text-sm text-muted-foreground mt-0.5">
              מרכז פעמון — מסמך פנימי
            </p>
          </div>
          <div
            className="text-xs px-2.5 py-1 rounded-full font-medium"
            style={{ color: PURPLE, backgroundColor: `${PURPLE}15` }}
          >
            אנונימי
          </div>
        </div>

        {/* Report body */}
        <div className="space-y-4 text-sm leading-relaxed text-foreground">
          <EditableText
            value={content.report_text}
            onSave={(v) => updateField("report_text", v)}
            multiline
            rows={10}
            className="text-sm leading-relaxed"
          />
        </div>

        {/* Resources block */}
        {content.resources && content.resources.length > 0 && (
          <div className="rounded-md bg-muted/50 px-4 py-3">
            <p className="text-xs font-semibold mb-2" style={{ color: GREEN }}>
              משאבי המטופל
            </p>
            <div className="grid grid-cols-2 gap-1 text-xs text-muted-foreground">
              {content.resources.map((r, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span
                    className="h-1.5 w-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: GREEN }}
                  />
                  <EditableText
                    value={r}
                    onSave={(v) => updateField(`resources.${i}`, v)}
                    className="text-xs text-muted-foreground"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Copy button */}
      <div>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
          style={
            copied
              ? { borderColor: `${GREEN}60`, color: GREEN }
              : { borderColor: `${PURPLE}40`, color: PURPLE }
          }
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              הועתק!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              העתק דיווח
            </>
          )}
        </button>
      </div>

      {/* Notes section */}
      <div className="rounded-lg border bg-card p-5 space-y-3">
        <h2 className="text-sm font-semibold">הערות על הדיווח</h2>
        <div className="space-y-2">
          {content.notes && content.notes.map((note, i) => (
            <NoteItem key={i}>
              <EditableText
                value={note}
                onSave={(v) => updateField(`notes.${i}`, v)}
                className="text-sm text-muted-foreground leading-relaxed"
              />
            </NoteItem>
          ))}
        </div>
      </div>
    </div>
  );
}

PaamonTreatmentReport.path = "/paamon/treatment-report";
