import { EButtonType } from "./enum";

export interface IButtonsProps {
  name: string;
  handler(): void;
  buttonType: EButtonType;
  disabled?: boolean;
  iconLeft?: JSX.Element;
  iconRight?: JSX.Element;
  height?: string;
  className?: string;
  isSmall?: boolean;
}
