import { Link, matchPath, useLocation } from "react-router";
import {
  LayoutDashboard,
  Stethoscope,
  Music,
  BookOpen,
  GraduationCap,
  Settings,
  ListChecks,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useConfigurationContext } from "../root/ConfigurationContext";

type NavItem = {
  label: string;
  to: string;
  icon: typeof LayoutDashboard;
  pattern: string;
};

const pages: NavItem[] = [
  { label: "משימות", to: "/tasks-gtd", icon: ListChecks, pattern: "/tasks-gtd" },
  { label: "קליניקה פרטית", to: "/clinic", icon: Stethoscope, pattern: "/clinic/*" },
  { label: "מרכז פעמון", to: "/paamon", icon: Music, pattern: "/paamon/*" },
  { label: "בסיס ידע", to: "/kb", icon: BookOpen, pattern: "/kb/*" },
  { label: "הוראה", to: "/teaching", icon: GraduationCap, pattern: "/teaching/*" },
  { label: "ניהול עצמי", to: "/self-management", icon: Target, pattern: "/self-management" },
];

export function CrmSidebar() {
  const { darkModeLogo, lightModeLogo, title } = useConfigurationContext();
  const location = useLocation();

  const isActive = (pattern: string) =>
    pattern === "/"
      ? !!matchPath("/", location.pathname)
      : !!matchPath(pattern, location.pathname);

  return (
    <aside className="flex h-svh w-56 shrink-0 flex-col border-e bg-[#f6f6f7] dark:bg-sidebar overflow-y-auto">
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-4">
        <Link to="/" className="flex items-center gap-2">
          <img
            className="[.light_&]:hidden h-7 w-7"
            src={darkModeLogo}
            alt={title}
          />
          <img
            className="[.dark_&]:hidden h-7 w-7"
            src={lightModeLogo}
            alt={title}
          />
          <span className="text-sm font-semibold">{title}</span>
        </Link>
      </div>

      {/* Pages */}
      <nav className="flex flex-1 flex-col gap-0.5 px-2 mt-3">
        {pages.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
              isActive(item.pattern)
                ? "bg-[#e3e3e6] dark:bg-sidebar-accent text-foreground font-medium"
                : "text-muted-foreground hover:bg-[#e3e3e6] dark:hover:bg-sidebar-accent hover:text-foreground"
            )}
          >
            <item.icon className="h-[18px] w-[18px]" />
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Settings at bottom */}
      <div className="px-2 pb-3">
        <Link
          to="/settings"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
            isActive("/settings")
              ? "bg-[#e3e3e6] dark:bg-sidebar-accent text-foreground font-medium"
              : "text-muted-foreground hover:bg-[#e3e3e6] dark:hover:bg-sidebar-accent hover:text-foreground"
          )}
        >
          <Settings className="h-[18px] w-[18px]" />
          הגדרות
        </Link>
      </div>
    </aside>
  );
}
