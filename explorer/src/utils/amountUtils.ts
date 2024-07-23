export const displayAmountWithComma = (str: string | number): string =>
  Number(str)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export const randomNumber = (min: number, max: number) => Math.floor(Math.random() * (max - min) + min);

export const formatNumber = (num: number): string => {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return num.toString();
};
