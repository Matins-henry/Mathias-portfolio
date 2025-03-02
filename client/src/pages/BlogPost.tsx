import { useParams } from "wouter";
import { motion } from "framer-motion";
import { BLOG_POSTS } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function BlogPost() {
  const { id } = useParams<{ id: string }>();
  const post = BLOG_POSTS.find((p) => p.id === id);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Post not found</h1>
          <Link href="/blog">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Link href="/blog">
            <Button variant="ghost" className="mb-8">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </Link>

          <div className="max-w-3xl mx-auto">
            <div className="relative aspect-video rounded-lg overflow-hidden mb-8">
              <img
                src={post.image}
                alt={post.title}
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <span>{format(new Date(post.date), 'MMMM dd, yyyy')}</span>
              <span>•</span>
              <span>{post.author}</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {post.title}
            </h1>

            <div className="flex flex-wrap gap-2 mb-8">
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

            <div className="prose prose-lg dark:prose-invert max-w-none">
              {post.content.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
