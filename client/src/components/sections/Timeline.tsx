import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import * as THREE from "three";
import { SECTIONS, CAREER_MILESTONES } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";

export function Timeline() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    // Three.js setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.offsetWidth / containerRef.current.offsetHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
    });

    renderer.setSize(containerRef.current.offsetWidth, containerRef.current.offsetHeight);
    camera.position.z = 15;

    // Create timeline path
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-10, -5, 0),
      new THREE.Vector3(-5, 5, -5),
      new THREE.Vector3(0, -2, -8),
      new THREE.Vector3(5, 3, -5),
      new THREE.Vector3(10, -4, 0),
    ]);

    const points = curve.getPoints(50);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: 0x808080 });
    const timelinePath = new THREE.Line(geometry, material);
    scene.add(timelinePath);

    // Create milestone markers
    const milestoneGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const milestoneMaterial = new THREE.MeshPhongMaterial({
      color: 0x4a90e2,
      emissive: 0x4a90e2,
      emissiveIntensity: 0.2,
    });

    const milestones = CAREER_MILESTONES.map((_, index) => {
      const t = index / (CAREER_MILESTONES.length - 1);
      const position = curve.getPoint(t);
      const milestone = new THREE.Mesh(milestoneGeometry, milestoneMaterial);
      milestone.position.copy(position);
      scene.add(milestone);
      return milestone;
    });

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    // Animation
    let frame = 0;
    const animate = () => {
      frame = requestAnimationFrame(animate);

      milestones.forEach((milestone, index) => {
        milestone.rotation.y += 0.01;
        milestone.position.y += Math.sin(Date.now() * 0.001 + index) * 0.002;
      });

      camera.position.x = Math.sin(Date.now() * 0.0005) * 2;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.offsetWidth;
      const height = containerRef.current.offsetHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    // Handle mouse interaction
    const handleMouseMove = (event: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      camera.position.x = x * 3;
      camera.position.y = y * 2;
      camera.lookAt(scene.position);
    };

    containerRef.current.addEventListener("mousemove", handleMouseMove);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", handleResize);
      containerRef.current?.removeEventListener("mousemove", handleMouseMove);
      
      // Cleanup Three.js resources
      scene.remove(timelinePath);
      geometry.dispose();
      material.dispose();
      
      milestones.forEach((milestone) => {
        scene.remove(milestone);
        milestone.geometry.dispose();
        (milestone.material as THREE.Material).dispose();
      });
      
      renderer.dispose();
    };
  }, []);

  return (
    <section
      id={SECTIONS.TIMELINE}
      ref={containerRef}
      className="min-h-screen relative py-20 bg-background overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full -z-10"
      />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-center mb-12">Career Journey</h2>

          <div ref={timelineRef} className="space-y-12">
            {CAREER_MILESTONES.map((milestone, index) => (
              <motion.div
                key={milestone.year}
                initial={{ opacity: 0, x: index % 2 ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`flex ${
                  index % 2 ? "md:flex-row-reverse" : "md:flex-row"
                } items-center gap-8`}
              >
                <div className="flex-1">
                  <div className="bg-card p-6 rounded-lg backdrop-blur-sm bg-background/80 hover:bg-background/95 transition-all duration-300">
                    <h3 className="text-2xl font-bold mb-2">{milestone.year}</h3>
                    <h4 className="text-xl text-primary mb-1">{milestone.title}</h4>
                    <p className="text-muted-foreground mb-2">{milestone.company}</p>
                    <p className="mb-4">{milestone.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {milestone.tech.map((tech) => (
                        <Badge
                          key={tech}
                          variant="secondary"
                          className="bg-primary/10 text-primary hover:bg-primary/20"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="hidden md:block flex-1" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
