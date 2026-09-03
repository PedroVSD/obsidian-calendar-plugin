import type { Moment } from "moment";
import type { ICalendarSource, IDayMetadata } from "obsidian-calendar-ui";
import { get } from "svelte/store";

import { selectedDate } from "../stores";

export const selectedDateSource: ICalendarSource = {
  getDailyMetadata: async (date: Moment): Promise<IDayMetadata> => {
    const sel = get(selectedDate);
    // se null, considera hoje como selecionado para feedback inicial
    const selStr = sel ?? window.moment().format("YYYY-MM-DD");
    const dateStr = date.format("YYYY-MM-DD");
    if (selStr === dateStr) {
      return {
        classes: ["agenda-selected"],
        dots: [],
      };
    }
    return { classes: [], dots: [] };
  },
  getWeeklyMetadata: async (): Promise<IDayMetadata> => {
    return { classes: [], dots: [] };
  },
};
