import { DASH, ZERO_STRING } from "@/constants";
import { parseDateTime } from "@/utils/dateUtils";

export const createDateListItem = (title: string, date: string | undefined) => ({
  title,
  value: !date || date === ZERO_STRING ? DASH : parseDateTime(date, true).stringUTC,
});
