// components/leaves/LeaveFilters.tsx

import React from 'react';
import { Filter } from 'lucide-react';
import { Button } from '../ui/leaves/Button';

interface LeaveFiltersProps {
  onApplyLeave: () => void;
}

export const LeaveFilters: React.FC<LeaveFiltersProps> = ({ onApplyLeave }) => {
  return (
    <div className="flex justify-end gap-3 mb-6">
      <Button variant="primary" onClick={onApplyLeave}>
        Apply Leave
      </Button>
      <Button variant="secondary">
        <Filter size={18} />
        Filter
      </Button>
    </div>
  );
};