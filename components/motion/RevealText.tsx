'use client';

import React from 'react';

interface RevealTextProps {
  text: string;
  delay?: number;
  className?: string;
  viewportOnce?: boolean;
}

export const RevealText: React.FC<RevealTextProps> = ({
  text,
  className = '',
}) => {
  return (
    <div style={{ display: 'inline-block', overflow: 'hidden' }} className={`inline-flex flex-wrap ${className}`}>
      {text}
    </div>
  );
};
