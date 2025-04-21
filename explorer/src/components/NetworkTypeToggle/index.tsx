import { useTernaryDarkMode } from "usehooks-ts";

import { useNetwork } from "@/contexts/NetworkContext";
import { cn } from "@/utils";

interface NetworkTypeToggleProps {
  className?: string;
}

export const NetworkTypeToggle: React.FC<NetworkTypeToggleProps> = ({ className }) => {
  const { networkType, setNetworkType } = useNetwork();
  const { isDarkMode } = useTernaryDarkMode();

  const toggleNetworkType = () => {
    setNetworkType(networkType === "mainnet" ? "testnet" : "mainnet");
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        onClick={toggleNetworkType}
        className={cn("relative flex items-center justify-center cursor-pointer", "h-10 w-[5.6rem]")}
      >
        <div className={cn("absolute inset-0 rounded-full", isDarkMode ? "bg-gray-700" : "bg-gray-200")} />

        <div
          className={cn(
            "absolute flex items-center justify-center z-10 rounded-full transition-transform duration-200",
            "h-9 w-9 m-0.5",
            isDarkMode ? "bg-gray-600" : "bg-white border border-gray-300",
            networkType === "mainnet" ? "translate-x-[-2.25rem]" : "translate-x-[2.25rem]",
          )}
        >
          <span className={cn("text-sm font-bold", isDarkMode ? "text-white" : "text-gray-800")}>
            {networkType === "mainnet" ? "M" : "T"}
          </span>
        </div>

        <div className="w-full flex justify-between px-4">
          <span
            className={cn(
              "text-sm font-bold z-0 translate-x-[-0.25rem]",
              networkType === "mainnet"
                ? isDarkMode
                  ? "text-white"
                  : "text-gray-800"
                : isDarkMode
                ? "text-gray-400"
                : "text-gray-400",
            )}
          >
            M
          </span>
          <span
            className={cn(
              "text-sm font-bold z-0 translate-x-[0.25rem]",
              networkType === "testnet"
                ? isDarkMode
                  ? "text-white"
                  : "text-gray-800"
                : isDarkMode
                ? "text-gray-400"
                : "text-gray-400",
            )}
          >
            T
          </span>
        </div>
      </div>

      <span className={cn("text-sm font-medium", isDarkMode ? "text-white" : "text-gray-800")}>
        {networkType === "mainnet" ? "Mainnets" : "Testnets"}
      </span>
    </div>
  );
};
