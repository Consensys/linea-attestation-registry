import { IDescriptionProps } from "./interface";

export const Description: React.FC<IDescriptionProps> = ({ description }) => {
  return (
    <div className="flex flex-col">
      <div className="text-base font-semibold dark:text-whiteDefault mb-2">Info</div>
      <div className="text-base font-normal dark:text-whiteDefault">{description}</div>
    </div>
  );
};
