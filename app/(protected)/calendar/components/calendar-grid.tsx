"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  description?: string;
  date: string;
  location?: string;
  start?: string;
  end?: string;
}

interface CalendarGridProps {
  currentDate: Date;
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  events: Record<string, CalendarEvent[]>;
  onSelectEvent: (event: CalendarEvent) => void;
}

export function CalendarGrid({
  currentDate,
  selectedDate,
  onSelectDate,
  events,
  onSelectEvent,
}: CalendarGridProps) {
  const formatDateKey = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Helper to get days in month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    return { days, firstDay };
  };

  const { days, firstDay } = getDaysInMonth(currentDate);

  const daysArray: (number | null)[] = [
    ...Array.from({ length: firstDay }, () => null),
    ...Array.from({ length: days }, (_, i) => i + 1),
  ];

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const selectedDateKey = selectedDate ? formatDateKey(selectedDate) : "";

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Day Header Row */}
      <div className="px-6 pt-4 pb-2 bg-card border-b border-border grid grid-cols-7 gap-2 z-10 shrink-0">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-semibold tracking-wider text-muted-foreground uppercase py-1"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Scrollable Grid Cells */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-6">
          <div className="grid grid-cols-7 gap-2">
            {daysArray.map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} className="p-4"></div>;
              }

              const cellDate = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                day
              );
              const cellDateKey = formatDateKey(cellDate);
              const isSelected = selectedDateKey === cellDateKey;
              const isToday =
                formatDateKey(new Date()) === cellDateKey;

              const dayEvents = events[cellDateKey] || [];

              return (
                <div
                  key={`day-${day}`}
                  className={`h-32 p-2 border rounded-lg transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-border hover:border-primary/40 hover:bg-accent"
                  }`}
                  onClick={() => onSelectDate(cellDate)}
                >
                  <div className="flex justify-end">
                    <span
                      className={`text-sm font-medium flex items-center justify-center ${
                        isToday
                          ? "bg-primary text-primary-foreground rounded-full size-6"
                          : isSelected
                          ? "text-primary"
                          : "text-foreground"
                      }`}
                    >
                      {day}
                    </span>
                  </div>
                  
                  {/* Event indicators in grid cells */}
                  <div className="flex-1 mt-1 flex flex-col gap-1 overflow-hidden">
                    {dayEvents.slice(0, 2).map((event) => (
                      <Badge
                        key={event.id}
                        variant="secondary"
                        className="w-full justify-start text-[10px] px-1.5 py-0.5 font-medium truncate cursor-pointer hover:bg-secondary/80 transition-colors"
                        title={`${event.time} - ${event.title}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectDate(cellDate);
                          onSelectEvent(event);
                        }}
                      >
                        {event.title}
                      </Badge>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-[9px] text-muted-foreground pl-1">
                        + {dayEvents.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
