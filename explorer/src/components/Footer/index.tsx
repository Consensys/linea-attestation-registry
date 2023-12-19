import HapiLogo from "@/assets/logo/hapi.svg?react";
import VeraxLogoGrey from "@/assets/logo/verax-logo-grey.svg?react";
import { Link } from "@/components/Link";
import { INFO_LIST } from "@/constants/components";
import { APP_ROUTES } from "@/routes/constants";

export const Footer: React.FC = () => {
  return (
    <footer className="flex flex-col justify-between items-center py-5 sm:px-8 md:px-[60px] border-t-[1px] border-border-table sm:flex-row gap-14 sm:gap-0 transition-spacing mt-14 md:mt-[4.5rem]">
      <Link to={APP_ROUTES.HOME} className="group">
        <VeraxLogoGrey
          className="
        group-hover:[&>path]:fill-blackDefault
        group-hover:[&>g>circle]:fill-[#676455]
        group-hover:[&>g>path]:fill-[#A5AF63]
        [&>path]:transition
        [&>g>circle]:transition
        [&>g>path]:transition
        "
        />
      </Link>
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 text-text-quaternary text-sm">
        {INFO_LIST.map(({ title, logo, url }) => {
          const Logo = logo;

          return (
            <a
              key={title}
              href={url}
              target="_blank"
              className="text-sm font-medium flex justify-center items-center self-center gap-2 hover:text-text-darkBlue transition group"
            >
              <Logo className="group-hover:svg-dark-blue [&>path]:transition [&>rect]:transition [&>g>path]:transition" />
              {title}
            </a>
          );
        })}
      </div>
      <a href={"https://hapi.one/"} target="_blank" className="group">
        <HapiLogo className="group-hover:[&>path]:fill-text-darkBlue [&>path]:transition" />
      </a>
    </footer>
  );
};
