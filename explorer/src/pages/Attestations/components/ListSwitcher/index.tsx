import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAccount } from "wagmi";

import { EQueryParams } from "@/enums/queryParams";

export interface IListSwitcherProps {
  showMyAttestations: boolean;
  setShowMyAttestation: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ListSwitcher: React.FC<IListSwitcherProps> = ({ showMyAttestations, setShowMyAttestation }) => {
  const { address } = useAccount();

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const currentSearchParams = new URLSearchParams(searchParams);
    address && showMyAttestations
      ? currentSearchParams.set(EQueryParams.ATTESTER, address)
      : currentSearchParams.delete(EQueryParams.ATTESTER);

    setSearchParams(currentSearchParams);
  }, [showMyAttestations, address, searchParams, setSearchParams]);

  return (
    <div className="inline-flex bg-slate-100 gap-2 mb-6 rounded">
      <button
        disabled={!showMyAttestations}
        onClick={() => setShowMyAttestation(false)}
        className={`h-[2.1875rem] px-3 rounded text-base font-medium ${
          showMyAttestations ? "text-text-tertiary" : "text-white bg-gray-700"
        }`}
      >
        All attestations
      </button>
      <button
        disabled={showMyAttestations}
        onClick={() => setShowMyAttestation(true)}
        className={`h-[2.1875rem] px-3 rounded text-base font-medium ${
          showMyAttestations ? "text-white bg-gray-700" : "text-text-tertiary"
        }`}
      >
        My attestations
      </button>
    </div>
  );
};
