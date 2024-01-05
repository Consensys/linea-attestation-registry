import { issuersData } from "../../data";
import { Issuer } from "../Issuer";

export const Issuers: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {issuersData.map((issuer) => (
        <Issuer issuer={issuer} key={issuer.address} />
      ))}
    </div>
  );
};
