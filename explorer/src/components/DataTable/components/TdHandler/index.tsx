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
          onClick={(e) => e.stopPropagation()}
          className={`hover:underline ${isTextLeft ? "translate-x-0" : "translate-x-5"} ${
            isTextLeft ? "group-hover:translate-x-5" : "group-hover:translate-x-0"
          } transition max-w-[300px] overflow-hidden text-ellipsis`}
        >
          {value}
        </a>
      ) : (
        <p
          className={`w-full text-${isTextLeft ? "left" : "right"} ${isTextLeft ? "translate-x-0" : "translate-x-5"} ${
            isTextLeft ? "group-hover:-translate-x-5" : "group-hover:translate-x-0"
          } transition max-w-[300px] overflow-hidden text-ellipsis`}
        >
          {value}
        </p>
      )}
      <Link to={to} onClick={(e) => e.stopPropagation()}>
        <ChevronRight className="w-5 opacity-0 group-hover:opacity-100 transition" />
      </Link>
    </div>
  );
};
