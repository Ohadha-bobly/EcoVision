import { Link, useLocation } from "wouter";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";
import { Leaf, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

interface HeaderProps {
  onAuthClick: () => void;
}

export function Header({ onAuthClick }: HeaderProps) {
  const [location] = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/">
            <a className="flex items-center gap-2 hover-elevate px-3 py-2 rounded-md" data-testid="link-home">
              <Leaf className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-foreground">EcoVision</span>
            </a>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/map">
              <a
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location === "/map" ? "text-primary" : "text-foreground"
                }`}
                data-testid="link-map"
              >
                Explore Map
              </a>
            </Link>
            <Link href="/projects">
              <a
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location === "/projects" ? "text-primary" : "text-foreground"
                }`}
                data-testid="link-projects"
              >
                Projects
              </a>
            </Link>
            {isAuthenticated && (
              <Link href="/admin">
                <a
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    location === "/admin" ? "text-primary" : "text-foreground"
                  }`}
                  data-testid="link-admin"
                >
                  Admin
                </a>
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            {isAuthenticated ? (
              <>
                <span className="text-sm text-muted-foreground hidden sm:inline">
                  {user?.username}
                </span>
                <Button variant="outline" onClick={logout} data-testid="button-logout">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <Button onClick={onAuthClick} data-testid="button-login">
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
