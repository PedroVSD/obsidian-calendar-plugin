/**
 * Google Calendar integration — stub para Fase 3
 * Fase MVP: exporta .ics. OAuth fica para v2 com client_id do usuário.
 */

import type { CalendarEvent } from "src/events/types";

export function eventToICS(ev: CalendarEvent): string {
  const dt = `${ev.date.replace(/-/g, "")}T${ev.time.replace(":", "")}00`;
  const uid = `${ev.id}@obsidian-calendar`;
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Obsidian Calendar Plugin//Agenda//PT",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTART:${dt}`,
    `SUMMARY:${escapeICS(ev.title)}`,
    `DESCRIPTION:${escapeICS(ev.description || "")}`,
    ev.location ? `LOCATION:${escapeICS(ev.location)}` : "",
    `COLOR:${ev.color}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .filter(Boolean)
    .join("\r\n");
}

function escapeICS(s: string): string {
  return s.replace(/[,;\\]/g, "\\$&").replace(/\n/g, "\\n");
}

export function downloadICS(ev: CalendarEvent): void {
  const ics = eventToICS(ev);
  const blob = new Blob([ics], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${ev.date}-${ev.title}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}

// TODO v2: OAuth flow
// export async function syncWithGoogle(...) {}
