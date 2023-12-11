import { NavLink } from "@/components/NavLink";
import { APP_ROUTES } from "@/routes/constants";

export const ListSwitcher: React.FC = () => {
  return (
    <div className="inline-flex bg-surface-secondary gap-2 mb-6 rounded">
      <NavLink
        end
        to={APP_ROUTES.ATTESTATIONS}
        className={({ isActive }) =>
          `flex items-center h-[2.1875rem] px-3 rounded text-base font-medium ${
            isActive ? "text-white bg-text-secondary" : "text-text-tertiary"
          }`
        }
      >
        All attestations
      </NavLink>
      <NavLink
        end
        to={APP_ROUTES.MY_ATTESTATIONS}
        className={({ isActive }) =>
          `flex items-center h-[2.1875rem] px-3 rounded text-base font-medium ${
            isActive ? "text-white bg-text-secondary" : "text-text-tertiary"
          }`
        }
      >
        My attestations
      </NavLink>
    </div>
  );
};
