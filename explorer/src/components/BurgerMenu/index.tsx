import { Dispatch, SetStateAction, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { slideBurgerMenuAnimation } from "@/constants/theme/animation";

import { NavigationList } from "../NavigationList";
import useWindowDimensions from "@/hooks/useWindowDimensions";

export const BurgerMenu: React.FC<{ isOpened: boolean; setIsOpened: Dispatch<SetStateAction<boolean>> }> = ({
  isOpened,
  setIsOpened,
}) => {
  const screen = useWindowDimensions();

  useEffect(() => {
    if (screen.xl || screen.lg) setIsOpened(false);
  }, [screen.xl, screen.lg, setIsOpened]);

  return (
    <AnimatePresence>
      {isOpened && (
        <motion.div
          initial="close"
          animate="open"
          variants={slideBurgerMenuAnimation}
          exit="close"
          className="bg-surface-secondary absolute min-h-screen w-full z-[100]"
        >
          <NavigationList setIsOpened={setIsOpened} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
