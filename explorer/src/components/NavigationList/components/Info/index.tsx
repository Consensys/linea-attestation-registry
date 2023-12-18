import { MoveUpRight } from "lucide-react";
import { useState } from "react";

import { INFO_LIST } from "@/constants/components";
import useWindowDimensions from "@/hooks/useWindowDimensions";

const DesktopLink: React.FC<{ title: string; logo: JSX.Element; url: string }> = ({ title, logo, url }) => {
  const [show, setShow] = useState<boolean>(false);
  return (
    <a
      key={title}
      href={url}
      target="_blank"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      className="w-52 rounded px-2 py-[10px] flex gap-2 items-center text-text-tertiary hover:bg-hover-lime20 hover:text-text-primary"
    >
      {logo}
      <span className="flex-1">{title}</span>
      <MoveUpRight width={16} height={16} className={`${show ? "visible" : "invisible"}`} />
    </a>
  );
};

export const Info: React.FC = () => {
  const screen = useWindowDimensions();
  const isAdaptive = !screen.xl;

  return (
    <div className="flex flex-col gap-2 text-sm xl:bg-surface-primary xl:absolute xl:border xl: border-border-card xl:rounded-xl xl:p-2 xl:-left-[15px] xl:top-[40px] xl:z-10">
      {INFO_LIST.map((items) =>
        !isAdaptive ? (
          <DesktopLink key={items.title} {...items} />
        ) : (
          <a
            key={items.title}
            href={items.url}
            target="_blank"
            className="w-fit rounded px-2 py-[10px] ms-4 flex gap-2 items-center text-xl text-text-tertiary hover:underline hover:text-text-primary"
          >
            {items.logo}
            <span>{items.title}</span>
          </a>
        ),
      )}
    </div>
  );
};
