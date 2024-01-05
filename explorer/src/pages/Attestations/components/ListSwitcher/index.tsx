import { NavLink } from "@/components/NavLink";

import { options } from "./options";

export const ListSwitcher: React.FC = () => {
  return (
    <div className="inline-flex bg-surface-secondary dark:bg-surface-secondaryDark gap-2 mb-6 rounded">
      {options.map((option) => (
        <NavLink
          end
          key={option.text}
          to={option.to}
          className={({ isActive }) =>
            `flex items-center h-[2.1875rem] px-3 rounded text-base font-medium ${
              isActive
                ? "text-white dark:text-text-primary bg-text-secondary dark:bg-surface-darkGrey"
                : "text-text-tertiary dark:text-tertiary"
            }`
          }
        >
          {option.text}
        </NavLink>
      ))}
    </div>
  );
};
