import { Link } from "react-router";
import { ArrowRight, Phone } from "lucide-react";
import { useContentPage } from "../../hooks/useContentPage";
import { EditableText } from "../../misc/EditableText";

const GREEN = "#3fb950";
const BLUE = "#58a6ff";
const ORANGE = "#f0883e";
const PURPLE = "#a78bfa";
const RED = "#f85149";

// Color per contact group by index: [PURPLE, ORANGE, BLUE, GREEN]
const GROUP_COLORS = [PURPLE, ORANGE, BLUE, GREEN];

// ─── Content Type ──────────────────────────────────────────────────────────────

type PhoneScriptsContent = {
  title: string;
  subtitle: string;
  prep_checklist: string[];
  script_parts: { label: string; text: string }[];
  script_tip: string;
  objections: { objection: string; response: string }[];
  contact_groups: {
    label: string;
    contacts?: {
      num?: number;
      name: string;
      group?: string;
      script: string;
      note?: string;
      phone?: string;
      extra?: string;
    }[];
    teachers?: { teacher: string; status: string; status_icon: string }[];
  }[];
  after_call_checklist: string[];
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

function ChecklistItem({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 text-sm text-muted-foreground">
      <span className="shrink-0 mt-px">☐</span>
      <span>{children}</span>
    </div>
  );
}

function ScriptPart({
  label,
  text,
}: {
  label: React.ReactNode;
  text: React.ReactNode;
}) {
  return (
    <div className="rounded-md bg-muted px-4 py-3 text-sm space-y-1">
      <span className="font-semibold text-foreground">{label}:</span>
      <p className="text-muted-foreground leading-relaxed">{text}</p>
    </div>
  );
}

function Objection({
  index,
  objection,
  response,
}: {
  index: number;
  objection: React.ReactNode;
  response: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border bg-card p-4 space-y-2">
      <div className="flex items-start gap-2">
        <span
          className="shrink-0 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center mt-px"
          style={{ backgroundColor: `${RED}20`, color: RED }}
        >
          {index}
        </span>
        <p className="text-sm font-medium">"{objection}"</p>
      </div>
      <div className="rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground leading-relaxed">
        <span className="font-semibold" style={{ color: GREEN }}>
          →{" "}
        </span>
        {response}
      </div>
    </div>
  );
}

// ─── Contact Item ─────────────────────────────────────────────────────────────

function ContactItem({
  number,
  name,
  group,
  script,
  note,
  color,
  phone,
  extra,
}: {
  number?: React.ReactNode;
  name: React.ReactNode;
  group?: React.ReactNode;
  script: React.ReactNode;
  note?: React.ReactNode;
  color?: string;
  phone?: React.ReactNode;
  extra?: React.ReactNode;
}) {
  const accent = color ?? GREEN;
  return (
    <div className="rounded-lg border bg-card p-4 space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          {number !== undefined && (
            <span
              className="text-xs font-bold shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${accent}20`, color: accent }}
            >
              {number}
            </span>
          )}
          <span className="text-sm font-semibold">{name}</span>
        </div>
        {group && (
          <span
            className="text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0"
            style={{ color: accent, backgroundColor: `${accent}15` }}
          >
            {group}
          </span>
        )}
      </div>
      {phone && (
        <div className="text-xs text-muted-foreground">
          <span className="font-medium">טלפון: </span>
          <span dir="ltr">{phone}</span>
        </div>
      )}
      {extra && (
        <div
          className="text-xs rounded bg-muted px-2 py-1"
          style={{ color: ORANGE }}
        >
          {extra}
        </div>
      )}
      <div className="rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground leading-relaxed">
        <span className="font-semibold text-foreground">מה להגיד: </span>
        {script}
      </div>
      {note && (
        <div
          className="text-xs rounded px-2 py-1.5"
          style={{ color: RED, backgroundColor: `${RED}10` }}
        >
          <span className="font-semibold">חשוב: </span>
          {note}
        </div>
      )}
    </div>
  );
}

