import React from 'react';
import { Input } from '@/components/ui/input';
import { useFloatingLabel } from '@/hooks/useFloatingLabel';

interface FloatingInputProps {
  id: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  autoComplete?: string;
  className?: string;
  children?: React.ReactNode;
}

export const FloatingInput: React.FC<FloatingInputProps> = ({
  id,
  type,
  value,
  onChange,
  label,
  placeholder,
  disabled,
  autoComplete,
  className = '',
  children
}) => {
  const { isFloating, inputProps } = useFloatingLabel(value);

  return (
    <div className="relative">
      <Input
        {...inputProps}
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        className={`h-14 w-full rounded-full border-2 border-gray-300 px-4 pt-6 pb-2 text-base bg-white focus:border-blue-500 focus:outline-none transition-all duration-200 ${className}`}
        placeholder=" "
        disabled={disabled}
        autoComplete={autoComplete}
      />
      <label
        htmlFor={id}
        className={`absolute left-4 transition-all duration-200 pointer-events-none ${
          isFloating
            ? 'top-2 text-xs text-blue-500 font-medium'
            : 'top-1/2 -translate-y-1/2 text-base text-gray-500'
        }`}
      >
        {label}
      </label>
      {children}
    </div>
  );
};