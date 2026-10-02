"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function RetroComputerScene() {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;

    const context = canvas.getContext("webgl2", {
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    if (!context) {
      host.dataset.webgl = "unavailable";
      canvas.style.display = "none";
      return;
    }

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        context,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
    } catch {
      host.dataset.webgl = "unavailable";
      canvas.style.display = "none";
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(31, 1, 0.1, 100);
    camera.position.set(0, 2.35, 17.8);
    camera.lookAt(0, -0.15, 0);

    const computer = new THREE.Group();
    computer.position.y = 0.25;
    scene.add(computer);

    const warmPlastic = new THREE.MeshStandardMaterial({
      color: 0xc9c0a8,
      roughness: 0.58,
      metalness: 0.08,
    });
    const darkPlastic = new THREE.MeshStandardMaterial({
      color: 0x282720,
      roughness: 0.7,
      metalness: 0.12,
    });
    const keyMaterial = new THREE.MeshStandardMaterial({
      color: 0x38372f,
      roughness: 0.62,
      metalness: 0.05,
    });
    const screenMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x07110c,
      roughness: 0.22,
      metalness: 0.05,
      clearcoat: 0.7,
      emissive: 0x052413,
      emissiveIntensity: 0.45,
    });

    const makeBox = (
      size: [number, number, number],
      position: [number, number, number],
      material: THREE.Material,
    ) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
      mesh.position.set(...position);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      computer.add(mesh);
      return mesh;
    };

    makeBox([10.45, 6.9, 1.52], [0, 0.85, 0], warmPlastic);
    makeBox([8.72, 5.12, 0.18], [0, 1.13, 0.86], darkPlastic);
    makeBox([8.18, 4.58, 0.08], [0, 1.13, 0.98], screenMaterial);

    const led = new THREE.Mesh(
      new THREE.SphereGeometry(0.08, 18, 18),
      new THREE.MeshStandardMaterial({
        color: 0x8cff74,
        emissive: 0x5eff45,
        emissiveIntensity: 2.2,
      }),
    );
    led.position.set(4.35, -1.95, 0.85);
    computer.add(led);

    for (let index = 0; index < 8; index += 1) {
      makeBox([0.42, 0.04, 0.06], [-4.1 + index * 0.55, -2.03, 0.84], darkPlastic);
    }

    makeBox([1.25, 1.22, 1.05], [0, -3.05, -0.1], warmPlastic);
    makeBox([4.8, 0.42, 3.3], [0, -3.85, 0.38], warmPlastic);

    const keyboard = new THREE.Group();
    keyboard.position.set(0, -4.28, 2.7);
    keyboard.rotation.x = -0.22;
    computer.add(keyboard);

    const keyboardDeck = new THREE.Mesh(new THREE.BoxGeometry(8.2, 0.35, 3.15), warmPlastic);
    keyboardDeck.castShadow = true;
    keyboardDeck.receiveShadow = true;
    keyboard.add(keyboardDeck);

    const keyGeometry = new THREE.BoxGeometry(0.42, 0.18, 0.42);
    const keys = new THREE.InstancedMesh(keyGeometry, keyMaterial, 65);
    let keyIndex = 0;
    const matrix = new THREE.Matrix4();
    for (let row = 0; row < 5; row += 1) {
      const count = row === 4 ? 10 : 14;
      const rowWidth = (count - 1) * 0.52;
      for (let col = 0; col < count; col += 1) {
        matrix.makeTranslation(-rowWidth / 2 + col * 0.52, 0.27, -0.98 + row * 0.5);
        keys.setMatrixAt(keyIndex, matrix);
        keyIndex += 1;
      }
    }
    keys.count = keyIndex;
    keys.castShadow = true;
    keyboard.add(keys);

    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(9, 64),
      new THREE.ShadowMaterial({ color: 0x000000, opacity: 0.42 }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -4.67;
    floor.receiveShadow = true;
    scene.add(floor);

    scene.add(new THREE.HemisphereLight(0xada4ff, 0x17120d, 1.4));
    const keyLight = new THREE.DirectionalLight(0xffecd2, 3.5);
    keyLight.position.set(-6, 9, 8);
    keyLight.castShadow = true;
    scene.add(keyLight);
    const rimLight = new THREE.PointLight(0x8d6cff, 24, 22, 2);
    rimLight.position.set(6, 2, 5);
    scene.add(rimLight);
    const screenLight = new THREE.PointLight(0x52ff9a, 7, 10, 2);
    screenLight.position.set(0, 1.1, 3.4);
    scene.add(screenLight);

    let pointerX = 0;
    let pointerY = 0;
    const onPointerMove = (event: PointerEvent) => {
      const bounds = host.getBoundingClientRect();
      pointerX = (event.clientX - bounds.left) / bounds.width - 0.5;
      pointerY = (event.clientY - bounds.top) / bounds.height - 0.5;
    };

    const resize = () => {
      const bounds = host.getBoundingClientRect();
      renderer.setSize(Math.max(1, bounds.width), Math.max(1, bounds.height), false);
      camera.aspect = bounds.width / Math.max(1, bounds.height);
      camera.fov = bounds.width < 620 ? 38 : 31;
      camera.position.z = bounds.width < 620 ? 21.8 : 17.8;
      camera.updateProjectionMatrix();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    host.addEventListener("pointermove", onPointerMove);
    resize();

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    const render = (time: number) => {
      if (!reduced) frame = window.requestAnimationFrame(render);
      computer.rotation.y += (pointerX * 0.045 - computer.rotation.y) * 0.035;
      computer.rotation.x += (-pointerY * 0.025 - computer.rotation.x) * 0.035;
      computer.position.y = 0.25 + (reduced ? 0 : Math.sin(time * 0.00055) * 0.055);
      rimLight.intensity = 22 + Math.sin(time * 0.0011) * 3;
      renderer.render(scene, camera);
    };
    render(0);

    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      host.removeEventListener("pointermove", onPointerMove);
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => material.dispose());
        }
      });
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={hostRef} className="retro-computer-scene" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}
