import { Skeleton } from "@/components/ui/skeleton";
import { ATTESTATION_INFO_AMOUNT, RELATED_ATTESTATIONS_AMOUNT } from "@/constants/skeleton";
import { randomNumber } from "@/utils/amountUtils";

export const AttestationSchemaCardSkeleton = () => {
  return (
    <div className="w-full flex-col justify-start items-start gap-6 inline-flex">
      <Skeleton className="w-[87px] h-4 mt-1" />
      <div className="w-full flex-col justify-start items-start gap-3 flex">
        <div className="w-full justify-between items-start inline-flex ">
          <Skeleton className="w-[172px] h-4" />
          <Skeleton className="w-[102px] h-4" />
        </div>
        <Skeleton className="w-[311px] h-4" />
      </div>
      <Skeleton className="w-[114px] h-4" />
    </div>
  );
};

export const RelatedAttestationsSkeleton = () => {
  return (
    <div className="w-full flex-col justify-start items-start gap-6 inline-flex mt-3">
      <Skeleton className="w-[164px] h-4" />
      <div className="self-stretch flex flex-col justify-start items-start gap-4 pb-1 lg:flex-row lg:flex-wrap">
        {Array.from(Array(RELATED_ATTESTATIONS_AMOUNT)).map((_, index) => (
          <div
            key={index}
            className="py-2 justify-start items-center gap-4 inline-flex flex-shrink-0 lg:flex-col lg:items-start lg:w-[115px]"
          >
            <Skeleton className="w-[74px] h-4" />
            <Skeleton className="w-[55px] h-4" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const AttestationLoadingSkeleton = () => {
  return (
    <div className="flex flex-col md:gap-4 max-w-[1200px] my-6 md:mt-2 md:mb-20 md:mx-10 xl:mx-auto">
      <Skeleton className="w-[70px] h-[25px] rounded-[100px]" />
      <div className="flex flex-col md:border md:rounded-3xl md:border-border-card xl:flex-row">
        {/* AttestationInfo */}
        <div className="p-6 md:border-b md:border-border-card xl:w-full xl:max-w-[440px] xl:border-b-0 xl:border-e">
          <div className="flex flex-col w-full items-start gap-8">
            <Skeleton className="w-[135px] h-8 rounded-[100px]" />
            <div className="gap-8 flex flex-col items-start w-full md:flex-wrap md:h-[170px] md:content-between xl:flex-nowrap xl:h-auto">
              {Array.from(Array(ATTESTATION_INFO_AMOUNT)).map((_, index) => (
                <div key={index} className="inline-flex gap-2 w-full justify-between items-center md:w-auto">
                  <div className="min-w-[120px]">
                    <Skeleton className="h-4" style={{ width: randomNumber(47, 111) }} />
                  </div>
                  <Skeleton className="h-4" style={{ width: randomNumber(40, 178) }} />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col p-6 gap-12 w-full">
          <AttestationSchemaCardSkeleton />
          {/* AttestationData */}
          <div className="w-full flex-col justify-start items-start gap-4 inline-flex">
            <Skeleton className="w-[147px] h-4" />
            <div className="bg-surface-attestationData rounded-xl p-4 pe-3 w-full relative">
              <div className="flex flex-col pe-1 items-start h-[108px]">
                <Skeleton className="w-[114px] h-4" />
              </div>
            </div>
          </div>
          {/* TODO: uncomment when RelatedAttestations component will be available */}
          {/* <RelatedAttestationsSkeleton /> */}
        </div>
      </div>
    </div>
  );
};
