import HapiLogo from "@/assets/logo/hapi.svg?react";
import VeraxLogo from "@/assets/logo/verax.svg?react";
import { Link } from "@/components/Link";
import { INFO_LIST } from "@/constants/components";
import { APP_ROUTES } from "@/routes/constants";

export const Footer: React.FC = () => {
  return (
    <footer className="flex flex-col justify-between items-center py-5 sm:px-8 md:px-[60px] border-t-[1px] border-border-table sm:flex-row gap-14 sm:gap-0 transition-spacing">
      <Link to={APP_ROUTES.HOME}>
        <VeraxLogo />
      </Link>
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 text-text-quaternary text-sm">
        {INFO_LIST.map(({ title, logo, url }) => (
          <a
            key={title}
            href={url}
            target="_blank"
            className="flex justify-center items-center self-center gap-2 hover:underline"
          >
            {logo && logo}
            {title}
          </a>
        ))}
      </div>
      <a href={"https://hapi.one/"} target="_blank">
        <HapiLogo className="!h-[25px]" />
      </a>
    </footer>
  );
};
