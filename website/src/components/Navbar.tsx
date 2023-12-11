import { NavLink } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
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
            <NavLink className="navbar-brand" to="/linea-poh" end>
              Linea POH
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
