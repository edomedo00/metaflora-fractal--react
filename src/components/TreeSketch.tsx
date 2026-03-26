import React, { useEffect, useRef } from "react";
import Tree1 from "../sketches/Tree1";
import Tree2 from "../sketches/Tree2";
import Tree3 from "../sketches/Tree3";

interface TreeSketchProps {
  page: number;
  setPage: (page: number) => void;
}

interface Tree3Controls {
  nextCamera: () => void;
  nextSeed: () => void;
}

const TreeSketch: React.FC<TreeSketchProps> = ({ setPage, page }) => {
  const [text, setText] = React.useState<string>("");

  const headerRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const treeControls = useRef<Tree3Controls | null>(null);

  useEffect(() => {
    fetch(`/arboles_con-texto--react/assets/texts/${page}.txt`)
      .then((res) => res.text())
      .then((data) => setText(data))
      .catch((err) => console.error("Failed to load text:", err));
  }, [page]);

  useEffect(() => {
    const header = headerRef.current;
    const controls = controlsRef.current;

    if (!header) return;
    if (!controls) return;

    const timer = setTimeout(() => {
      header.style.animation = "none";
      controls.style.animation = "none";
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="tree-main">
      <div className="interface-container">
        <div className="header" ref={headerRef}>
          <button
            className={`btn btn-return btn-return--${page}`}
            onClick={() => setPage(0)}
          >
            volver
          </button>
          <div className="top-line--interface"></div>
        </div>
        <div className="interface">
          {/* eslint-disable-next-line */}
          <div className="interface__text">{`${text}`}</div>
          <div className="interface__controls" ref={controlsRef}>
            <button
              className={`btn btn-controls btn-controls--${page}`}
              onClick={() => treeControls.current?.nextSeed()}
            >
              regenerar
            </button>
            <button
              className={`btn btn-controls btn-controls--${page}`}
              onClick={() => treeControls.current?.nextCamera()}
            >
              cambiar vista
            </button>
            <button
              className={`btn btn-controls btn-controls--${page}`}
              onClick={() => setPage((page + 1) % 4)}
            >
              avanzar
            </button>
          </div>
        </div>
        {/* <div className="interface-text"></div> */}
      </div>
      <div className="tree-container">
        {page === 1 ? (
          <Tree1 onReady={(controls) => (treeControls.current = controls)} />
        ) : (
          <></>
        )}
        {page === 2 ? (
          <Tree2 onReady={(controls) => (treeControls.current = controls)} />
        ) : (
          <></>
        )}
        {page === 3 ? (
          <Tree3 onReady={(controls) => (treeControls.current = controls)} />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default TreeSketch;
