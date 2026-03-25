import React from 'react';
import { cn } from '@/lib/utils';

interface MagneticProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}

export const Magnetic: React.FC<MagneticProps> = ({ 
  children, 
  className, 
  strength = 0.2 
}) => {
  return (
    <div className={cn('inline-block', className)} data-magnetic-strength={strength}>
      {children}
    </div>
  );
};
