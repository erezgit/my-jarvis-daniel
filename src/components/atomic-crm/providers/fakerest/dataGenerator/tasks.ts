import type { Task, GtdStatus, TaskPriority, TaskContext } from "../../../types";
import type { Db } from "./types";

// ─── Daniel's real GTD tasks ──────────────────────────────────────────────────

type GtdTask = {
  text: string;
  type: string;
  gtd_status: GtdStatus;
  priority: TaskPriority;
  context?: TaskContext | null;
  due_date?: string;
  waiting_for_person?: string | null;
};

const inboxTasks: GtdTask[] = [
  { text: "לפתוח קבוצות וואטסאפ - 13:30", type: "Todo", gtd_status: "inbox", priority: "medium", context: "פעמון" },
  { text: "לתכנן קבוצת מקהלה עם ענאל - שבוע הבא", type: "Todo", gtd_status: "inbox", priority: "medium", context: "פעמון" },
  { text: "פולואו אפ מצדה", type: "Todo", gtd_status: "inbox", priority: "medium" },
  { text: "פולואו אפ נתיב", type: "Todo", gtd_status: "inbox", priority: "medium" },
  { text: "להזכיר למונזיר לבוא לתיאטרון עם החבר שלו ולדבר עם נופר", type: "Todo", gtd_status: "inbox", priority: "medium", context: "פעמון" },
  { text: "ציוד תיאטרון - פולואו אפ", type: "Todo", gtd_status: "inbox", priority: "medium", context: "פעמון" },
  { text: "פגישה עם ארז על ג׳רביס וניהול פעמון", type: "Todo", gtd_status: "inbox", priority: "medium", context: "פעמון" },
  { text: "שיחות טלפון עם מנהלות ומורים לתיאטרון מוזיקה ואמנות", type: "Todo", gtd_status: "inbox", priority: "medium", context: "פעמון" },
  { text: "פסטיבל אביב לפרסם למורים", type: "Todo", gtd_status: "inbox", priority: "medium", context: "פעמון" },
  { text: "לבדוק בפייסבוק - פרסום בהורים מיוחדים", type: "Todo", gtd_status: "inbox", priority: "medium", context: "פעמון" },
  { text: "לפרסם בקבוצות נוספות מנהלים ואנשי מפתח בחינוך הרגיל כיתות קטנות", type: "Todo", gtd_status: "inbox", priority: "medium", context: "פעמון" },
  { text: "לסדר את כל הקבוצות והשינויים שנעשו", type: "Todo", gtd_status: "inbox", priority: "medium", context: "פעמון" },
  { text: "להוציא תוכנייה באנגלית", type: "Todo", gtd_status: "inbox", priority: "medium", context: "פעמון" },
  { text: "ענת שחור - פולואו אפ", type: "Todo", gtd_status: "inbox", priority: "medium" },
  { text: "וינייטות", type: "Todo", gtd_status: "inbox", priority: "medium" },
  { text: "חשבונאות", type: "Todo", gtd_status: "inbox", priority: "medium", context: "אישי" },
  { text: "לשלוח חוזה ופרטים לעופר דורי", type: "Todo", gtd_status: "inbox", priority: "medium" },
  { text: "מיילים", type: "Todo", gtd_status: "inbox", priority: "medium" },
  { text: "מסלול יהונתן - לברר עם אורית", type: "Todo", gtd_status: "inbox", priority: "medium", context: "עירייה" },
  { text: "ביכורים - להבין מאורית את ההסבר ולהעביר לשחר", type: "Todo", gtd_status: "inbox", priority: "medium", context: "עירייה" },
  { text: "גבייה", type: "Todo", gtd_status: "inbox", priority: "medium" },
  { text: "סדר בקבוצות פעמון והכנה לגביהם", type: "Todo", gtd_status: "inbox", priority: "medium", context: "פעמון" },
  { text: "טלפון של ענת שחור וחיבור אליה", type: "Todo", gtd_status: "inbox", priority: "medium" },
  { text: "הרכב מוזיקלי לצוות חינוכי", type: "Todo", gtd_status: "inbox", priority: "medium", context: "עירייה" },
  { text: "מפרט טכני", type: "Todo", gtd_status: "inbox", priority: "medium" },
  { text: "ענאל שיחה - קבוצת הורים לתכנן", type: "Todo", gtd_status: "inbox", priority: "medium", context: "פעמון" },
  { text: "ברוריה", type: "Todo", gtd_status: "inbox", priority: "medium" },
  { text: "תיאום מס - חוזים", type: "Todo", gtd_status: "inbox", priority: "medium", context: "אישי" },
  { text: "ציוד מוזיקה", type: "Todo", gtd_status: "inbox", priority: "medium", context: "פעמון" },
  { text: "הרשמה - ממוקד מחנכות ומורים לאמנויות: כיתות קטנות + כוללני", type: "Todo", gtd_status: "inbox", priority: "medium", context: "פעמון" },
  { text: "ציוד תיאטרון - ברורה חשבונית מס ואז לשלוח לאורית", type: "Todo", gtd_status: "inbox", priority: "medium", context: "עירייה" },
  { text: "זריזי - הזמנה במהלך שבוע הבא אחרי שיגיע לו משלוח ציוד מוזיקה", type: "Todo", gtd_status: "inbox", priority: "medium" },
  { text: "לעבור עם עדן על חוזה יובל חינוך", type: "Todo", gtd_status: "inbox", priority: "medium", context: "אישי" },
  { text: "ניקול סיכומי טיפול", type: "Todo", gtd_status: "inbox", priority: "medium", context: "קליניקה" },
  { text: "סיכומי טיפול קליניקה", type: "Todo", gtd_status: "inbox", priority: "medium", context: "קליניקה" },
  { text: "תקנון וחוקי התנהגות בסיסיים למרכז", type: "Todo", gtd_status: "inbox", priority: "medium", context: "פעמון" },
  { text: "פגישה עם חרדים חינוך מיוחד", type: "Todo", gtd_status: "inbox", priority: "medium", context: "פעמון" },
  { text: "פגישה ב28.1 עם תיכונים", type: "Todo", gtd_status: "inbox", priority: "medium", context: "פעמון" },
  { text: "אביה רציונל לאנסמבלים לתרפיה", type: "Todo", gtd_status: "inbox", priority: "medium", context: "קליניקה" },
  { text: "קופה קטנה - פעמון", type: "Todo", gtd_status: "inbox", priority: "medium", context: "פעמון" },
  { text: "מיקרודוזינג סן פדרו", type: "Todo", gtd_status: "inbox", priority: "medium", context: "אישי" },
  { text: "מחר - פרק תאורטי מהלכים הרמוניים", type: "Todo", gtd_status: "inbox", priority: "medium" },
  { text: "סיור של לוינסקי - אורי אהרונוב שעה", type: "Todo", gtd_status: "inbox", priority: "medium" },
  { text: "אישורי צילום - ליצור מסמך ולהעביר לכולם", type: "Todo", gtd_status: "inbox", priority: "medium", context: "פעמון" },
  { text: "הדפסה בגיל - של תוכנייה בצבע", type: "Todo", gtd_status: "inbox", priority: "medium", context: "פעמון" },
  { text: "חדרים מתרצה", type: "Todo", gtd_status: "inbox", priority: "medium" },
  { text: "הופעה 4.2", type: "Todo", gtd_status: "inbox", priority: "medium" },
  { text: "רשימת תאריכי של הפעילות", type: "Todo", gtd_status: "inbox", priority: "medium", context: "פעמון" },
  { text: "לחתום על חוזה ועל 101 לוינסקי", type: "Todo", gtd_status: "inbox", priority: "medium" },
  { text: "דוד שיחה שיבוא לפרידה", type: "Todo", gtd_status: "inbox", priority: "medium", context: "אישי" },
  { text: "פינוק לעדן - רשימת מחוות ומתנות לעדן", type: "Todo", gtd_status: "inbox", priority: "medium", context: "אישי" },
  { text: "כיוון פסנתר", type: "Todo", gtd_status: "inbox", priority: "medium", context: "אישי" },
  { text: "טבעת יהלום לעדן", type: "Todo", gtd_status: "inbox", priority: "medium", context: "אישי" },
  { text: "על הספה, בטיפולנט", type: "Todo", gtd_status: "inbox", priority: "medium", context: "קליניקה" },
  { text: "לבטל מנוי גראביטס באוקטובר 2026", type: "Todo", gtd_status: "inbox", priority: "medium", context: "אישי" },
  { text: "פסיכולוגיה עברית - להשלים תהליך", type: "Todo", gtd_status: "inbox", priority: "medium", context: "אישי" },
  { text: "בדיקות דם - לבקש", type: "Todo", gtd_status: "inbox", priority: "medium", context: "אישי" },
  { text: "טופס סיום טיפול ניצן פרחי", type: "Todo", gtd_status: "inbox", priority: "medium", context: "קליניקה" },
  { text: "שקע חשמל", type: "Todo", gtd_status: "inbox", priority: "medium", context: "אישי" },
  { text: "מס ייסף - לשבת עם עדן ולוודא שאין עניין", type: "Todo", gtd_status: "inbox", priority: "medium", context: "אישי" },
  { text: "לדבר עם מנהלת התכנית בחיפה לגבי מחקר וסטודנטים", type: "Todo", gtd_status: "inbox", priority: "medium" },
  { text: "ויזה לארה״ב", type: "Todo", gtd_status: "inbox", priority: "medium", context: "אישי" },
  { text: "אופניים", type: "Todo", gtd_status: "inbox", priority: "medium", context: "אישי" },
  { text: "מסעדה בספרד חיוב פעמיים", type: "Todo", gtd_status: "inbox", priority: "medium", context: "אישי" },
  { text: "קבוצת וואטסאפ האקומי ת״א", type: "Todo", gtd_status: "inbox", priority: "medium" },
  { text: "שליחת אתר לקולגות", type: "Todo", gtd_status: "inbox", priority: "medium", context: "קליניקה" },
  { text: "משקפיים", type: "Todo", gtd_status: "inbox", priority: "medium", context: "אישי" },
  { text: "מפגשים עם קולגות וחברים - מיכל", type: "Todo", gtd_status: "inbox", priority: "medium", context: "אישי" },
  { text: "מדריך מוסמך", type: "Todo", gtd_status: "inbox", priority: "medium" },
  { text: "דוקטורט", type: "Todo", gtd_status: "inbox", priority: "medium" },
  { text: "רענוני EMDR בקבוצה - פלאש", type: "Todo", gtd_status: "inbox", priority: "medium", context: "קליניקה" },
  { text: "דרכון חדש", type: "Todo", gtd_status: "inbox", priority: "medium", context: "אישי" },
  { text: "פוליפוניה - משרד הבטחון, נט״ל, אגף קהילה ותרבות", type: "Todo", gtd_status: "inbox", priority: "medium", context: "פעמון" },
  { text: "לסדר תאורה בשולחן אוכל", type: "Todo", gtd_status: "inbox", priority: "medium", context: "אישי" },
  { text: "לשים חורים בחגורה", type: "Todo", gtd_status: "inbox", priority: "medium", context: "אישי" },
  { text: "לסיים תחומי החיים ושגרה אידאלית", type: "Todo", gtd_status: "inbox", priority: "medium", context: "אישי" },
  { text: "בר מרדיקס - לשלוח סופית את היום ולעבור על התיקונים", type: "Todo", gtd_status: "inbox", priority: "medium" },
  { text: "להעביר לשלישי ולסדר חומר פירסומי קורס לוינסקי", type: "Todo", gtd_status: "inbox", priority: "medium" },
  { text: "להוציא פלייר לקורס שנה הבאה", type: "Todo", gtd_status: "inbox", priority: "medium" },
  { text: "לפרסם ביהת, בפייסבוק - קורס", type: "Todo", gtd_status: "inbox", priority: "medium" },
  { text: "עירוני א׳/ישיבת בר אילן (לפנות לעידית) - פוליפוניה", type: "Todo", gtd_status: "inbox", priority: "medium", context: "פעמון" },
  { text: "ביטוח - דניאל - לארגן שיחה עם אורית והיועצת ביטוח", type: "Todo", gtd_status: "inbox", priority: "medium", context: "אישי" },
  { text: "הסכם התקשרות עם ההורים - לנסח", type: "Todo", gtd_status: "inbox", priority: "medium", context: "פעמון" },
  { text: "שעות הסמכה להדרכה - להביא מכולם", type: "Todo", gtd_status: "inbox", priority: "medium" },
  { text: "טיפול רפואי - אוזניים", type: "Todo", gtd_status: "inbox", priority: "medium", context: "אישי" },
  { text: "טיפול רפואי - שיננית", type: "Todo", gtd_status: "inbox", priority: "medium", context: "אישי" },
  { text: "טיפול רפואי - רופא משפחה", type: "Todo", gtd_status: "inbox", priority: "medium", context: "אישי" },
];

