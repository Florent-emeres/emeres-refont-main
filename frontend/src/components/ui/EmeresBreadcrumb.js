import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

const EmeresBreadcrumb = ({ items, className = '' }) => {
  return (
    <nav className={`flex items-center space-x-1 text-sm text-gray-500 mb-4 ${className}`}>
      <div className="flex items-center">
        <Home className="h-4 w-4" />
        <span className="ml-1">Entreprise</span>
      </div>
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="h-4 w-4 text-gray-300" />
          <span 
            className={`${
              index === items.length - 1 
                ? 'text-gray-900 font-medium' 
                : 'text-gray-500 hover:text-gray-700'
            } transition-colors duration-200`}
          >
            {item}
          </span>
        </React.Fragment>
      ))}
    </nav>
  );
};

export default EmeresBreadcrumb;