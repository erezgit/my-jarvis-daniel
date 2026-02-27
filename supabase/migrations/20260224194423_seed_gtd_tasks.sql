-- Seed Daniel's GTD tasks from his original משימות-gtd.html
-- All tasks inserted without contact_id (quick capture style)

-- ═══════════════════════════════════════════════════════════════════
-- INBOX (86 tasks) — raw brain dumps, medium priority
-- ═══════════════════════════════════════════════════════════════════
INSERT INTO public.tasks (text, type, gtd_status, priority, context, due_date) VALUES
('לפתוח קבוצות וואטסאפ - 13:30', 'Todo', 'inbox', 'medium', 'פעמון', now()),
('לתכנן קבוצת מקהלה עם ענאל - שבוע הבא', 'Todo', 'inbox', 'medium', 'פעמון', now()),
('פולואו אפ מצדה', 'Todo', 'inbox', 'medium', NULL, now()),
('פולואו אפ נתיב', 'Todo', 'inbox', 'medium', NULL, now()),
('להזכיר למונזיר לבוא לתיאטרון עם החבר שלו ולדבר עם נופר', 'Todo', 'inbox', 'medium', 'פעמון', now()),
('ציוד תיאטרון - פולואו אפ', 'Todo', 'inbox', 'medium', 'פעמון', now()),
('פגישה עם ארז על ג׳רביס וניהול פעמון', 'Todo', 'inbox', 'medium', 'פעמון', now()),
('שיחות טלפון עם מנהלות ומורים לתיאטרון מוזיקה ואמנות', 'Todo', 'inbox', 'medium', 'פעמון', now()),
('פסטיבל אביב לפרסם למורים', 'Todo', 'inbox', 'medium', 'פעמון', now()),
('לבדוק בפייסבוק - פרסום בהורים מיוחדים', 'Todo', 'inbox', 'medium', 'פעמון', now()),
('לפרסם בקבוצות נוספות מנהלים ואנשי מפתח בחינוך הרגיל כיתות קטנות - אושרי ואילת', 'Todo', 'inbox', 'medium', 'פעמון', now()),
('לסדר את כל הקבוצות והשינויים שנעשו', 'Todo', 'inbox', 'medium', 'פעמון', now()),
('להוציא תוכנייה באנגלית', 'Todo', 'inbox', 'medium', 'פעמון', now()),
('ענת שחור - פולואו אפ', 'Todo', 'inbox', 'medium', NULL, now()),
('וינייטות', 'Todo', 'inbox', 'medium', NULL, now()),
('חשבונאות', 'Todo', 'inbox', 'medium', 'אישי', now()),
('לשלוח חוזה ופרטים לעופר דורי', 'Todo', 'inbox', 'medium', NULL, now()),
('מיילים', 'Todo', 'inbox', 'medium', NULL, now()),
('מסלול יהונתן - לברר עם אורית', 'Todo', 'inbox', 'medium', 'עירייה', now()),
('ביכורים - להבין מאורית את ההסבר ולהעביר לשחר', 'Todo', 'inbox', 'medium', 'עירייה', now()),
('גבייה', 'Todo', 'inbox', 'medium', NULL, now()),
('סדר בקבוצות פעמון והכנה לגביהם', 'Todo', 'inbox', 'medium', 'פעמון', now()),
('טלפון של ענת שחור וחיבור אליה', 'Todo', 'inbox', 'medium', NULL, now()),
('הרכב מוזיקלי לצוות חינוכי', 'Todo', 'inbox', 'medium', 'עירייה', now()),
('מפרט טכני', 'Todo', 'inbox', 'medium', NULL, now()),
('ענאל שיחה - קבוצת הורים לתכנן', 'Todo', 'inbox', 'medium', 'פעמון', now()),
('ברוריה', 'Todo', 'inbox', 'medium', NULL, now()),
('תיאום מס - חוזים', 'Todo', 'inbox', 'medium', 'אישי', now()),
('ציוד מוזיקה', 'Todo', 'inbox', 'medium', 'פעמון', now()),
('הרשמה - ממוקד מחנכות ומורים לאמנויות: כיתות קטנות + כוללני', 'Todo', 'inbox', 'medium', 'פעמון', now()),
('ציוד תיאטרון - ברורה חשבונית מס ואז לשלוח לאורית', 'Todo', 'inbox', 'medium', 'עירייה', now()),
('זריזי - הזמנה במהלך שבוע הבא אחרי שיגיע לו משלוח ציוד מוזיקה', 'Todo', 'inbox', 'medium', NULL, now()),
('לעבור עם עדן על חוזה יובל חינוך', 'Todo', 'inbox', 'medium', 'אישי', now()),
('ניקול סיכומי טיפול', 'Todo', 'inbox', 'medium', 'קליניקה', now()),
('סיכומי טיפול קליניקה', 'Todo', 'inbox', 'medium', 'קליניקה', now()),
('תקנון וחוקי התנהגות בסיסיים למרכז', 'Todo', 'inbox', 'medium', 'פעמון', now()),
('פגישה עם חרדים חינוך מיוחד', 'Todo', 'inbox', 'medium', 'פעמון', now()),
('פגישה ב28.1 עם תיכונים', 'Todo', 'inbox', 'medium', 'פעמון', now()),
('אביה רציונל לאנסמבלים לתרפיה', 'Todo', 'inbox', 'medium', 'קליניקה', now()),
('קופה קטנה - פעמון', 'Todo', 'inbox', 'medium', 'פעמון', now()),
('מיקרודוזינג סן פדרו', 'Todo', 'inbox', 'medium', 'אישי', now()),
('מחר - פרק תאורטי מהלכים הרמוניים', 'Todo', 'inbox', 'medium', NULL, now()),
('סיור של לוינסקי - אורי אהרונוב שעה', 'Todo', 'inbox', 'medium', NULL, now()),
('אישורי צילום - ליצור מסמך ולהעביר לכולם', 'Todo', 'inbox', 'medium', 'פעמון', now()),
('הדפסה בגיל - של תוכנייה בצבע', 'Todo', 'inbox', 'medium', 'פעמון', now()),
('חדרים מתרצה', 'Todo', 'inbox', 'medium', NULL, now()),
('הופעה 4.2', 'Todo', 'inbox', 'medium', NULL, now()),
('רשימת תאריכי של הפעילות', 'Todo', 'inbox', 'medium', 'פעמון', now()),
('לחתום על חוזה ועל 101 לוינסקי', 'Todo', 'inbox', 'medium', NULL, now()),
('דוד שיחה שיבוא לפרידה', 'Todo', 'inbox', 'medium', 'אישי', now()),
('פינוק לעדן - רשימת מחוות ומתנות לעדן', 'Todo', 'inbox', 'medium', 'אישי', now()),
('כיוון פסנתר', 'Todo', 'inbox', 'medium', 'אישי', now()),
('טבעת יהלום לעדן', 'Todo', 'inbox', 'medium', 'אישי', now()),
('על הספה, בטיפולנט', 'Todo', 'inbox', 'medium', 'קליניקה', now()),
('לבטל מנוי גראביטס באוקטובר 2026', 'Todo', 'inbox', 'medium', 'אישי', now()),
('פסיכולוגיה עברית - להשלים תהליך', 'Todo', 'inbox', 'medium', 'אישי', now()),
('בדיקות דם - לבקש', 'Todo', 'inbox', 'medium', 'אישי', now()),
('טופס סיום טיפול ניצן פרחי', 'Todo', 'inbox', 'medium', 'קליניקה', now()),
('שקע חשמל', 'Todo', 'inbox', 'medium', 'אישי', now()),
('מס ייסף - לשבת עם עדן ולוודא שאין עניין', 'Todo', 'inbox', 'medium', 'אישי', now()),
('לדבר עם מנהלת התכנית בחיפה לגבי מחקר וסטודנטים', 'Todo', 'inbox', 'medium', NULL, now()),
('ויזה לארה״ב', 'Todo', 'inbox', 'medium', 'אישי', now()),
('אופניים', 'Todo', 'inbox', 'medium', 'אישי', now()),
('מסעדה בספרד חיוב פעמיים', 'Todo', 'inbox', 'medium', 'אישי', now()),
('קבוצת וואטסאפ האקומי ת״א', 'Todo', 'inbox', 'medium', NULL, now()),
('שליחת אתר לקולגות', 'Todo', 'inbox', 'medium', 'קליניקה', now()),
('משקפיים', 'Todo', 'inbox', 'medium', 'אישי', now()),
('מפגשים עם קולגות וחברים - מיכל', 'Todo', 'inbox', 'medium', 'אישי', now()),
('מדריך מוסמך', 'Todo', 'inbox', 'medium', NULL, now()),
('דוקטורט', 'Todo', 'inbox', 'medium', NULL, now()),
('רענוני EMDR בקבוצה - פלאש', 'Todo', 'inbox', 'medium', 'קליניקה', now()),
('דרכון חדש', 'Todo', 'inbox', 'medium', 'אישי', now()),
('פוליפוניה - משרד הבטחון, נט״ל, אגף קהילה ותרבות, כפר איזון, בתים מאזנים, מילואימניקים ת״א', 'Todo', 'inbox', 'medium', 'פעמון', now()),
('לסדר תאורה בשולחן אוכל', 'Todo', 'inbox', 'medium', 'אישי', now()),
('לשים חורים בחגורה', 'Todo', 'inbox', 'medium', 'אישי', now()),
('לסיים תחומי החיים ושגרה אידאלית', 'Todo', 'inbox', 'medium', 'אישי', now()),
('בר מרדיקס - לשלוח סופית את היום ולעבור על התיקונים', 'Todo', 'inbox', 'medium', NULL, now()),
('להעביר לשלישי ולסדר חומר פירסומי קורס לוינסקי', 'Todo', 'inbox', 'medium', NULL, now()),
('להוציא פלייר לקורס שנה הבאה', 'Todo', 'inbox', 'medium', NULL, now()),
('לפרסם ביהת, בפייסבוק - קורס', 'Todo', 'inbox', 'medium', NULL, now()),
('עירוני א׳/ישיבת בר אילן (לפנות לעידית) - פוליפוניה', 'Todo', 'inbox', 'medium', 'פעמון', now()),
('ביטוח - דניאל - לארגן שיחה עם אורית והיועצת ביטוח', 'Todo', 'inbox', 'medium', 'אישי', now()),
('הסכם התקשרות עם ההורים - לנסח', 'Todo', 'inbox', 'medium', 'פעמון', now()),
('שעות הסמכה להדרכה - להביא מכולם', 'Todo', 'inbox', 'medium', NULL, now()),
('טיפול רפואי - אוזניים', 'Todo', 'inbox', 'medium', 'אישי', now()),
('טיפול רפואי - שיננית', 'Todo', 'inbox', 'medium', 'אישי', now()),
('טיפול רפואי - רופא משפחה', 'Todo', 'inbox', 'medium', 'אישי', now());