const nextActionTasks: GtdTask[] = [
  { text: "פולואפ מיקה מרכז חוסן - תשלום דצמבר וינואר", type: "Follow-up", gtd_status: "next_action", priority: "medium", context: "קליניקה", due_date: "2026-02-15" },
  { text: "ארגון פרטי קבוצת תיאטרון - יום ראשון 17:00", type: "Todo", gtd_status: "next_action", priority: "high", context: "פעמון", due_date: "2026-02-15" },
  { text: "פולואפ עם ענאל - האם דיברה עם טל קמחי", type: "Call", gtd_status: "next_action", priority: "medium", context: "פעמון", due_date: "2026-02-15" },
  { text: "פולואפ רימון - תשלום עבר", type: "Call", gtd_status: "next_action", priority: "medium", context: "עירייה", due_date: "2026-02-15" },
  { text: "מייל לטופלברג - בקשת קופה קטנה", type: "Email", gtd_status: "next_action", priority: "medium", context: "עירייה", due_date: "2026-02-15" },
  { text: "קביעת פגישה עם עידית - מרכז פעמון + פסטיבל אביב", type: "Meeting", gtd_status: "next_action", priority: "medium", context: "עירייה", due_date: "2026-02-15" },
  { text: "פולואפ חתימת הסכם מרכז עינב", type: "Follow-up", gtd_status: "next_action", priority: "medium", context: "עירייה", due_date: "2026-02-15" },
  { text: "פולואפ קופה קטנה - תשובת לימור", type: "Call", gtd_status: "next_action", priority: "medium", context: "עירייה", due_date: "2026-02-15" },
  { text: "פולואפ גבייה", type: "Follow-up", gtd_status: "next_action", priority: "medium", context: "עירייה", due_date: "2026-02-15" },
  { text: "הודעה לסי ג׳יי ואלישיב - ביטול שיעור", type: "Email", gtd_status: "next_action", priority: "high", context: "פעמון", due_date: "2026-02-15" },
  { text: "הודעה לרועי - הצטרפות לאנסמבל", type: "Email", gtd_status: "next_action", priority: "high", context: "פעמון", due_date: "2026-02-15" },
  { text: "הודעה למורים - גל לא יגיע, אני אהיה", type: "Email", gtd_status: "next_action", priority: "high", context: "פעמון", due_date: "2026-02-15" },
  { text: "פולואפ רואי - תשלום", type: "Follow-up", gtd_status: "next_action", priority: "medium", context: "קליניקה", due_date: "2026-02-15" },
  { text: "פולואפ פגישת מטה פעמון הבאה - 22.2 בשעה 10:00?", type: "Meeting", gtd_status: "next_action", priority: "medium", context: "עירייה", due_date: "2026-02-17" },
  { text: "הרכב צוות חינוכי - יצירת קשר עם יפה לקביעת פגישה", type: "Call", gtd_status: "next_action", priority: "high", context: "עירייה", due_date: "2026-02-18" },
  { text: "שיחה עם איתי - האם מעוניין במקהלה?", type: "Call", gtd_status: "next_action", priority: "high", context: "פעמון", due_date: "2026-02-19" },
  { text: "פולואפ אמא של אלכסנדרה - השלמת פרטים", type: "Call", gtd_status: "next_action", priority: "medium", context: "פעמון", due_date: "2026-02-20" },
  { text: "פולואפ שמוליק ונועה - מכתב על אבל", type: "Follow-up", gtd_status: "next_action", priority: "medium", context: "פעמון", due_date: "2026-02-20" },
  { text: "פולואפ ענאל - שיחה עם אמא של אלכס", type: "Call", gtd_status: "next_action", priority: "medium", context: "פעמון", due_date: "2026-02-22" },
  { text: "פולואפ ניר - מייל ממוקד לכל הורי החינוך המיוחד", type: "Email", gtd_status: "next_action", priority: "medium", context: "פעמון", due_date: "2026-02-22" },
];

