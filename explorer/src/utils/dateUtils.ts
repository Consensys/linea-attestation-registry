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
