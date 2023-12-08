import { cn } from "@/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("animate-pulse rounded-3xl bg-muted bg-skeleton", className)} {...props} />;
}

export { Skeleton };
