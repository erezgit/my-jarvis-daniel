import { Link } from "react-router";
import {
  BookOpen,
  GraduationCap,
  FileText,
  ClipboardCheck,
} from "lucide-react";

const sections = [
  {
    label: "Course Booklet",
    desc: "Interactive course chapters, exercises, music theory",
    icon: BookOpen,
    to: "/teaching/booklet",
    color: "#a78bfa",
  },
  {
    label: "Grading",
    desc: "Student list, assignment status, attendance",
    icon: ClipboardCheck,
    to: "/teaching/grading",
    color: "#3fb950",
  },
  {
    label: "Materials",
    desc: "Music notation, Q&A docs, prep materials",
    icon: FileText,
    to: "/teaching/materials",
    color: "#58a6ff",
  },
];

export function TeachingHome() {
  return (
    <div className="flex flex-col gap-6 mt-1">
      {/* Header */}
      <div className="flex items-center gap-3">
        <GraduationCap className="h-6 w-6 text-[#a78bfa]" />
        <div>
          <h1 className="text-xl font-semibold">Levinsky College</h1>
          <p className="text-sm text-muted-foreground">לוינסקי — Music Therapy Teaching</p>
        </div>
      </div>

      {/* Sections */}
      <div className="grid grid-cols-3 gap-4">
        {sections.map((sec) => (
          <Link
            key={sec.label}
            to={sec.to}
            className="flex flex-col items-start gap-3 rounded-lg border bg-card p-5 transition-colors hover:bg-accent"
          >
            <sec.icon className="h-5 w-5" style={{ color: sec.color }} />
            <div>
              <div className="text-sm font-medium">{sec.label}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{sec.desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

TeachingHome.path = "/teaching";
