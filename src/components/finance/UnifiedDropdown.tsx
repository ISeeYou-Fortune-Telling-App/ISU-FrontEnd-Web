/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface DropdownOption {
  value: string | number;
  label: string;
}

interface UnifiedDropdownProps {
  options: DropdownOption[];
  value: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const UnifiedDropdown: React.FC<UnifiedDropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Chọn...',
  className = '',
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find((option) => option.value === value);

  const handleSelect = (optionValue: string | number) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-400 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
      >
        <span>{selectedOption?.label || placeholder}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && !disabled && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-full min-w-32 bg-white dark:bg-gray-700 border border-gray-400 dark:border-gray-700 rounded-lg shadow-lg z-20 overflow-hidden max-h-60 overflow-y-auto">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`w-full px-4 py-2 text-sm text-left transition-colors ${
                  value === option.value
                    ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-medium'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// Predefined dropdown components for common use cases
export const YearDropdown: React.FC<{
  value: number;
  onChange: (year: number) => void;
  className?: string;
}> = ({ value, onChange, className }) => {
  const years = [2026, 2025, 2024, 2023].map((year) => ({
    value: year,
    label: `Năm ${year}`,
  }));

  return (
    <UnifiedDropdown
      options={years}
      value={value}
      onChange={(val) => onChange(val as number)}
      className={className}
    />
  );
};

export const MonthDropdown: React.FC<{
  value: number;
  onChange: (month: number) => void;
  className?: string;
  includeAllYear?: boolean;
}> = ({ value, onChange, className, includeAllYear = false }) => {
  const months = [
    ...(includeAllYear ? [{ value: 0, label: 'Cả năm' }] : []),
    { value: 1, label: 'Tháng 1' },
    { value: 2, label: 'Tháng 2' },
    { value: 3, label: 'Tháng 3' },
    { value: 4, label: 'Tháng 4' },
    { value: 5, label: 'Tháng 5' },
    { value: 6, label: 'Tháng 6' },
    { value: 7, label: 'Tháng 7' },
    { value: 8, label: 'Tháng 8' },
    { value: 9, label: 'Tháng 9' },
    { value: 10, label: 'Tháng 10' },
    { value: 11, label: 'Tháng 11' },
    { value: 12, label: 'Tháng 12' },
  ];

  return (
    <UnifiedDropdown
      options={months}
      value={value}
      onChange={(val) => onChange(val as number)}
      className={className}
    />
  );
};
