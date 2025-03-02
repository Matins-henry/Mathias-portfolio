import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import { SECTIONS } from "@/lib/constants";
import gsap from "gsap";
import * as THREE from "three";

export function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    // Three.js setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.z = 5;

    // Create animated background particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 5000;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 10;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.005,
      color: '#808080',
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      particlesMesh.rotation.y += 0.001;
      renderer.render(scene, camera);
    };
    animate();

    // GSAP animations
    const tl = gsap.timeline();
    tl.from(".hero-title", {
      y: 100,
      opacity: 0,
      duration: 1,
      ease: "power4.out",
    })
    .from(".hero-subtitle", {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: "power4.out",
    }, "-=0.5")
    .from(".hero-buttons", {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: "power4.out",
    }, "-=0.5");

    // Cleanup
    return () => {
      scene.remove(particlesMesh);
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      renderer.dispose();
    };
  }, []);

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