import React, { forwardRef } from 'react';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';

const EmeresInput = forwardRef(({ 
  type = 'text',
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  placeholder,
  disabled = false,
  required = false,
  className = '',
  containerClassName = '',
  ...props 
}, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  const inputClasses = [
    'input-emeres',
    leftIcon ? 'pl-10' : '',
    rightIcon || isPassword ? 'pr-10' : '',
    error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : '',
    disabled ? 'opacity-50 cursor-not-allowed' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={`space-y-2 ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {leftIcon}
          </div>
        )}
        
        <input
          ref={ref}
          type={inputType}
          placeholder={placeholder}
          disabled={disabled}
          className={inputClasses}
          {...props}
        />
        
        {isPassword && (
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
        
        {rightIcon && !isPassword && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {rightIcon}
          </div>
        )}
      </div>
      
      {error && (
        <div className="flex items-center gap-1 text-sm text-red-600">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}
      
      {helperText && !error && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
});

EmeresInput.displayName = 'EmeresInput';

export default EmeresInput;