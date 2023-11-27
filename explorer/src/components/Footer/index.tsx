import verax from '@/assets/logo/verax.svg';
import veraxIcon from '@/assets/logo/verax-icon.svg';
import github from '@/assets/socials/github.svg';
import gitbook from '@/assets/icons/gitbook.svg';
import hapi from '@/assets/logo/hapi.svg';

//todo: add url
const list = [
  {
    title: 'About',
    logo: veraxIcon,
    url: '',
  },
  {
    title: 'Github',
    logo: github,
    url: '',
  },
  {
    title: 'Documentation',
    logo: gitbook,
    url: '',
  },
  {
    title: 'Terms and Conditions',
    url: '',
  },
];

export const Footer: React.FC = () => {
  return (
    <div className="flex justify-between items-center py-5 px-[60px] border-t-[1px] border-[#DAD8EC]">
      <img src={verax} alt="verax" />
      <div className="flex gap-8 text-[#9096B2] text-sm">
        {list.map(({ title, logo, url }) => (
          <a href={url} target="_blank" className="flex justify-center self-center gap-2 hover:underline">
            {logo && <img src={logo} alt={title} className="!w-4 !h-4 self-center" />}
            {title}
          </a>
        ))}
      </div>
      <img src={hapi} alt="hapi" className="!h-[25px]" />
    </div>
  );
};
