
import React from "react";
import Header from "./Header";
import MobileNav from "./MobileNav";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 container py-6">
        <div className="md:hidden flex justify-between items-center mb-6">
          <MobileNav />
        </div>
        {children}
      </main>
      <footer className="border-t py-4 bg-background">
        <div className="container flex flex-col items-center justify-center gap-2 text-center md:gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Daily Zen Streak. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
