import { TEN, THOUSAND, ZERO_STRING } from "@/constants";
import { ParseDateTimeProps } from "@/interfaces/date";

const formatAmount = (amount: number) => {
  return amount < TEN ? `${ZERO_STRING}${amount}` : amount.toString();
};

export const parseDateTime = (inputDate: string, isSeconds = false): ParseDateTimeProps => {
  const newDate = isSeconds ? Number(inputDate) * THOUSAND : inputDate;

  const date = new Date(newDate);

  return {
    date: date,
    year: date.getUTCFullYear().toString(),
    month: formatAmount(date.getUTCMonth() + 1),
    day: formatAmount(date.getUTCDate()),
    hours: formatAmount(date.getUTCHours()),
    minutes: formatAmount(date.getUTCMinutes()),
    seconds: formatAmount(date.getUTCSeconds()),
    get stringUTC() {
      return `${this.day}/${this.month}/${this.year} ${this.hours}:${this.minutes} UTC`;
    },
  } as const;
};

export const timeElapsed = (seconds: number): string => {
  const now = new Date();
  const secondsElapsed = Math.floor(now.getTime() / 1000) - seconds;

  const minutes = Math.floor(secondsElapsed / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30.44);
  const years = Math.floor(days / 365.25);

  if (years > 0) {
    return years === 1 ? "1 year ago" : `${years} years ago`;
  } else if (months > 0) {
    return months === 1 ? "1 month ago" : `${months} months ago`;
  } else if (days > 0) {
    return days === 1 ? "1 day ago" : `${days} days ago`;
  } else if (hours > 0) {
    return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  } else if (minutes > 0) {
    return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
  } else {
    return secondsElapsed === 1 ? "1 second ago" : `${secondsElapsed} seconds ago`;
  }
};
