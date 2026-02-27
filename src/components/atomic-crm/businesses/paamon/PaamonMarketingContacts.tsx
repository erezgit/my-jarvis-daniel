import { Link } from "react-router";
import { ArrowRight, Users } from "lucide-react";
import { useContentPage } from "../../hooks/useContentPage";
import { EditableText } from "../../misc/EditableText";

const ORANGE = "#f0883e";
const GREEN = "#3fb950";
const BLUE = "#58a6ff";

// ─── Content Type ──────────────────────────────────────────────────────────────

type MarketingContactsContent = {
  title: string;
  subtitle: string;
  contacts: {
    name: string;
    role: string;
    school: string;
    phone: string;
    tag: string;
    note: string;
  }[];
  footer_notes: string[];
};

// ─── Main Component ────────────────────────────────────────────────────────────

export function PaamonMarketingContacts() {
  const { content, isPending, updateField } =
    useContentPage<MarketingContactsContent>("paamon/marketing-contacts");

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
        <Users className="h-6 w-6" style={{ color: ORANGE }} />
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

      {/* Contact grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {(content.contacts ?? []).map((contact, i) => {
          const isReferral = contact.tag === "המלצות";
          const tagColor = isReferral ? GREEN : BLUE;

          return (
            <div key={i} className="rounded-lg border bg-card p-5 flex flex-col gap-3">
              {/* Name + tag row */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-base font-semibold">
                    <EditableText
                      value={contact.name}
                      onSave={(v) => updateField(`contacts.${i}.name`, v)}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    <EditableText
                      value={contact.role}
                      onSave={(v) => updateField(`contacts.${i}.role`, v)}
                      className="text-xs text-muted-foreground"
                    />
                  </div>
                </div>
                <span
                  className="text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0"
                  style={{ color: tagColor, backgroundColor: `${tagColor}20` }}
                >
                  <EditableText
                    value={contact.tag}
                    onSave={(v) => updateField(`contacts.${i}.tag`, v)}
                    className="text-[10px] font-medium"
                  />
                </span>
              </div>

              {/* School */}
              <div className="flex items-start gap-2 text-sm">
                <span className="text-muted-foreground shrink-0">בית ספר</span>
                <span className="font-medium">
                  <EditableText
                    value={contact.school}
                    onSave={(v) => updateField(`contacts.${i}.school`, v)}
                    className="text-sm font-medium"
                  />
                </span>
              </div>

              {/* Phone — highlighted box, LTR direction */}
              <div
                className="rounded-md px-3 py-2 text-sm font-mono font-medium"
                style={{
                  backgroundColor: `${ORANGE}18`,
                  color: ORANGE,
                  direction: "ltr",
                  textAlign: "left",
                }}
              >
                <EditableText
                  value={contact.phone}
                  onSave={(v) => updateField(`contacts.${i}.phone`, v)}
                  className="text-sm font-mono font-medium"
                />
              </div>

              {/* Note — warning-style box */}
              {contact.note && (
                <div
                  className="rounded-md border px-3 py-2 text-xs text-muted-foreground leading-relaxed"
                  style={{
                    backgroundColor: `${ORANGE}0d`,
                    borderColor: `${ORANGE}35`,
                  }}
                >
                  <span className="font-semibold" style={{ color: ORANGE }}>
                    הערה:{" "}
                  </span>
                  <EditableText
                    value={contact.note}
                    onSave={(v) => updateField(`contacts.${i}.note`, v)}
                    className="text-xs text-muted-foreground"
                    multiline
                    rows={2}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer notes */}
      <div className="rounded-lg border bg-card p-4 space-y-1.5 text-sm text-muted-foreground">
        {(content.footer_notes ?? []).map((note, i) => (
          <div key={i} className="flex items-start gap-2">
            <span
              className="mt-1 h-1.5 w-1.5 rounded-full shrink-0"
              style={{ backgroundColor: ORANGE }}
            />
            <span>
              <EditableText
                value={note}
                onSave={(v) => updateField(`footer_notes.${i}`, v)}
                className="text-sm text-muted-foreground"
              />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

PaamonMarketingContacts.path = "/paamon/marketing";
