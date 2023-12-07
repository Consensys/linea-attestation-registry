import { IButtonsProps } from "./interface";

export const ButtonOutlined: React.FC<IButtonsProps> = ({ name, handler }) => {
  return (
    <button
      onClick={handler}
      className="h-12 px-4 py-3 rounded-md border border-zinc-200 justify-center items-center gap-2 inline-flex text-zinc-950 text-base font-semibold hover:border-slate-500 disabled:opacity-40"
    >
      {name}
    </button>
  );
};
