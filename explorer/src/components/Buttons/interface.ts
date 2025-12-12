import { ReactElement } from "react";

import { EButtonType } from "./enum";

export interface IButtonsProps {
  name: string;
  handler(): void;
  buttonType: EButtonType;
  disabled?: boolean;
  iconLeft?: ReactElement;
  iconRight?: ReactElement;
  height?: string;
  className?: string;
  isSmall?: boolean;
}
