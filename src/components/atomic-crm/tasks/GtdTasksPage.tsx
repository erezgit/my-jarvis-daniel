import { useState, useRef, useEffect } from "react";
import {
  useGetList,
  useCreate,
  useUpdate,
  useDelete,
  useNotify,
  useGetIdentity,
} from "ra-core";
import { useQueryClient } from "@tanstack/react-query";
import {
  Inbox,
  Zap,
  Clock,
  FolderOpen,
  Lightbulb,
  Plus,
  Check,
  MoreVertical,
  Pencil,
  Trash2,
  ArrowUpDown,
  X,
  List,
  Columns3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import type { Task, GtdStatus, TaskPriority, TaskContext } from "../types";

// ─── Constants ────────────────────────────────────────────────────────────────

const GTD_SECTIONS: {
  status: GtdStatus;
  label: string;
  labelHe: string;
  icon: typeof Inbox;
  color: string;
}[] = [
  { status: "inbox", label: "Inbox", labelHe: "תיבת דואר", icon: Inbox, color: "#ef4444" },
  { status: "next_action", label: "Next Actions", labelHe: "לביצוע", icon: Zap, color: "#3b82f6" },
  { status: "waiting_for", label: "Waiting For", labelHe: "ממתין", icon: Clock, color: "#8b5cf6" },
  { status: "project", label: "Projects", labelHe: "פרויקטים", icon: FolderOpen, color: "#f0883e" },
  { status: "someday_maybe", label: "Someday/Maybe", labelHe: "אולי", icon: Lightbulb, color: "#6b7280" },
];

const CONTEXTS: { value: TaskContext; label: string; color: string }[] = [
  { value: "עירייה", label: "עירייה", color: "#f0883e" },
  { value: "פעמון", label: "פעמון", color: "#a78bfa" },
  { value: "קליניקה", label: "קליניקה", color: "#3b82f6" },
  { value: "אישי", label: "אישי", color: "#6b7280" },
];

const PRIORITIES: { value: TaskPriority; label: string; color: string }[] = [
  { value: "urgent", label: "דחוף", color: "#ef4444" },
  { value: "high", label: "חשוב", color: "#f59e0b" },
  { value: "medium", label: "רגיל", color: "#3b82f6" },
  { value: "low", label: "נמוך", color: "#10b981" },
];

function priorityColor(p: TaskPriority) {
  return PRIORITIES.find((x) => x.value === p)?.color ?? "#6b7280";
}

function contextColor(c: TaskContext | null | undefined) {
  if (!c) return "#6b7280";
  return CONTEXTS.find((x) => x.value === c)?.color ?? "#6b7280";
}

// ─── Quick Add ────────────────────────────────────────────────────────────────

function QuickAdd({ gtdStatus }: { gtdStatus: GtdStatus }) {
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [create] = useCreate();
  const { identity } = useGetIdentity();
  const notify = useNotify();
  const queryClient = useQueryClient();

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    create(
      "tasks",
      {
        data: {
          text: trimmed,
          gtd_status: gtdStatus,
          priority: "medium",
          type: "Todo",
          due_date: new Date().toISOString().slice(0, 10),
          member_id: identity?.id,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["tasks"] });
          setText("");
          notify("המשימה נוספה", { type: "success" });
          inputRef.current?.focus();
        },
      }
    );
  };

  return (
    <div className="flex gap-2">
      <Input
        ref={inputRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleSubmit();
          }
        }}
        placeholder="משימה חדשה..."
        className="text-sm"
        dir="rtl"
      />
      <Button
        size="sm"
        variant="ghost"
        className="shrink-0 cursor-pointer"
        onClick={handleSubmit}
        disabled={!text.trim()}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}

// ─── Task Edit Dialog ─────────────────────────────────────────────────────────

