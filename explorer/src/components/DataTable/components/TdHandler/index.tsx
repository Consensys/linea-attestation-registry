import { ChevronRight } from "lucide-react";

import { Link } from "@/components/Link";

import { ITdHandler } from "./interface";

export const TdHandler: React.FC<ITdHandler> = ({ value, valueUrl, to, isTextLeft = false }) => {
  return (
    <div className="flex items-center justify-end gap-2">
      {valueUrl ? (
        <a
          href={valueUrl}
          target="_blank"
          className={`hover:underline hover:text-text-quaternary translate-x-${
            isTextLeft ? 0 : 5
          } group-hover:translate-x-${isTextLeft ? 5 : 0} transition max-w-[300px] overflow-hidden text-ellipsis`}
        >
          {value}
        </a>
      ) : (
        <p
          className={`w-full text-${isTextLeft ? "left" : "right"} translate-x-${isTextLeft ? 0 : 5} group-hover:${
            isTextLeft ? "-translate-x-5" : "translate-x-0"
          } transition max-w-[300px] overflow-hidden text-ellipsis`}
        >
          {value}
        </p>
      )}
      <Link to={to}>
        <ChevronRight className="w-5 opacity-0 group-hover:opacity-100 transition" />
      </Link>
    </div>
  );
};