const waitingForTasks: GtdTask[] = [
  { text: "ציוד מוזיקה - אישורים", type: "Todo", gtd_status: "waiting_for", priority: "medium", context: "עירייה", waiting_for_person: "עירייה - אישור רכישה" },
];

const projectTasks: GtdTask[] = [
  { text: "ניהול קשר עירייה — פגישות שבועיות עם אורית חפץ ואורית טופלברג", type: "Todo", gtd_status: "project", priority: "medium", context: "עירייה" },
  { text: "ניהול מרכז פעמון — 15 קבוצות, 58 מקומות, 44 תלמידים", type: "Todo", gtd_status: "project", priority: "medium", context: "פעמון" },
];

const allGtdTasks: GtdTask[] = [
  ...inboxTasks,
  ...nextActionTasks,
  ...waitingForTasks,
  ...projectTasks,
];

export const generateTasks = (_db: Db) => {
  const now = new Date().toISOString().slice(0, 10);
  return allGtdTasks.map<Task>((task, id) => ({
    id,
    contact_id: undefined as any,
    type: task.type,
    text: task.text,
    due_date: task.due_date ?? now,
    done_date: undefined,
    member_id: 0,
    gtd_status: task.gtd_status,
    priority: task.priority,
    context: task.context ?? null,
    waiting_for_person: task.waiting_for_person ?? null,
  }));
};
