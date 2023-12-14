import { Link } from "@/components/Link";
import { toIssuerById } from "@/routes/constants";

import { IIssuerProps } from "./interface";

export const Issuer: React.FC<IIssuerProps> = ({ issuer }) => {
  const IssuerLogo = issuer.logo;

  return (
    <Link
      to={toIssuerById(issuer.id)}
      key={issuer.name}
      className="group flex flex-col gap-4 border border-border-card rounded-xl p-4 md:p-6 cursor-pointer hover:bg-surface-secondary"
    >
      <div className="flex items-center gap-3 text-xl md:text-2xl font-semibold text-blackDefault">
        <div className="w-[2.5rem] h-[2.5rem] md:w-[3rem] md:h-[3rem] flex items-center justify-center">
          <IssuerLogo className="w-full h-auto max-w-[2.5rem] md:max-w-[3rem] max-h-[2.5rem] md:max-h-[3rem]" />
        </div>
        {issuer.name}
      </div>
      {/* TODO: uncomment when data will be available */}
      {/* <div className="flex flex-wrap gap-2">
        <Chips name="proof of humanity" additionalClass="group-hover:bg-surface-primary" />
        <Chips name="proof of humanity" additionalClass="group-hover:bg-surface-primary" />
        <Chips name="proof of humanity" additionalClass="group-hover:bg-surface-primary" />
      </div> */}
      <div className="text-sm font-normal text-text-darkGrey">{issuer.description}</div>
      {/* TODO: uncomment when data will be available */}
      {/* <div className="flex flex-wrap gap-4">
        <div>
          <div className="text-xl md:text-2xl font-semibold">24k</div>
          <div className="text-xs font-normal text-text-darkGrey">Attestations</div>
        </div>
        <div>
          <div className="text-xl md:text-2xl font-semibold">13</div>
          <div className="text-xs font-normal text-text-darkGrey">Schemas</div>
        </div>
      </div> */}
    </Link>
  );
};
