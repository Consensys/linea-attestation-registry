import { ZERO_STRING, DASH } from '@/constants';
import { parseDateTime } from '@/utils/dateUtils';

export const createDateListItem = (title: string, date: string) => ({
  title,
  value: date === ZERO_STRING ? DASH : parseDateTime(date, true).stringUTC,
});
