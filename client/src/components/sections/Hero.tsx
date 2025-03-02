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
        void main() {
          vertexNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vertexNormal;
        void main() {
          float intensity = pow(0.7 - dot(vertexNormal, vec3(0.0, 0.0, 1.0)), 2.0);
          gl_FragColor = vec4(0.3, 0.6, 1.0, intensity);
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
    });

    // Create globe material with simple shader
    const globeMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec2 vertexUV;
        varying vec3 vertexNormal;
        void main() {
          vertexUV = uv;
          vertexNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vertexUV;
        varying vec3 vertexNormal;
        void main() {
          float intensity = 1.05 - dot(vertexNormal, vec3(0.0, 0.0, 1.0));
          vec3 atmosphere = vec3(0.3, 0.6, 1.0) * pow(intensity, 1.5);
          gl_FragColor = vec4(atmosphere + vec3(0.1), 1.0);
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

        // Smooth rotation
        globe.rotation.y += 0.002;

        // Interactive tilt based on mouse position
        mouse.x += (mouse.targetX - mouse.x) * 0.05;
        mouse.y += (mouse.targetY - mouse.y) * 0.05;

        globe.rotation.x = mouse.y * 0.3;
        atmosphere.rotation.x = globe.rotation.x;
        atmosphere.rotation.y = globe.rotation.y;

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