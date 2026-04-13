import "./Footer.css";
import { faDiscord, faGithub, faXTwitter } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Footer = () => {
  return (
    <ul className="social-icon">
      <li className="social-icon__item">
        <a className="social-icon__link" href={"https://x.com/VeraxRegistry"} target={"_blank"} rel="noreferrer">
          <FontAwesomeIcon icon={faXTwitter} />
        </a>
      </li>

      <li className="social-icon__item">
        <a className="social-icon__link" href={"https://discord.gg/Sq4EmYdBEk"} target={"_blank"} rel="noreferrer">
          <FontAwesomeIcon icon={faDiscord} />
        </a>
      </li>

      <li className="social-icon__item">
        <a
          className="social-icon__link"
          href={"https://github.com/Consensys/linea-attestation-registry"}
          target={"_blank"}
          rel="noreferrer"
        >
          <FontAwesomeIcon icon={faGithub} />
        </a>
      </li>
    </ul>
  );
};

export default Footer;
