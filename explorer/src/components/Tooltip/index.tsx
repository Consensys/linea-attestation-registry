import {
  autoUpdate,
  flip,
  offset,
  shift,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
} from "@floating-ui/react";
import { useState } from "react";

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  placement?: "top" | "bottom" | "left" | "right";
  isDarkMode?: boolean;
  minWidth?: string;
  compact?: boolean;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  placement = "bottom",
  isDarkMode = false,
  minWidth,
  compact = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const { refs, floatingStyles, context } = useFloating({
    open: isVisible,
    onOpenChange: setIsVisible,
    placement: placement,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(5),
      flip({
        fallbackAxisSideDirection: "start",
      }),
      shift(),
    ],
  });

  const hover = useHover(context, { move: false });
  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "tooltip" });

  const { getReferenceProps, getFloatingProps } = useInteractions([hover, focus, dismiss, role]);

  const tooltipStyles = {
    ...floatingStyles,
    zIndex: 1000,
    minWidth: minWidth,
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      ref={refs.setReference}
      {...getReferenceProps()}
    >
      {children}
      {isVisible && (
        <div
          ref={refs.setFloating}
          style={tooltipStyles}
          {...getFloatingProps()}
          className={`${compact ? "p-1" : "p-2"} rounded-md ${
            isDarkMode ? "bg-whiteDefault text-blackDefault" : "bg-blackDefault text-whiteDefault"
          }`}
        >
          {content}
        </div>
      )}
    </div>
  );
};
