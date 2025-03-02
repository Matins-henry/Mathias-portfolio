import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import { SECTIONS } from "@/lib/constants";
import gsap from "gsap";
import * as THREE from "three";

export function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number>();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Setup intersection observer for lazy initialization
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible || !canvasRef.current || !containerRef.current) return;

    console.time('Hero:init');

    // Three.js setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    camera.position.z = 5;

    // Create globe geometry
    const globeGeometry = new THREE.SphereGeometry(2, 64, 64);

    // Create atmosphere effect
    const atmosphereGeometry = new THREE.SphereGeometry(2.1, 64, 64);
    const atmosphereMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vertexNormal;
        varying vec3 viewVector;

        void main() {
          vertexNormal = normalize(normalMatrix * normal);
          viewVector = normalize(cameraPosition - (modelMatrix * vec4(position, 1.0)).xyz);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vertexNormal;
        varying vec3 viewVector;

        void main() {
          float rim = pow(0.7 - dot(vertexNormal, viewVector), 3.0);
          vec3 glow = vec3(0.3, 0.6, 1.0);
          gl_FragColor = vec4(glow, rim * 0.6);
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
    });

    // Create globe material with advanced shader
    const globeMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uLight: { value: new THREE.Vector3(1, 1, 1).normalize() },
        uMouse: { value: new THREE.Vector2(0, 0) },
      },
      vertexShader: `
        uniform float uTime;
        uniform vec2 uMouse;
        varying vec2 vertexUV;
        varying vec3 vertexNormal;
        varying vec3 viewVector;
        varying vec3 worldPosition;

        void main() {
          vertexUV = uv;
          vertexNormal = normalize(normalMatrix * normal);
          worldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
          viewVector = normalize(cameraPosition - worldPosition);

          // Add subtle vertex displacement based on mouse position
          vec3 mouseEffect = vec3(uMouse.x, uMouse.y, 0.0);
          float distanceToMouse = length(mouseEffect - position.xyz);
          vec3 newPosition = position + normal * sin(distanceToMouse * 5.0 + uTime) * 0.02;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uLight;
        uniform float uTime;
        uniform vec2 uMouse;

        varying vec2 vertexUV;
        varying vec3 vertexNormal;
        varying vec3 viewVector;
        varying vec3 worldPosition;

        void main() {
          // Dynamic base color gradient
          vec3 baseColor = mix(
            vec3(0.1, 0.3, 0.6),
            vec3(0.3, 0.6, 1.0),
            vertexUV.y + sin(uTime * 0.5) * 0.2
          );

          // Enhanced diffuse lighting
          float diffuse = max(dot(vertexNormal, uLight), 0.0);

          // Advanced Fresnel rim effect
          float fresnel = pow(1.0 - dot(vertexNormal, viewVector), 3.0);
          vec3 rimColor = vec3(0.5, 0.7, 1.0);

          // Interactive wave pattern based on mouse position
          float mouseDistance = length(uMouse - vertexUV * 2.0);
          float wave = sin(mouseDistance * 10.0 - uTime) * 0.5 + 0.5;
          wave *= sin(vertexUV.x * 20.0 + uTime * 0.5) * 0.5 + 0.5;

          // Add subtle pulse effect
          float pulse = sin(uTime) * 0.5 + 0.5;

          // Combine all effects
          vec3 finalColor = baseColor * (diffuse * 0.5 + 0.5);
          finalColor += rimColor * fresnel * 0.4;
          finalColor += wave * vec3(0.1, 0.2, 0.3) * 0.3;
          finalColor *= 0.8 + pulse * 0.2;

          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
    });

    const globe = new THREE.Mesh(globeGeometry, globeMaterial);
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);

    scene.add(globe);
    scene.add(atmosphere);

    console.timeEnd('Hero:init');

    // Mouse interaction setup
    const mouse = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
    };

    let mouseTimeout: NodeJS.Timeout;
    const handleMouseMove = (event: MouseEvent) => {
      if (mouseTimeout) clearTimeout(mouseTimeout);
      mouseTimeout = setTimeout(() => {
        mouse.targetX = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.targetY = -(event.clientY / window.innerHeight) * 2 + 1;
      }, 50);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Add point lights for enhanced lighting
    const pointLight1 = new THREE.PointLight(0x4169e1, 2, 10);
    pointLight1.position.set(2, 2, 4);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x4169e1, 1.5, 10);
    pointLight2.position.set(-2, -2, 4);
    scene.add(pointLight2);

    // Animation loop with performance optimization
    const clock = new THREE.Clock();
    let lastFrame = 0;
    const fps = 30;
    const frameInterval = 1000 / fps;
    let frameCount = 0;
    let lastFPSUpdate = performance.now();

    const animate = () => {
      const now = performance.now();
      const elapsed = now - lastFrame;

      // FPS monitoring
      frameCount++;
      if (now - lastFPSUpdate >= 1000) {
        console.log(`Current FPS: ${frameCount}`);
        frameCount = 0;
        lastFPSUpdate = now;
      }

      if (elapsed > frameInterval) {
        const elapsedTime = clock.getElapsedTime();

        // Update shader uniforms
        globeMaterial.uniforms.uTime.value = elapsedTime;
        globeMaterial.uniforms.uMouse.value.set(mouse.x, mouse.y);

        // Smooth rotation
        globe.rotation.y += 0.002;

        // Interactive tilt based on mouse position
        mouse.x += (mouse.targetX - mouse.x) * 0.05;
        mouse.y += (mouse.targetY - mouse.y) * 0.05;

        globe.rotation.x = mouse.y * 0.3;
        atmosphere.rotation.x = globe.rotation.x;
        atmosphere.rotation.y = globe.rotation.y;

        // Animate point lights
        pointLight1.position.x = Math.sin(elapsedTime * 0.5) * 3;
        pointLight1.position.y = Math.cos(elapsedTime * 0.3) * 3;
        pointLight2.position.x = Math.sin(elapsedTime * 0.3) * -3;
        pointLight2.position.y = Math.cos(elapsedTime * 0.5) * -3;

        renderer.render(scene, camera);
        lastFrame = now - (elapsed % frameInterval);
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    // GSAP animations for content
    console.time('Hero:gsap');
    const tl = gsap.timeline();
    tl.from(".hero-title, .hero-subtitle, .hero-buttons", {
      y: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: "power4.out",
    });
    console.timeEnd('Hero:gsap');

    // Optimized resize handler
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        console.time('Hero:resize');
        const width = window.innerWidth;
        const height = window.innerHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
        console.timeEnd('Hero:resize');
      }, 250);
    };

    window.addEventListener('resize', handleResize, { passive: true });

    // Cleanup
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      if (mouseTimeout) clearTimeout(mouseTimeout);
      if (resizeTimeout) clearTimeout(resizeTimeout);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      scene.remove(globe);
      scene.remove(atmosphere);
      scene.remove(pointLight1);
      scene.remove(pointLight2);
      globeGeometry.dispose();
      atmosphereGeometry.dispose();
      globeMaterial.dispose();
      atmosphereMaterial.dispose();
      renderer.dispose();
    };
  }, [isVisible]);

  return (
    <section
      id={SECTIONS.HOME}
      ref={containerRef}
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full -z-10"
      />

      <div className="container mx-auto px-4 py-12 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="hero-title text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Mathias Henry
          </h1>
          <p className="hero-subtitle text-xl md:text-2xl text-muted-foreground mb-8">
            Full Stack Developer & UI/UX Designer
          </p>
          <div className="hero-buttons flex justify-center gap-4">
            <Button
              size="lg"
              onClick={() =>
                document
                  .getElementById(SECTIONS.CONTACT)
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="bg-primary hover:bg-primary/90 transition-all duration-300"
            >
              Get in Touch
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary text-primary hover:bg-primary/10 transition-all duration-300"
              onClick={() => window.open('/resume.pdf', '_blank')}
            >
              Download Resume
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              document
                .getElementById(SECTIONS.ABOUT)
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            <ArrowDown className="h-6 w-6 animate-bounce" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}