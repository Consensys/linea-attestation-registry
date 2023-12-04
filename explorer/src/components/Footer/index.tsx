import { Link } from "@/components/Link";
import verax from "@/assets/logo/verax.svg";
import hapi from "@/assets/logo/hapi.svg";
import { APP_ROUTES } from "@/routes/constants";
import { INFO_LIST } from "@/constants/components";

export const Footer: React.FC = () => {
  return (
    <footer className="flex flex-col justify-between items-center py-5 sm:px-8 md:px-[60px] border-t-[1px] border-border-table sm:flex-row gap-14 sm:gap-0 transition-spacing">
      <Link to={APP_ROUTES.HOME}>
        <img src={verax} alt="verax" />
      </Link>
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 text-text-quaternary text-sm">
        {INFO_LIST.map(({ title, logo, url }) => (
          <a
            key={title}
            href={url}
            target="_blank"
            className="flex justify-center self-center gap-2 hover:underline hover:text-zinc-950"
          >
            {logo && <img src={logo} alt={title} className="!w-4 !h-4 self-center" />}
            {title}
          </a>
        ))}
      </div>
      <a href={"https://hapi.one/"} target="_blank">
        <img src={hapi} alt="hapi" className="!h-[25px]" />
      </a>
    </footer>
  );
};
