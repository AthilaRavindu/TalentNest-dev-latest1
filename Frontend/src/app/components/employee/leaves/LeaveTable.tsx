// components/leaves/LeaveTable.tsx

'use client';

import React, { useState } from 'react';
import { ChevronDown, Edit2, Trash2 } from 'lucide-react';
import { Leave } from '@/types/employee/leave.types';
import { Badge } from '../ui/leaves/Badge';

interface LeaveTableProps {
  leaves: Leave[];
}

export const LeaveTable: React.FC<LeaveTableProps> = ({ leaves }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  
  const totalPages = Math.ceil(leaves.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLeaves = leaves.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-2xl">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-left text-gray-700">
                Leave type
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-left text-gray-700">
                <div className="flex items-center gap-2">
                  From
                  <ChevronDown size={16} className="text-gray-400" />
                </div>
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-left text-gray-700">
                <div className="flex items-center gap-2">
                  To
                  <ChevronDown size={16} className="text-gray-400" />
                </div>
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-left text-gray-700">
                Days
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-left text-gray-700">
                Status
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-left text-gray-700">
                Reason
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-left text-gray-700">
                Approver
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-left text-gray-700">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {currentLeaves.map((leave, index) => (
              <tr 
                key={leave.id} 
                className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                  index === currentLeaves.length - 1 ? 'border-b-0' : ''
                }`}
              >
                <td className="px-6 py-4 text-sm text-gray-900">
                  {leave.leaveType}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {leave.from}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {leave.to}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {leave.days}
                </td>
                <td className="px-6 py-4">
                  <Badge status={leave.status} />
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {leave.reason}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {leave.approver}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <button className="text-gray-400 transition-colors hover:text-teal-600">
                      <Edit2 size={18} />
                    </button>
                    <button className="text-gray-400 transition-colors hover:text-red-600">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 transition-colors shadow-lg hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed border-border rounded-xl"
        >
          <span>← Previous</span>
        </button>

        <div className="flex items-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                currentPage === page
                  ? 'bg-teal-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 transition-colors shadow-lg border-border rounded-xl hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>Next →</span>
        </button>
      </div>
    </div>
  );
};