function TeacherItem({
  teacher,
  status,
  statusColor,
  statusIcon,
}: {
  teacher: React.ReactNode;
  status: React.ReactNode;
  statusColor: string;
  statusIcon: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span>{teacher}</span>
      <span
        className="text-xs font-medium px-2 py-0.5 rounded"
        style={{ color: statusColor, backgroundColor: `${statusColor}15` }}
      >
        {statusIcon} {status}
      </span>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function PaamonPhoneScripts() {
  const { content, isPending, updateField } =
    useContentPage<PhoneScriptsContent>("paamon/phone-scripts");

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
        <Phone className="h-6 w-6" style={{ color: GREEN }} />
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

      {/* ── Section 1: הכנה לפני שמתחילים ──────────────────────────── */}
      <SectionCard title="הכנה לפני שמתחילים">
        <div className="space-y-2">
          {(content.prep_checklist ?? []).map((item, i) => (
            <ChecklistItem key={i}>
              <EditableText
                value={item}
                onSave={(v) => updateField(`prep_checklist.${i}`, v)}
              />
            </ChecklistItem>
          ))}
        </div>
      </SectionCard>

      {/* ── Section 2: הסקריפט הכללי ────────────────────────────────── */}
      <SectionCard title="הסקריפט הכללי (התאם לפי הקבוצה)">
        <div className="space-y-2">
          {(content.script_parts ?? []).map((part, i) => (
            <ScriptPart
              key={i}
              label={
                <EditableText
                  value={part.label}
                  onSave={(v) => updateField(`script_parts.${i}.label`, v)}
                />
              }
              text={
                <EditableText
                  value={part.text}
                  onSave={(v) => updateField(`script_parts.${i}.text`, v)}
                  multiline
                  rows={2}
                />
              }
            />
          ))}
        </div>

        {/* Tip box */}
        <div
          className="rounded-lg border px-4 py-3 text-sm leading-relaxed"
          style={{
            borderColor: `${GREEN}40`,
            backgroundColor: `${GREEN}10`,
            color: GREEN,
          }}
        >
          <span className="font-semibold">טיפ חשוב: </span>
          <EditableText
            value={content.script_tip ?? ""}
            onSave={(v) => updateField("script_tip", v)}
            multiline
            rows={2}
          />
        </div>
      </SectionCard>

      {/* ── Section 3: טיפול בהתנגדויות ────────────────────────────── */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold">טיפול בהתנגדויות נפוצות</h2>
        {(content.objections ?? []).map((obj, i) => (
          <Objection
            key={i}
            index={i + 1}
            objection={
              <EditableText
                value={obj.objection}
                onSave={(v) => updateField(`objections.${i}.objection`, v)}
              />
            }
            response={
              <EditableText
                value={obj.response}
                onSave={(v) => updateField(`objections.${i}.response`, v)}
                multiline
                rows={2}
              />
            }
          />
        ))}
      </div>

      {/* ── Section 4: רשימת הטלפונים ───────────────────────────────── */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold">רשימת הטלפונים</h2>

        {(content.contact_groups ?? []).map((group, gi) => {
          const groupColor = GROUP_COLORS[gi] ?? GREEN;
          return (
            <div key={gi} className="space-y-3">
              {/* Group header divider */}
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-border" />
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded"
                  style={{ color: groupColor, backgroundColor: `${groupColor}20` }}
                >
                  <EditableText
                    value={group.label}
                    onSave={(v) => updateField(`contact_groups.${gi}.label`, v)}
                  />
                </span>
                <div className="h-px flex-1 bg-border" />
              </div>

              {/* Contacts */}
              {group.contacts &&
                group.contacts.map((contact, ci) => (
                  <ContactItem
                    key={ci}
                    number={contact.num}
                    name={
                      <EditableText
                        value={contact.name}
                        onSave={(v) =>
                          updateField(`contact_groups.${gi}.contacts.${ci}.name`, v)
                        }
                      />
                    }
                    group={
                      contact.group !== undefined ? (
                        <EditableText
                          value={contact.group}
                          onSave={(v) =>
                            updateField(
                              `contact_groups.${gi}.contacts.${ci}.group`,
                              v
                            )
                          }
                        />
                      ) : undefined
                    }
                    script={
                      <EditableText
                        value={contact.script}
                        onSave={(v) =>
                          updateField(`contact_groups.${gi}.contacts.${ci}.script`, v)
                        }
                        multiline
                        rows={2}
                      />
                    }
                    note={
                      contact.note !== undefined ? (
                        <EditableText
                          value={contact.note}
                          onSave={(v) =>
                            updateField(
                              `contact_groups.${gi}.contacts.${ci}.note`,
                              v
                            )
                          }
                        />
                      ) : undefined
                    }
                    phone={
                      contact.phone !== undefined ? (
                        <EditableText
                          value={contact.phone}
                          onSave={(v) =>
                            updateField(
                              `contact_groups.${gi}.contacts.${ci}.phone`,
                              v
                            )
                          }
                        />
                      ) : undefined
                    }
                    extra={
                      contact.extra !== undefined ? (
                        <EditableText
                          value={contact.extra}
                          onSave={(v) =>
                            updateField(
                              `contact_groups.${gi}.contacts.${ci}.extra`,
                              v
                            )
                          }
                        />
                      ) : undefined
                    }
                    color={groupColor}
                  />
                ))}

              {/* Teachers */}
              {group.teachers && (
                <div className="rounded-lg border bg-card p-4 space-y-3">
                  {group.teachers.map((t, ti) => (
                    <TeacherItem
                      key={ti}
                      teacher={
                        <EditableText
                          value={t.teacher}
                          onSave={(v) =>
                            updateField(
                              `contact_groups.${gi}.teachers.${ti}.teacher`,
                              v
                            )
                          }
                        />
                      }
                      status={
                        <EditableText
                          value={t.status}
                          onSave={(v) =>
                            updateField(
                              `contact_groups.${gi}.teachers.${ti}.status`,
                              v
                            )
                          }
                        />
                      }
                      statusColor={groupColor}
                      statusIcon={
                        <EditableText
                          value={t.status_icon}
                          onSave={(v) =>
                            updateField(
                              `contact_groups.${gi}.teachers.${ti}.status_icon`,
                              v
                            )
                          }
                        />
                      }
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Section 5: אחרי כל שיחה ─────────────────────────────────── */}
      <SectionCard title="אחרי כל שיחה">
        <div className="space-y-2">
          {(content.after_call_checklist ?? []).map((item, i) => (
            <ChecklistItem key={i}>
              <EditableText
                value={item}
                onSave={(v) => updateField(`after_call_checklist.${i}`, v)}
              />
            </ChecklistItem>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

PaamonPhoneScripts.path = "/paamon/phone-scripts";
