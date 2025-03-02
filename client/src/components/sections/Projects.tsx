import { motion, useScroll, useTransform } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SECTIONS, PROJECTS } from "@/lib/constants";
import { useRef } from "react";

export function Projects() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  return (
    <section
      id={SECTIONS.PROJECTS}
      ref={containerRef}
      className="py-20 bg-background relative"
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-center mb-12">Projects</h2>

          <div className="grid md:grid-cols-2 gap-8">
            {PROJECTS.map((project, index) => {
              const rotateY = useTransform(
                scrollYProgress,
                [0, 1],
                [index % 2 === 0 ? -15 : 15, 0]
              );

              return (
                <motion.div
                  key={project.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  style={{
                    perspective: 1000,
                  }}
                >
                  <motion.div
                    style={{ rotateY }}
                    whileHover={{
                      scale: 1.05,
                      rotateY: 0,
                      transition: { duration: 0.3 },
                    }}
                  >
                    <Card className="overflow-hidden backdrop-blur-sm bg-background/80 hover:bg-background/95 transition-all duration-300">
                      <div className="relative overflow-hidden">
                        <img
                          src={project.image}
                          alt={project.imageAlt}
                          className="w-full h-48 object-cover transform hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                      </div>
                      <CardHeader>
                        <CardTitle className="text-2xl">{project.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4">
                          {project.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {project.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="bg-primary/10 text-primary hover:bg-primary/20"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}