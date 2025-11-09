import React from 'react';

const Button = ({ 
  children, 
  type = 'button', 
  className = '', 
  disabled = false, 
  onClick,
  ...props 
}) => {
  return (
    <button
      type={type}
      className={`
        px-4 py-2 rounded-md font-medium transition-colors duration-200
        ${disabled 
          ? 'bg-gray-400 cursor-not-allowed text-gray-200' 
          : 'bg-blue-600 hover:bg-blue-700 text-white'
        }
        ${className}
      `}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;