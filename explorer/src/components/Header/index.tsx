import { useWeb3Modal } from "@web3modal/wagmi/react";
import { t } from "i18next";
import { ChevronDown } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { useLocation } from "react-router-dom";
import { useAccount } from "wagmi";

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
import { Button } from "../Buttons";
import { EButtonType } from "../Buttons/enum";
import { NavigationList } from "../NavigationList";
import { SearchInput } from "../SearchInput";

import "./styles.css";

interface HeaderProps {
  isOpened: boolean;
  setIsOpened: Dispatch<SetStateAction<boolean>>;
}

export const Header: React.FC<HeaderProps> = ({ isOpened, setIsOpened }) => {
  const location = useLocation();
  const { address, isConnected } = useAccount();
  const { open } = useWeb3Modal();

  const { network, setNetwork } = useNetworkContext();
  const screen = useWindowDimensions();
  const isAdaptive = !screen.xl;
  const isHomePage = location.pathname === `/${network.network}`;

  const titleByScreen = screen.sm ? t("common.actions.connect") : t("common.actions.connectWallet");
  const title = address && isConnected ? cropString(address) : titleByScreen;

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
          {!screen.sm && !isHomePage && <SearchInput />}
          <DropdownMenu>
            <DropdownMenuTrigger className="DropdownMenuTrigger select-none w-[72px] p-2 rounded-md outline-none hover:bg-jumbotronDark justify-start items-center gap-2 inline-flex transition">
              {network.img}
              <ChevronDown className="header-arrow w-6 h-6 relative" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="flex flex-col gap-2 bg-surface-primary">
              {chains.map((chain) => (
                <DropdownMenuItem
                  key={chain.name}
                  className="flex gap-2 focus:bg-jumbotronDark cursor-pointer transition"
                  onClick={() => setNetwork(chain)}
                >
                  {chain.img}
                  {chain.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            name={title}
            handler={() => open()}
            buttonType={EButtonType.OUTLINED}
            iconRight={isConnected && !isAdaptive ? <ChevronDown /> : undefined}
            className="whitespace-nowrap"
          />
          {isAdaptive && <MenuButton isOpened={isOpened} setIsOpened={setIsOpened} />}
        </div>
      </div>
      {screen.sm && !isHomePage && <SearchInput />}
    </header>
  );
};
