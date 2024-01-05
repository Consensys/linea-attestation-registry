export const displayAmountWithComma = (str: string | number): string =>
  Number(str)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export const randomNumber = (min: number, max: number) => Math.floor(Math.random() * (max - min) + min);
