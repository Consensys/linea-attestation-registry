import { Search } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";

import { EMPTY_STRING } from "@/constants";
import { keyboard } from "@/constants/keyboard";
import { useNavigate } from "@/hooks/useNavigate";
import { toSearch } from "@/routes/constants";

export const SearchInput: React.FC = () => {
  const { search } = useParams();
  const [value, setValue] = useState<string>(search || EMPTY_STRING);
  const navigate = useNavigate();
  const handleSearch = () => {
    if (!value) return;
    navigate(toSearch(value));
  };

  return (
    <div className="w-full md:max-w-[370px] xl:min-w-[auto] h-12 p-2 bg-white rounded-md border border-border-card justify-between items-center inline-flex">
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Search by ID, name, description"
        className="text-base w-full outline-none"
        onKeyDown={(event) => event.key === keyboard.enter && handleSearch()}
      />
      <div
        className={`p-1.5 bg-surface-secondary text-text-darkGrey rounded ${
          !value ? "cursor-not-allowed" : "cursor-pointer"
        }`}
        onClick={handleSearch}
      >
        <Search className="w-5 h-5" />
      </div>
    </div>
  );
};
