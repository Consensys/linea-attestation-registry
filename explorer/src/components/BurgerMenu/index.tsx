import { AnimatePresence, motion } from "framer-motion";
import { Dispatch, SetStateAction, useEffect } from "react";

import { slideBurgerMenuAnimation } from "@/constants/theme/animation";
import useWindowDimensions from "@/hooks/useWindowDimensions";

import { LightDarkModeSwitcher } from "../LightDarkModeSwitcher";
import { NavigationList } from "../NavigationList";

export const BurgerMenu: React.FC<{ isOpened: boolean; setIsOpened: Dispatch<SetStateAction<boolean>> }> = ({
  isOpened,
  setIsOpened,
}) => {
  const screen = useWindowDimensions();

  useEffect(() => {
    if (screen.xl) setIsOpened(false);
  }, [screen.xl, setIsOpened]);

  return (
    <AnimatePresence>
      {isOpened && (
        <motion.div
          initial="close"
          animate="open"
          variants={slideBurgerMenuAnimation}
          exit="close"
          className="bg-surface-secondary dark:bg-surface-secondaryDark absolute w-full z-[100] min-h-[100dvh]"
        >
          <NavigationList setIsOpened={setIsOpened} />
          <div className="absolute left-6 md:left-20 bottom-5 md:bottom-8">
            <LightDarkModeSwitcher isMobile />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
