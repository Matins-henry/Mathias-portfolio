import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { SECTIONS } from "@/lib/constants";

export function About() {
  return (
    <section
      id={SECTIONS.ABOUT}
      className="py-20 bg-background"
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-center mb-12">About Me</h2>
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <Card>
              <CardContent className="p-6">
                <p className="text-lg leading-relaxed">
                  I'm a passionate Full Stack Developer with 5+ years of experience
                  building modern web applications. I specialize in React, Node.js,
                  and modern JavaScript frameworks.
                </p>
                <p className="text-lg leading-relaxed mt-4">
                  My approach combines technical expertise with creative
                  problem-solving to deliver exceptional user experiences and
                  scalable solutions.
                </p>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Experience</h3>
                <p className="text-muted-foreground">
                  Senior Developer at Tech Corp (2020-Present)
                </p>
                <p className="text-muted-foreground">
                  Full Stack Developer at Web Solutions (2018-2020)
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">Education</h3>
                <p className="text-muted-foreground">
                  MS in Computer Science - Tech University
                </p>
                <p className="text-muted-foreground">
                  BS in Software Engineering - Code College
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
