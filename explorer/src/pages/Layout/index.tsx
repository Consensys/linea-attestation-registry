import { PropsWithChildren, useState } from "react";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BurgerMenu } from "@/components/BurgerMenu";

export const Layout: React.FC<PropsWithChildren> = ({ children }): JSX.Element => {
  const [isBurgerOpened, setIsBurgerOpened] = useState<boolean>(false);
  return (
    <div className="flex min-h-screen flex-col relative">
      <BurgerMenu isOpened={isBurgerOpened} setIsOpened={setIsBurgerOpened} />
      <Header isOpened={isBurgerOpened} setIsOpened={setIsBurgerOpened} />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
};
