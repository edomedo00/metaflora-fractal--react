import React from "react";
import LobbyPlantSketch from "../sketches/LobbyPlantSketch";
import useBreakpoint from "../hooks/useBreakpoint";

const cameraZMap: Record<string, number> = {
  desktop: 201.3,
  "tab-land": 260,
  "tab-port": 360,
  phone: 400,
};

interface LobbyPlantProps {
  setPage: (page: number) => void;
}

const LobbyPlant: React.FC<LobbyPlantProps> = ({ setPage }) => {
  const breakpoint = useBreakpoint();
  const cameraZ = cameraZMap[breakpoint];

  return (
    <div className="lobby-right">
      <div className="plant-container">
        <LobbyPlantSketch cameraZ={cameraZ} />
      </div>
      <div className="start">
        <button className="btn btn-start" onClick={() => setPage(1)}>
          visitar
        </button>
      </div>
    </div>
  );
};

export default LobbyPlant;
