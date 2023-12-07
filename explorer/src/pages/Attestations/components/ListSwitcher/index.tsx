import { useSearchParams } from "react-router-dom";
import { useAccount } from "wagmi";

import { EQueryParams } from "@/enums/queryParams";

import { IListSwitcherProps } from "./interface";

export const ListSwitcher: React.FC<IListSwitcherProps> = ({ showMyAttestations, setShowMyAttestation }) => {
  const { address } = useAccount();

  const [searchParams, setSearchParams] = useSearchParams();

  const handleShowAttestations = () => {
    const currentSearchParams = new URLSearchParams(searchParams);

    if (address && showMyAttestations) {
      setShowMyAttestation(false);
      currentSearchParams.set(EQueryParams.ATTESTER, address);
    } else {
      setShowMyAttestation(true);
      currentSearchParams.delete(EQueryParams.ATTESTER);
    }

    setSearchParams(currentSearchParams);
  };

  return (
    <div className="inline-flex bg-slate-100 gap-2 mb-6 rounded">
      <button
        disabled={!showMyAttestations}
        onClick={handleShowAttestations}
        className={`h-[2.1875rem] px-3 rounded text-base font-medium ${
          showMyAttestations ? "text-text-tertiary" : "text-white bg-gray-700"
        }`}
      >
        All attestations
      </button>
      <button
        disabled={showMyAttestations}
        onClick={handleShowAttestations}
        className={`h-[2.1875rem] px-3 rounded text-base font-medium ${
          showMyAttestations ? "text-white bg-gray-700" : "text-text-tertiary"
        }`}
      >
        My attestations
      </button>
    </div>
  );
};
