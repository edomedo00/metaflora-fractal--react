import React, { useEffect, useRef } from "react";
import p5Types from "p5";
import p5 from "p5";

// const TEXT_PATH = "/arboles_con-texto--react/assets/texts/3.txt";
// const FONT_PATH =
//   "/arboles_con-texto--react/assets/fonts/ancizar-serif-latin-400-normal.ttf";

const FONT_PATH =
  "/arboles_con-texto--react/assets/fonts/ancizar-serif-latin-400-normal.ttf";
const TEXT_PATH = "/arboles_con-texto--react/assets/texts/1.txt";

const SPACING_FACTOR = 0.95;

const CAM_PRESETS = [
  { pos: [-72, -116, 345], look: [-72, -116, 0] },
  { pos: [110, -256, 205], look: [-70, -86, 36] },
  { pos: [-20.6, 15.2, 201.1], look: [-97.5, -213.6, -64.7] },
  { pos: [-87, -145, 223], look: [-87, -145, 0] },
];

// ── Types ────────────────────────────────────────────────────────────────────

interface Tree1Controls {
  nextCamera: () => void;
  nextSeed: () => void;
}

interface Tree1Props {
  onReady?: (controls: Tree1Controls) => void;
}

// ── Component ────────────────────────────────────────────────────────────────

