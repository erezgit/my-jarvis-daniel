import { useState } from "react";
import { Link } from "react-router";
import { ArrowRight, MessageCircle, Copy, Check } from "lucide-react";
import { useContentPage } from "../../hooks/useContentPage";
import { EditableText } from "../../misc/EditableText";

const ORANGE = "#f0883e";
const GREEN = "#3fb950";

type OpeningMessageContent = {
  title: string;
  subtitle: string;
  message_text: string;
  note: string;
  channel: string;
  occasion: string;
};

export function PaamonOpeningMessage() {
  const [copied, setCopied] = useState(false);
  const { content, isPending, updateField } =
    useContentPage<OpeningMessageContent>("paamon/opening-message");

  if (isPending) {
    return (
      <div className="p-8 text-center text-muted-foreground">טוען...</div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(content.message_text).then(() => {
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
        <MessageCircle className="h-6 w-6" style={{ color: ORANGE }} />
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

      {/* WhatsApp-like message bubble */}
      <div className="relative max-w-2xl">
        {/* Bubble */}
        <div
          className="rounded-2xl rounded-tr-sm border p-5 space-y-3 relative"
          style={{
            backgroundColor: `${GREEN}10`,
            borderColor: `${GREEN}30`,
          }}
        >
          {/* Tail indicator */}
          <div
            className="absolute -top-px right-0 w-3 h-3 overflow-hidden"
            style={{ transform: "translateX(8px)" }}
          >
            <div
              className="w-4 h-4 rotate-45 origin-bottom-left border"
              style={{
                backgroundColor: `${GREEN}10`,
                borderColor: `${GREEN}30`,
              }}
            />
          </div>

          {/* Message body */}
          <div className="text-sm leading-relaxed text-foreground">
            <EditableText
              value={content.message_text}
              onSave={(v) => updateField("message_text", v)}
              multiline
              rows={12}
              className="text-sm leading-relaxed"
            />
          </div>

          {/* Timestamp-like element */}
          <div className="flex items-center justify-between pt-1">
            <span
              className="text-[11px] font-medium px-2 py-0.5 rounded-full"
              style={{ color: GREEN, backgroundColor: `${GREEN}15` }}
            >
              <EditableText
                value={content.channel}
                onSave={(v) => updateField("channel", v)}
                className="text-[11px] font-medium"
              />
            </span>
            <span className="text-[11px] text-muted-foreground">
              <EditableText
                value={content.occasion}
                onSave={(v) => updateField("occasion", v)}
                className="text-[11px] text-muted-foreground"
              />
            </span>
          </div>
        </div>
      </div>

      {/* Copy button */}
      <div>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
          style={
            copied
              ? { borderColor: `${GREEN}60`, color: GREEN }
              : { borderColor: `${ORANGE}40`, color: ORANGE }
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
              העתק הודעה
            </>
          )}
        </button>
      </div>

      {/* Usage note */}
      <div
        className="rounded-lg border px-4 py-3 text-sm leading-relaxed"
        style={{
          borderColor: `${ORANGE}30`,
          backgroundColor: `${ORANGE}08`,
        }}
      >
        <span className="font-semibold" style={{ color: ORANGE }}>
          הערה:{" "}
        </span>
        <span className="text-muted-foreground">
          <EditableText
            value={content.note}
            onSave={(v) => updateField("note", v)}
            className="text-muted-foreground text-sm"
          />
        </span>
      </div>
    </div>
  );
}

PaamonOpeningMessage.path = "/paamon/opening-message";
