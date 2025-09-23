import React from 'react';
import { Loader2 } from 'lucide-react';

const EmeresButton = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  className = '',
  onClick,
  ...props 
}) => {
  const variants = {
    primary: 'bg-[#0f4c81] text-white hover:bg-[#0c3c69] border-transparent shadow-emeres-md hover:shadow-xl',
    secondary: 'bg-[#0d9488] text-white hover:bg-[#0b766c] border-transparent shadow-emeres-md',
    ghost: 'text-[#0f4c81] hover:bg-[#0f4c81]/10 border border-transparent',
    outline: 'border border-[#0f4c81]/40 text-[#0f4c81] hover:bg-[#0f4c81]/10 hover:border-[#0f4c81]/60',
    danger: 'bg-red-600 text-white hover:bg-red-700 border-red-600',
    success: 'bg-[#15803d] text-white hover:bg-[#166534] border-[#15803d]',
    gradient: 'bg-gradient-to-r from-[#0f4c81] via-[#0d9488] to-[#b8761a] text-white shadow-emeres-lg hover:shadow-emeres-colored',
    glass: 'glass text-[#0f4c81] hover:bg-white/20'
  };

  const sizes = {
    xs: 'px-3 py-1.5 text-xs',
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
    xl: 'px-10 py-5 text-lg'
  };

  const baseClasses = `
    inline-flex items-center justify-center gap-2 font-medium rounded-lg
    transition-emeres focus-emeres cursor-pointer
    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none
    ${variants[variant]}
    ${sizes[size]}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `;

  const handleClick = (e) => {
    if (loading || disabled) return;
    onClick?.(e);
  };

  return (
    <button
      className={baseClasses}
      disabled={disabled || loading}
      onClick={handleClick}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        icon && iconPosition === 'left' && <span className="w-4 h-4">{icon}</span>
      )}
      
      {children}
      
      {!loading && icon && iconPosition === 'right' && (
        <span className="w-4 h-4">{icon}</span>
      )}
    </button>
  );
};

export default EmeresButton;