import React from 'react';

export const PageTransition = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {children}
    </div>
  );
};
