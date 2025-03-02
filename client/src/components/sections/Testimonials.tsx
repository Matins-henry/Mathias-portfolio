import { motion } from "framer-motion";

const TESTIMONIALS = [
  {
    name: "Sarah Johnson",
    role: "Tech Lead at InnovateCorp",
    content: "Mathias is an exceptional developer with a keen eye for detail. His work on our project exceeded expectations.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330"
  },
  {
    name: "Michael Chen",
    role: "CEO of DigitalFlow",
    content: "Working with Mathias was a game-changer for our startup. His technical expertise and problem-solving skills are outstanding.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"
  },
  {
    name: "Emily Rodriguez",
    role: "Product Manager at TechSolutions",
    content: "Mathias has a unique ability to transform complex requirements into elegant solutions. A true professional.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80"
  }
];

export function Testimonials() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Client Testimonials
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {TESTIMONIALS.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-card rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-card-foreground">
                      {testimonial.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <blockquote className="text-card-foreground">
                  "{testimonial.content}"
                </blockquote>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
