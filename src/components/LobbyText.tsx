import React from "react";
import useBreakpoint from "../hooks/useBreakpoint";

const LobbyText: React.FC = () => {
  const breakpoint = useBreakpoint();

  return (
    <div className="text">
      <p className="text__title">
        metá<span className="text__title--accent">flora</span> fractal
      </p>
      <div className="text-below">
        <p className="text__text">
          De metáflora fractal nace una experiencia compuesta multidisciplinar
          que inicia en un punto lírico - reflexivo que gira alrededor de las
          formas pertenecientes a los árboles, entendiendo formas como la
          posibilidad asociativa a los árboles desde lo más literal como sus
          partes físicas hasta algo mucho más simbólico como las palabras detrás
          de esta figura "árbol" en toda su extensión.
        </p>
        <p className="text__text">
          Esta práctica converge con la construcción de figuras arbóreas de
          manera generativa utilizando un algoritmo recursivo que genera la
          misma figura n veces con variaciones pseudoaleatorias en cada
          iteración hasta (concluir/encontrar su extremo) en hojas/palabras.
          cada elemento de la escena esta construido con palabras
        </p>
        <p className="text__text">
          de esta convergencia obtenemos descripción literal del producto
        </p>
        <div className="text__contact">
          <div className="text__contact__names">
            <div>
              <p className="names-text">Poesía </p>
              {breakpoint === "phone" ? (
                <a
                  href="https://www.instagram.com/seydidemiel/"
                  className="instagram-small-text"
                >
                  @seydidemiel
                </a>
              ) : (
                <></>
              )}
            </div>
            <div>
              <p className="names-text">Código </p>
              {breakpoint === "phone" ? (
                <a
                  href="https://www.instagram.com/_edomedo___/"
                  className="instagram-small-text"
                >
                  @_edomedo___
                </a>
              ) : (
                <></>
              )}
            </div>
          </div>
          <div className="text__contact__instagram">
            {breakpoint !== "phone" ? (
              <a href="https://www.instagram.com/seydidemiel/" className="link">
                @seydidemiel
              </a>
            ) : (
              <></>
            )}

            {breakpoint !== "phone" ? (
              <a href="https://www.instagram.com/_edomedo___/" className="link">
                @_edomedo___
              </a>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LobbyText;
