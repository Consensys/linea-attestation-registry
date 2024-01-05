import { Skeleton } from "@/components/ui/skeleton";

export const SchemaLoadingSkeleton = () => {
  return (
    <section className="flex flex-col gap-6 w-full mb-10 md:mb-20 xl:max-w-[1200px] xl:m-auto">
      <div className="flex flex-col px-5 md:px-10 gap-6">
        <Skeleton className="w-[70px] h-[25px] rounded-3xl" />
        <div className="flex flex-col gap-3">
          <Skeleton className="w-full max-w-[300px] h-8 rounded-3xl" />
          <Skeleton className="w-full max-w-[250px] h-6 rounded-3xl" />
        </div>
        <hr className="bg-border-card" />
      </div>
      <div className="flex flex-col gap-6 px-5 md:px-10 xl:flex-row xl:justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            <Skeleton className="w-[70px] h-4 rounded-3xl" />
            <Skeleton className="w-full max-w-[320px] h-6 rounded-3xl xl:w-[320px]" />
          </div>
        </div>
        <div className="flex flex-col gap-2 xl:max-w-[600px] w-full">
          <Skeleton className="w-[70px] h-4 rounded-3xl" />
          <div className="flex animate-pulse h-[113px] md:h-[131px] px-4 py-2 md:p-4 rounded-xl bg-surface-magenta20 text-text-tertiary md:text-base">
            <Skeleton className="w-full max-w-[320px] h-4 rounded-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
};
