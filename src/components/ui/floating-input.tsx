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
      <input
        {...inputProps}
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        className={`h-14 w-full rounded-full border-2 px-4 text-base bg-background transition-all duration-200 focus:outline-none ${
          isFloating 
            ? 'border-primary pt-6 pb-2' 
            : 'border-border pt-4 pb-4'
        } ${className}`}
        placeholder=" "
        disabled={disabled}
        autoComplete={autoComplete}
      />
      <label
        htmlFor={id}
        className={`absolute left-4 transition-all duration-200 pointer-events-none select-none ${
          isFloating
            ? 'top-2 text-xs text-primary font-medium'
            : 'top-1/2 -translate-y-1/2 text-base text-muted-foreground'
        }`}
      >
        {label}
      </label>
      {children}
    </div>
  );
};