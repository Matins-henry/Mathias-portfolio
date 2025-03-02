import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import { SECTIONS } from "@/lib/constants";

export function Hero() {
  return (
    <section
      id={SECTIONS.HOME}
      className="min-h-screen flex items-center justify-center relative bg-gradient-to-b from-background to-muted"
    >
      <div className="container mx-auto px-4 py-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            John Doe
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            Full Stack Developer & UI/UX Designer
          </p>
          <div className="flex justify-center gap-4">
            <Button
              size="lg"
              onClick={() =>
                document
                  .getElementById(SECTIONS.CONTACT)
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Get in Touch
            </Button>
            <Button
              size="lg"
              variant="outline"
              as="a"
              href="/resume.pdf"
              target="_blank"
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
