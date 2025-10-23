// app/leaves/page.tsx

'use client';

import React, { useState } from 'react';
import { LeaveStats } from '../../../components/employee/leaves/LeaveStats';
import { LeaveFilters } from '../../../components/employee/leaves/LeaveFilters';
import { LeaveTable } from '../../../components/employee/leaves/LeaveTable';
import { ApplyLeaveModal } from '../../../components/employee/leaves/ApplyLeaveModal';
import { leaveStats, mockLeaves } from '@/lib/employee/data/mockLeaveData';

export default function LeavesPage() {
  const [activeTab, setActiveTab] = useState<'leaves' | 'entitlement'>('leaves');
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen p-8  ">
      <div className="mx-auto max-w-7xl">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="inline-flex font-bold text-gray-900 px-6 py-3 bg-background rounded-full items-center justify-center
               shadow-[0_0_16px_rgba(0,0,0,0.24)]">Leave Management</h1>
        </div>
        {/* Tabs */}
        <div className="flex gap-8 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('leaves')}
            className={`pb-3 px-1 text-sm font-medium transition-colors relative ${
              activeTab === 'leaves'
                ? 'text-teal-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Leaves
            {activeTab === 'leaves' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('entitlement')}
            className={`pb-3 px-1 text-sm font-medium transition-colors relative ${
              activeTab === 'entitlement'
                ? 'text-teal-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Leave Entitlement
            {activeTab === 'entitlement' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600" />
            )}
          </button>
        </div>
        
        {/* Stats Cards */}
        <LeaveStats stats={leaveStats} />

        {/* Filters */}
        <LeaveFilters onApplyLeave={() => setIsModalOpen(true)} />

        {/* Leave Table */}
        <LeaveTable leaves={mockLeaves} />

        {/* Apply Leave Modal */}
        <ApplyLeaveModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    
      </div>
    </div>
  );
}