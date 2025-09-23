import React from 'react';

const EmeresCard = ({ 
  children, 
  variant = 'default',
  interactive = false,
  padding = 'md',
  className = '',
  onClick,
  ...props 
}) => {
  const variants = {
    default: 'card-emeres',
    gradient: 'card-emeres-gradient',
    glass: 'glass border border-white/20',
    elevated: 'card-emeres shadow-emeres-lg',
    outlined: 'border-2 border-teal-200 bg-white'
  };

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  };

  const baseClasses = `
    ${variants[variant]}
    ${interactive ? 'card-emeres-interactive' : ''}
    ${paddings[padding]}
    ${className}
  `;

  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      className={baseClasses}
      onClick={onClick}
      {...props}
    >
      {children}
    </Component>
  );
};

const EmeresCardHeader = ({ children, className = '', ...props }) => (
  <div className={`pb-4 border-b border-gray-100 ${className}`} {...props}>
    {children}
  </div>
);

const EmeresCardTitle = ({ children, className = '', ...props }) => (
  <h3 className={`text-lg font-semibold text-gray-900 ${className}`} {...props}>
    {children}
  </h3>
);

const EmeresCardDescription = ({ children, className = '', ...props }) => (
  <p className={`text-sm text-gray-600 mt-1 ${className}`} {...props}>
    {children}
  </p>
);

const EmeresCardContent = ({ children, className = '', ...props }) => (
  <div className={`pt-4 ${className}`} {...props}>
    {children}
  </div>
);

const EmeresCardFooter = ({ children, className = '', ...props }) => (
  <div className={`pt-4 mt-4 border-t border-gray-100 ${className}`} {...props}>
    {children}
  </div>
);

export default EmeresCard;
export { EmeresCardHeader, EmeresCardTitle, EmeresCardDescription, EmeresCardContent, EmeresCardFooter };