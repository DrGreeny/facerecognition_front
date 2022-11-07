import React from "react";
import Tilt from "react-parallax-tilt";
import brain from "./brain.png";

const Logo = () => {
  return (
    <div className="w4">
      <Tilt>
        <div
          style={{
            height: "130px",
            width: "130px",
            backgroundColor: "white",
            paddingTop: "10px",
            paddingLeft: "10px",
          }}
        >
          <img src={brain} alt="logo" />
        </div>
      </Tilt>
    </div>
  );
};

export default Logo;
