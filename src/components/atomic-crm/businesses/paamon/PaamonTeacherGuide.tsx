import { Link } from "react-router";
import { ArrowRight, BookOpen } from "lucide-react";
import { useContentPage } from "../../hooks/useContentPage";
import { EditableText } from "../../misc/EditableText";

const PURPLE = "#a78bfa";
const GREEN = "#3fb950";
const BLUE = "#58a6ff";
const ORANGE = "#f0883e";
const RED = "#f85149";

// ─── Content Type ──────────────────────────────────────────────────────────────

type TeacherGuideContent = {
  title: string;
  subtitle: string;
  intro: string;
  values: string;
  daily_ops: { emoji: string; title: string; bullets: string[] }[];
  team_meetings: { intro: string; items: string[]; highlight: string };
  first_meeting: string[];
  heterogeneity: {
    intro: string;
    why_important: string[];
    experience: string;
    how_to: string[];
    warning: string;
  };
  footer: string;
  footer_sub: string;
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

function SubSection({
  emoji,
  title,
  color,
  children,
}: {
  emoji: string;
  title: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-md bg-muted/40 px-4 py-3 space-y-2">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <span>{emoji}</span>
        <span>{title}</span>
      </div>
      <div className="space-y-1.5">{children}</div>
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

// Color mapping for daily_ops by index (matches order in seed data)
const DAILY_OPS_COLORS = [BLUE, GREEN, PURPLE, RED, ORANGE, BLUE];

// ─── Component ────────────────────────────────────────────────────────────────

export function PaamonTeacherGuide() {
  const { content, isPending, updateField } =
    useContentPage<TeacherGuideContent>("paamon/teacher-guide");

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

      {/* Intro */}
      <HighlightBox color={PURPLE}>
        <EditableText
          value={content.intro}
          onSave={(v) => updateField("intro", v)}
          multiline
          rows={3}
        />
      </HighlightBox>

      {/* ── Section: ערכי המרכז ─────────────────────────────────── */}
      <SectionCard title="ערכי המרכז">
        <p className="text-sm text-muted-foreground leading-relaxed">
          <EditableText
            value={content.values}
            onSave={(v) => updateField("values", v)}
            multiline
            rows={3}
          />
        </p>
      </SectionCard>

      {/* ── Section: התנהלות יומיומית ───────────────────────────── */}
      <div className="rounded-lg border bg-card p-5 space-y-4">
        <h2 className="text-sm font-semibold">התנהלות יומיומית</h2>

        {(content.daily_ops ?? []).map((op, i) => (
          <SubSection
            key={i}
            emoji={op.emoji}
            title={op.title}
            color={DAILY_OPS_COLORS[i] ?? BLUE}
          >
            {(op.bullets ?? []).map((bullet, j) => (
              <BulletItem key={j}>
                <EditableText
                  value={bullet}
                  onSave={(v) => updateField(`daily_ops.${i}.bullets.${j}`, v)}
                />
              </BulletItem>
            ))}
          </SubSection>
        ))}
      </div>

      {/* ── Section: ישיבות צוות ──────────────────────────────────── */}
      <SectionCard title="ישיבות צוות">
        <p className="text-sm text-muted-foreground leading-relaxed">
          <EditableText
            value={content.team_meetings?.intro}
            onSave={(v) => updateField("team_meetings.intro", v)}
          />
        </p>
        <div className="space-y-1.5">
          {(content.team_meetings?.items ?? []).map((item, i) => (
            <BulletItem key={i}>
              <EditableText
                value={item}
                onSave={(v) => updateField(`team_meetings.items.${i}`, v)}
              />
            </BulletItem>
          ))}
        </div>
        <HighlightBox color={BLUE}>
          <EditableText
            value={content.team_meetings?.highlight}
            onSave={(v) => updateField("team_meetings.highlight", v)}
            multiline
            rows={2}
          />
        </HighlightBox>
      </SectionCard>

      {/* ── Section: לקראת המפגש הראשון ─────────────────────────── */}
      <SectionCard title="לקראת המפגש הראשון">
        <div className="space-y-1.5">
          {(content.first_meeting ?? []).map((item, i) => (
            <BulletItem key={i}>
              <EditableText
                value={item}
                onSave={(v) => updateField(`first_meeting.${i}`, v)}
              />
            </BulletItem>
          ))}
        </div>
      </SectionCard>

      {/* ── Section: ההטרוגניות היא היתרון שלנו ─────────────────── */}
      <div className="rounded-lg border bg-card p-5 space-y-4">
        <h2 className="text-sm font-semibold">🌈 ההטרוגניות היא היתרון שלנו</h2>

        <p className="text-sm text-muted-foreground leading-relaxed">
          <EditableText
            value={content.heterogeneity?.intro}
            onSave={(v) => updateField("heterogeneity.intro", v)}
            multiline
            rows={3}
          />
        </p>

        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            למה זה חשוב
          </p>
          {(content.heterogeneity?.why_important ?? []).map((item, i) => (
            <BulletItem key={i}>
              <EditableText
                value={item}
                onSave={(v) => updateField(`heterogeneity.why_important.${i}`, v)}
              />
            </BulletItem>
          ))}
        </div>

        <HighlightBox color={GREEN}>
          <EditableText
            value={content.heterogeneity?.experience}
            onSave={(v) => updateField("heterogeneity.experience", v)}
            multiline
            rows={3}
          />
        </HighlightBox>

        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            איך להתייחס
          </p>
          {(content.heterogeneity?.how_to ?? []).map((item, i) => (
            <BulletItem key={i}>
              <EditableText
                value={item}
                onSave={(v) => updateField(`heterogeneity.how_to.${i}`, v)}
              />
            </BulletItem>
          ))}
        </div>

        <div
          className="rounded-lg border px-4 py-3 text-sm leading-relaxed space-y-1"
          style={{
            borderColor: `${ORANGE}40`,
            backgroundColor: `${ORANGE}10`,
          }}
        >
          <p className="font-semibold" style={{ color: ORANGE }}>
            שימו לב:
          </p>
          <p className="text-muted-foreground">
            <EditableText
              value={content.heterogeneity?.warning}
              onSave={(v) => updateField("heterogeneity.warning", v)}
              multiline
              rows={3}
            />
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="rounded-lg border bg-card p-5 space-y-2 text-center">
        <p className="text-sm font-semibold">
          <EditableText
            value={content.footer}
            onSave={(v) => updateField("footer", v)}
          />
        </p>
        <p className="text-sm text-muted-foreground">
          <EditableText
            value={content.footer_sub}
            onSave={(v) => updateField("footer_sub", v)}
          />
        </p>
      </div>
    </div>
  );
}

PaamonTeacherGuide.path = "/paamon/teacher-guide";
