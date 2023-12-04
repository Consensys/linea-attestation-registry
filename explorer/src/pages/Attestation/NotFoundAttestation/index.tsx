import { ChevronDown } from "lucide-react";
import { Hex, hexToNumber } from "viem";

import archive from "@/assets/icons/archive.svg";
import { Link } from "@/components/Link";
import { BILLION } from "@/constants";
import { APP_ROUTES } from "@/routes/constants";
import { displayAmountWithComma } from "@/utils/amountUtils";
import { removeCommas } from "@/utils/stringUtils";

export const NotFoundAttestation: React.FC<{ id: string }> = ({ id }) => {
  const decodedId = hexToNumber(id as Hex);
  const showNumber =
    !isNaN(decodedId) &&
    removeCommas(BILLION.toLocaleString()).length > removeCommas(decodedId.toLocaleString()).length;

  return (
    <section className="w-full flex justify-center px-4">
      <div className="flex flex-col max-w-[1200px] w-full h-[644px] items-center justify-center gap-6 border border-solid mt-8">
        <img src={archive} className="!h-[32px] !w-[32px]" />
        <p className="flex gap-1 font-medium text-base text-center text-[#646a86]">
          <span>Attestation ID</span>
          {showNumber && <span className="text-[#3d3d50]">{displayAmountWithComma(decodedId)}</span>}
          <span>hasn`t been found</span>
        </p>
        <Link to={APP_ROUTES.ATTESTATIONS} className="flex gap-2 border border-solid rounded-md px-4 py-3">
          <ChevronDown width={24} height={24} />
          Go Back
        </Link>
      </div>
    </section>
  );
};
