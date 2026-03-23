import { useEffect, useRef } from "react";
import p5 from "p5";

const PlantSketch = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sketch = (p: p5) => {
      let angle = 0;
      const ANGLE_INC = 0.1;
      let cam: any;

      p.setup = () => {
        const canvas = p.createCanvas(
          containerRef.current!.clientWidth,
          containerRef.current!.clientHeight,
          p.WEBGL,
        );
        canvas.parent(containerRef.current!);
        p.angleMode(p.DEGREES);

        cam = (p as any)._renderer.mainCamera;

        cam.setPosition(-8.7, -57.8, 201.3);
        cam.lookAt(-8.7, -57.8, 0.0);

        // cam.setPosition(-2.3, -61.3, 152.1);
        // cam.lookAt(-2.3, -61.3, 0.0);

        // cam.setPosition(-2.3, -61.3, 175.0);
        // cam.lookAt(-2.3, -61.3, 0.0);
      };

      p.draw = () => {
        p.background(255, 255, 239);
        p.rotateY(angle);
        p.randomSeed(18);
        p.orbitControl();
        branch(200, 0);
        angle += ANGLE_INC;
      };

      const branch = (len: number, iteration: number) => {
        const short = -len / 4;
        const mid = (-len / 7) * 2;
        const long = -(len / 2);

        const segment = iteration === 0 ? short : iteration < 2 ? mid : long;

        p.strokeWeight(p.map(len, 10, 100, 0.5, 1.7));
        p.stroke(33, 88, 42);
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
          // drawLeaf();
        }
      };

      const drawLeaf = () => {
        const r = 80 + p.random(-20, 20);
        const g = 120 + p.random(-20, 20);
        const b = 40 + p.random(-20, 20);

        p.fill(r, g, b, 200);
        p.noStroke();
        p.beginShape();

        for (let i = 45; i < 135; i++) {
          p.vertex(3 * p.cos(i), 3 * p.sin(i));
        }
        for (let i = 135; i > 45; i--) {
          p.vertex(7 * p.cos(i), 7 * p.sin(-i + 10));
        }

        p.endShape();
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
    };

    const p5Instance = new p5(sketch);

    return () => {
      p5Instance.remove();
    };
  }, []);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
};

export default PlantSketch;
