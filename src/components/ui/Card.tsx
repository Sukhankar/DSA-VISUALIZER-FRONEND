import React, { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverable = false,
  hover = false,
  className = '',
  ...props
}) => {
  const isHoverable = hoverable || hover;
  return (
    <div
      className={`glass-panel rounded-xl p-6 border border-slate-800/80 ${
        isHoverable ? 'glass-panel-hover cursor-pointer' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
