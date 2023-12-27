import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { EMPTY_STRING } from "@/constants";
import useWindowDimensions from "@/hooks/useWindowDimensions";

interface ListItemWithSubmenuProps {
  name: string;
  submenu: JSX.Element;
}

export const ListItemWithSubmenu: React.FC<ListItemWithSubmenuProps> = ({ name, submenu }) => {
  const screen = useWindowDimensions();
  const [showSubmenu, setShowSubmenu] = useState<boolean>(false);
  const isAdaptive = !screen.xl;

  return (
    <div
      onMouseEnter={() => setShowSubmenu(true)}
      onMouseLeave={() => setShowSubmenu(false)}
      className="relative flex self-stretch flex-col gap-2 xl:gap-0 xl:flex-row"
    >
      <div
        className={`flex gap-1 items-center text-text-tertiary text-xl xl:text-base font-medium dark:text-tertiary ${
          showSubmenu ? "cursor-pointer !text-text-primary dark:!text-whiteDefault" : EMPTY_STRING
        }`}
      >
        {name}
        {!isAdaptive && <ChevronDown width={16} height={16} />}
      </div>
      {(isAdaptive || showSubmenu) && submenu}
    </div>
  );
};
