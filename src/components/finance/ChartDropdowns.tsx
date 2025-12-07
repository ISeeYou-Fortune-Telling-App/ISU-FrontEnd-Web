/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface YearMonthDropdownsProps {
  selectedYear: number;
  selectedMonth: number;
  onYearChange: (year: number) => void;
  onMonthChange: (month: number) => void;
  showMonthDropdown?: boolean;
}

export const YearMonthDropdowns: React.FC<YearMonthDropdownsProps> = ({
  selectedYear,
  selectedMonth,
  onYearChange,
  onMonthChange,
  showMonthDropdown = true,
}) => {
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);

  const YEARS = [2025, 2024, 2023];
  const MONTHS = [
    { value: 0, label: 'Cả năm' },
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
    <div className="flex items-center space-x-2">
      {/* Month Dropdown - only show if enabled */}
      {showMonthDropdown && (
        <div className="relative">
          <button
            onClick={() => setIsMonthDropdownOpen(!isMonthDropdownOpen)}
            className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-400 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            <span>{MONTHS.find((m) => m.value === selectedMonth)?.label}</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${isMonthDropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {isMonthDropdownOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsMonthDropdownOpen(false)} />
              <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-700 border border-gray-400 dark:border-gray-700 rounded-lg shadow-lg z-20 overflow-hidden max-h-60 overflow-y-auto">
                {MONTHS.map((month) => (
                  <button
                    key={month.value}
                    onClick={() => {
                      onMonthChange(month.value);
                      setIsMonthDropdownOpen(false);
                    }}
                    className={`w-full px-4 py-2 text-sm text-left transition-colors ${
                      selectedMonth === month.value
                        ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-medium'
                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'
                    }`}
                  >
                    {month.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Year Dropdown */}
      <div className="relative">
        <button
          onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
          className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-400 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
        >
          <span>Năm {selectedYear}</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${isYearDropdownOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {isYearDropdownOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsYearDropdownOpen(false)} />
            <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-700 border border-gray-400 dark:border-gray-700 rounded-lg shadow-lg z-20 overflow-hidden">
              {YEARS.map((year) => (
                <button
                  key={year}
                  onClick={() => {
                    onYearChange(year);
                    setIsYearDropdownOpen(false);
                  }}
                  className={`w-full px-4 py-2 text-sm text-left transition-colors ${
                    selectedYear === year
                      ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-medium'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'
                  }`}
                >
                  Năm {year}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
