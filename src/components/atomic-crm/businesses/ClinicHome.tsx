import { Link } from "react-router";
import {
  Stethoscope,
  AlertCircle,
  Music,
} from "lucide-react";

const GREEN = "#3fb950";

type Patient = {
  name: string;
  payer: string;
  rate: number;
  febHours: number;
  febTotal: number;
  payerColor: string;
  note?: string;
};

const patients: Patient[] = [
  // לב בטוח group
  { name: "תמר", payer: "לב בטוח", rate: 275, febHours: 2, febTotal: 550, payerColor: "#58a6ff" },
  { name: "אורי", payer: "לב בטוח", rate: 275, febHours: 0, febTotal: 0, payerColor: "#58a6ff" },
  { name: "פנינה", payer: "לב בטוח", rate: 300, febHours: 3, febTotal: 900, payerColor: "#58a6ff" },
  { name: "קובי", payer: "לב בטוח", rate: 300, febHours: 3, febTotal: 900, payerColor: "#58a6ff" },
  { name: "תומר רימון", payer: "לב בטוח", rate: 300, febHours: 2, febTotal: 600, payerColor: "#58a6ff" },
  // Organization patients
  { name: "ויקי", payer: "מרכז חוסן", rate: 250, febHours: 0, febTotal: 0, payerColor: "#a78bfa", note: "סיימה טיפול — נשלח פירוט, מחכה לתשלום" },
  { name: "איציק", payer: "בשביל החיים", rate: 300, febHours: 3, febTotal: 900, payerColor: "#f0883e", note: "20/35 טיפולים — ₪3,450 חוב (נוב-ינו)" },
  // Private patients
  { name: "עמית עמר", payer: "פרטי", rate: 400, febHours: 2, febTotal: 800, payerColor: GREEN },
  { name: "משה לב ארי", payer: "פרטי", rate: 400, febHours: 2, febTotal: 800, payerColor: GREEN },
  { name: "רואי", payer: "פרטי", rate: 450, febHours: 3, febTotal: 1350, payerColor: GREEN },
  { name: "יעל", payer: "פרטי", rate: 300, febHours: 3, febTotal: 900, payerColor: GREEN },
  { name: "בנימין", payer: "פרטי", rate: 400, febHours: 3, febTotal: 1200, payerColor: GREEN },
  { name: "אלון", payer: "פרטי", rate: 400, febHours: 3, febTotal: 1200, payerColor: GREEN },
  { name: "עומר", payer: "פרטי", rate: 450, febHours: 3, febTotal: 1350, payerColor: GREEN },
];

const alerts = [
  { text: "איציק (בשביל החיים) — ₪3,450 חוב מנובמבר", color: "#f85149" },
  { text: "ויקי (מרכז חוסן) — פירוט דצמבר-ינואר נשלח, ממתין לתשלום", color: "#f0883e" },
];

