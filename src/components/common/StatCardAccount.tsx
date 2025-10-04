import React from 'react';

interface StatCardAccountProps {
    value: number;
    label: string;
    colorClass: string;
    moneyType?: 'vnđ' | '₫';
}

export const StatCardAccount: React.FC<StatCardAccountProps> = ({ value, label, colorClass, moneyType }) => {
    let displayValue: string | number = value.toLocaleString('vi-VN');

    if (moneyType === 'vnđ') {
        displayValue = `${value.toLocaleString('vi-VN')} VNĐ`;
    } else if (moneyType === '₫') {
        displayValue = `${value.toLocaleString('vi-VN')} ₫`;
    }

    return (
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow border border-gray-200 dark:border-gray-700">
            <p className={`text-2xl font-semibold ${colorClass}`}>
                {displayValue}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{label}</p>
        </div>
    );
};
