import { moveAlongMultiQuadricBaziers } from "../../utils/canvas/interpolation";
import { PlaneSingleton } from "../../utils/canvas/plane";
import { circlePulse } from "../../utils/canvas/rendeners";
import { AdvancedGravityParticle } from "../../utils/canvas/GravityParticle";
import { randomPoint } from "../../utils/math";
import { emmitter } from "../../utils/canvas/boundary";

export const orbitingFountain = () => (height, width) => (
  canvas: HTMLCanvasElement,
  checkUnmount
) => {
  const context = canvas.getContext("2d");

  const originPosition = {
    x: width * 0.9,
    y: 50
  };

  new PlaneSingleton(
    {
      dimensions: { width, height }
    },
    context,
    true
  );

  const Sun = new AdvancedGravityParticle(
    randomPoint(10),
    // { x: width / 1.2, y: height / 4 },
    {
      size: 75,
      weight: 1455410,
      fillColor: "rgba(200,10,10, 0.5)",
      speed: 0
    },
    circlePulse(100)
  );

  const Sun2 = new AdvancedGravityParticle(
    randomPoint(10),
    // { x: width / 6, y: height / 2 },
    {
      size: 55,
      weight: -314100,
      fillColor: "rgba(100,100,10, 0.5)",
      speed: 0
    },
    circlePulse(75)
  );

  const Sun3 = new AdvancedGravityParticle(
    randomPoint(10),
    // { x: width / 2, y: height / 1.1 },
    {
      size: 35,
      weight: 455520,
      fillColor: "rgba(0,100,100, 0.2)",
      speed: 0
    },
    circlePulse(45)
  );

  const Sun4 = new AdvancedGravityParticle(
    randomPoint(10),
    // { x: width / 2, y: height / 8 },
    {
      size: 22,
      weight: -255520,
      fillColor: "rgba(10,255,100, 0.92)",
      speed: 0
    },
    circlePulse(30)
  );

  let particles = [];
  const numbersOfParticles = 2100;
  const particleSpeedFormula = () => 0.7 + Math.random() * 2;
  const particleDirectionFormula = () =>
    Math.PI / 2 + (Math.PI / 2) * (Math.random() - 0.5);

  for (let i = 1; i < numbersOfParticles; i++) {
    const circleSize = 1.2 + Math.random() * 3.5;
    const weight = circleSize;
    const particle = new AdvancedGravityParticle(originPosition, {
      size: circleSize,
      speed: particleSpeedFormula(),
      direction: -Math.PI / 3,
      weight
    });

    particle.setGravityTowards(Sun);
    particle.setGravityTowards(Sun2);
    particle.setGravityTowards(Sun3);
    particle.setGravityTowards(Sun4);
    particles.push(particle);
  }

  const numberOfPointsForIteration = 1009;

  const testArray = Array.from({ length: numberOfPointsForIteration }, () =>
    randomPoint(20)
  );

  const hugeGreen = Array.from({ length: numberOfPointsForIteration }, () =>
    randomPoint(20)
  );

  const redBaron = Array.from({ length: numberOfPointsForIteration }, () =>
    randomPoint(20)
  );

  const blueBilbo = Array.from({ length: numberOfPointsForIteration }, () =>
    randomPoint(20)
  );

  //less = faster
  const interpolationIntervals = 1500;
  const mulitQuadricMovePoint = moveAlongMultiQuadricBaziers(
    interpolationIntervals,
    testArray
  );
  const mulitQuadricRedBaron = moveAlongMultiQuadricBaziers(
    interpolationIntervals,
    redBaron
  );
  const mulitQuadricBlueBilbo = moveAlongMultiQuadricBaziers(
    interpolationIntervals,
    blueBilbo
  );
  const mulitQuadricHugeGreen = moveAlongMultiQuadricBaziers(
    interpolationIntervals,
    hugeGreen
  );

  const render = () => {
    if (checkUnmount() || particles.length < 2) {
      return;
    }

    context.clearRect(0, 0, width, height);

    Sun.render();
    Sun2.render();
    Sun3.render();

    const pulsarPosition = mulitQuadricMovePoint();
    const redBaronPosition = mulitQuadricRedBaron();
    const blueBilboPosition = mulitQuadricBlueBilbo();
    const hugeGreenPosition = mulitQuadricHugeGreen();
    Sun4.position.setCords(pulsarPosition);
    Sun3.position.setCords(blueBilboPosition);
    Sun.position.setCords(redBaronPosition);
    Sun2.position.setCords(hugeGreenPosition);
    Sun4.render();

    particles.forEach((particle: AdvancedGravityParticle) => {
      particle.render();
      emmitter(
        originPosition,
        particleSpeedFormula(),
        particleDirectionFormula(),
        particle,
        particle.features.size
      );
    });

    requestAnimationFrame(render);
  };

  render();
};
