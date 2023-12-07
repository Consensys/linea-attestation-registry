import { useSearchParams } from "react-router-dom";

import { EQueryParams } from "@/enums/queryParams";

export const ListSwitcher: React.FC = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const isMyAttestations = searchParams.get(EQueryParams.SHOW_MY_ATTESTATIONS);

  const [, setSearchParams] = useSearchParams();

  const handleShowAttestations = (showMy?: boolean) => {
    const currentSearchParams = new URLSearchParams();

    showMy
      ? currentSearchParams.set(EQueryParams.SHOW_MY_ATTESTATIONS, "true")
      : currentSearchParams.delete(EQueryParams.SHOW_MY_ATTESTATIONS);

    setSearchParams(currentSearchParams);
  };

  return (
    <div className="inline-flex bg-slate-100 gap-2 mb-6 rounded">
      <button
        disabled={!isMyAttestations}
        onClick={() => handleShowAttestations()}
        className={`h-[2.1875rem] px-3 rounded text-base font-medium ${
          isMyAttestations ? "text-text-tertiary" : "text-white bg-gray-700"
        }`}
      >
        All attestations
      </button>
      <button
        disabled={!!isMyAttestations}
        onClick={() => handleShowAttestations(true)}
        className={`h-[2.1875rem] px-3 rounded text-base font-medium ${
          isMyAttestations ? "text-white bg-gray-700" : "text-text-tertiary"
        }`}
      >
        My attestations
      </button>
    </div>
  );
};
