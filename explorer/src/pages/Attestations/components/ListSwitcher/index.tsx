import { useSearchParams } from "react-router-dom";
import { useAccount } from "wagmi";

import { EQueryParams } from "@/enums/queryParams";

export const ListSwitcher = () => {
  const { address } = useAccount();

  const [searchParams, setSearchParams] = useSearchParams();

  const attester = searchParams.get(EQueryParams.ATTESTER);

  const handleAttester = (address?: string) => {
    const currentSearchParams = new URLSearchParams(searchParams);
    address
      ? currentSearchParams.set(EQueryParams.ATTESTER, address)
      : currentSearchParams.delete(EQueryParams.ATTESTER);

    setSearchParams(currentSearchParams);
  };

  return (
    <div className="inline-flex bg-slate-100 gap-2 mb-6 rounded">
      <button
        disabled={Boolean(!attester)}
        onClick={() => handleAttester()}
        className={`h-[2.1875rem] px-3 rounded text-base font-medium ${
          attester ? "text-text-tertiary" : "text-white bg-gray-700"
        }`}
      >
        All attestations
      </button>
      <button
        disabled={!address || Boolean(attester)}
        onClick={() => handleAttester(address)}
        className={`h-[2.1875rem] px-3 rounded text-base font-medium ${
          attester ? "text-white bg-gray-700" : "text-text-tertiary"
        }`}
      >
        My attestations
      </button>
    </div>
  );
};
