import { t } from "i18next";
import { ArrowRight } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import useSWR from "swr";

import { Button } from "@/components/Buttons";
import { EButtonType } from "@/components/Buttons/enum";
import { SWRKeys } from "@/interfaces/swr/enum";
import { useNetworkContext } from "@/providers/network-provider/context";
import { CHAIN_ID_ROUTE, toPortalById } from "@/routes/constants";

import { IPortalProps } from "./interface";

export const Portals: React.FC<IPortalProps> = ({ address }) => {
  const {
    sdk,
    network: { network },
  } = useNetworkContext();
  const navigate = useNavigate();
  const location = useLocation();

  const { data: portals } = useSWR(`${SWRKeys.GET_PORTALS_BY_ISSUER}/${address}`, () =>
    sdk.portal.findBy(undefined, undefined, { ownerAddress: address }),
  );

  if (!portals) return null;

  return (
    <div className="flex flex-col gap-6 md:gap-8 text-base md:text-[2rem] dark:text-whiteDefault">
      <div className="flex flex-row items-center gap-6 mb-6">{t("issuer.portals.title")}</div>
      <div className="overflow-hidden border-2 border-black dark:border-white rounded-[15px]">
        <table className="min-w-full divide-y divide-black dark:divide-white dark:text-whiteDefault">
          <thead>
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-sm font-medium tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-sm font-medium tracking-wider">
                Description
              </th>
              <th scope="col" className="px-6 py-3 text-left text-sm font-medium tracking-wider">
                Attestations
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {portals.map((portal) => (
              <tr key={portal.id}>
                <td className="px-6 py-4 whitespace-nowrap text-xs font-medium">
                  <Button
                    name={portal.name}
                    handler={() =>
                      navigate(toPortalById(portal.id).replace(CHAIN_ID_ROUTE, network), {
                        state: { from: location.pathname },
                      })
                    }
                    buttonType={EButtonType.TRANSPARENT}
                    iconRight={<ArrowRight />}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xs">{portal.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-xs font-medium">{portal.attestationCounter}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
