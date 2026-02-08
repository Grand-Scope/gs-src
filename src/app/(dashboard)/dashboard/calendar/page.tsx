"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useSession } from "next-auth/react";
import DashboardLayoutClient from "@/components/layout/DashboardLayoutClient";
import TaskModal from "@/components/tasks/TaskModal";
import { Calendar, dateFnsLocalizer, type Event, type SlotInfo, type View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import type { TaskWithRelations } from "@/types/task";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./calendar.css";

const locales = { "en-US": enUS };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface MilestoneData {
  id: string;
  name: string;
  date: string;
  completed: boolean;
  project: { id: string; name: string };
}

interface CalendarEvent extends Event {
  id: string;
  type: "task" | "milestone";
  priority?: string;
  task?: TaskWithRelations;
  milestone?: MilestoneData;
}

export default function CalendarPage() {
  const { data: session } = useSession();
  const user = session?.user;

  const [tasks, setTasks] = useState<TaskWithRelations[]>([]);
  const [milestones, setMilestones] = useState<MilestoneData[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>("month");
  const [date, setDate] = useState(new Date());

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskWithRelations | null>(null);
  const [defaultDate, setDefaultDate] = useState<string>("");

  const fetchData = useCallback(async () => {
    try {
      const [tasksRes, milestonesRes] = await Promise.all([
        fetch("/api/tasks"),
        fetch("/api/milestones"),
      ]);

      if (tasksRes.ok) {
        const data = await tasksRes.json();
        setTasks(data);
      }
      if (milestonesRes.ok) {
        const data = await milestonesRes.json();
        setMilestones(data);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const events: CalendarEvent[] = useMemo(() => {
    const taskEvents: CalendarEvent[] = tasks
      .filter((t) => t.dueDate || t.startDate)
      .map((t) => ({
        id: t.id,
        title: t.title,
        start: new Date(t.startDate || t.dueDate!),
        end: new Date(t.dueDate || t.startDate!),
        allDay: true,
        type: "task" as const,
        priority: t.priority,
        task: t,
      }));

    const milestoneEvents: CalendarEvent[] = milestones.map((m) => ({
      id: m.id,
      title: `${m.name} (${m.project.name})`,
      start: new Date(m.date),
      end: new Date(m.date),
      allDay: true,
      type: "milestone" as const,
      milestone: m,
    }));

    return [...taskEvents, ...milestoneEvents];
  }, [tasks, milestones]);

  const handleSelectEvent = (event: CalendarEvent) => {
    if (event.type === "task" && event.task) {
      setEditingTask(event.task);
      setDefaultDate("");
      setModalOpen(true);
    }
  };

  const handleSelectSlot = (slotInfo: SlotInfo) => {
    setEditingTask(null);
    setDefaultDate(format(slotInfo.start, "yyyy-MM-dd"));
    setModalOpen(true);
  };

  const eventPropGetter = (event: CalendarEvent) => {
    if (event.type === "milestone") {
      return { className: "event-milestone" };
    }
    const priorityClass = event.priority
      ? `event-priority-${event.priority.toLowerCase()}`
      : "event-priority-medium";
    return { className: priorityClass };
  };

  return (
    <DashboardLayoutClient title="Calendar" user={user || {}}>
      <div className="calendar-page">
        <div className="page-header">
          <div className="page-header-content">
            <h2>Calendar</h2>
            <p>View tasks and milestones across your projects</p>
          </div>
        </div>

        {loading ? (
          <div className="calendar-loading">
            <div className="loader"></div>
            <p>Loading calendar...</p>
          </div>
        ) : (
          <div className="calendar-container">
            <Calendar
              localizer={localizer}
              events={events}
              view={view}
              onView={setView}
              date={date}
              onNavigate={setDate}
              views={["month", "week", "day"]}
              selectable
              onSelectEvent={handleSelectEvent}
              onSelectSlot={handleSelectSlot}
              eventPropGetter={eventPropGetter}
              style={{ height: 700 }}
              popup
            />
          </div>
        )}
      </div>

      <TaskModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={fetchData}
        task={editingTask}
        defaultDate={defaultDate}
      />
    </DashboardLayoutClient>
  );
}
