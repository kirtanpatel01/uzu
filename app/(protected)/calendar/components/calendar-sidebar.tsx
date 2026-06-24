"use client";

import React from "react";
import { Plus, Clock, MapPin, AlignLeft, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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

interface CalendarSidebarProps {
  selectedDate: Date | null;
  events: CalendarEvent[];
  onAddEventClick: () => void;
  selectedEvent: CalendarEvent | null;
  onSelectEvent: (event: CalendarEvent | null) => void;
}

const renderTextWithLinks = (text: string) => {
  if (!text) return null;
  const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;
  const parts = text.split(urlRegex);

  return parts.map((part, index) => {
    if (part.match(urlRegex)) {
      const href = part.startsWith("http") ? part : `https://${part}`;
      return (
        <a
          key={index}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline font-medium hover:text-primary/80 transition-colors break-all"
        >
          {part}
        </a>
      );
    }
    return part;
  });
};

export function CalendarSidebar({
  selectedDate,
  events,
  onAddEventClick,
  selectedEvent,
  onSelectEvent,
}: CalendarSidebarProps) {
  if (selectedEvent) {
    return (
      <aside className="w-80 border-l border-border bg-card hidden md:flex flex-col h-full shrink-0">
        <div className="px-4 py-3 border-b border-border flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onSelectEvent(null)}
            title="Back to list"
          >
            <ArrowLeft className="size-4" />
          </Button>
          <span className="text-sm font-medium text-muted-foreground">Event Details</span>
        </div>
        <ScrollArea className="flex-1 min-h-0">
          <div className="p-4 space-y-4">
            <div>
              <h3 className="text-base font-semibold text-foreground tracking-tight leading-snug">
                {selectedEvent.title}
              </h3>
            </div>

            <Separator />

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-2.5 text-muted-foreground">
                <Clock className="size-4 mt-0.5 shrink-0" />
                <div className="space-y-0.5">
                  <p className="font-medium text-foreground">{selectedEvent.time}</p>
                  <p className="text-[10px]">
                    {new Date(selectedEvent.start || selectedEvent.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              {selectedEvent.location && (
                <div className="flex items-start gap-2.5 text-muted-foreground">
                  <MapPin className="size-4 mt-0.5 shrink-0" />
                  <span className="text-foreground">{renderTextWithLinks(selectedEvent.location)}</span>
                </div>
              )}

              {selectedEvent.description && (
                <div className="flex items-start gap-2.5 text-muted-foreground">
                  <AlignLeft className="size-4 mt-0.5 shrink-0" />
                  <div className="space-y-1 flex-1">
                    <span className="text-[10px] font-semibold text-foreground uppercase tracking-wider block">
                      Description
                    </span>
                    <p className="text-muted-foreground text-xs leading-relaxed whitespace-pre-wrap">
                      {renderTextWithLinks(selectedEvent.description)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </aside>
    );
  }

  return (
    <aside className="w-80 border-l border-border bg-card hidden md:flex flex-col h-full shrink-0">
      <div className="px-4 py-3 border-b border-border">
        <h3 className="font-semibold text-foreground">
          {selectedDate?.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </h3>
      </div>
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-4 flex flex-col gap-3">
          {events.length > 0 ? (
            events.map((event) => (
              <Card
                key={event.id}
                size="sm"
                className="bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors border border-border"
                onClick={() => onSelectEvent(event)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <CardTitle className="text-sm font-medium">{event.title}</CardTitle>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1 whitespace-nowrap bg-muted px-1.5 py-0.5 rounded border border-border">
                      <Clock className="size-3 text-muted-foreground" />
                      {event.time}
                    </span>
                  </div>
                  {event.description && (
                    <CardDescription className="text-xs mt-1.5 text-muted-foreground leading-relaxed line-clamp-2">
                      {event.description}
                    </CardDescription>
                  )}
                </CardHeader>
              </Card>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-border rounded-lg p-4 bg-muted/10">
              <span className="text-sm text-muted-foreground">No events scheduled</span>
            </div>
          )}

          <Separator className="my-2" />

          <Button
            variant="outline"
            className="w-full"
            onClick={onAddEventClick}
          >
            <Plus data-icon="inline-start" />
            Add Event
          </Button>
        </div>
      </ScrollArea>
    </aside>
  );
}
