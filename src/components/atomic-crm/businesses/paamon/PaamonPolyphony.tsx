import { Link } from "react-router";
import { ArrowRight, Music, Users, Star, MessageSquare, BookOpen } from "lucide-react";
import { useContentPage } from "../../hooks/useContentPage";
import { EditableText } from "../../misc/EditableText";

const PURPLE = "#a78bfa";
const GREEN = "#3fb950";
const BLUE = "#58a6ff";
const ORANGE = "#f0883e";
const YELLOW = "#d4a84b";

// ─── Content Type ──────────────────────────────────────────────────────────────

type PolyphonyContent = {
  title: string;
  subtitle: string;
  overview: {
    description: string;
    locations: string;
    student_count: string;
    founded_by: string;
  };
  teacher_prep: {
    teacher: string;
    instrument: string;
    students: {
      name: string;
      age: string;
      details: string;
    }[];
  }[];
  songs_english: {
    title: string;
    artist: string;
    rating: number;
    message: string;
  }[];
  songs_hebrew: {
    title: string;
    artist: string;
    rating: number;
    message: string;
  }[];
  parent_messages: {
    title: string;
    text: string;
  }[];
  principles: string[];
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

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className="h-3.5 w-3.5"
          fill={i <= rating ? YELLOW : "none"}
          style={{ color: i <= rating ? YELLOW : "#4b5563" }}
        />
      ))}
    </div>
  );
}

function SongCard({
  song,
  highlighted,
}: {
  song: PolyphonyContent["songs_english"][0];
  highlighted: boolean;
}) {
  return (
    <div
      className="rounded-lg border p-4 space-y-2"
      style={
        highlighted
          ? { borderColor: `${PURPLE}60`, backgroundColor: `${PURPLE}08` }
          : {}
      }
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold leading-tight">{song.title}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{song.artist}</p>
        </div>
        {highlighted && (
          <span
            className="shrink-0 rounded-full px-2 py-0.5 text-xs font-medium"
            style={{ backgroundColor: `${PURPLE}20`, color: PURPLE }}
          >
            מומלץ
          </span>
        )}
      </div>
      <StarRating rating={song.rating} />
      <p className="text-xs text-muted-foreground leading-relaxed">
        {song.message}
      </p>
    </div>
  );
}

const INSTRUMENT_EMOJI: Record<string, string> = {
  תופים: "🥁",
  קלידים: "🎹",
  שירה: "🎤",
  גיטרה: "🎸",
};

// ─── Component ────────────────────────────────────────────────────────────────

