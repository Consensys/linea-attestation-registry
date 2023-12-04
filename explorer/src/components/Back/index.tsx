import { ChevronLeft } from "lucide-react";

import { EMPTY_STRING } from "@/constants";

import { Link } from "../Link";

export interface BackProps {
  to: string;
  className?: string;
}

export const Back: React.FC<BackProps> = ({ to, className }) => {
  return (
    <Link to={to} className={`w-fit flex gap-2 text-text-tertiary hover:opacity-60 ${className || EMPTY_STRING}`}>
      <ChevronLeft width={24} height={24} />
      Back
    </Link>
  );
};
