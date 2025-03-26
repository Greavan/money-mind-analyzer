
import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full py-6 px-8 border-t border-border mt-auto">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} FinSight. All rights reserved.
        </p>
        <div className="flex items-center space-x-6 mt-4 md:mt-0">
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Terms of Service
          </a>
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
