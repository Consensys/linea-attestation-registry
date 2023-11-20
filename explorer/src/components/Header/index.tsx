import { PropsWithChildren } from 'react';
import logo from '@/assets/logo/header-logo.svg';
import lineaTestnet from '@/assets/networks/linea-testnet.svg';
import arrow from '@/assets/arrow.svg';
import './styles.css';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const Header = ({ children }: PropsWithChildren) => {
  return (
    <div className="w-screen h-screen bg-gray-100 ">
      <div className="w-screen h-16 px-14 py-3border-b justify-between items-center inline-flex">
        <div className="justify-start items-center gap-12 flex">
          <img src={logo} className="w-36 h-6 " alt="Verax logo" />
          <div className="justify-start items-start gap-6 flex">
            <div className="cursor-pointer justify-center items-center gap-2.5 flex">
              <div className="text-neutral-900 text-base font-medium">Issuers</div>
            </div>
            <div className="cursor-pointer justify-center items-center gap-2.5 flex">
              <div className="text-neutral-900 text-base font-normal">Attestations</div>
            </div>
            <div className="cursor-pointer justify-center items-center gap-2.5 flex">
              <div className="text-neutral-900 text-base font-normal">Schemas</div>
            </div>
            <div className="cursor-pointer justify-center items-center gap-2.5 flex">
              <div className="text-neutral-900 text-base font-normal">Modules</div>
            </div>
          </div>
        </div>
        <div className="justify-start items-start gap-8 flex">
          <DropdownMenu>
            <DropdownMenuTrigger className="DropdownMenuTrigger select-none w-[72px] h-12 p-2 rounded-md border border-gray-300 justify-start items-center gap-2 inline-flex">
              <img src={lineaTestnet} className="w-6 h-6 relative" alt="Linea logo" />
              <img src={arrow} className="header-arrow w-6 h-6 relative" alt="arrow" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuItem>Subscription</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="select-none cursor-pointer w-38 px-4 py-3 bg-slate-200 rounded-md">
            <div className="text-gray-900 text-base font-semibold  leading-snug">Connect wallet</div>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
};
