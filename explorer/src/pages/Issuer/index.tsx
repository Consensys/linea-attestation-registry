import { useParams } from "react-router-dom";

export const Issuer: React.FC = () => {
  const { id } = useParams();

  return <>Issuer Page {id}</>;
};
