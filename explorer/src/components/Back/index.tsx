import { t } from "i18next";
import { ChevronLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import { EMPTY_STRING } from "@/constants";

interface BackProps {
  className?: string;
}

export const Back: React.FC<BackProps> = ({ className }) => {
  const navigate = useNavigate();
  const { state, pathname } = useLocation();
  const backPath = pathname.split("/").slice(0, -1);
  const { title, handler } = state?.from
    ? { handler: () => navigate(-1), title: t("common.actions.back") }
    : { handler: () => navigate(backPath.join("/")), title: t("common.actions.backTo", { to: backPath.slice(-1) }) };
  return (
    <button
      onClick={() => handler()}
      className={`w-fit flex gap-2 text-text-tertiary hover:opacity-60 ${className || EMPTY_STRING}`}
    >
      <ChevronLeft width={24} height={24} />
      {title}
    </button>
  );
};
