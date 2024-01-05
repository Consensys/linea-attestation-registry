import { IInfoBlockProps } from "./interface";
import { Button } from "../Buttons";
import { EButtonType } from "../Buttons/enum";

export const InfoBlock: React.FC<IInfoBlockProps> = ({ message, button, buttonComponent, icon }) => {
  return (
    <div className="h-[27.625rem] md:h-[40.875rem] flex flex-col items-center justify-center gap-6 w-full text-text-darkGrey dark:text-tertiary">
      {icon}
      <div className="text-base font-normal">{message}</div>
      {button && <Button name={button.name} handler={button.handler} buttonType={EButtonType.OUTLINED} />}
      {buttonComponent && buttonComponent}
    </div>
  );
};
