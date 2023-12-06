import { EMPTY_STRING, TEN, THOUSAND, ZERO_STRING } from "@/constants";
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

export const getTimeAgo = (timestamp: number): string => {
  const inputDateTime = new Date(timestamp * 1000);
  const now = new Date();
  const timeDifference = now.getTime() - inputDateTime.getTime();
  const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));

  if (hoursDifference < 24) {
    return hoursDifference === 0
      ? "Less than an hour ago"
      : `${hoursDifference} hour${hoursDifference === 1 ? EMPTY_STRING : "s"} ago`;
  }

  const dd = String(inputDateTime.getDate()).padStart(2, ZERO_STRING);
  const mm = String(inputDateTime.getMonth() + 1).padStart(2, ZERO_STRING);
  const yyyy = inputDateTime.getFullYear();
  const hours = String(inputDateTime.getHours()).padStart(2, ZERO_STRING);
  const minutes = String(inputDateTime.getMinutes()).padStart(2, ZERO_STRING);

  return `${dd}.${mm}.${yyyy}, ${hours}:${minutes}`;
};
