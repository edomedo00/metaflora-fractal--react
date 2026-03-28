import { useEffect, useRef } from "react";
import p5 from "p5";

interface PlantSketchProps {
  cameraZ?: number;
}

const PlantSketch = ({ cameraZ = 201.3 }: PlantSketchProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sketch = (p: p5) => {
      let angle = 0;
      const ANGLE_INC = 0.02;
      let cam: any;

      p.setup = () => {
        const { clientWidth, clientHeight } = containerRef.current!;

        p.createCanvas(clientWidth, clientHeight, p.WEBGL);

        p.angleMode(p.DEGREES);

        cam = (p as any)._renderer.mainCamera;
        cam.setPosition(-6.0, -55.7, cameraZ);
        cam.lookAt(-6.0, -55.7, 0.0);

        // cam.setPosition(-2.3, -61.3, 152.1);
        // cam.lookAt(-2.3, -61.3, 0.0);

        // cam.setPosition(-2.3, -61.3, 175.0);
        // cam.lookAt(-2.3, -61.3, 0.0);
      };

      p.draw = () => {
        p.background(255, 255, 239);
        p.rotateY(angle);
        p.randomSeed(19);
        // p.orbitControl();
        branch(200, 0);
        angle += ANGLE_INC;
      };

      const branch = (len: number, iteration: number) => {
        const short = -len / 4;
        const mid = -len / 5;
        const long = -(len / 2);

        const segment = iteration === 0 ? short : iteration < 2 ? mid : long;

        p.strokeWeight(p.map(len, 10, 100, 0.5, 1.7));
        p.stroke(87, 117, 5);
        p.line(0, 0, 0, 0, segment, 0);
        p.translate(0, segment, 0);

        if (len > 20) {
          for (let i = 0; i < 4; i++) {
            p.push();
            p.rotateY(i * 90);
            p.rotateZ(p.random(10, 100));
            branch(len * 0.5, iteration + 1);
            p.pop();
          }
        } else {
          drawLeaf();
        }
      };

      const drawLeaf = () => {
        const r = 80 + p.random(-20, 20);
        const g = 120 + p.random(-20, 20);
        const b = 40 + p.random(-20, 20);

        p.fill(r, g, b, 200);
        p.noStroke();

        p.rotateZ(p.random(-15, 15));
        p.rotateY(p.random(-15, 15));
        p.rect(-2, -2, p.random(4, 5), p.random(5, 7));
      };

      p.keyPressed = () => {
        if (p.key === "s") {
          const cam = (p as any)._renderer.mainCamera;
          console.log(
            `cam.setPosition(${cam.eyeX.toFixed(1)}, ${cam.eyeY.toFixed(1)}, ${cam.eyeZ.toFixed(1)})`,
          );
          console.log(
            `cam.lookAt(${cam.centerX.toFixed(1)}, ${cam.centerY.toFixed(1)}, ${cam.centerZ.toFixed(1)})`,
          );
        }
      };

      p.windowResized = () => {
        if (!containerRef.current) return;
        const { clientWidth, clientHeight } = containerRef.current;
        p.resizeCanvas(clientWidth, clientHeight);
      };
    };

    const p5Instance = new p5(sketch, containerRef.current!);

    return () => {
      p5Instance.remove();
    };
  }, [cameraZ]);

  return (
    <div ref={containerRef} style={{ width: "100%", aspectRatio: "4/3" }} />
  );
};

export default PlantSketch;
