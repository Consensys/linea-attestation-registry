import { Skeleton } from "@/components/ui/skeleton";
import { ColumnsOptions } from "@/interfaces/components";
import { randomNumber } from "@/utils/amountUtils";

export const columnsSkeleton = <ColumnType,>(value: ColumnType[], options: ColumnsOptions): ColumnType[] =>
  value.map((column, index) => {
    const element = options[index];
    return {
      ...column,
      cell: () => {
        const maxWidth = element.maxWidth;
        const minWidth = element.minWidth;
        const randomWidth = element?.isRandomWidth && maxWidth && minWidth ? randomNumber(minWidth, maxWidth) : "100%";
        const width = element.width ?? randomWidth;
        return <Skeleton className="h-[14px] rounded-full" style={{ minWidth, maxWidth, width }} />;
      },
    };
  });
