export const SECTIONS = {
  HOME: "home",
  ABOUT: "about",
  SKILLS: "skills",
  TIMELINE: "timeline",
  PROJECTS: "projects",
  BLOG: "blog",
  CONTACT: "contact",
};

export const SKILLS = [
  { name: "React", level: 90 },
  { name: "JavaScript", level: 85 },
  { name: "Node.js", level: 80 },
  { name: "TypeScript", level: 75 },
  { name: "HTML/CSS", level: 90 },
  { name: "Tailwind", level: 85 },
  { name: "Git", level: 80 },
  { name: "REST APIs", level: 85 },
];

export const CAREER_MILESTONES = [
  {
    year: 2024,
    title: "Senior Full Stack Developer",
    company: "Tech Innovations Inc.",
    description: "Leading development of enterprise-scale applications",
    tech: ["React", "Node.js", "AWS"],
  },
  {
    year: 2022,
    title: "Full Stack Team Lead",
    company: "Digital Solutions Ltd",
    description: "Managed team of 5 developers, delivered 12 major projects",
    tech: ["React", "TypeScript", "PostgreSQL"],
  },
  {
    year: 2020,
    title: "Full Stack Developer",
    company: "Web Solutions",
    description: "Developed and maintained multiple client projects",
    tech: ["JavaScript", "React", "Node.js"],
  },
  {
    year: 2018,
    title: "Junior Developer",
    company: "StartUp Tech",
    description: "Built and launched 3 successful web applications",
    tech: ["JavaScript", "HTML/CSS", "jQuery"],
  },
];

export const PROJECTS = [
  {
    id: "project-management-dashboard",
    title: "Project Management Dashboard",
    description: "A modern project management tool built with React and Node.js",
    image: "https://images.unsplash.com/photo-1508873535684-277a3cbcc4e8",
    imageAlt: "Project Management Dashboard",
    tags: ["React", "Node.js", "Express", "MongoDB"],
    fullDescription: `A comprehensive project management solution that helps teams collaborate effectively. 
    Features include task management, team communication, and real-time updates.

    Key Features:
    - Real-time task tracking
    - Team collaboration tools
    - Resource management
    - Analytics dashboard`,
    link: "https://github.com/example/project-dashboard",
    demo: "https://project-dashboard.demo.com"
  },
  {
    id: "ecommerce-platform",
    title: "E-commerce Platform",
    description: "Full-featured e-commerce solution with payment integration",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40",
    imageAlt: "E-commerce Platform",
    tags: ["React", "Redux", "Node.js", "Stripe"],
    fullDescription: `A scalable e-commerce platform with modern features and secure payment processing.
    Built with performance and user experience in mind.

    Key Features:
    - Product catalog management
    - Shopping cart functionality
    - Secure payment processing
    - Order management system`,
    link: "https://github.com/example/ecommerce",
    demo: "https://ecommerce.demo.com"
  },
  {
    id: "social-media-analytics",
    title: "Social Media Analytics",
    description: "Real-time social media analytics and reporting platform",
    image: "https://images.unsplash.com/photo-1664580618281-fbc47baf6edf",
    imageAlt: "Social Media Analytics",
    tags: ["React", "D3.js", "Node.js", "WebSocket"],
    fullDescription: `A powerful analytics platform that provides real-time insights into social media performance.
    Features interactive visualizations and detailed reporting.

    Key Features:
    - Real-time data processing
    - Interactive dashboards
    - Custom report generation
    - Trend analysis`,
    link: "https://github.com/example/social-analytics",
    demo: "https://social-analytics.demo.com"
  },
  {
    id: "ai-content-generator",
    title: "AI Content Generator",
    description: "AI-powered content generation and optimization tool",
    image: "https://images.unsplash.com/photo-1712668401428-df42b8bd93fc",
    imageAlt: "AI Content Generator",
    tags: ["React", "Python", "OpenAI", "Flask"],
    fullDescription: `An innovative content generation tool powered by AI technology.
    Helps creators produce high-quality content efficiently.

    Key Features:
    - AI-powered content suggestions
    - SEO optimization
    - Multiple content formats
    - Performance analytics`,
    link: "https://github.com/example/ai-content",
    demo: "https://ai-content.demo.com"
  },
];

export const BLOG_POSTS = [
  {
    id: "future-of-web-development",
    title: "The Future of Web Development in 2024",
    excerpt: "Exploring emerging trends and technologies shaping the web development landscape",
    date: "2024-03-01",
    author: "Mathias Henry",
    content: `As we progress through 2024, the web development landscape continues to evolve at an unprecedented pace. Let's explore the key trends and technologies that are shaping our industry.

## AI-Powered Development Tools

The integration of AI in development workflows has become more sophisticated. From code completion to automated testing, AI is enhancing developer productivity significantly.

## Web Assembly and Edge Computing

Web Assembly is gaining momentum, enabling high-performance applications in the browser. Combined with edge computing, it's revolutionizing how we build and deploy web applications.

## The Rise of Meta-Frameworks

Meta-frameworks like Next.js and Remix are becoming industry standards, offering powerful features out of the box while maintaining developer flexibility.`,
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
    tags: ["Web Development", "AI", "Technology Trends"]
  },
  {
    id: "mastering-react-performance",
    title: "Mastering React Performance Optimization",
    excerpt: "Essential techniques for building fast and efficient React applications",
    date: "2024-02-15",
    author: "Mathias Henry",
    content: `Performance optimization is crucial for delivering a great user experience. Here's a comprehensive guide to optimizing your React applications.

## Understanding React's Virtual DOM

The Virtual DOM is a fundamental concept in React. Understanding how it works is key to writing performant code.

## Code Splitting and Lazy Loading

Implementing code splitting and lazy loading can significantly improve initial load times and overall application performance.

## Memoization Techniques

Using React.memo, useMemo, and useCallback effectively can prevent unnecessary re-renders and optimize performance.`,
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee",
    tags: ["React", "Performance", "Web Development"]
  },
  {
    id: "modern-css-techniques",
    title: "Modern CSS Techniques for Better Web Design",
    excerpt: "Exploring advanced CSS features and best practices for modern web development",
    date: "2024-01-30",
    author: "Mathias Henry",
    content: `CSS has evolved significantly in recent years. Let's explore modern techniques that can enhance your web designs.

## CSS Grid and Flexbox

Understanding the power of CSS Grid and Flexbox for creating complex layouts with ease.

## CSS Custom Properties

Leveraging CSS variables for maintainable and dynamic styling solutions.

## Modern CSS Units

Using modern CSS units like clamp(), min(), max() for responsive designs.`,
    image: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2",
    tags: ["CSS", "Web Design", "Frontend Development"]
  }
];