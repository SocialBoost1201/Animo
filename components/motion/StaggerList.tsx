'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface StaggerListProps extends HTMLMotionProps<"ul"> {
  children: React.ReactNode;
  staggerDelay?: number;
  delayChildren?: number;
  viewportOnce?: boolean;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: (custom: any) => ({
    opacity: 1,
    transition: {
      staggerChildren: custom.staggerDelay,
      delayChildren: custom.delayChildren,
    },
  }),
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring' as const,
      damping: 20,
      stiffness: 100,
    },
  },
};

export const StaggerList: React.FC<StaggerListProps> = ({
  children,
  staggerDelay = 0.1,
  delayChildren = 0,
  viewportOnce = true,
  className,
  ...props
}) => {
  return (
    <motion.ul
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: viewportOnce, margin: '-50px' }}
      custom={{ staggerDelay, delayChildren }}
      className={className}
      {...props}
    >
      {React.Children.map(children, (child) => (
        <motion.li variants={itemVariants}>{child}</motion.li>
      ))}
    </motion.ul>
  );
};
