import { IButtonsProps } from "./interface";

export const ButtonOutlined: React.FC<IButtonsProps> = ({ name, handler, disabled = false }) => {
  return (
    <button
      onClick={handler}
      disabled={disabled}
      className="h-12 px-4 py-3 rounded-md border border-button-outlined-border justify-center items-center gap-2 inline-flex text-button-outlined-text text-base font-semibold hover:border-button-outlined-borderHover disabled:opacity-40"
    >
      {name}
    </button>
  );
};
