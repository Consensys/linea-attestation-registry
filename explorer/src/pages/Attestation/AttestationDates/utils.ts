import { ZERO_STRING } from "@/constants";
import { parseDateTime } from "@/utils/dateUtils";

export const createDateListItem = (title: string, date: string) => ({
  title,
  value: date === ZERO_STRING ? "-" : parseDateTime(date, true).stringUTC,
});