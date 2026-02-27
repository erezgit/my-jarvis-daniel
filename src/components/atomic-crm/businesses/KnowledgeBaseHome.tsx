import { BookOpen, FileText, ExternalLink } from "lucide-react";

type KBItem = {
  title: string;
  category: string;
  fileType: string;
  processed: string;
  description: string;
  href?: string;
};

const kbItems: KBItem[] = [
  {
    title: "מעגל הקווינטות",
    category: "Music Theory",
    fileType: "PDF",
    processed: "2025-11-01",
    description: "Circle of Fifths diagram — key relationships and chord progressions",
    href: "/docs/circle-of-fifths.pdf",
  },
  {
    title: "I IV I / I V I EZ",
    category: "Chord Charts",
    fileType: "PDF",
    processed: "2025-11-01",
    description: "Piano chord progression chart by Raz Yitzhaki — C, F, G variations",
    href: "/docs/chord-progressions-ez.pdf",
  },
  {
    title: "Lama Bada צ׳רט",
    category: "Music Theory",
    fileType: "PDF",
    processed: "2025-10-22",
    description: "Muwassah composition — Andalusian-Arabic tradition, Fm/B♭m, 100 BPM",
    href: "/docs/lama-bada-chart.pdf",
  },
  {
    title: "לו״ז תשפ״ו",
    category: "Schedule",
    fileType: "PDF",
    processed: "2025-10-23",
    description: "Class schedule — 4-day and 5-day weeks, instructor assignments",
    href: "/docs/schedule-tashpav.pdf",
  },
  {
    title: "תכנייה — מרכז פעמון",
    category: "Schedule",
    fileType: "PDF",
    processed: "2026-01-15",
    description: "Paamon Center schedule — January 2026, group assignments",
    href: "/docs/paamon-schedule-jan-2026.pdf",
  },
];

const categoryColor: Record<string, string> = {
  "Music Theory": "#58a6ff",
  "Chord Charts": "#a78bfa",
  Schedule: "#3fb950",
  Technical: "#f0883e",
  Reference: "#8b949e",
};

const categories = [...new Set(kbItems.map((i) => i.category))];

export function KnowledgeBaseHome() {
  return (
    <div className="flex flex-col gap-6 mt-1">
      {/* Header */}
      <div className="flex items-center gap-3">
        <BookOpen className="h-6 w-6 text-[#f0883e]" />
        <div>
          <h1 className="text-xl font-semibold">Knowledge Base</h1>
          <p className="text-sm text-muted-foreground">Reference material — PDFs, music theory, schedules</p>
        </div>
      </div>

      {/* Category filter chips */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Filter:</span>
        {categories.map((cat) => (
          <span
            key={cat}
            className="rounded-full px-3 py-1 text-xs font-medium border cursor-pointer hover:opacity-80"
            style={{ color: categoryColor[cat], borderColor: categoryColor[cat] + "40" }}
          >
            {cat}
          </span>
        ))}
      </div>

      {/* KB grid */}
      <div className="grid grid-cols-2 gap-4">
        {kbItems.map((item) => {
          const Wrapper = item.href ? "a" : "div";
          const linkProps = item.href ? { href: item.href, target: "_blank" as const, rel: "noopener noreferrer" } : {};
          return (
            <Wrapper key={item.title} {...linkProps} className="rounded-lg border bg-card p-5 cursor-pointer hover:bg-accent transition-colors block">
              <div className="flex items-start gap-3 mb-3">
                <FileText className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium truncate">{item.title}</h3>
                    {item.href && <ExternalLink className="h-3 w-3 shrink-0 text-muted-foreground" />}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span
                  className="rounded-full px-2 py-0.5 text-xs"
                  style={{
                    color: categoryColor[item.category],
                    backgroundColor: (categoryColor[item.category] || "#8b949e") + "15",
                  }}
                >
                  {item.category}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{item.fileType}</span>
                  <span className="text-xs text-muted-foreground">{item.processed}</span>
                </div>
              </div>
            </Wrapper>
          );
        })}
      </div>

      {/* Empty state hint */}
      <div className="rounded-lg border border-dashed p-5 text-center">
        <p className="text-sm text-muted-foreground">
          Upload PDFs and documents to grow the knowledge base.
          <br />
          <span className="text-xs">Supported: PDF, images, text files — auto-chunked for search</span>
        </p>
      </div>
    </div>
  );
}

KnowledgeBaseHome.path = "/kb";
