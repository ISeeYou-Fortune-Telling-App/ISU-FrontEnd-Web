import { useState, useEffect } from 'react';

/**
 * Hook giúp debounce giá trị (ví dụ: text search)
 * @param value - giá trị thay đổi liên tục (searchTerm,...)
 * @param delay - thời gian chờ trước khi cập nhật (ms)
 */
export const useDebounce = <T>(value: T, delay = 400): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};
