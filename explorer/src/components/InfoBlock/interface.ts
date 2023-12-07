import { IButtonsProps } from "../Buttons/interface";

export interface IInfoBlockProps {
  icon: JSX.Element;
  message: string;
  button?: IButtonsProps;
  buttonComponent?: JSX.Element;
}
