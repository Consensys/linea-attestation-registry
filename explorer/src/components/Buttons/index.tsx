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
  className,
  isSmall = false,
}) => {
  return (
    <button
      onClick={handler}
      disabled={disabled}
      className={`${isSmall ? "h-11 text-sm button-small" : height} ${
        buttonType === EButtonType.TRANSPARENT
          ? "px-0 py-0 rounded-none border-b border-transparent hover:border-blackDefault dark:text-whiteDefault dark:hover:border-whiteDefault"
          : "px-4 py-3"
      } flex justify-center items-center gap-2 rounded-md disabled:opacity-40 font-semibold 
      transition ${getButtonExtraClassName(buttonType)} ${className}`}
    >
      {iconLeft && iconLeft}
      {name}
      {iconRight && iconRight}
    </button>
  );
};