function TaskEditDialog({
  task,
  open,
  onClose,
}: {
  task: Task;
  open: boolean;
  onClose: () => void;
}) {
  const [update] = useUpdate();
  const notify = useNotify();
  const queryClient = useQueryClient();
  const [text, setText] = useState(task.text);
  const [priority, setPriority] = useState(task.priority);
  const [context, setContext] = useState<TaskContext | "">(task.context ?? "");
  const [gtdStatus, setGtdStatus] = useState(task.gtd_status);
  const [dueDate, setDueDate] = useState(task.due_date?.slice(0, 10) ?? "");
  const [waitingFor, setWaitingFor] = useState(task.waiting_for_person ?? "");

  useEffect(() => {
    setText(task.text);
    setPriority(task.priority);
    setContext(task.context ?? "");
    setGtdStatus(task.gtd_status);
    setDueDate(task.due_date?.slice(0, 10) ?? "");
    setWaitingFor(task.waiting_for_person ?? "");
  }, [task]);

  const handleSave = () => {
    update(
      "tasks",
      {
        id: task.id,
        data: {
          text,
          priority,
          context: context || null,
          gtd_status: gtdStatus,
          due_date: dueDate || new Date().toISOString().slice(0, 10),
          waiting_for_person: waitingFor || null,
        },
        previousData: task,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["tasks"] });
          notify("המשימה עודכנה", { type: "success" });
          onClose();
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle>עריכת משימה</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="תיאור המשימה"
            className="text-sm"
            dir="rtl"
          />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">סטטוס GTD</label>
              <select
                value={gtdStatus}
                onChange={(e) => setGtdStatus(e.target.value as GtdStatus)}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              >
                {GTD_SECTIONS.map((s) => (
                  <option key={s.status} value={s.status}>
                    {s.labelHe}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">עדיפות</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              >
                {PRIORITIES.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">הקשר</label>
              <select
                value={context}
                onChange={(e) => setContext(e.target.value as TaskContext | "")}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              >
                <option value="">ללא</option>
                {CONTEXTS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">תאריך יעד</label>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="text-sm"
              />
            </div>
          </div>
          {gtdStatus === "waiting_for" && (
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">ממתין ל...</label>
              <Input
                value={waitingFor}
                onChange={(e) => setWaitingFor(e.target.value)}
                placeholder="שם האדם"
                className="text-sm"
                dir="rtl"
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="cursor-pointer">
            ביטול
          </Button>
          <Button onClick={handleSave} className="cursor-pointer">
            שמור
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Single Task Row ──────────────────────────────────────────────────────────

function GtdTaskRow({ task }: { task: Task }) {
  const [update] = useUpdate();
  const [deleteOne] = useDelete();
  const notify = useNotify();
  const queryClient = useQueryClient();
  const [editOpen, setEditOpen] = useState(false);

  const invalidateTasks = () => queryClient.invalidateQueries({ queryKey: ["tasks"] });

  const handleDone = () => {
    update(
      "tasks",
      {
        id: task.id,
        data: {
          done_date: task.done_date ? null : new Date().toISOString(),
          gtd_status: task.done_date ? task.gtd_status : "done",
        },
        previousData: task,
      },
      { onSuccess: invalidateTasks }
    );
  };

  const handleDelete = () => {
    deleteOne(
      "tasks",
      { id: task.id, previousData: task },
      {
        onSuccess: () => {
          invalidateTasks();
          notify("המשימה נמחקה", { type: "success", undoable: true });
        },
        undoable: true,
      }
    );
  };

  const moveTo = (status: GtdStatus) => {
    update(
      "tasks",
      {
        id: task.id,
        data: { gtd_status: status },
        previousData: task,
      },
      { onSuccess: invalidateTasks }
    );
  };

  return (
    <>
      <div className="group flex items-start gap-2 rounded-lg border bg-card px-3 py-2.5 hover:bg-accent/30 transition-colors">
        <Checkbox
          checked={!!task.done_date}
          onCheckedChange={handleDone}
          className="mt-0.5 cursor-pointer"
        />
        <div className="flex-1 min-w-0">
          <div className={cn("text-sm", task.done_date && "line-through text-muted-foreground")}>
            {task.text}
          </div>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            {task.priority && task.priority !== "medium" && (
              <span
                className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
                style={{
                  color: priorityColor(task.priority),
                  backgroundColor: `${priorityColor(task.priority)}20`,
                }}
              >
                {PRIORITIES.find((p) => p.value === task.priority)?.label}
              </span>
            )}
            {task.context && (
              <span
                className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
                style={{
                  color: contextColor(task.context),
                  backgroundColor: `${contextColor(task.context)}20`,
                }}
              >
                {task.context}
              </span>
            )}
            {task.waiting_for_person && (
              <span className="text-[10px] text-muted-foreground">
                ממתין ל: {task.waiting_for_person}
              </span>
            )}
            {task.due_date && task.gtd_status !== "inbox" && (
              <span className="text-[10px] text-muted-foreground">
                {new Date(task.due_date).toLocaleDateString("he-IL", {
                  day: "numeric",
                  month: "short",
                })}
              </span>
            )}
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shrink-0"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" dir="rtl">
            <DropdownMenuItem onClick={() => setEditOpen(true)} className="cursor-pointer gap-2">
              <Pencil className="h-3.5 w-3.5" /> עריכה
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {GTD_SECTIONS.filter((s) => s.status !== task.gtd_status).map((s) => (
              <DropdownMenuItem
                key={s.status}
                onClick={() => moveTo(s.status)}
                className="cursor-pointer gap-2"
              >
                <ArrowUpDown className="h-3.5 w-3.5" />
                העבר ל{s.labelHe}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleDelete} className="cursor-pointer gap-2 text-destructive">
              <Trash2 className="h-3.5 w-3.5" /> מחק
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <TaskEditDialog task={task} open={editOpen} onClose={() => setEditOpen(false)} />
    </>
  );
}

// ─── GTD Section ──────────────────────────────────────────────────────────────

function GtdSection({
  status,
  label,
  labelHe,
  icon: Icon,
  color,
  tasks,
  showQuickAdd,
}: {
  status: GtdStatus;
  label: string;
  labelHe: string;
  icon: typeof Inbox;
  color: string;
  tasks: Task[];
  showQuickAdd?: boolean;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div>
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center gap-2 w-full mb-2 cursor-pointer group"
      >
        <Icon className="h-5 w-5 shrink-0" style={{ color }} />
        <span className="text-sm font-semibold">{labelHe}</span>
        <span
          className="text-xs font-medium px-2 py-0.5 rounded-full"
          style={{ color, backgroundColor: `${color}20` }}
        >
          {tasks.length}
        </span>
        <span className="text-xs text-muted-foreground mr-1">{label}</span>
        <div className="flex-1" />
        <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
          {collapsed ? "▸" : "▾"}
        </span>
      </button>

      {!collapsed && (
        <div className="space-y-1.5 mr-7">
          {showQuickAdd && <QuickAdd gtdStatus={status} />}
          {tasks.length === 0 && !showQuickAdd && (
            <p className="text-xs text-muted-foreground py-2">אין משימות</p>
          )}
          {tasks.map((task) => (
            <GtdTaskRow key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Stats Bar ────────────────────────────────────────────────────────────────

function StatsBar({ tasks }: { tasks: Task[] }) {
  return (
    <div className="flex gap-3 flex-wrap">
      {GTD_SECTIONS.map((section) => {
        const count = tasks.filter((t) => t.gtd_status === section.status && !t.done_date).length;
        return (
          <div
            key={section.status}
            className="flex items-center gap-2 rounded-lg border px-3 py-2"
          >
            <section.icon className="h-4 w-4" style={{ color: section.color }} />
            <span className="text-lg font-bold" style={{ color: section.color }}>
              {count}
            </span>
            <span className="text-xs text-muted-foreground">{section.labelHe}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Task Card (shared by Kanban + Timeline) ─────────────────────────────────

function TaskCard({
  task,
  onEdit,
  onDone,
}: {
  task: Task;
  onEdit: (task: Task) => void;
  onDone: (task: Task) => void;
}) {
  return (
    <div
      className="group rounded-lg border bg-card px-3 py-2.5 hover:border-accent transition-colors cursor-pointer"
      onClick={() => onEdit(task)}
    >
      <div className="flex items-start gap-2">
        <Checkbox
          checked={!!task.done_date}
          onCheckedChange={() => onDone(task)}
          className="mt-0.5 cursor-pointer shrink-0"
          onClick={(e) => e.stopPropagation()}
        />
        <div className="flex-1 min-w-0">
          <div
            className={cn(
              "text-sm line-clamp-2",
              task.done_date && "line-through text-muted-foreground"
            )}
          >
            {task.text}
          </div>
          <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
            {task.priority && task.priority !== "medium" && (
              <span
                className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
                style={{
                  color: priorityColor(task.priority),
                  backgroundColor: `${priorityColor(task.priority)}20`,
                }}
              >
                {PRIORITIES.find((p) => p.value === task.priority)?.label}
              </span>
            )}
            {task.context && (
              <span
                className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
                style={{
                  color: contextColor(task.context),
                  backgroundColor: `${contextColor(task.context)}20`,
                }}
              >
                {task.context}
              </span>
            )}
            {task.waiting_for_person && (
              <span className="text-[10px] text-muted-foreground">
                ממתין ל: {task.waiting_for_person}
              </span>
            )}
            {task.due_date && (
              <span className="text-[10px] text-muted-foreground">
                {new Date(task.due_date).toLocaleDateString("he-IL", {
                  day: "numeric",
                  month: "short",
                })}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Date helpers ─────────────────────────────────────────────────────────────

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfToday() {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d;
}

function endOfWeek() {
  const d = endOfToday();
  const day = d.getDay(); // 0=Sun
  const daysUntilSat = day === 6 ? 0 : 6 - day;
  d.setDate(d.getDate() + daysUntilSat);
  return d;
}

type DateFilter = "all" | "today" | "thisweek";

function matchesDateFilter(task: Task, dateFilter: DateFilter): boolean {
  if (dateFilter === "all") return true;
  if (!task.due_date) return false;
  const taskDate = new Date(task.due_date);
  if (dateFilter === "today") {
    return taskDate >= startOfToday() && taskDate <= endOfToday();
  }
  if (dateFilter === "thisweek") {
    return taskDate >= startOfToday() && taskDate <= endOfWeek();
  }
  return true;
}

// ─── Filters Row ──────────────────────────────────────────────────────────────

function FiltersRow({
  contextFilter,
  onContextChange,
  dateFilter,
  onDateChange,
}: {
  contextFilter: string;
  onContextChange: (v: string) => void;
  dateFilter: DateFilter;
  onDateChange: (v: DateFilter) => void;
}) {
  return (
    <div className="flex gap-1.5 flex-wrap items-center">
      {/* Context filters */}
      <Button
        size="sm"
        variant={contextFilter === "all" ? "default" : "outline"}
        className="h-7 text-xs cursor-pointer"
        onClick={() => onContextChange("all")}
      >
        הכל
      </Button>
      {CONTEXTS.map((c) => (
        <Button
          key={c.value}
          size="sm"
          variant={contextFilter === c.value ? "default" : "outline"}
          className="h-7 text-xs cursor-pointer"
          onClick={() => onContextChange(c.value)}
        >
          {c.label}
        </Button>
      ))}

      {/* Separator */}
      <span className="mx-1 text-border">|</span>

      {/* Date filters */}
      <Button
        size="sm"
        variant={dateFilter === "today" ? "default" : "outline"}
        className="h-7 text-xs cursor-pointer"
        onClick={() => onDateChange(dateFilter === "today" ? "all" : "today")}
      >
        היום
      </Button>
      <Button
        size="sm"
        variant={dateFilter === "thisweek" ? "default" : "outline"}
        className="h-7 text-xs cursor-pointer"
        onClick={() => onDateChange(dateFilter === "thisweek" ? "all" : "thisweek")}
      >
        השבוע
      </Button>
      <Button
        size="sm"
        variant={dateFilter === "all" ? "default" : "outline"}
        className="h-7 text-xs cursor-pointer"
        onClick={() => onDateChange("all")}
      >
        כל התאריכים
      </Button>
    </div>
  );
}

// ─── StrictMode-safe Droppable wrapper ────────────────────────────────────────

function StrictModeDroppable(props: React.ComponentProps<typeof Droppable>) {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));
    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);
  if (!enabled) return null;
  return <Droppable {...props} />;
}

// ─── Kanban View ──────────────────────────────────────────────────────────────

function KanbanView({ tasks }: { tasks: Task[] }) {
  const [update] = useUpdate();
  const queryClient = useQueryClient();
  const [editTask, setEditTask] = useState<Task | null>(null);
  const invalidateTasks = () =>
    queryClient.invalidateQueries({ queryKey: ["tasks"] });

  const handleDone = (task: Task) => {
    update(
      "tasks",
      {
        id: task.id,
        data: {
          done_date: task.done_date ? null : new Date().toISOString(),
          gtd_status: task.done_date ? task.gtd_status : "done",
        },
        previousData: task,
      },
      { onSuccess: invalidateTasks }
    );
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const newStatus = result.destination.droppableId as GtdStatus;
    const taskId = result.draggableId;
    const task = tasks.find((t) => String(t.id) === taskId);
    if (!task || task.gtd_status === newStatus) return;
    update(
      "tasks",
      {
        id: task.id,
        data: { gtd_status: newStatus },
        previousData: task,
      },
      { onSuccess: invalidateTasks }
    );
  };

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div
          className="flex gap-3 overflow-x-auto pb-4"
          style={{ minHeight: 400 }}
        >
          {GTD_SECTIONS.map((section) => {
            const colTasks = tasks.filter(
              (t) => t.gtd_status === section.status
            );
            return (
              <StrictModeDroppable droppableId={section.status} key={section.status}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={cn(
                      "flex-1 min-w-[220px] max-w-[280px] rounded-xl border bg-muted/30 p-3 flex flex-col",
                      snapshot.isDraggingOver && "bg-accent/20"
                    )}
                  >
                    <div className="flex items-center gap-2 mb-3 px-1">
                      <section.icon
                        className="h-4 w-4 shrink-0"
                        style={{ color: section.color }}
                      />
                      <span className="text-sm font-semibold truncate">
                        {section.labelHe}
                      </span>
                      <span
                        className="text-xs font-medium px-1.5 py-0.5 rounded-full"
                        style={{
                          color: section.color,
                          backgroundColor: `${section.color}20`,
                        }}
                      >
                        {colTasks.length}
                      </span>
                    </div>
                    {section.status === "inbox" && (
                      <div className="mb-2">
                        <QuickAdd gtdStatus="inbox" />
                      </div>
                    )}
                    <div className="flex-1 space-y-2 overflow-y-auto max-h-[60vh]">
                      {colTasks.map((task, index) => (
                        <Draggable
                          key={String(task.id)}
                          draggableId={String(task.id)}
                          index={index}
                        >
                          {(dragProvided, dragSnapshot) => (
                            <div
                              ref={dragProvided.innerRef}
                              {...dragProvided.draggableProps}
                              {...dragProvided.dragHandleProps}
                              className={cn(
                                dragSnapshot.isDragging && "opacity-80"
                              )}
                            >
                              <TaskCard
                                task={task}
                                onEdit={setEditTask}
                                onDone={handleDone}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </StrictModeDroppable>
            );
          })}
        </div>
      </DragDropContext>
      {editTask && (
        <TaskEditDialog
          task={editTask}
          open={!!editTask}
          onClose={() => setEditTask(null)}
        />
      )}
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

type ViewMode = "gtd" | "kanban";

export function GtdTasksPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("gtd");
  const [contextFilter, setContextFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const { data: allTasks, isLoading } = useGetList<Task>("tasks", {
    pagination: { page: 1, perPage: 500 },
    sort: { field: "id", order: "ASC" },
    filter: { "done_date@is": null },
  });

  const tasks = (allTasks ?? []).filter((t) => {
    if (contextFilter !== "all" && t.context !== contextFilter) return false;
    if (!matchesDateFilter(t, dateFilter)) return false;
    return true;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-sm text-muted-foreground">טוען...</div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-6 mt-1",
        viewMode === "kanban" ? "max-w-6xl" : "max-w-3xl"
      )}
      dir="rtl"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Inbox className="h-6 w-6 text-[#3b82f6]" />
          <div>
            <h1 className="text-xl font-semibold">משימות GTD</h1>
            <p className="text-sm text-muted-foreground">Getting Things Done</p>
          </div>
        </div>
        <ToggleGroup
          type="single"
          value={viewMode}
          onValueChange={(v) => v && setViewMode(v as ViewMode)}
          size="sm"
          variant="outline"
        >
          <ToggleGroupItem value="gtd" className="gap-1.5 text-xs cursor-pointer">
            <List className="h-3.5 w-3.5" /> GTD
          </ToggleGroupItem>
          <ToggleGroupItem value="kanban" className="gap-1.5 text-xs cursor-pointer">
            <Columns3 className="h-3.5 w-3.5" /> קנבן
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Stats */}
      <StatsBar tasks={allTasks ?? []} />

      {/* Filters */}
      <FiltersRow
        contextFilter={contextFilter}
        onContextChange={setContextFilter}
        dateFilter={dateFilter}
        onDateChange={setDateFilter}
      />

      {/* Views */}
      {viewMode === "gtd" && (
        <div className="space-y-6">
          {GTD_SECTIONS.map((section) => {
            const sectionTasks = tasks.filter((t) => t.gtd_status === section.status);
            return (
              <GtdSection
                key={section.status}
                {...section}
                tasks={sectionTasks}
                showQuickAdd={section.status === "inbox"}
              />
            );
          })}
        </div>
      )}
      {viewMode === "kanban" && <KanbanView tasks={tasks} />}
    </div>
  );
}

GtdTasksPage.path = "/tasks-gtd";
