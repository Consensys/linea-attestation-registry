export const displayAmountWithComma = (str: string | number): string =>
  Number(str)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
