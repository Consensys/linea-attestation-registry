import { Link } from 'react-router-dom';

import logo from '@/assets/logo/header-logo.svg';
import arrow from '@/assets//icons/arrow.svg';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { chains } from '@/config';
import { useNetworkContext } from '@/providers/network-provider';
import { APP_ROUTES } from '@/routes/constants';

import './styles.css';

const routes = [
  {
    name: 'Issuers',
    path: APP_ROUTES.ISSUERS,
  },
  {
    name: 'Attestations',
    path: APP_ROUTES.ATTESTATIONS,
  },
  {
    name: 'Schemas',
    path: APP_ROUTES.SCHEMAS,
  },
  {
    name: 'Modules',
    path: APP_ROUTES.MODULES,
  },
];

export const Header = () => {
  const { network, setNetwork } = useNetworkContext();
  console.log(network, 'network');
  return (
    <div className="bg-gray-100 h-16 px-14 py-3border-b justify-between items-center inline-flex">
      <div className="justify-start items-center gap-12 flex">
        <Link to={APP_ROUTES.HOME}>
          <img src={logo} className="w-36 h-6 cursor-pointer" alt="Verax logo" />
        </Link>
        <div className="justify-start items-start gap-6 flex">
          {routes.map((route) => (
            <div key={route.name} className="cursor-pointer justify-center items-center gap-2.5 flex">
              <Link to={route.path} className="text-neutral-900 text-base font-medium">
                {route.name}
              </Link>
            </div>
          ))}
        </div>
      </div>
      <div className="justify-start items-start gap-8 flex">
        <DropdownMenu>
          <DropdownMenuTrigger className="DropdownMenuTrigger select-none w-[72px] h-12 p-2 rounded-md border border-gray-300 justify-start items-center gap-2 inline-flex">
            <img src={network.img} className="w-6 h-6 relative" alt="Linea logo" />
            <img src={arrow} className="header-arrow w-6 h-6 relative" alt="arrow" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {chains.map((chain) => (
              <DropdownMenuItem key={chain.name} onClick={() => setNetwork(chain)}>
                {chain.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="select-none cursor-pointer w-38 px-4 py-3 bg-slate-200 rounded-md">
          <div className="text-gray-900 text-base font-semibold  leading-snug">Connect wallet</div>
        </div>
      </div>
    </div>
  );
};
