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

  const getHasHover = () =>
    window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const [hasHover, setHasHover] = React.useState(getHasHover());

  useEffect(() => {
    fetch(`/assets/texts/${page}.txt`)
      .then((res) => res.text())
      .then((data) => setText(data))
      .catch((err) => console.error("Failed to load text:", err));
  }, [page]);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const handler = () => setHasHover(mq.matches);

    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const header = headerRef.current;
    const controls = controlsRef.current;
    if (!header || !controls) return;

    if (!hasHover) {
      // mobile: always visible
      header.style.transition = "none";
      header.style.opacity = "1";
      controls.style.transition = "none";
      controls.style.opacity = "1";
      return;
    }

    // desktop: fade out after 6s, then hover to show
    const fadeTransition = "opacity 2s cubic-bezier(0.72, 0.14, 0.8, 0.3)";
    const showTransition = "opacity 0.8s ease";

    const fadeOut = (el: HTMLElement) => {
      el.style.transition = fadeTransition;
      el.style.opacity = "0";
    };

    const onMouseEnter = (el: HTMLElement) => {
      el.style.transition = showTransition;
      el.style.opacity = "1";
    };

    const onMouseLeave = (el: HTMLElement) => {
      el.style.transition = fadeTransition;
      el.style.opacity = "0";
    };

    const timer = setTimeout(() => {
      fadeOut(header);
      fadeOut(controls);

      const onHeaderEnter = () => onMouseEnter(header);
      const onHeaderLeave = () => onMouseLeave(header);
      const onControlsEnter = () => onMouseEnter(controls);
      const onControlsLeave = () => onMouseLeave(controls);

      header.addEventListener("mouseenter", onHeaderEnter);
      header.addEventListener("mouseleave", onHeaderLeave);
      controls.addEventListener("mouseenter", onControlsEnter);
      controls.addEventListener("mouseleave", onControlsLeave);

      (header as any)._cleanup = () => {
        header.removeEventListener("mouseenter", onHeaderEnter);
        header.removeEventListener("mouseleave", onHeaderLeave);
      };
      (controls as any)._cleanup = () => {
        controls.removeEventListener("mouseenter", onControlsEnter);
        controls.removeEventListener("mouseleave", onControlsLeave);
      };
    }, 6000);

    return () => {
      clearTimeout(timer);
      (header as any)._cleanup?.();
      (controls as any)._cleanup?.();
    };
  }, [hasHover]);

  return (
    <div className={`tree-main ${hasHover ? "has-hover" : "no-hover"}`}>
      <div className="interface-container">
        <div className="header" ref={headerRef}>
          <button
            className={`btn btn-return btn-return--${page}`}
            onClick={() => setPage(0)}
          >
            <span className="text-blur__word">volver</span>
          </button>
          <div className="top-line--interface"></div>
        </div>
        <div className="interface">
          {/* eslint-disable-next-line */}
          <div className="interface__text">
            <p className="text-blur">
              {text.split(" ").map((word, i) => (
                <span key={i} className="text-blur__word">
                  {word}{" "}
                </span>
              ))}
            </p>
          </div>
          <div className="interface__controls" ref={controlsRef}>
            <button
              className={`btn btn-controls btn-controls--${page}`}
              onClick={() => treeControls.current?.nextSeed()}
            >
              <span className="text-blur__word">regenerar</span>
            </button>
            <button
              className={`btn btn-controls btn-controls--${page}`}
              onClick={() => treeControls.current?.nextCamera()}
            >
              <span className="text-blur__word">cambiar</span>
              <span className="text-blur__word"> vista</span>
            </button>
            <button
              className={`btn btn-controls btn-controls--${page}`}
              onClick={() => setPage((page + 1) % 4)}
            >
              <span className="text-blur__word">avanzar</span>
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
