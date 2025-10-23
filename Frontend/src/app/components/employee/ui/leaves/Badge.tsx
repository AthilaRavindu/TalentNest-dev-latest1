// components/ui/Badge.tsx

import React from 'react';
import { LeaveStatus } from '@/types/employee/leave.types';

interface BadgeProps {
  status: LeaveStatus;
}

export const Badge: React.FC<BadgeProps> = ({ status }) => {
  const statusStyles = {
    Pending: 'bg-yellow-100 text-yellow-800',
    Approved: 'bg-green-100 text-green-800',
    Rejected: 'bg-red-100 text-red-800',
  };

  return (
    <span className={`px-3 py-1 rounded-md text-sm font-medium ${statusStyles[status]}`}>
      {status}
    </span>
  );
};