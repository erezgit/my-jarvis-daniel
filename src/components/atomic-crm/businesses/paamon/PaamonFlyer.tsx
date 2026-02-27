import { Link } from "react-router";
import { ArrowRight, Image, Music, Theater, Palette, Check, Phone, Mail } from "lucide-react";
import { useContentPage } from "../../hooks/useContentPage";
import { EditableText } from "../../misc/EditableText";

const GREEN = "#3fb950";
const PURPLE = "#a78bfa";
const BLUE = "#58a6ff";
const PINK = "#f472b6";

// ─── Content Type ──────────────────────────────────────────────────────────────

type FlyerContent = {
  title: string;
  subtitle: string;
  org: string;
  headline: string;
  headline_highlight: string;
  target: string;
  description: string;
  domains: { title: string; description: string }[];
  features: { title: string; description: string }[];
  audience: string;
  grades: string;
  days: string;
  time: string;
  cta: string;
  cta_sub: string;
  contact_name: string;
  contact_phone: string;
  contact_email: string;
};

// ─── Domain icon/color mapping (layout — hardcoded by index) ──────────────────

const DOMAIN_META = [
  { icon: Music, color: PURPLE },
  { icon: Theater, color: BLUE },
  { icon: Palette, color: PINK },
] as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function FeatureCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2.5 rounded-lg border bg-muted/30 p-3">
      <span
        className="mt-0.5 h-4 w-4 rounded-full flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${GREEN}25` }}
      >
        <Check className="h-2.5 w-2.5" style={{ color: GREEN }} />
      </span>
      <span className="text-xs text-muted-foreground leading-relaxed">{children}</span>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export function PaamonFlyer() {
  const { content, isPending, updateField } = useContentPage<FlyerContent>("paamon/flyer");

  if (isPending) {
    return (
      <div className="p-8 text-center text-muted-foreground">טוען...</div>
    );
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

      {/* Section header */}
      <div className="flex items-center gap-3">
        <Image className="h-6 w-6 shrink-0" style={{ color: GREEN }} />
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

      {/* ── Flyer ───────────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border overflow-hidden shadow-md">

        {/* Gradient header banner */}
        <div
          className="px-6 py-5 text-center space-y-1"
          style={{
            background: "linear-gradient(135deg, #a78bfa 0%, #58a6ff 50%, #f472b6 100%)",
          }}
        >
          <p className="text-xs font-medium text-white/80 tracking-wide">
            <EditableText
              value={content.org}
              onSave={(v) => updateField("org", v)}
              className="text-xs font-medium"
            />
          </p>
        </div>

        {/* Main headline block */}
        <div
          className="px-6 py-6 text-center space-y-3"
          style={{ background: "linear-gradient(180deg, #1a0a2e 0%, #0d1117 100%)" }}
        >
          <h2 className="text-2xl font-extrabold leading-tight" style={{ color: "#ffffff" }}>
            <EditableText
              value={content.headline}
              onSave={(v) => updateField("headline", v)}
              className="text-2xl font-extrabold"
            />
            <br />
            <span
              style={{
                background: "linear-gradient(90deg, #a78bfa, #58a6ff, #f472b6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              <EditableText
                value={content.headline_highlight}
                onSave={(v) => updateField("headline_highlight", v)}
                className="text-2xl font-extrabold"
              />
            </span>
          </h2>
          <p className="text-sm font-medium text-white/70">
            <EditableText
              value={content.target}
              onSave={(v) => updateField("target", v)}
              className="text-sm font-medium"
            />
          </p>
          <p className="text-xs text-white/55 leading-relaxed max-w-sm mx-auto">
            <EditableText
              value={content.description}
              onSave={(v) => updateField("description", v)}
              multiline
              rows={3}
              className="text-xs leading-relaxed"
            />
          </p>
        </div>

        {/* Domain cards */}
        <div className="px-5 py-5 bg-card space-y-3">
          <p
            className="text-xs font-semibold text-center uppercase tracking-wider"
            style={{ color: PURPLE }}
          >
            תחומי הפעילות
          </p>
          <div className="grid grid-cols-3 gap-3">
            {(content.domains ?? []).map((domain, i) => {
              const meta = DOMAIN_META[i] ?? DOMAIN_META[0];
              const Icon = meta.icon;
              const color = meta.color;
              return (
                <div
                  key={i}
                  className="rounded-xl border p-4 flex flex-col items-center gap-3 text-center"
                  style={{ borderColor: `${color}40`, backgroundColor: `${color}0d` }}
                >
                  <div
                    className="h-11 w-11 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${color}20` }}
                  >
                    <Icon className="h-5 w-5" style={{ color }} />
                  </div>
                  <p className="text-sm font-bold">
                    <EditableText
                      value={domain.title}
                      onSave={(v) => updateField(`domains.${i}.title`, v)}
                      className="text-sm font-bold"
                    />
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <EditableText
                      value={domain.description}
                      onSave={(v) => updateField(`domains.${i}.description`, v)}
                      className="text-xs text-muted-foreground"
                    />
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Why us */}
        <div className="px-5 pb-5 bg-card space-y-3">
          <p
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: GREEN }}
          >
            למה דווקא אנחנו?
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            {(content.features ?? []).map((feature, i) => (
              <FeatureCard key={i}>
                <span className="font-semibold text-foreground">
                  <EditableText
                    value={feature.title}
                    onSave={(v) => updateField(`features.${i}.title`, v)}
                    className="font-semibold text-foreground text-xs"
                  />
                </span>
                <br />
                <EditableText
                  value={feature.description}
                  onSave={(v) => updateField(`features.${i}.description`, v)}
                  className="text-xs text-muted-foreground"
                />
              </FeatureCard>
            ))}
          </div>
        </div>

        {/* Details row */}
        <div
          className="mx-5 mb-5 rounded-xl border grid grid-cols-2 divide-x divide-x-reverse overflow-hidden"
          style={{ borderColor: `${BLUE}35` }}
        >
          <div className="px-4 py-3 text-center space-y-0.5">
            <p className="text-xs text-muted-foreground">למי?</p>
            <p className="text-sm font-semibold">
              <EditableText
                value={content.audience}
                onSave={(v) => updateField("audience", v)}
                className="text-sm font-semibold"
              />
            </p>
            <p className="text-xs text-muted-foreground">
              <EditableText
                value={content.grades}
                onSave={(v) => updateField("grades", v)}
                className="text-xs text-muted-foreground"
              />
            </p>
          </div>
          <div className="px-4 py-3 text-center space-y-0.5">
            <p className="text-xs text-muted-foreground">מתי?</p>
            <p className="text-sm font-semibold">
              <EditableText
                value={content.days}
                onSave={(v) => updateField("days", v)}
                className="text-sm font-semibold"
              />
            </p>
            <p className="text-xs text-muted-foreground">
              <EditableText
                value={content.time}
                onSave={(v) => updateField("time", v)}
                className="text-xs text-muted-foreground"
              />
            </p>
          </div>
        </div>

        {/* CTA */}
        <div
          className="mx-5 mb-5 rounded-xl px-5 py-4 text-center space-y-3"
          style={{
            background: "linear-gradient(135deg, #a78bfa22 0%, #58a6ff22 100%)",
            border: "1px solid #a78bfa44",
          }}
        >
          <p className="text-sm font-bold leading-snug" style={{ color: "#ffffff" }}>
            <EditableText
              value={content.cta}
              onSave={(v) => updateField("cta", v)}
              className="text-sm font-bold"
            />
          </p>
          <p className="text-xs text-muted-foreground">
            <EditableText
              value={content.cta_sub}
              onSave={(v) => updateField("cta_sub", v)}
              className="text-xs text-muted-foreground"
            />
          </p>
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-center gap-2 text-sm">
              <Phone className="h-3.5 w-3.5 shrink-0" style={{ color: GREEN }} />
              <span className="text-muted-foreground text-xs">
                <EditableText
                  value={content.contact_name}
                  onSave={(v) => updateField("contact_name", v)}
                  className="text-xs text-muted-foreground"
                />
              </span>
              <span className="font-semibold text-xs" dir="ltr">
                <EditableText
                  value={content.contact_phone}
                  onSave={(v) => updateField("contact_phone", v)}
                  className="font-semibold text-xs"
                />
              </span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm">
              <Mail className="h-3.5 w-3.5 shrink-0" style={{ color: GREEN }} />
              <span className="font-medium text-xs" dir="ltr">
                <EditableText
                  value={content.contact_email}
                  onSave={(v) => updateField("contact_email", v)}
                  className="font-medium text-xs"
                />
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="px-6 py-3 text-center"
          style={{
            background: "linear-gradient(135deg, #a78bfa 0%, #58a6ff 50%, #f472b6 100%)",
          }}
        >
          <p className="text-xs font-medium text-white/80 tracking-wide">
            <EditableText
              value={content.org}
              onSave={(v) => updateField("org", v)}
              className="text-xs font-medium"
            />
          </p>
        </div>

      </div>
    </div>
  );
}

PaamonFlyer.path = "/paamon/flyer";
