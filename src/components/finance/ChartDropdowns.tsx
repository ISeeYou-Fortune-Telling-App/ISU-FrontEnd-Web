/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import { YearDropdown, MonthDropdown } from './UnifiedDropdown';

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
  return (
    <div className="flex items-center space-x-2">
      {/* Month Dropdown - only show if enabled */}
      {showMonthDropdown && (
        <MonthDropdown value={selectedMonth} onChange={onMonthChange} className="w-32" />
      )}

      {/* Year Dropdown */}
      <YearDropdown value={selectedYear} onChange={onYearChange} className="w-32" />
    </div>
  );
};
