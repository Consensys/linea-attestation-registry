import "./Footer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord, faDiscourse, faGithub, faTelegram } from "@fortawesome/free-brands-svg-icons";
import { Link } from "react-router-dom";
import { faBook, faLeaf } from "@fortawesome/free-solid-svg-icons";

function Navbar() {

  return (
    <>
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
          <Link className="social-icon__link" to={"https://community.ver.ax"}
                target={"_blank"}>
            <FontAwesomeIcon icon={faDiscourse} />
          </Link>
        </li>

        <li className="social-icon__item">
          <Link className="social-icon__link" to={"https://hey.xyz/u/verax"}
                target={"_blank"}>
            <FontAwesomeIcon icon={faLeaf} />
          </Link>
        </li>

        <li className="social-icon__item">
          <Link className="social-icon__link" to={"https://docs.ver.ax"}
                target={"_blank"}>
            <FontAwesomeIcon icon={faBook} />
          </Link>
        </li>
      </ul>
    </>
  );
}

export default Navbar;
