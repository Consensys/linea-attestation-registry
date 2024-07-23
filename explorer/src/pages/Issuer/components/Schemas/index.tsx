import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import { Button } from "@/components/Buttons";
import { EButtonType } from "@/components/Buttons/enum";
import { useNetworkContext } from "@/providers/network-provider/context";
import { APP_ROUTES, CHAIN_ID_ROUTE } from "@/routes/constants";

import { ISchemasProps } from "./interface";

export const Schemas: React.FC<ISchemasProps> = ({ issuerSchemas }) => {
  const {
    network: { network },
  } = useNetworkContext();
  const navigate = useNavigate();
  const location = useLocation();

  if (issuerSchemas === undefined || issuerSchemas.length === 0) return null;

  const handleSeeAttestationsClick = (portal: string, schema: string) => {
    const whereClauseJSON = { portal: portal, schemaId: schema };
    const whereClause = `?where=${encodeURIComponent(JSON.stringify(whereClauseJSON))}`;
    navigate(APP_ROUTES.ATTESTATIONS.replace(CHAIN_ID_ROUTE, network) + whereClause, {
      state: { from: location.pathname },
    });
  };

  return (
    <div className="flex flex-wrap gap-6">
      {issuerSchemas.map((issuerSchema) => (
        <div className="flex flex-col justify-between items-start p-5 gap-6 w-[305px] h-[300px] bg-[#D9D9D9] rounded-[15px] flex-none order-0 flex-grow-0">
          <div className="flex items-center">
            <issuerSchema.logo className="w-8 h-8" />
            <span className="ml-4">{issuerSchema.name}</span>
          </div>
          <div className="flex items-center">{issuerSchema.description}</div>
          <div>
            <Button
              name="See attestations"
              handler={() => handleSeeAttestationsClick(issuerSchema.portal, issuerSchema.schema)}
              buttonType={EButtonType.PRIMARY_BLACK}
              iconRight={<ArrowRight />}
              className="mb-5 text-[16px] dark:bg-[#252534] w-[100%] h-[44px] rounded-[50px]"
            />
            <Button
              name="Get attestation"
              handler={() => window.open(issuerSchema.url, "_blank")}
              buttonType={EButtonType.PRIMARY_BLACK}
              iconRight={<ArrowUpRight />}
              className="mb-5 text-[16px] dark:bg-[#252534] w-[100%] h-[44px] rounded-[50px]"
            />
          </div>
        </div>
      ))}
    </div>
  );
};
