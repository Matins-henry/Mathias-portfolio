import { useEffect, useRef } from "react";
import * as THREE from "three";

interface LoadingAnimationProps {
  isLoading: boolean;
}

export function LoadingAnimation({ isLoading }: LoadingAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>();

  useEffect(() => {
    if (!canvasRef.current || !isLoading) return;

    console.time('LoadingAnimation:init');

    // Three.js setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    });

    renderer.setSize(200, 200);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    camera.position.z = 5;

    // Create ring geometry
    const ringGeometry = new THREE.TorusGeometry(1, 0.2, 16, 32);
    const ringMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
      },
      vertexShader: `
        uniform float uTime;
        varying vec2 vUv;
        varying vec3 vNormal;

        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          
          // Add wave effect to the ring
          vec3 pos = position;
          float wave = sin(uTime * 2.0 + position.x * 2.0) * 0.1;
          pos += normal * wave;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        varying vec2 vUv;
        varying vec3 vNormal;

        void main() {
          // Create a gradient based on the UV coordinates
          vec3 baseColor = mix(
            vec3(0.3, 0.6, 1.0),
            vec3(0.1, 0.3, 0.6),
            vUv.x + sin(uTime) * 0.2
          );
          
          // Add rim lighting effect
          float rimLight = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
          vec3 finalColor = mix(baseColor, vec3(1.0), rimLight * 0.5);
          
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
    });

    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    scene.add(ring);

    // Add ambient and point lights
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x4169e1, 2, 10);
    pointLight.position.set(2, 2, 4);
    scene.add(pointLight);

    console.timeEnd('LoadingAnimation:init');

    // Animation loop
    const clock = new THREE.Clock();
    let lastFrame = 0;
    const fps = 30;
    const frameInterval = 1000 / fps;

    const animate = () => {
      const now = performance.now();
      const elapsed = now - lastFrame;

      if (elapsed > frameInterval) {
        const elapsedTime = clock.getElapsedTime();
        
        // Update uniforms
        ringMaterial.uniforms.uTime.value = elapsedTime;
        
        // Rotate the ring
        ring.rotation.x = Math.sin(elapsedTime * 0.5) * 0.5;
        ring.rotation.y += 0.02;
        
        // Move the point light
        pointLight.position.x = Math.sin(elapsedTime) * 3;
        pointLight.position.y = Math.cos(elapsedTime) * 3;

        renderer.render(scene, camera);
        lastFrame = now - (elapsed % frameInterval);
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      scene.remove(ring);
      scene.remove(ambientLight);
      scene.remove(pointLight);
      ringGeometry.dispose();
      ringMaterial.dispose();
      renderer.dispose();
    };
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <canvas
        ref={canvasRef}
        className="w-[200px] h-[200px]"
      />
    </div>
  );
}
