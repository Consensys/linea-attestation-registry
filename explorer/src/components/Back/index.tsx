import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { EMPTY_STRING } from "@/constants";

export interface BackProps {
  className?: string;
}

export const Back: React.FC<BackProps> = ({ className }) => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(-1)}
      className={`w-fit flex gap-2 text-text-tertiary hover:opacity-60 ${className || EMPTY_STRING}`}
    >
      <ChevronLeft width={24} height={24} />
      Back
    </button>
  );
};
