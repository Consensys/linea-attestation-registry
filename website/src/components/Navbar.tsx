import { NavLink } from "react-router-dom";
import "./Navbar.css";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";

const Navbar: React.FC = () => {
  return (
    <nav className="navbar navbar-light">
      <div className="container">
        <ul className="nav navbar-nav pull-xs-right">
          <li className="nav-item">
            <NavLink className="navbar-brand" to="/" end>
              Home
            </NavLink>
          </li>
          <li className="nav-item">
            <a className={"navbar-brand"} href={"https://explorer.ver.ax"} target={"_blank"}>
              Explorer <FontAwesomeIcon icon={faArrowUpRightFromSquare} size={"xs"} />
            </a>
          </li>
          <li className="nav-item">
            <a className={"navbar-brand"} href={"https://docs.ver.ax"} target={"_blank"}>
              Documentation <FontAwesomeIcon icon={faArrowUpRightFromSquare} size={"xs"} />
            </a>
          </li>
          <li className="nav-item">
            <a className={"navbar-brand"} href={"https://poh.linea.build"} target={"_blank"}>
              Linea POH <FontAwesomeIcon icon={faArrowUpRightFromSquare} size={"xs"} />
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
