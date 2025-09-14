import { useState, useRef, useEffect } from 'react';

export const useFloatingLabel = (value: string) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setHasValue(!!value);
  }, [value]);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const isFloating = isFocused || hasValue;

  return {
    inputRef,
    isFocused,
    hasValue,
    isFloating,
    handleFocus,
    handleBlur,
    inputProps: {
      ref: inputRef,
      onFocus: handleFocus,
      onBlur: handleBlur,
    }
  };
};