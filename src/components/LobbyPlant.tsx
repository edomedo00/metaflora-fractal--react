import React from "react";
import LobbyPlantSketch from "../sketches/LobbyPlantSketch";

const LobbyPlant: React.FC = () => {
  return (
    <div className="lobby-right">
      <div className="plant-container">
        <LobbyPlantSketch />
      </div>
      <div className="start">
        <button className="btn btn-start">comenzar</button>
      </div>
    </div>
  );
};

export default LobbyPlant;
