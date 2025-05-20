import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, History } from "lucide-react";
import ClarionLogo from "@/assets/logo";
import { useState } from "react";

export default function Navbar() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <nav className="border-b border-border sticky top-0 z-50 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Logo */}
            <Link href="/analyzer">
              <div className="flex-shrink-0 flex items-center cursor-pointer">
                <ClarionLogo size={36} className="mr-2" />
                <div>
                  <span className="text-xl font-semibold logo-gradient">CLARION</span>
                </div>
              </div>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* History Icon */}
            <Link href="/history">
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn(
                  "rounded-full",
                  location === "/history" 
                    ? "bg-primary/20 text-primary" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <History className="h-5 w-5" />
              </Button>
            </Link>
            
            {/* Mobile menu button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-border">
            <div className="space-y-1">
              <Link href="/analyzer">
                <span className={cn(
                  "block px-3 py-2 text-base font-medium rounded-md cursor-pointer",
                  location === "/analyzer"
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}>
                  Home
                </span>
              </Link>
              <Link href="/history">
                <span className={cn(
                  "block px-3 py-2 text-base font-medium rounded-md cursor-pointer",
                  location === "/history"
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}>
                  History
                </span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
