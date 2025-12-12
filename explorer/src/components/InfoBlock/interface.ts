import { ReactElement } from "react";

import { IButtonsProps } from "../Buttons/interface";

export interface IInfoBlockProps {
  icon: ReactElement;
  message: string | ReactElement;
  button?: IButtonsProps;
  buttonComponent?: ReactElement;
}
