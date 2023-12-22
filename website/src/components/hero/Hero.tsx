import React from "react";
import heroImg from "../../assets/hero.png";
import heroMobile from "../../assets/hero_mobile.png";
import ConnectWallet from "../connectWallet/ConnectWallet";
import "./Hero.css";

const Hero: React.FC = () => {
  return (
    <div className="hero">
      <div className="container">
        <div className="hero_content">
          <h1 className="hero_title">Proof of Humanity</h1>
          <p className="hero_description">To check your Proof of Humanity status, please connect your wallet.</p>
          <div className="hero_cta">
            <ConnectWallet />
          </div>
        </div>
        <div className="hero_image">
          <img src={heroImg} alt="" />
        </div>
        <div className="hero_image-mobile">
          <img src={heroMobile} alt="" />
        </div>
      </div>
    </div>
  );
};

export default Hero;
