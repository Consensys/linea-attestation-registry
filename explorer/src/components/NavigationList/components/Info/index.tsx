import { MoveUpRight } from "lucide-react";
import { useState } from "react";

import { INFO_LIST } from "@/constants/components";
import useWindowDimensions from "@/hooks/useWindowDimensions";
import { IInfoListItem } from "@/interfaces/components";

const DesktopLink: React.FC<IInfoListItem> = ({ title, logo, url }) => {
  const [show, setShow] = useState<boolean>(false);
  const Logo = logo;

  return (
    <a
      key={title}
      href={url}
      target="_blank"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      className="w-52 rounded px-2 py-[10px] flex gap-2 items-center text-text-tertiary dark:text-tertiary hover:bg-jumbotronLight dark:hover:bg-jumbotronDark hover:text-text-primary dark:hover:text-whiteDefault  text-base font-medium transition group"
    >
      <Logo className="group-hover:svg-dark-blue dark:group-hover:svg-white [&>path]:transition [&>rect]:transition [&>g>path]:transition" />
      <span className="flex-1">{title}</span>
      <MoveUpRight width={16} height={16} className={`${show ? "visible" : "invisible"}`} />
    </a>
  );
};

export const Info: React.FC = () => {
  const screen = useWindowDimensions();
  const isAdaptive = !screen.xl;

  return (
    <div className="flex flex-col gap-2 text-sm dark:xl:bg-blackDefault xl:bg-surface-primary xl:absolute xl:border xl: border-border-card dark:border-border-cardDark xl:rounded-xl xl:p-2 xl:-left-[15px] xl:top-[40px] xl:z-10">
      {INFO_LIST.map((items) => {
        if (!isAdaptive) return <DesktopLink key={items.title} {...items} />;
        const Logo = items.logo;

        return (
          <a
            key={items.title}
            href={items.url}
            target="_blank"
            className={`w-fit rounded px-2 py-[10px] ms-4 flex gap-2 items-center text-xl font-medium ${
              isAdaptive
                ? "dark:text-tertiary dark:hover:text-whiteDefault"
                : "text-text-tertiary hover:text-text-primary"
            } group`}
          >
            <Logo className="h-6 w-auto group-hover:svg-dark-blue [&>path]:transition [&>rect]:transition [&>g>path]:transition" />
            <span>{items.title}</span>
          </a>
        );
      })}
    </div>
  );
};
