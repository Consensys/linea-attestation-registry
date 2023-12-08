import "./Footer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord, faGithub, faTelegram } from "@fortawesome/free-brands-svg-icons";
import { Link } from "react-router-dom";
import { faBook } from "@fortawesome/free-solid-svg-icons";
import { FollowOnLens } from "@lens-protocol/widgets-react";

function Navbar() {

  return (
    <ul className="social-icon">
      <li className="social-icon__item">
        <Link className="social-icon__link" to={"https://discord.gg/Sq4EmYdBEk"}
              target={"_blank"}>
          <FontAwesomeIcon icon={faDiscord} />
        </Link>
      </li>

      <li className="social-icon__item">
        <Link className="social-icon__link" to={"https://t.me/+C94-EJOoVjVhM2U0"}
              target={"_blank"}>
          <FontAwesomeIcon icon={faTelegram} />
        </Link>
      </li>

      <li className="social-icon__item">
        <Link className="social-icon__link" to={"https://github.com/Consensys/linea-attestation-registry"}
              target={"_blank"}>
          <FontAwesomeIcon icon={faGithub} />
        </Link>
      </li>

      <li className="social-icon__item">
        <Link className="social-icon__link" to={"https://docs.ver.ax"}
              target={"_blank"}>
          <FontAwesomeIcon icon={faBook} />
        </Link>
      </li>

      <li className="social-icon__item social-icon__link lens">
        <FollowOnLens handle="verax" title={"Follow us on Lens"} />
      </li>
    </ul>
  );
}

export default Navbar;
