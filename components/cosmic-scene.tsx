"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type CosmicSceneProps = {
  mode?: "intro" | "hero";
  className?: string;
};

function makeGlowTexture(color: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const context = canvas.getContext("2d");

  if (!context) return null;

  const gradient = context.createRadialGradient(128, 128, 4, 128, 128, 128);
  gradient.addColorStop(0, color);
  gradient.addColorStop(0.18, `${color}cc`);
  gradient.addColorStop(0.48, `${color}38`);
  gradient.addColorStop(1, `${color}00`);
  context.fillStyle = gradient;
  context.fillRect(0, 0, 256, 256);

  return new THREE.CanvasTexture(canvas);
}

function seededRandom(seed: number) {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

export function CosmicScene({ mode = "hero", className = "" }: CosmicSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: window.innerWidth > 700,
      powerPreference: "high-performance",
    });
    renderer.setClearColor(0x020205, mode === "intro" ? 1 : 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030308, mode === "intro" ? 0.026 : 0.065);

    const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 120);
    camera.position.set(0, 0.1, mode === "intro" ? 8.8 : 8.4);

    const root = new THREE.Group();
    root.rotation.x = mode === "hero" ? 0.18 : 0;
    scene.add(root);

    const starCount = mode === "intro" ? 1700 : 900;
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const violet = new THREE.Color("#8b5cf6");
    const blue = new THREE.Color("#70e1ff");

    for (let index = 0; index < starCount; index += 1) {
      const radius = mode === "intro"
        ? 5 + seededRandom(index + 1) * 50
        : 5 + seededRandom(index + 1) * 28;
      const angle = seededRandom(index + 12) * Math.PI * 2;
      const spread = (seededRandom(index + 33) - 0.5) * (mode === "intro" ? 18 : 12);
      positions[index * 3] = Math.cos(angle) * radius;
      positions[index * 3 + 1] = spread;
      positions[index * 3 + 2] = -seededRandom(index + 66) * 60 + 8;

      const tone = violet.clone().lerp(blue, seededRandom(index + 95));
      colors[index * 3] = tone.r;
      colors[index * 3 + 1] = tone.g;
      colors[index * 3 + 2] = tone.b;
    }

    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    starGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const starMaterial = new THREE.PointsMaterial({
      size: mode === "intro" ? 0.055 : 0.04,
      transparent: true,
      opacity: 0.82,
      sizeAttenuation: true,
      vertexColors: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const stars = new THREE.Points(starGeometry, starMaterial);
    root.add(stars);

    const hole = new THREE.Group();
    hole.position.set(mode === "hero" ? -0.85 : 0, mode === "hero" ? -0.15 : 0, 0);
    hole.rotation.x = 1.1;
    hole.rotation.z = -0.18;
    root.add(hole);

    const core = new THREE.Mesh(
      new THREE.SphereGeometry(mode === "intro" ? 1.28 : 1.18, 48, 48),
      new THREE.MeshBasicMaterial({ color: 0x000000 }),
    );
    core.scale.y = 0.92;
    hole.add(core);

    const glowTexture = makeGlowTexture("#a36bff");
    if (glowTexture) {
      const glow = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: glowTexture,
          transparent: true,
          opacity: mode === "intro" ? 0.58 : 0.48,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        }),
      );
      glow.scale.setScalar(mode === "intro" ? 5.8 : 5.1);
      glow.position.z = -0.25;
      hole.add(glow);
    }

    const ringPalette = ["#fff2ce", "#ffbd59", "#e868ff", "#6be9ff"];
    ringPalette.forEach((color, index) => {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(1.55 + index * 0.19, 0.032 + index * 0.009, 12, 180),
        new THREE.MeshBasicMaterial({
          color,
          transparent: true,
          opacity: 0.92 - index * 0.13,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        }),
      );
      ring.scale.x = 1.48 + index * 0.04;
      ring.rotation.z = index * 0.06;
      ring.userData.speed = 0.08 + index * 0.035;
      hole.add(ring);
    });

    const dustCount = mode === "intro" ? 900 : 520;
    const dustPositions = new Float32Array(dustCount * 3);
    const dustColors = new Float32Array(dustCount * 3);
    const warm = new THREE.Color("#ffbb55");
    const cool = new THREE.Color("#a05cff");

    for (let index = 0; index < dustCount; index += 1) {
      const angle = seededRandom(index + 210) * Math.PI * 2;
      const radius = 1.55 + Math.pow(seededRandom(index + 420), 0.72) * 2.15;
      dustPositions[index * 3] = Math.cos(angle) * radius * 1.52;
      dustPositions[index * 3 + 1] = Math.sin(angle) * radius;
      dustPositions[index * 3 + 2] = (seededRandom(index + 630) - 0.5) * 0.15;

      const dustTone = warm.clone().lerp(cool, seededRandom(index + 840));
      dustColors[index * 3] = dustTone.r;
      dustColors[index * 3 + 1] = dustTone.g;
      dustColors[index * 3 + 2] = dustTone.b;
    }

    const dustGeometry = new THREE.BufferGeometry();
    dustGeometry.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
    dustGeometry.setAttribute("color", new THREE.BufferAttribute(dustColors, 3));
    const dustMaterial = new THREE.PointsMaterial({
      size: 0.035,
      transparent: true,
      opacity: 0.88,
      sizeAttenuation: true,
      vertexColors: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const dust = new THREE.Points(dustGeometry, dustMaterial);
    hole.add(dust);

    let pointerX = 0;
    let pointerY = 0;
    let width = 1;
    let height = 1;
    let visible = true;

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 700 ? 1.35 : 1.8));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.fov = width < 600 ? 58 : 46;
      camera.updateProjectionMatrix();

      if (mode === "hero") {
        const compact = width < 620;
        hole.position.x = compact ? -0.15 : -0.8;
        hole.scale.setScalar(compact ? 0.83 : 1);
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      pointerX = (event.clientX / window.innerWidth - 0.5) * 2;
      pointerY = (event.clientY / window.innerHeight - 0.5) * 2;
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true;
    });
    intersectionObserver.observe(canvas);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    resize();

    const clock = new THREE.Clock();
    let frame = 0;
    const render = () => {
      frame = window.requestAnimationFrame(render);
      if (!visible) return;

      const elapsed = clock.getElapsedTime();
      if (!reduceMotion) {
        dust.rotation.z = elapsed * 0.1;
        stars.rotation.z = elapsed * 0.004;
        stars.position.z = mode === "intro" ? (elapsed * 1.25) % 7 : 0;
        hole.children.forEach((child) => {
          if (typeof child.userData.speed === "number") {
            child.rotation.z = elapsed * child.userData.speed;
          }
        });
        root.rotation.y += (pointerX * 0.035 - root.rotation.y) * 0.025;
        root.rotation.x += ((mode === "hero" ? 0.18 : 0) - pointerY * 0.02 - root.rotation.x) * 0.025;
        camera.position.z = (mode === "intro" ? 8.8 : 8.4) + Math.sin(elapsed * 0.35) * 0.12;
      }
      renderer.render(scene, camera);
    };
    render();

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointerMove);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Points || object instanceof THREE.Sprite) {
          object.geometry?.dispose();
          const material = object.material;
          if (Array.isArray(material)) material.forEach((item) => item.dispose());
          else material?.dispose();
        }
      });
      glowTexture?.dispose();
      renderer.dispose();
    };
  }, [mode]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
