import { IButtonsProps } from "../Buttons/interface";

export interface IInfoBlockProps {
  icon: JSX.Element;
  message: string | JSX.Element;
  button?: IButtonsProps;
  buttonComponent?: JSX.Element;
}
