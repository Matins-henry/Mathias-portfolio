import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { CustomCursor } from "@/components/layout/CustomCursor";
import { lazy, Suspense, useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LoadingAnimation } from "@/components/LoadingAnimation";

// Lazy load pages with performance monitoring
const monitoredImport = (name: string, importFn: () => Promise<any>) => {
  return () => {
    console.time(`Route:${name}`);
    return importFn().finally(() => {
      console.timeEnd(`Route:${name}`);
    });
  };
};

// Lazy load pages
const Home = lazy(monitoredImport('Home', () => import("@/pages/Home")));
const Blog = lazy(monitoredImport('Blog', () => import("@/pages/Blog")));
const BlogPost = lazy(monitoredImport('BlogPost', () => import("@/pages/BlogPost")));
const NotFound = lazy(monitoredImport('NotFound', () => import("@/pages/not-found")));

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loader2 className="w-8 h-8 animate-spin" />
  </div>
);

// Custom hook for loading state
function useLoadingState() {
  const [isLoading, setIsLoading] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 800); // Minimum loading time
    return () => clearTimeout(timer);
  }, [location]);

  return isLoading;
}

function AppRouter() {
  const isLoading = useLoadingState();

  return (
    <ErrorBoundary>
      <LoadingAnimation isLoading={isLoading} />
      <Suspense fallback={<PageLoader />}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/blog" component={Blog} />
          <Route path="/blog/:id" component={BlogPost} />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CustomCursor />
      <AppRouter />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;