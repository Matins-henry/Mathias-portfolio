import { motion } from "framer-motion";
import { BLOG_POSTS } from "@/lib/constants";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function Blog() {
  return (
    <div className="min-h-screen py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Blog
          </h1>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {BLOG_POSTS.map((post) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="group"
              >
                <Link href={`/blog/${post.id}`}>
                  <a className="block">
                    <div className="relative overflow-hidden rounded-lg aspect-video mb-4">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{format(new Date(post.date), 'MMM dd, yyyy')}</span>
                        <span>•</span>
                        <span>{post.author}</span>
                      </div>
                      <h2 className="text-xl font-semibold group-hover:text-primary transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-muted-foreground line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="flex flex-wrap gap-2 pt-2">
                        {post.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="bg-primary/10 text-primary hover:bg-primary/20"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </a>
                </Link>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
