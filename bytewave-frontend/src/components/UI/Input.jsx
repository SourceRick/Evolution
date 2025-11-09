import React from 'react';

const Input = ({ 
  label, 
  type = 'text', 
  name, 
  value, 
  onChange, 
  placeholder = '', 
  required = false,
  className = '',
  ...props 
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label 
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`
          w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
          rounded-md shadow-sm focus:outline-none focus:ring-2 
          focus:ring-blue-500 focus:border-blue-500
          bg-white dark:bg-gray-700 
          text-gray-900 dark:text-white
          ${className}
        `}
        {...props}
      />
    </div>
  );
};

export default Input;