import { EButtonType } from "./enum";
import { IButtonsProps } from "./interface";
import { getButtonExtraClassName } from "./utils";

export const Button: React.FC<IButtonsProps> = ({
  name,
  handler,
  buttonType,
  disabled = false,
  iconLeft,
  iconRight,
  height = "h-12",
}) => {
  return (
    <button
      onClick={handler}
      disabled={disabled}
      className={`${height} ${
        buttonType === EButtonType.TRANSPARENT
          ? "px-0 py-0 rounded-none border-b border-transparent hover:border-blackDefault"
          : "px-4 py-3"
      } flex justify-center items-center gap-2 rounded-md disabled:opacity-40 font-semibold 
      ${getButtonExtraClassName(buttonType)}`}
    >
      {iconLeft && iconLeft}
      {name}
      {iconRight && iconRight}
    </button>
  );
};
