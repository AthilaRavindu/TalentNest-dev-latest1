// components/leaves/LeaveStats.tsx

import React from 'react';
import { LeaveStats as LeaveStatsType } from '@/types/employee/leave.types';

interface LeaveStatsProps {
  stats: LeaveStatsType;
}

export const LeaveStats: React.FC<LeaveStatsProps> = ({ stats }) => {
  const statCards = [
    {
      value: stats.available,
      label: 'Available Leaves',
      bgColor: 'bg-green-100',
      textColor: 'text-green-800',
    },
    {
      value: stats.compensatory,
      label: 'Compensatory Balance',
      bgColor: 'bg-teal-100',
      textColor: 'text-teal-800',
    },
    {
      value: stats.deducted,
      label: 'Deducted Leaves',
      bgColor: 'bg-red-100',
      textColor: 'text-red-800',
    },
    {
      value: stats.pending,
      label: 'Pending Leave requests',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-800',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((card, index) => (
        <div
          key={index}
          className="p-6 transition-shadow bg-white border border-gray-100 shadow-sm rounded-2xl hover:shadow-md"
        >
          <div className="flex items-center gap-4">
            <div className={`${card.bgColor} ${card.textColor} w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold`}>
              {card.value}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">{card.label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};