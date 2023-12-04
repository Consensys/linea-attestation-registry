import { useEffect, useState } from "react";

const MEDIA_WIDTHS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};

interface WindowDimensions {
  sm: boolean;
  md: boolean;
  lg: boolean;
  xl: boolean;
}

const initialDimensions: WindowDimensions = {
  sm: false,
  md: false,
  lg: false,
  xl: false,
};

function getWindowDimensions(): WindowDimensions {
  const { innerWidth: width } = window;
  const dimensions: WindowDimensions = { ...initialDimensions };

  if (width >= MEDIA_WIDTHS.xl) {
    dimensions.xl = true;
  } else if (width >= MEDIA_WIDTHS.lg) {
    dimensions.lg = true;
  } else if (width >= MEDIA_WIDTHS.md) {
    dimensions.md = true;
  } else {
    dimensions.sm = true;
  }

  return dimensions;
}

const useWindowDimensions = () => {
  const [windowDimension, setWindowDimension] = useState<typeof initialDimensions>(getWindowDimensions());

  const handleResize = () => {
    const dimension = getWindowDimensions();
    if (JSON.stringify(dimension) !== JSON.stringify(windowDimension)) setWindowDimension(dimension);
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  });

  return windowDimension;
};

export default useWindowDimensions;
