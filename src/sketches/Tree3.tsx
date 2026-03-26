import React, { useEffect, useRef } from "react";
import p5Types from "p5";
import p5 from "p5";

// const FONT_PATH = "../../assets/fonts/ancizar-serif-latin-400-normal.ttf";
// const TEXT_PATH = "../../assets/texts/3.txt";

const FONT_PATH =
  "/arboles_con-texto--react/assets/fonts/ancizar-serif-latin-400-normal.ttf";
const TEXT_PATH = "/arboles_con-texto--react/assets/texts/3.txt";
const SPACING_FACTOR = 0.95;

const CAM_PRESETS = [
  { pos: [-235.7, -114.0, 292.1], look: [-81.3, -114.0, -15.6] },
  { pos: [138, -219, 203], look: [-63, -103, 22] },
  { pos: [-3, 35, 164], look: [-88, -252, -31] },
  { pos: [-116, -129, 174], look: [-51, -153, -29] },
];

interface Tree3Controls {
  nextCamera: () => void;
  nextSeed: () => void;
}

interface Tree3Props {
  onReady?: (controls: Tree3Controls) => void;
}

const Tree3: React.FC<Tree3Props> = ({ onReady }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const state = useRef({
    fontTree: undefined as p5Types.Font | undefined,
    textTree: [] as string[],

    fullTxt: "",
    words: [] as string[],
    text_trunk: "",

    angle: 0,
    ANGLE_INCREMENT: 0.05,

    cameras: [] as p5Types.Camera[],
    camIndex: 0,

    seed: 11,
  });

  useEffect(() => {
    if (!containerRef.current) return;

    const sketch = (p: p5) => {
      p.setup = async () => {
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

        if (iteration < 1) {
          const endY = (-len / 3) * 2;
          textLine(p, 0, 0, 0, 0, endY, 0, strWgt);
          p.translate(-3, endY, 0);
        } else if (iteration < 2) {
          const endY = (-len / 3) * 2;
          textLine(p, 0, 0, 0, 0, endY, 0, strWgt);
          p.translate(0, endY, 0);
        } else {
          textLine(p, 0, 0, 0, 0, -len - 2, 0, strWgt);
          p.translate(0, -len, 0);
        }

        if (len > 30) {
          for (let i = 0; i < 6; i++) {
            p.rotateY(60);
            p.push();
            p.rotateZ(p.random(10, 100));
            branch(p, len * 0.5, iteration + 1);
            p.pop();
          }
        } else {
          p.fill(
            110 + p.random(0, 30),
            16 + p.random(0, 30),
            100 + p.random(0, 30),
            255,
          );
          p.noStroke();
          p.push();
          p.translate(5, 0, 0);
          p.rotateY(p.random(60, 120));
          p.rotateX(180);
          p.textSize(7);

          for (let i = 0; i < 4; i++) {
            p.push();
            const currWord = p.random(state.current.words);
            p.rotateX(p.random(0, 20));
            p.text(currWord, p.random(-15, 15), p.random(-15, 15));
            p.pop();
          }

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

        for (let i = 0; i < 500; i++) {
          p.push();
          p.fill(
            100 + p.random(-30, 30),
            6 + p.random(-30, 30),
            90 + p.random(-30, 30),
            255,
          );
          p.translate(p.random(-110, 110), 0, p.random(-110, 110));
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

export default Tree3;
