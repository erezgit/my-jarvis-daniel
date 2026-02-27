import { Link } from "react-router";
import { ArrowRight, Calendar } from "lucide-react";
import { useContentPage } from "../../hooks/useContentPage";
import { EditableText } from "../../misc/EditableText";

const BLUE = "#58a6ff";
const GREEN = "#3fb950";
const ORANGE = "#f0883e";
const PURPLE = "#a78bfa";

// ─── Content Type ──────────────────────────────────────────────────────────────

type FirstMeetingContent = {
  title: string;
  subtitle: string;
  sections: {
    num: string;
    title: string;
    quote?: string;
    bullets?: string[];
    daniel_intro?: string;
    team_intro_items?: string[];
    completed?: string[];
    stat?: string;
    placeholder?: string;
    subsections?: { title: string; bullets: string[] }[];
    note?: string;
  }[];
  footer: string;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function SectionNumber({ num }: { num: string }) {
  return (
    <span
      className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold"
      style={{ backgroundColor: `${BLUE}20`, color: BLUE }}
    >
      {num}
    </span>
  );
}

function SectionCard({
  num,
  title,
  children,
}: {
  num: string;
  title: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border bg-card p-5 space-y-4">
      <div className="flex items-center gap-3">
        <SectionNumber num={num} />
        <h2 className="text-base font-semibold flex-1">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function Bullet({
  children,
  color,
}: {
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <div className="flex items-start gap-2 text-sm text-muted-foreground">
      <span
        className="mt-2 h-1.5 w-1.5 rounded-full shrink-0"
        style={{ backgroundColor: color ?? `${BLUE}80` }}
      />
      <span>{children}</span>
    </div>
  );
}

function SubSection({
  title,
  color,
  children,
}: {
  title: React.ReactNode;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-md pl-4 py-3 space-y-2"
      style={{ backgroundColor: `${color}08` }}
    >
      <p className="text-xs font-semibold uppercase tracking-wide" style={{ color }}>
        {title}
      </p>
      {children}
    </div>
  );
}

function CheckItem({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 text-sm text-muted-foreground">
      <span className="shrink-0 mt-px" style={{ color: GREEN }}>✅</span>
      <span>{children}</span>
    </div>
  );
}

function NoteItem({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 text-sm text-muted-foreground">
      <span className="shrink-0 mt-px">📊</span>
      <span>{children}</span>
    </div>
  );
}

// Subsection color cycling for sections 5 & 6
const SUBSECTION_COLORS = [BLUE, ORANGE, GREEN, PURPLE, ORANGE];

// ─── Main Component ────────────────────────────────────────────────────────────

export function PaamonFirstMeeting() {
  const { content, isPending, updateField } = useContentPage<FirstMeetingContent>(
    "paamon/first-meeting"
  );

  if (isPending) {
    return <div className="p-8 text-center text-muted-foreground">טוען...</div>;
  }

  const sections = content.sections ?? [];

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
        <Calendar className="h-6 w-6" style={{ color: BLUE }} />
        <div>
          <h1 className="text-xl font-semibold">
            <EditableText
              value={content.title ?? ""}
              onSave={(v) => updateField("title", v)}
            />
          </h1>
          <p className="text-sm text-muted-foreground">
            <EditableText
              value={content.subtitle ?? ""}
              onSave={(v) => updateField("subtitle", v)}
            />
          </p>
        </div>
      </div>

      {/* Sections */}
      {sections.map((section, i) => (
        <SectionCard
          key={i}
          num={section.num}
          title={
            <EditableText
              value={section.title ?? ""}
              onSave={(v) => updateField(`sections.${i}.title`, v)}
            />
          }
        >
          {/* quote — Section 1 */}
          {section.quote !== undefined && (
            <div
              className="rounded-md border px-4 py-3 text-sm font-semibold text-center"
              style={{ borderColor: `${BLUE}40`, color: BLUE, backgroundColor: `${BLUE}10` }}
            >
              <EditableText
                value={section.quote}
                onSave={(v) => updateField(`sections.${i}.quote`, v)}
              />
            </div>
          )}

          {/* bullets — Sections 1, 7, 8 */}
          {section.bullets !== undefined && (
            <div className="space-y-2">
              {section.bullets.map((bullet, j) => (
                <Bullet key={j}>
                  <EditableText
                    value={bullet}
                    onSave={(v) => updateField(`sections.${i}.bullets.${j}`, v)}
                  />
                </Bullet>
              ))}
            </div>
          )}

          {/* daniel_intro — Section 2 */}
          {section.daniel_intro !== undefined && (
            <SubSection title="דניאל (מנהל המרכז)" color={BLUE}>
              <p className="text-sm text-muted-foreground">
                <EditableText
                  value={section.daniel_intro}
                  onSave={(v) => updateField(`sections.${i}.daniel_intro`, v)}
                />
              </p>
            </SubSection>
          )}

          {/* team_intro_items — Section 2 */}
          {section.team_intro_items !== undefined && (
            <SubSection title="הצגת אנשי הצוות" color={ORANGE}>
              <p className="text-sm text-muted-foreground">כל אחד יציג:</p>
              <div className="space-y-1.5 mt-1">
                {section.team_intro_items.map((item, j) => (
                  <Bullet key={j} color={ORANGE}>
                    <EditableText
                      value={item}
                      onSave={(v) => updateField(`sections.${i}.team_intro_items.${j}`, v)}
                    />
                  </Bullet>
                ))}
              </div>
            </SubSection>
          )}

          {/* completed — Section 3 */}
          {section.completed !== undefined && (
            <div className="space-y-2">
              {section.completed.map((item, j) => (
                <CheckItem key={j}>
                  <EditableText
                    value={item}
                    onSave={(v) => updateField(`sections.${i}.completed.${j}`, v)}
                  />
                </CheckItem>
              ))}
            </div>
          )}

          {/* stat — Section 3 */}
          {section.stat !== undefined && (
            <div
              className="rounded-lg border p-4 space-y-1"
              style={{ borderColor: `${GREEN}40`, backgroundColor: `${GREEN}08` }}
            >
              <NoteItem>
                <EditableText
                  value={section.stat}
                  onSave={(v) => updateField(`sections.${i}.stat`, v)}
                />
              </NoteItem>
            </div>
          )}

          {/* placeholder — Sections 4, 8 */}
          {section.placeholder !== undefined && (
            <div
              className="rounded-md border border-dashed p-4 text-sm text-muted-foreground text-center"
              style={{ borderColor: `${PURPLE}40`, color: PURPLE }}
            >
              <EditableText
                value={section.placeholder}
                onSave={(v) => updateField(`sections.${i}.placeholder`, v)}
              />
            </div>
          )}

          {/* subsections — Sections 5, 6 */}
          {section.subsections !== undefined &&
            section.subsections.map((sub, k) => {
              const color = SUBSECTION_COLORS[k % SUBSECTION_COLORS.length];
              return (
                <SubSection
                  key={k}
                  title={
                    <EditableText
                      value={sub.title ?? ""}
                      onSave={(v) =>
                        updateField(`sections.${i}.subsections.${k}.title`, v)
                      }
                    />
                  }
                  color={color}
                >
                  <div className="space-y-1.5">
                    {(sub.bullets ?? []).map((bullet, j) => (
                      <Bullet key={j} color={color}>
                        <EditableText
                          value={bullet}
                          onSave={(v) =>
                            updateField(
                              `sections.${i}.subsections.${k}.bullets.${j}`,
                              v
                            )
                          }
                        />
                      </Bullet>
                    ))}
                  </div>
                </SubSection>
              );
            })}

          {/* note — Section 9 */}
          {section.note !== undefined && (
            <div
              className="rounded-md p-4 text-sm text-muted-foreground leading-relaxed"
              style={{ backgroundColor: `${BLUE}08`, borderLeft: `4px solid ${BLUE}` }}
            >
              <EditableText
                value={section.note}
                onSave={(v) => updateField(`sections.${i}.note`, v)}
                multiline
                rows={2}
              />
            </div>
          )}
        </SectionCard>
      ))}

      {/* Footer */}
      <div
        className="rounded-lg border p-4 text-center text-base font-semibold"
        style={{ borderColor: `${GREEN}40`, color: GREEN, backgroundColor: `${GREEN}08` }}
      >
        <EditableText
          value={content.footer ?? ""}
          onSave={(v) => updateField("footer", v)}
        />
      </div>
    </div>
  );
}

PaamonFirstMeeting.path = "/paamon/first-meeting";
