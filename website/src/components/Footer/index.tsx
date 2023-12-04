import verax from '@/assets/logo/verax.svg';
import veraxIcon from '@/assets/logo/verax-icon.svg';
import github from '@/assets/socials/github.svg';
import gitbook from '@/assets/icons/gitbook.svg';
import hapi from '@/assets/logo/hapi.svg';
import { Link } from 'react-router-dom';
import { APP_ROUTES } from '@/routes/constants';

const list = [
  {
    title: 'About',
    logo: veraxIcon,
    url: 'https://ver.ax/',
  },
  {
    title: 'Github',
    logo: github,
    url: 'https://github.com/Consensys/linea-attestation-registry/tree/dev',
  },
  {
    title: 'Documentation',
    logo: gitbook,
    url: 'https://docs.ver.ax/verax-documentation/',
  },
];

export const Footer: React.FC = () => {
  return (
    <div className="flex flex-col justify-between items-center py-5 md:px-[60px] border-t-[1px] border-border-table md:flex-row gap-14 md:gap-0">
      <Link to={APP_ROUTES.HOME}>
        <img src={verax} alt="verax" />
      </Link>
      <div className="flex flex-col md:flex-row gap-6 md:gap-8 text-text-quaternary text-sm">
        {list.map(({ title, logo, url }) => (
          <a href={url} target="_blank" className="flex justify-center self-center gap-2 hover:underline">
            {logo && <img src={logo} alt={title} className="!w-4 !h-4 self-center" />}
            {title}
          </a>
        ))}
      </div>
      <Link to={'https://hapi.one/'} target="_blank">
        <img src={hapi} alt="hapi" className="!h-[25px]" />
      </Link>
    </div>
  );
};
