import React, { type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div>
        {label && (
          <label className="block text-sm font-medium text-slate-600 mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`app-input ${
            error ? 'border-rose-400 focus:ring-rose-200 focus:border-rose-400' : ''
          } ${className}`}
          {...props}
        />
        {error && <p className="mt-2 text-sm text-rose-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