export function ClinicHome() {
  const activePatients = patients.length;
  const totalHours = patients.reduce((s, p) => s + p.febHours, 0);
  const totalIncome = patients.reduce((s, p) => s + p.febTotal, 0);
  const outstanding = 3450;

  const stats = [
    { label: "מטופלים פעילים", value: String(activePatients), color: GREEN },
    { label: "שעות פברואר", value: String(totalHours), color: "#58a6ff" },
    { label: "הכנסה משוערת", value: `₪${totalIncome.toLocaleString()}`, color: "#f0883e" },
    { label: "חוב פתוח", value: `₪${outstanding.toLocaleString()}`, color: "#f85149" },
  ];

  return (
    <div className="flex flex-col gap-6 mt-1">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Stethoscope className="h-6 w-6 text-[#3fb950]" />
        <div>
          <h1 className="text-xl font-semibold">קליניקה פרטית</h1>
          <p className="text-sm text-muted-foreground">מוזיקותרפיה — דניאל</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg border bg-card p-4 text-center">
            <div className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Payment Alerts */}
      {alerts.length > 0 && (
        <div className="rounded-lg border border-[#f8514930] bg-[#f8514910] p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-4 w-4 text-[#f85149]" />
            <span className="text-sm font-medium text-[#f85149]">התראות תשלום</span>
          </div>
          <div className="space-y-1">
            {alerts.map((a) => (
              <div key={a.text} className="text-xs" style={{ color: a.color }}>{a.text}</div>
            ))}
          </div>
        </div>
      )}

      {/* Patient Table */}
      <div className="rounded-lg border bg-card">
        <div className="px-5 py-3 border-b flex items-center justify-between">
          <h2 className="text-sm font-medium">מטופלים — פברואר</h2>
          <span className="text-xs text-muted-foreground">{activePatients} פעילים</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-xs text-muted-foreground">
                <th className="text-right px-5 py-2 font-medium">מטופל</th>
                <th className="text-right px-3 py-2 font-medium">משלם</th>
                <th className="text-right px-3 py-2 font-medium">תעריף</th>
                <th className="text-right px-3 py-2 font-medium">שעות</th>
                <th className="text-right px-3 py-2 font-medium">סה״כ</th>
                <th className="text-right px-3 py-2 font-medium">הערה</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p) => (
                <tr key={p.name} className="border-b last:border-0 hover:bg-accent/50">
                  <td className="px-5 py-2.5 font-medium text-right">{p.name}</td>
                  <td className="px-3 py-2.5 text-right">
                    <span
                      className="rounded-full px-2 py-0.5 text-xs"
                      style={{
                        color: p.payerColor,
                        backgroundColor: p.payerColor + "15",
                      }}
                    >
                      {p.payer}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-right text-muted-foreground">₪{p.rate}</td>
                  <td className="px-3 py-2.5 text-right text-muted-foreground">{p.febHours}</td>
                  <td className="px-3 py-2.5 text-right font-medium" style={{ color: p.febTotal > 0 ? GREEN : "#6e7681" }}>
                    {p.febTotal > 0 ? `₪${p.febTotal.toLocaleString()}` : "—"}
                  </td>
                  <td className="px-3 py-2.5 text-right text-xs text-muted-foreground max-w-[200px] truncate">
                    {p.note || ""}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t bg-accent/30">
                <td className="px-5 py-2.5 font-semibold text-right" colSpan={3}>סה״כ</td>
                <td className="px-3 py-2.5 text-right font-medium">{totalHours}</td>
                <td className="px-3 py-2.5 text-right font-bold text-[#3fb950]">₪{totalIncome.toLocaleString()}</td>
                <td className="px-3 py-2.5 text-right text-xs text-muted-foreground">+18% מע״מ</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Payer Breakdown */}
      <div className="rounded-lg border bg-card p-5">
        <h2 className="text-sm font-medium mb-3">פילוח לפי משלם</h2>
        <div className="grid grid-cols-4 gap-3">
          {(() => {
            const byPayer = patients.reduce((acc, p) => {
              if (!acc[p.payer]) acc[p.payer] = { count: 0, total: 0, color: p.payerColor };
              acc[p.payer].count++;
              acc[p.payer].total += p.febTotal;
              return acc;
            }, {} as Record<string, { count: number; total: number; color: string }>);

            return Object.entries(byPayer).map(([payer, data]) => (
              <div key={payer} className="rounded-lg border p-3 text-center">
                <div className="text-sm font-medium" style={{ color: data.color }}>{payer}</div>
                <div className="text-xs text-muted-foreground mt-1">{data.count} מטופלים</div>
                <div className="text-sm font-bold mt-1" style={{ color: data.total > 0 ? GREEN : "#6e7681" }}>
                  {data.total > 0 ? `₪${data.total.toLocaleString()}` : "—"}
                </div>
              </div>
            ));
          })()}
        </div>
      </div>

      {/* Programs */}
      <div className="rounded-lg border bg-card p-5">
        <h2 className="text-sm font-medium mb-3">תוכניות</h2>
        <Link
          to="/clinic/shir-derekh"
          className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-accent"
        >
          <Music className="h-5 w-5 text-[#3fb950]" />
          <div>
            <div className="text-sm font-medium">שיר דרך</div>
            <div className="text-xs text-muted-foreground mt-0.5">תוכנית מוזיקותרפיה — שיקום לוחמים פצועים</div>
          </div>
        </Link>
      </div>

      {/* Notes */}
      <div className="rounded-lg border bg-card p-4 text-xs text-muted-foreground space-y-1">
        <div className="font-medium text-sm mb-2">הערות ניהול</div>
        <div>• בסוף כל חודש — שליחת פירוט לכל מטופל</div>
        <div>• "בשביל החיים" — הגשה עד ה-5 לחודש</div>
        <div>• עמותות אחרות — לבדוק מועדים</div>
      </div>
    </div>
  );
}

ClinicHome.path = "/clinic";
