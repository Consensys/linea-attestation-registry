import { ChevronDown } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PerPageSelectorProps {
  onChange: (val: string | number) => void;
  values: string[] | number[];
  value: string | number;
}

export const PerPageSelector: React.FC<PerPageSelectorProps> = ({ onChange, values, value }) => {
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger className="DropdownMenuTrigger flex items-center justify-center border text-xs font-semibold text-text-primary dark:text-whiteDefault outline-none w-16 h-8 px-2 rounded-md outline-none dark:border-greyDark hover:border-border-inputFocus dark:focus:border-border-inputFocus dark:hover:border-border-inputFocus rounded-lg transition">
          {value}
          <ChevronDown className="header-arrow ml-1 w-5 h-6 relative" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="flex flex-col-reverse gap-2 bg-surface-primary dark:bg-blackDefault dark:border-border-cardDark">
          {values.map((number) => (
            <DropdownMenuItem
              key={number}
              className="flex gap-2 focus:bg-jumbotronLight dark:focus:bg-jumbotronDark dark:text-whiteDefault cursor-pointer transition"
              onClick={() => onChange(number)}
            >
              {number}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
