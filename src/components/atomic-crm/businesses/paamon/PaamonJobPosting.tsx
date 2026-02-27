import { Link } from "react-router";
import { ArrowRight, Megaphone } from "lucide-react";
import { useContentPage } from "../../hooks/useContentPage";
import { EditableText } from "../../misc/EditableText";

const GREEN = "#3fb950";

// ─── Content Type ──────────────────────────────────────────────────────────────

type JobPostingContent = {
  title: string;
  subtitle: string;
  headline: string;
  intro: string;
  positions: { icon: string; title: string }[];
  requirements: string[];
  benefits: { icon: string; text: string }[];
  details: { icon: string; text: string }[];
  start_date: string;
  cta: string;
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  created_at: string;
};

// ─── Main Component ────────────────────────────────────────────────────────────

export function PaamonJobPosting() {
  const { content, isPending, updateField } = useContentPage<JobPostingContent>("paamon/job-posting");

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
        <Megaphone className="h-6 w-6 shrink-0" style={{ color: GREEN }} />
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

      {/* Main title */}
      <div
        className="rounded-lg border p-5"
        style={{ borderColor: `${GREEN}40`, backgroundColor: `${GREEN}08` }}
      >
        <h2 className="text-base font-bold leading-snug" style={{ color: GREEN }}>
          <EditableText
            value={content.headline}
            onSave={(v) => updateField("headline", v)}
          />
        </h2>
      </div>

      {/* Opening text */}
      <div className="rounded-lg border bg-card p-5">
        <p className="text-sm text-muted-foreground leading-relaxed">
          <EditableText
            value={content.intro}
            onSave={(v) => updateField("intro", v)}
            multiline
            rows={3}
          />
        </p>
      </div>

      {/* Open positions */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold">תפקידים פתוחים</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {(content.positions ?? []).map((pos, i) => (
            <div
              key={i}
              className="rounded-lg border p-4 flex items-center gap-3"
              style={{ borderColor: `${GREEN}50`, backgroundColor: `${GREEN}0d` }}
            >
              <span className="text-2xl">{pos.icon}</span>
              <span className="text-sm font-semibold">
                <EditableText
                  value={pos.title}
                  onSave={(v) => updateField(`positions.${i}.title`, v)}
                />
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Requirements */}
      <div className="rounded-lg border bg-card p-5 space-y-3">
        <h2 className="text-sm font-semibold">דרישות התפקיד</h2>
        <div className="space-y-2">
          {(content.requirements ?? []).map((req, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="mt-0.5 shrink-0 font-bold" style={{ color: GREEN }}>
                ✓
              </span>
              <span>
                <EditableText
                  value={req}
                  onSave={(v) => updateField(`requirements.${i}`, v)}
                />
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* What we offer */}
      <div className="rounded-lg border bg-card p-5 space-y-3">
        <h2 className="text-sm font-semibold">מה אנחנו מציעים</h2>
        <div className="space-y-2.5">
          {(content.benefits ?? []).map((benefit, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="shrink-0 text-base">{benefit.icon}</span>
              <span>
                <EditableText
                  value={benefit.text}
                  onSave={(v) => updateField(`benefits.${i}.text`, v)}
                />
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Position details */}
      <div className="rounded-lg border bg-card p-5 space-y-3">
        <h2 className="text-sm font-semibold">פרטי המשרה</h2>
        <div className="space-y-2.5">
          {(content.details ?? []).map((detail, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="shrink-0 text-base">{detail.icon}</span>
              <span>
                <EditableText
                  value={detail.text}
                  onSave={(v) => updateField(`details.${i}.text`, v)}
                />
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Opening date */}
      <div
        className="rounded-lg border px-5 py-3 flex items-center gap-2"
        style={{ borderColor: `${GREEN}40`, backgroundColor: `${GREEN}08` }}
      >
        <span className="text-sm text-muted-foreground">תחילת עבודה:</span>
        <span className="text-sm font-semibold" style={{ color: GREEN }}>
          <EditableText
            value={content.start_date}
            onSave={(v) => updateField("start_date", v)}
          />
        </span>
      </div>

      {/* Contact CTA */}
      <div
        className="rounded-lg border p-5 space-y-4"
        style={{ borderColor: `${GREEN}50`, backgroundColor: `${GREEN}0d` }}
      >
        <h2 className="text-sm font-semibold" style={{ color: GREEN }}>
          <EditableText
            value={content.cta}
            onSave={(v) => updateField("cta", v)}
          />
        </h2>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-base">📱</span>
            <span className="text-muted-foreground">
              <EditableText
                value={content.contact_name}
                onSave={(v) => updateField("contact_name", v)}
              />
              :
            </span>
            <span className="font-medium" dir="ltr">
              <EditableText
                value={content.contact_phone}
                onSave={(v) => updateField("contact_phone", v)}
              />
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-base">📧</span>
            <span className="font-medium" dir="ltr">
              <EditableText
                value={content.contact_email}
                onSave={(v) => updateField("contact_email", v)}
              />
            </span>
          </div>
        </div>
      </div>

      {/* Creation date */}
      <p className="text-xs text-muted-foreground/60 text-center">
        תאריך יצירה:{" "}
        <EditableText
          value={content.created_at}
          onSave={(v) => updateField("created_at", v)}
          className="inline"
        />
      </p>
    </div>
  );
}

PaamonJobPosting.path = "/paamon/job-posting";
