import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { Link, useLocation } from "wouter";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => location === path;

  const navItems = [
    { label: "Home", path: "/" },
    { label: "About", path: "/#about" },
    { label: "Skills", path: "/#skills" },
    { label: "Timeline", path: "/#timeline" },
    { label: "Projects", path: "/#projects" },
    { label: "Blog", path: "/blog" },
    { label: "Contact", path: "/#contact" },
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" : ""
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/">
            <Button
              variant="ghost"
              className="text-xl font-bold"
            >
              Portfolio
            </Button>
          </Link>

          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <Button
                  variant="ghost"
                  className={`capitalize ${
                    isActive(item.path) ? "text-primary" : ""
                  }`}
                >
                  {item.label}
                </Button>
              </Link>
            ))}
            <ThemeToggle />
          </div>

          <div className="md:hidden flex items-center">
            <ThemeToggle />
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link key={item.path} href={item.path}>
                  <Button
                    variant="ghost"
                    className={`w-full text-left capitalize ${
                      isActive(item.path) ? "text-primary" : ""
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}