import { Link } from "react-router";
import {
  Music,
  LayoutDashboard,
  ListChecks,
  Clock,
  Phone,
  Building2,
  Users,
  BookOpen,
  Megaphone,
  Calendar,
  MessageCircle,
  FileText,
  Image,
} from "lucide-react";
import { useContentPage } from "../hooks/useContentPage";
import type { DashboardContent } from "./paamon/PaamonDashboard";

const BLUE = "#58a6ff";
const ORANGE = "#f0883e";
const PURPLE = "#a78bfa";
const GREEN = "#3fb950";
const RED = "#f85149";

type Section = {
  label: string;
  to: string;
  icon: typeof LayoutDashboard;
  color: string;
  desc: string;
};

const operations: Section[] = [
  { label: "לוח בקרה", to: "/paamon/dashboard", icon: LayoutDashboard, color: BLUE, desc: "קבוצות, תלמידים, תפוסה" },
  { label: "משימות", to: "/paamon/tasks", icon: ListChecks, color: ORANGE, desc: "תוכנית פעולה 3 שבועות" },
  { label: "רשימת המתנה", to: "/paamon/waiting-list", icon: Clock, color: PURPLE, desc: "ממתינים לשיבוץ" },
  { label: "סקריפט טלפונים", to: "/paamon/phone-scripts", icon: Phone, color: GREEN, desc: "תסריט שיחות ומענה להתנגדויות" },
];

const contacts: Section[] = [
  { label: "קשר עירייה", to: "/paamon/municipality", icon: Building2, color: BLUE, desc: "אורית חפץ, אורית טופלברג, משימות" },
  { label: "אנשי קשר שיווק", to: "/paamon/marketing", icon: Users, color: ORANGE, desc: "5 אנשי קשר בבתי ספר" },
];

const knowledge: Section[] = [
  { label: "הנחיות למורים", to: "/paamon/teacher-guide", icon: BookOpen, color: PURPLE, desc: "נהלים, חירום, יומיום" },
  { label: "פוליפוניה — חינוך מיוחד", to: "/paamon/polyphony", icon: Music, color: PURPLE, desc: "מורים, שירים, הודעות להורים" },
  { label: "מודעת דרושים", to: "/paamon/job-posting", icon: Megaphone, color: GREEN, desc: "גיוס מנחי קבוצות מוזיקה" },
  { label: "ישבץ ראשון", to: "/paamon/first-meeting", icon: Calendar, color: BLUE, desc: "סדר יום מפגש צוות ראשון" },
  { label: "הודעה למורים", to: "/paamon/opening-message", icon: MessageCircle, color: ORANGE, desc: "הודעת WhatsApp פתיחה" },
  { label: "דיווח התקדמות", to: "/paamon/treatment-report", icon: FileText, color: PURPLE, desc: "תבנית דיווח אנונימי לעמותה" },
  { label: "פלייר שיווקי", to: "/paamon/flyer", icon: Image, color: GREEN, desc: "פלייר המרכז" },
];

function SectionGrid({ title, items, cols = 4 }: { title: string; items: Section[]; cols?: number }) {
  return (
    <div>
      <h2 className="text-sm font-medium text-muted-foreground mb-3">{title}</h2>
      <div className={`grid gap-3 ${cols === 4 ? "grid-cols-4" : cols === 3 ? "grid-cols-3" : "grid-cols-2"}`}>
        {items.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="flex flex-col items-start gap-3 rounded-lg border bg-card p-5 transition-colors hover:bg-accent"
          >
            <item.icon className="h-5 w-5" style={{ color: item.color }} />
            <div>
              <div className="text-sm font-medium">{item.label}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{item.desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function PaamonHome() {
  const { content, isPending } = useContentPage<DashboardContent>("paamon/dashboard");
  const groups = content.groups ?? [];

  const totalEnrolled = groups.reduce((s, g) => s + g.enrolled, 0);
  const totalCapacity = groups.reduce((s, g) => s + g.capacity, 0);
  const occupancyPct = totalCapacity > 0 ? Math.round((totalEnrolled / totalCapacity) * 100) : 0;

  const stats = isPending
    ? []
    : [
        { label: "קבוצות", value: String(groups.length), color: BLUE },
        { label: "תלמידים", value: String(totalEnrolled), color: GREEN },
        { label: "תפוסה", value: `${occupancyPct}%`, color: ORANGE },
        { label: "מקומות פנויים", value: String(totalCapacity - totalEnrolled), color: RED },
      ];

  return (
    <div className="flex flex-col gap-6 mt-1">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Music className="h-6 w-6 text-[#58a6ff]" />
        <div>
          <h1 className="text-xl font-semibold">מרכז פעמון</h1>
          <p className="text-sm text-muted-foreground">מרכז לאומנויות לחינוך מיוחד — פליטי הספר 17, תל אביב</p>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg border bg-card p-4 text-center">
            <div className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Section grids */}
      <SectionGrid title="ניהול שוטף" items={operations} cols={4} />
      <SectionGrid title="אנשי קשר" items={contacts} cols={2} />
      <SectionGrid title="ידע ותבניות" items={knowledge} cols={3} />
    </div>
  );
}

PaamonHome.path = "/paamon";
