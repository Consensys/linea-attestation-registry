import { PropsWithChildren, useEffect, useState } from "react";
import { useTernaryDarkMode } from "usehooks-ts";

import { BurgerMenu } from "@/components/BurgerMenu";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export const Layout: React.FC<PropsWithChildren> = ({ children }): JSX.Element => {
  const { isDarkMode } = useTernaryDarkMode();
  const [isBurgerOpened, setIsBurgerOpened] = useState<boolean>(false);

  useEffect(() => {
    isDarkMode ? document.documentElement.classList.add("dark") : document.documentElement.classList.remove("dark");
  }, [isDarkMode]);

  return (
    <div className="flex min-h-screen flex-col relative">
      <BurgerMenu isOpened={isBurgerOpened} setIsOpened={setIsBurgerOpened} />
      <Header isOpened={isBurgerOpened} setIsOpened={setIsBurgerOpened} />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
};