const Tree1: React.FC<Tree1Props> = ({ onReady }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const isMobile = !window.matchMedia("(hover: hover)").matches;

  const state = useRef({
    fontTree: undefined as p5Types.Font | undefined,
    textTree: [] as string[],

    fullTxt: "",
    words: [] as string[],
    text_trunk: "",

    angle: 0,
    ANGLE_INCREMENT: isMobile ? 0.02 : 0.05,

    cameras: [] as p5Types.Camera[],
    camIndex: 0,

    seed: 11,
  });

  useEffect(() => {
    if (!containerRef.current) return;

    const sketch = (p: p5) => {
      p.setup = async () => {
        p.pixelDensity(isMobile ? 1 : p.displayDensity());
        p.frameRate(isMobile ? 30 : 60);
        p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL).parent(
          containerRef.current!,
        );
        p.angleMode(p.DEGREES);

        const s = state.current;

        try {
          s.fontTree = await (p.loadFont(FONT_PATH) as any);
          s.textTree = await (p.loadStrings(TEXT_PATH) as any);

          if (s.fontTree) {
            p.textFont(s.fontTree);
          }
          p.textSize(15);

          if (s.textTree && s.textTree.length > 0) {
            s.fullTxt = s.textTree.join("\n").replace(/\\n/g, "\n");
            s.words = s.fullTxt.split(" ");
            s.text_trunk = s.fullTxt.replace(/\s+/g, "");
          }
        } catch (error) {
          console.error("Failed to load assets:", error);
        }

        s.cameras = CAM_PRESETS.map(({ pos, look }) => {
          const c = p.createCamera();
          c.setPosition(...(pos as [number, number, number]));
          c.lookAt(...(look as [number, number, number]));
          return c;
        });

        p.setCamera(s.cameras[0]);

        onReady?.({
          nextCamera: () => {
            const s = state.current;
            s.camIndex = (s.camIndex + 1) % s.cameras.length;
            s.cameras.forEach((c, i) => {
              c.setPosition(
                ...(CAM_PRESETS[i].pos as [number, number, number]),
              );
              c.lookAt(...(CAM_PRESETS[i].look as [number, number, number]));
            });
            p.setCamera(s.cameras[s.camIndex]);
          },
          nextSeed: () => {
            state.current.seed = Math.floor(Math.random() * 10000);
          },
        });
      };

      p.draw = () => {
        p.background(255, 255, 239);
        p.orbitControl();
        p.rotateY(state.current.angle);
        p.randomSeed(state.current.seed);

        ground(p);
        branch(p, 200, 0);

        state.current.angle += state.current.ANGLE_INCREMENT;
      };

      const branch = (p: p5Types, len: number, iteration: number) => {
        const strWgt = p.map(len, 10, 100, 0.5, 5);
        const tipLen = iteration === 0 ? len / 2 : len;

        p.strokeWeight(strWgt);
        p.stroke(70, 40, 20, 255);

        if (iteration === 0) {
          textLine(p, 0, 0, 0, 0, -(len / 2), 0, strWgt);
          p.translate(-4, -tipLen, 0);
        } else {
          textLine(p, 0, 0, 0, 0, -(len / 2), 0, strWgt);
          p.translate(0, -tipLen, 0);
        }

        if (len > (isMobile ? 20 : 13)) {
          for (let i = 0; i < 5; i++) {
            p.rotateY(72);
            p.push();
            p.rotateZ(p.random(50, 70));
            branch(p, len * 0.5, iteration + 1);
            p.pop();
          }
        } else {
          p.fill(
            80 + p.random(-20, 20),
            120 + p.random(-20, 20),
            40 + p.random(-20, 20),
            255,
          );
          p.noStroke();
          p.push();
          p.translate(5, 0, 0);
          p.rotateY(p.random(60, 120));
          p.rotateX(180);
          p.textSize(7);
          p.text(p.random(state.current.words), 0, 0);
          p.pop();
        }
      };

      const textLine = (
        p: p5Types,
        x1: number,
        y1: number,
        z1: number,
        x2: number,
        y2: number,
        z2: number,
        strWgt: number,
      ) => {
        let index = 0;
        let lineLen = 0;
        const overdraw = p.textWidth("a");

        const totalLen = p.dist(x1, y1, z1, x2, y2, z2);
        const dirNorm = p.createVector(x2 - x1, y2 - y1, z2 - z1).normalize();

        const forward = p.createVector(1, 0, 0);
        const dot = p.constrain(forward.dot(dirNorm), -1, 1);
        const rotAngle = p.acos(dot);
        const axis = forward.cross(dirNorm);
        const axisNorm = axis.mag() > 0.0001 ? axis.normalize() : null;

        p.textSize(Math.max(strWgt * 1.5, 4));

        let iters = 0;
        const SAFETY = 2000;

        while (lineLen < totalLen + overdraw && iters < SAFETY) {
          const char =
            state.current.text_trunk[index % state.current.text_trunk.length];
          const charW = p.textWidth(char);

          if (charW <= 0) {
            index++;
            iters++;
            continue;
          }

          if (lineLen + charW > totalLen + overdraw) break;

          p.push();
          p.translate(
            x1 + dirNorm.x * lineLen,
            y1 + dirNorm.y * lineLen,
            z1 + dirNorm.z * lineLen,
          );

          if (axisNorm) {
            p.rotate(rotAngle, axisNorm);
          } else if (dot < 0) {
            p.rotate(p.PI, p.createVector(0, 1, 0));
          }

          p.fill(70, 40, 20, 200);
          p.noStroke();
          p.text(char, 0, 0);
          p.pop();

          lineLen += charW * SPACING_FACTOR;
          index++;
          iters++;
        }
      };

      const ground = (p: p5Types) => {
        p.push();
        p.textSize(6);

        const count = isMobile ? 150 : 500;

        for (let i = 0; i < count; i++) {
          p.push();
          p.fill(
            80 + p.random(-20, 20),
            120 + p.random(-20, 20),
            40 + p.random(-20, 20),
            255,
          );
          p.translate(p.random(-100, 100), 0, p.random(-100, 100));
          p.rotateZ(p.random(-20, 20));
          p.rotateY(p.random(-200, 200));
          p.text(p.random(state.current.words), 0, 0);
          p.pop();
        }

        p.pop();
      };

      // p.doubleClicked = () => {
      //   state.current.camIndex =
      //     (state.current.camIndex + 1) % state.current.cameras.length;

      //   state.current.cameras.forEach((c, i) => {
      //     c.setPosition(...(CAM_PRESETS[i].pos as [number, number, number]));
      //     c.lookAt(...(CAM_PRESETS[i].look as [number, number, number]));
      //   });

      //   p.setCamera(state.current.cameras[state.current.camIndex]);
      // };

      p.windowResized = () => p.resizeCanvas(p.windowWidth, p.windowHeight);
    };

    const p5Instance = new p5(sketch, containerRef.current);

    return () => p5Instance.remove();
  }, []);

  return <div ref={containerRef}></div>;
};

export default Tree1;
