import React from 'react';
import { X } from 'lucide-react';

const EmeresBadge = ({ 
  children, 
  variant = 'primary', 
  size = 'sm', 
  removable = false, 
  onRemove,
  icon,
  animate = false,
  className = '',
  ...props 
}) => {
  const variants = {
    primary: 'bg-teal-100 text-teal-800 border-teal-200',
    secondary: 'bg-blue-100 text-blue-800 border-blue-200',
    accent: 'bg-orange-100 text-orange-800 border-orange-200',
    success: 'bg-green-100 text-green-800 border-green-200',
    warning: 'bg-blue-100 text-amber-800 border-blue-200',
    error: 'bg-red-100 text-red-800 border-red-200',
    gradient: 'bg-gradient-emeres-primary text-white border-transparent shadow-emeres-sm',
    glass: 'glass text-gray-700 border-white/20'
  };

  const sizes = {
    xs: 'px-2 py-0.5 text-xs',
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-sm'
  };

  const baseClasses = `
    inline-flex items-center gap-1.5 font-medium rounded-full border
    transition-emeres-fast hover-lift
    ${animate ? 'animate-scale-in' : ''}
    ${variants[variant]}
    ${sizes[size]}
    ${className}
  `;

  return (
    <span className={baseClasses} {...props}>
      {icon && <span className="w-3 h-3">{icon}</span>}
      {children}
      {removable && (
        <button
          onClick={onRemove}
          className="ml-1 hover:bg-black/10 rounded-full p-0.5 transition-emeres-fast"
          aria-label="Supprimer"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
};

export default EmeresBadge;