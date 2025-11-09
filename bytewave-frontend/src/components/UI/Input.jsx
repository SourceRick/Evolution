import React from 'react';

const Input = ({
  label,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className="input-group">
      {label && (
        <label className="input-label">
          {label}
          {props.required && <span style={{ color: '#ef4444', marginLeft: '0.25rem' }}>*</span>}
        </label>
      )}
      <input
        className={`input ${className}`}
        {...props}
      />
      {error && (
        <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;