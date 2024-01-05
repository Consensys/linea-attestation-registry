import type { FunctionComponent } from "react";
import { useEffect } from "react";
import "./Poh.css";

export const Poh: FunctionComponent = () => {
  useEffect(() => {
    window.location.replace("https://poh.linea.build");
  }, []);

  return <></>;
};

export default Poh;
