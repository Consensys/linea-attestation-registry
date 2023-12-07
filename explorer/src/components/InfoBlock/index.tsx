import { IInfoBlockProps } from "./interface";
import { ButtonOutlined } from "../Buttons";

export const InfoBlock: React.FC<IInfoBlockProps> = ({ message, button, buttonComponent, icon }) => {
  return (
    <div className="h-[27.625rem] md:h-[40.875rem] flex flex-col items-center justify-center gap-6">
      {icon}
      <div className="text-slate-500 text-base font-normal">{message}</div>
      {button && <ButtonOutlined name={button.name} handler={button.handler} />}
      {buttonComponent && buttonComponent}
    </div>
  );
};
