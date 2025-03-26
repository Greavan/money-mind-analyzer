
import React from 'react';

const Header = () => {
  return (
    <header className="w-full py-6 px-8 flex items-center justify-between border-b border-border animate-slide-down">
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="ml-3 text-2xl font-medium tracking-tight">FinSight</h1>
      </div>
      
      <nav className="hidden md:flex items-center space-x-8">
        <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Dashboard</a>
        <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Analytics</a>
        <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Help</a>
      </nav>
      
      <div className="flex items-center space-x-4">
        <button className="rounded-full w-9 h-9 flex items-center justify-center transition-colors hover:bg-secondary">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
