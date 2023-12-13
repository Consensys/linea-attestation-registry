import { ConnectKitButton } from "connectkit";
import { t } from "i18next";
import { ChevronDown } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

import VeraxLogo from "@/assets/logo/verax-logo.svg?react";
import { Link } from "@/components/Link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { chains } from "@/config";
import useWindowDimensions from "@/hooks/useWindowDimensions";
import { useNetworkContext } from "@/providers/network-provider/context";
import { APP_ROUTES } from "@/routes/constants";
import { cropString } from "@/utils/stringUtils";

import { MenuButton } from "./components/MenuButtons";
import { NavigationList } from "../NavigationList";
import "./styles.css";
import { SearchInput } from "../SearchInput";

interface HeaderProps {
  isOpened: boolean;
  setIsOpened: Dispatch<SetStateAction<boolean>>;
}

export const Header: React.FC<HeaderProps> = ({ isOpened, setIsOpened }) => {
  const { network, setNetwork } = useNetworkContext();
  const screen = useWindowDimensions();
  const isAdaptive = !screen.xl;
  return (
    <header className="px-5 md:px-14 xl:px-[60px] py-3 inline-flex flex-col gap-5">
      <div className="justify-between items-center inline-flex gap-4">
        <div className="justify-start items-center gap-6 flex self-stretch">
          <Link to={APP_ROUTES.HOME} className="shrink-0 hover:opacity-70">
            <VeraxLogo />
          </Link>
          {!isAdaptive && <NavigationList />}
        </div>
        <div className="justify-end items-center gap-4 flex flex-1">
          {!screen.sm && <SearchInput />}
          <DropdownMenu>
            <DropdownMenuTrigger className="DropdownMenuTrigger select-none w-[72px] p-2 rounded-md outline-none hover:bg-hover-lime20 justify-start items-center gap-2 inline-flex">
              {network.img}
              <ChevronDown className="header-arrow w-6 h-6 relative" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="flex flex-col gap-2 bg-surface-primary">
              {chains.map((chain) => (
                <DropdownMenuItem
                  key={chain.name}
                  className="flex gap-2 focus:bg-hover-lime20 cursor-pointer"
                  onClick={() => setNetwork(chain)}
                >
                  {chain.img}
                  {chain.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <ConnectKitButton.Custom>
            {({ isConnected, show, address }) => {
              return (
                <button
                  onClick={show}
                  className="cursor-pointer px-3 h-9 xl:h-12 xl:px-4 gap-2 rounded-md border border-button-secondary-border justify-center items-center inline-flex whitespace-nowrap hover:border-button-secondary-hover"
                >
                  {address && isConnected
                    ? cropString(address)
                    : screen.sm
                      ? t("common.actions.connect")
                      : t("common.actions.connectWallet")}
                  {!isAdaptive && <ChevronDown />}
                </button>
              );
            }}
          </ConnectKitButton.Custom>
          {isAdaptive && <MenuButton isOpened={isOpened} onClick={() => setIsOpened((prev) => !prev)} />}
        </div>
      </div>
      {screen.sm && <SearchInput />}
    </header>
  );
};
