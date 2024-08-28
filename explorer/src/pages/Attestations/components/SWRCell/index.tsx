import { Portal, Schema } from "@verax-attestation-registry/verax-sdk";

import { Link } from "@/components/Link";

export const SWRCell: React.FC<{ data: Portal | Schema; to: string }> = ({ data, to }) => {
  return (
    <Link className="hover:underline transition" to={to} onClick={(e) => e.stopPropagation()}>
      {data.name}
    </Link>
  );
};
