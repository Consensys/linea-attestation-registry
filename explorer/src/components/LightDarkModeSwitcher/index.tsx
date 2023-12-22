import { Moon, Sun, SunMoon } from "lucide-react";
import { useEffect } from "react";
import { useTernaryDarkMode } from "usehooks-ts";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const LightDarkModeSwitcher = () => {
  const { isDarkMode, ternaryDarkMode, setTernaryDarkMode } = useTernaryDarkMode();

  const theme: (typeof ternaryDarkMode)[] = ["light", "dark", "system"];

  const getThemeIcon = (mode: typeof ternaryDarkMode, width = "w-6 ") => {
    switch (mode) {
      case "light":
        return <Sun className={width} />;
      case "dark":
        return <Moon className={width} />;
      case "system":
        return <SunMoon className={width} />;
    }
  };

  useEffect(() => {
    isDarkMode ? document.documentElement.classList.add("dark") : document.documentElement.classList.remove("dark");
  }, [isDarkMode]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="DropdownMenuTrigger select-none p-2 rounded-md outline-none hover:bg-jumbotronLight dark:hover:bg-jumbotronDark justify-start items-center gap-2 inline-flex transition dark:text-whiteDefault">
        {getThemeIcon(ternaryDarkMode)}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex flex-col gap-2 bg-surface-primary dark:bg-blackDefault dark:border-border-cardDark">
        {theme.map((mode) => (
          <DropdownMenuItem
            key={mode}
            className="flex gap-2 focus:bg-jumbotronLight dark:focus:bg-jumbotronDark dark:text-whiteDefault cursor-pointer transition capitalize"
            onClick={() => setTernaryDarkMode(mode)}
          >
            {getThemeIcon(mode, "w-4")}
            {mode}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
