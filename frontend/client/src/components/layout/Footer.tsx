import { Link } from "wouter";
import { FaGithub } from "react-icons/fa";
import ClarionLogo from "@/assets/logo";

export default function Footer() {
  return (
    <footer className="border-t border-border mt-12 bg-card/30">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center md:flex-row md:justify-between">
          <div className="flex items-center">
            <ClarionLogo size={28} className="mr-2" />
            <span className="font-medium logo-gradient">Clarion</span>
            <span className="text-muted-foreground text-sm ml-2">© {new Date().getFullYear()}</span>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="flex space-x-6">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <span className="sr-only">GitHub</span>
                <FaGithub className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