export function PaamonPolyphony() {
  const { content, isPending, updateField } =
    useContentPage<PolyphonyContent>("paamon/polyphony");

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
        <Music className="h-6 w-6" style={{ color: PURPLE }} />
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

      {/* ── Section: סקירת הפרויקט ─────────────────────────────────── */}
      <div className="rounded-lg border bg-card p-5 space-y-4">
        <h2 className="text-sm font-semibold">סקירת הפרויקט</h2>

        <HighlightBox color={PURPLE}>
          <EditableText
            value={content.overview?.description}
            onSave={(v) => updateField("overview.description", v)}
            multiline
            rows={3}
          />
        </HighlightBox>

        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-md bg-muted/40 px-4 py-3 space-y-1">
            <p className="text-xs text-muted-foreground">מיקומים</p>
            <p className="text-sm font-medium">
              <EditableText
                value={content.overview?.locations}
                onSave={(v) => updateField("overview.locations", v)}
              />
            </p>
          </div>
          <div className="rounded-md bg-muted/40 px-4 py-3 space-y-1">
            <p className="text-xs text-muted-foreground">תלמידים</p>
            <p className="text-sm font-medium">
              <EditableText
                value={content.overview?.student_count}
                onSave={(v) => updateField("overview.student_count", v)}
              />
            </p>
          </div>
          <div className="rounded-md bg-muted/40 px-4 py-3 space-y-1">
            <p className="text-xs text-muted-foreground">הוקם על ידי</p>
            <p className="text-sm font-medium">
              <EditableText
                value={content.overview?.founded_by}
                onSave={(v) => updateField("overview.founded_by", v)}
              />
            </p>
          </div>
        </div>
      </div>

      {/* ── Section: עקרונות עבודה ─────────────────────────────────── */}
      <SectionCard title="עקרונות עבודה עם תלמידי חינוך מיוחד">
        <div className="space-y-1.5">
          {(content.principles ?? []).map((p, i) => (
            <BulletItem key={i}>
              <EditableText
                value={p}
                onSave={(v) => updateField(`principles.${i}`, v)}
              />
            </BulletItem>
          ))}
        </div>
      </SectionCard>

      {/* ── Section: הכנת המורים ─────────────────────────────────────── */}
      <div className="rounded-lg border bg-card p-5 space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4" style={{ color: BLUE }} />
          <h2 className="text-sm font-semibold">הכנת המורים — נתיב תשפ"ו</h2>
        </div>

        {(content.teacher_prep ?? []).map((teacher, ti) => (
          <div key={ti} className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">
                {INSTRUMENT_EMOJI[teacher.instrument] ?? "🎵"}
              </span>
              <div>
                <p className="text-sm font-semibold" style={{ color: BLUE }}>
                  {teacher.teacher}
                </p>
                <p className="text-xs text-muted-foreground">
                  {teacher.instrument}
                </p>
              </div>
            </div>

            <div className="space-y-3 mr-6">
              {(teacher.students ?? []).map((student, si) => (
                <div
                  key={si}
                  className="rounded-md border bg-muted/20 px-4 py-3 space-y-1"
                >
                  <div className="flex items-center gap-2">
                    <Users className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-sm font-medium">{student.name}</span>
                    <span className="text-xs text-muted-foreground">
                      גיל {student.age}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <EditableText
                      value={student.details}
                      onSave={(v) =>
                        updateField(
                          `teacher_prep.${ti}.students.${si}.details`,
                          v
                        )
                      }
                      multiline
                      rows={3}
                    />
                  </p>
                </div>
              ))}
            </div>

            {ti < (content.teacher_prep?.length ?? 0) - 1 && (
              <div className="border-t" />
            )}
          </div>
        ))}
      </div>

      {/* ── Section: המלצות שירים — אנגלית ─────────────────────────── */}
      <div className="rounded-lg border bg-card p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Music className="h-4 w-4" style={{ color: GREEN }} />
          <h2 className="text-sm font-semibold">המלצות שירים — אנגלית</h2>
        </div>
        <p className="text-xs text-muted-foreground">
          שירים בסגנון רוק-פופ, גרובי, עם מסר חינוכי — גיל 14–18
        </p>
        <div className="grid grid-cols-2 gap-3">
          {(content.songs_english ?? []).map((song, i) => (
            <SongCard key={i} song={song} highlighted={song.rating === 5} />
          ))}
        </div>
      </div>

      {/* ── Section: המלצות שירים — עברית ──────────────────────────── */}
      <div className="rounded-lg border bg-card p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Music className="h-4 w-4" style={{ color: ORANGE }} />
          <h2 className="text-sm font-semibold">המלצות שירים — עברית</h2>
        </div>
        <p className="text-xs text-muted-foreground">
          שירים בסגנון חנן בן ארי ופופ-רוק ישראלי, עם מסר מעצים
        </p>
        <div className="grid grid-cols-2 gap-3">
          {(content.songs_hebrew ?? []).map((song, i) => (
            <SongCard key={i} song={song} highlighted={song.rating === 5} />
          ))}
        </div>
      </div>

      {/* ── Section: הודעות להורים ───────────────────────────────────── */}
      <div className="rounded-lg border bg-card p-5 space-y-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4" style={{ color: PURPLE }} />
          <h2 className="text-sm font-semibold">הודעות WhatsApp להורים — נובמבר 2024</h2>
        </div>
        <p className="text-xs text-muted-foreground">
          תבניות הודעות לפי שעת שיעור וכלי
        </p>

        <div className="space-y-3">
          {(content.parent_messages ?? []).map((msg, i) => (
            <div key={i} className="rounded-md bg-muted/40 px-4 py-3 space-y-1.5">
              <p
                className="text-xs font-semibold"
                style={{ color: PURPLE }}
              >
                {msg.title}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                <EditableText
                  value={msg.text}
                  onSave={(v) => updateField(`parent_messages.${i}.text`, v)}
                  multiline
                  rows={5}
                />
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

PaamonPolyphony.path = "/paamon/polyphony";
