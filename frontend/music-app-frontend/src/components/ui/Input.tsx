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
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-4 py-4 bg-neutral-800 border ${
            error ? 'border-red-500' : 'border-neutral-700'
          } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 ${
            error ? 'focus:ring-red-500' : 'focus:ring-green-500'
          } focus:border-transparent transition ${className}`}
          {...props}
        />
        {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;