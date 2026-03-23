import React from "react";

const LobbyText: React.FC = () => {
  return (
    <div className="text">
      <p className="text__title">metáflora fractal</p>
      <div className="text-below">
        <p className="text__text">
          metáflora fractal parte de la idea de arbol y sus asociaciones: árbol
          como hojas, copa; árbol como tronco, refugio; árbol como raíces,
          origen; árbol como palabras, metáfora
        </p>
        <p className="text__text">
          desde ahí se construyen figuras arbóreas de manera generativa
          utilizando fractales, los patrones recursivos de la naturaleza, y
          azar, hasta donde le es posible a una computadora
        </p>
        <p className="text__text">
          resultan árboles porque las figuras siguen un proceso de generacion
          similar al de sus inspiraciones —en un entorno determinista y
          controlado—, y porque estan construidos con metaforas intimamente
          ligadas a lo que han significado estas formas en la experiencia real,
          sensorial y abstracta para nosotros
        </p>
        <div className="text__contact">
          <div className="text__contact__names">
            <p>Poemas por Seydi Pineda</p>
            <p>Código por Edmundo Medel</p>
          </div>
          <div className="text__contact__instagram">
            <a href="#" className="link">
              @seydidemiel
            </a>
            <a href="#" className="link">
              @edomedo
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LobbyText;
