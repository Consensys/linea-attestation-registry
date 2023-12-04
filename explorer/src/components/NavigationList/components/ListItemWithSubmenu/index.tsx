import { useState } from "react";
import { ChevronDown } from "lucide-react";

import useWindowDimensions from "@/hooks/useWindowDimensions";
import { EMPTY_STRING } from "@/constants";

interface ListItemWithSubmenuProps {
  name: string;
  submenu: JSX.Element;
}

export const ListItemWithSubmenu: React.FC<ListItemWithSubmenuProps> = ({ name, submenu }) => {
  const screen = useWindowDimensions();
  const [showSubmenu, setShowSubmenu] = useState<boolean>(false);
  const isAdaptive = screen.sm || screen.md;

  return (
    <div
      onMouseEnter={() => !isAdaptive && setShowSubmenu(true)}
      onMouseLeave={() => !isAdaptive && setShowSubmenu(false)}
      className="relative flex self-stretch flex-col gap-2 lg:gap-0 lg:flex-row"
    >
      <div
        className={`flex gap-1 items-center text-text-tertiary text-xl lg:text-base font-medium ${
          showSubmenu ? "cursor-pointer underline !text-text-primary" : EMPTY_STRING
        }`}
      >
        {name}
        {!isAdaptive && <ChevronDown width={16} height={16} />}
      </div>
      {(isAdaptive || showSubmenu) && submenu}
    </div>
  );
};
