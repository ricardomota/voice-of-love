import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export const OTPInput: React.FC<OTPInputProps> = ({
  length = 6,
  value,
  onChange,
  onComplete,
  disabled = false,
  className
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  useEffect(() => {
    if (value.length === length && onComplete) {
      onComplete(value);
    }
  }, [value, length, onComplete]);

  const handleInputChange = (index: number, inputValue: string) => {
    const newValue = inputValue.slice(-1); // Only take the last character
    const newOTP = value.split('');
    newOTP[index] = newValue;
    
    const updatedValue = newOTP.join('');
    onChange(updatedValue);

    // Move to next input if current is filled
    if (newValue && index < length - 1) {
      setActiveIndex(index + 1);
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!value[index] && index > 0) {
        // Move to previous input if current is empty
        setActiveIndex(index - 1);
        inputRefs.current[index - 1]?.focus();
      } else {
        // Clear current input
        const newOTP = value.split('');
        newOTP[index] = '';
        onChange(newOTP.join(''));
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      setActiveIndex(index - 1);
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      setActiveIndex(index + 1);
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const pastedNumbers = pastedData.replace(/\D/g, '').slice(0, length);
    onChange(pastedNumbers);
    
    // Focus the next empty input or the last one
    const nextIndex = Math.min(pastedNumbers.length, length - 1);
    setActiveIndex(nextIndex);
    inputRefs.current[nextIndex]?.focus();
  };

  return (
    <div className={cn("flex gap-3 justify-center", className)}>
      {Array.from({ length }, (_, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          pattern="\d*"
          value={value[index] || ''}
          onChange={(e) => handleInputChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          onFocus={() => setActiveIndex(index)}
          disabled={disabled}
          className={cn(
            "w-12 h-12 text-center text-lg font-medium",
            "border border-border rounded-lg",
            "bg-background text-foreground",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
            "transition-all duration-200",
            disabled && "opacity-50 cursor-not-allowed",
            value[index] && "border-primary bg-primary/5"
          )}
          maxLength={1}
        />
      ))}
    </div>
  );
};