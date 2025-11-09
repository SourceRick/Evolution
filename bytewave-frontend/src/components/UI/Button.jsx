import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary',
  loading = false,
  disabled = false,
  className = '',
  ...props 
}) => {
  const baseClass = 'btn';
  const variantClass = variant === 'primary' ? 'btn-primary' : 'btn-outline';
  
  const classes = `${baseClass} ${variantClass} ${className}`.trim();

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span style={{ marginRight: '0.5rem' }}>⏳</span>
      )}
      {children}
    </button>
  );
};

export default Button;