import "./Navbar.css";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Navbar = () => {
  return (
    <nav className="navbar navbar-light">
      <div className="container">
        <ul className="nav navbar-nav pull-xs-right">
          <li className="nav-item">
            <a className={"navbar-brand"} href={"https://ver.ax"} target={"_blank"} rel="noreferrer">
              Homepage <FontAwesomeIcon icon={faArrowUpRightFromSquare} size={"xs"} />
            </a>
          </li>
          <li className="nav-item">
            <a className={"navbar-brand"} href={"https://explorer.ver.ax"} target={"_blank"} rel="noreferrer">
              Explorer <FontAwesomeIcon icon={faArrowUpRightFromSquare} size={"xs"} />
            </a>
          </li>
          <li className="nav-item">
            <a className={"navbar-brand"} href={"https://docs.ver.ax"} target={"_blank"} rel="noreferrer">
              Documentation <FontAwesomeIcon icon={faArrowUpRightFromSquare} size={"xs"} />
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