-- ═══════════════════════════════════════════════════════════════════
-- NEXT ACTIONS (20 tasks) — processed, with priority/context/dates
-- ═══════════════════════════════════════════════════════════════════
INSERT INTO public.tasks (text, type, gtd_status, priority, context, due_date) VALUES
('פולואפ מיקה מרכז חוסן - תשלום דצמבר וינואר', 'Follow-up', 'next_action', 'medium', 'קליניקה', '2026-02-15'),
('ארגון פרטי קבוצת תיאטרון - יום ראשון 17:00', 'Todo', 'next_action', 'high', 'פעמון', '2026-02-15'),
('פולואפ עם ענאל - האם דיברה עם טל קמחי', 'Call', 'next_action', 'medium', 'פעמון', '2026-02-15'),
('פולואפ רימון - תשלום עבר', 'Call', 'next_action', 'medium', 'עירייה', '2026-02-15'),
('מייל לטופלברג - בקשת קופה קטנה', 'Email', 'next_action', 'medium', 'עירייה', '2026-02-15'),
('קביעת פגישה עם עידית - מרכז פעמון + פסטיבל אביב', 'Meeting', 'next_action', 'medium', 'עירייה', '2026-02-15'),
('פולואפ חתימת הסכם מרכז עינב', 'Follow-up', 'next_action', 'medium', 'עירייה', '2026-02-15'),
('פולואפ קופה קטנה - תשובת לימור', 'Call', 'next_action', 'medium', 'עירייה', '2026-02-15'),
('פולואפ גבייה', 'Follow-up', 'next_action', 'medium', 'עירייה', '2026-02-15'),
('הודעה לסי ג׳יי ואלישיב - ביטול שיעור', 'Email', 'next_action', 'high', 'פעמון', '2026-02-15'),
('הודעה לרועי - הצטרפות לאנסמבל', 'Email', 'next_action', 'high', 'פעמון', '2026-02-15'),
('הודעה למורים - גל לא יגיע, אני אהיה', 'Email', 'next_action', 'high', 'פעמון', '2026-02-15'),
('פולואפ רואי - תשלום', 'Follow-up', 'next_action', 'medium', 'קליניקה', '2026-02-15'),
('פולואפ פגישת מטה פעמון הבאה - 22.2 בשעה 10:00?', 'Meeting', 'next_action', 'medium', 'עירייה', '2026-02-17'),
('הרכב צוות חינוכי - יצירת קשר עם יפה לקביעת פגישה', 'Call', 'next_action', 'high', 'עירייה', '2026-02-18'),
('שיחה עם איתי - האם מעוניין במקהלה?', 'Call', 'next_action', 'high', 'פעמון', '2026-02-19'),
('פולואפ אמא של אלכסנדרה - השלמת פרטים', 'Call', 'next_action', 'medium', 'פעמון', '2026-02-20'),
('פולואפ שמוליק ונועה - מכתב על אבל', 'Follow-up', 'next_action', 'medium', 'פעמון', '2026-02-20'),
('פולואפ ענאל - שיחה עם אמא של אלכס', 'Call', 'next_action', 'medium', 'פעמון', '2026-02-22'),
('פולואפ ניר - מייל ממוקד לכל הורי החינוך המיוחד', 'Email', 'next_action', 'medium', 'פעמון', '2026-02-22');

-- ═══════════════════════════════════════════════════════════════════
-- WAITING FOR (1 task)
-- ═══════════════════════════════════════════════════════════════════
INSERT INTO public.tasks (text, type, gtd_status, priority, context, due_date, waiting_for_person) VALUES
('ציוד מוזיקה - אישורים', 'Todo', 'waiting_for', 'medium', 'עירייה', now(), 'עירייה - אישור רכישה');

-- ═══════════════════════════════════════════════════════════════════
-- PROJECTS (2 tasks)
-- ═══════════════════════════════════════════════════════════════════
INSERT INTO public.tasks (text, type, gtd_status, priority, context, due_date) VALUES
('ניהול קשר עירייה — פגישות שבועיות עם אורית חפץ ואורית טופלברג', 'Todo', 'project', 'medium', 'עירייה', now()),
('ניהול מרכז פעמון — 15 קבוצות, 58 מקומות, 44 תלמידים', 'Todo', 'project', 'medium', 'פעמון', now());
