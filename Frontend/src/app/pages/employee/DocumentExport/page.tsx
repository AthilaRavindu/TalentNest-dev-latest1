"use client";

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Calendar, Download, FileText, Table, X } from 'lucide-react';
import Select, { Option } from './components/select';

// Types
interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  disabled?: boolean;
  placeholder?: string;
  label?: string;
}

interface AttendanceRecord {
  date: string;
  timeIn: string;
  timeOut: string;
  totalHours: string;
  status: 'Present' | 'Late' | 'Leave' | 'Overtime';
}

interface LeaveRecord {
  leaveType: string;
  from: string;
  to: string;
  days: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  reason: string;
  approver: string;
}

interface SummaryStats {
  totalHours?: number;
  attendanceRate?: number;
  presentDays?: number;
  totalLeaves?: number;
  approvedLeaves?: number;
  pendingLeaves?: number;
  rejectedLeaves?: number;
}

// Constants
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WEEK_DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const RECORDS_PER_PAGE = 8;

// Date utility functions
const parseLeaveDate = (dateStr: string): Date => {
  // Convert "31 Dec 2024" to Date object
  const parts = dateStr.split(' ');
  const day = parseInt(parts[0]);
  const month = MONTHS_SHORT.indexOf(parts[1]);
  const year = parseInt(parts[2]);
  return new Date(year, month, day);
};

const formatDateForDisplay = (date: Date): string => {
  // Format as "31 Dec 2024"
  const day = date.getDate();
  const month = MONTHS_SHORT[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

const isDateInRange = (checkDate: Date, fromDate: string, toDate: string): boolean => {
  if (!fromDate && !toDate) return true;
  
  const from = fromDate ? new Date(fromDate) : null;
  const to = toDate ? new Date(toDate) : null;
  
  if (from && to) {
    return checkDate >= from && checkDate <= to;
  } else if (from) {
    return checkDate >= from;
  } else if (to) {
    return checkDate <= to;
  }
  
  return true;
};

// Custom Date Picker Component (same as before)
const CustomDatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  disabled = false,
  placeholder = 'Select date',
  label
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    value ? new Date(value) : null
  );
  const [view, setView] = useState<'days' | 'months' | 'years'>('days');
  const [yearRange, setYearRange] = useState<number[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Date utilities
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatDisplayDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getDaysInMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  // Event handlers
  const handleDateSelect = (day: number) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(newDate);
    onChange(formatDate(newDate));
    setIsOpen(false);
    setView('days');
  };

  const handleMonthSelect = (monthIndex: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), monthIndex, 1));
    setView('days');
  };

  const handleYearSelect = (year: number) => {
    setCurrentDate(new Date(year, currentDate.getMonth(), 1));
    setView('months');
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const change = direction === 'prev' ? -1 : 1;
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + change, 1));
  };

  const navigateYearRange = (direction: 'up' | 'down') => {
    const change = direction === 'up' ? -5 : 5;
    setYearRange(prev => prev.map(year => year + change));
  };

  const clearDate = () => {
    setSelectedDate(null);
    onChange('');
    setIsOpen(false);
  };

  const setToday = () => {
    const today = new Date();
    setSelectedDate(today);
    setCurrentDate(today);
    onChange(formatDate(today));
    setIsOpen(false);
  };

  // Date comparison helpers
  const isToday = (day: number): boolean => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (day: number): boolean => {
    if (!selectedDate) return false;
    return (
      day === selectedDate.getDate() &&
      currentDate.getMonth() === selectedDate.getMonth() &&
      currentDate.getFullYear() === selectedDate.getFullYear()
    );
  };

  const isCurrentMonth = (monthIndex: number): boolean => {
    const today = new Date();
    return (
      monthIndex === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const isSelectedMonth = (monthIndex: number): boolean => {
    if (!selectedDate) return false;
    return (
      monthIndex === selectedDate.getMonth() &&
      currentDate.getFullYear() === selectedDate.getFullYear()
    );
  };

  const isCurrentYear = (year: number): boolean => {
    return year === new Date().getFullYear();
  };

  const isSelectedYear = (year: number): boolean => {
    return selectedDate ? year === selectedDate.getFullYear() : false;
  };

  // Calendar rendering
  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Previous month days
    const prevMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1);
    const daysInPrevMonth = getDaysInMonth(prevMonthDate);
    
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push(
        <div key={`prev-${i}`} className="h-8 flex items-center justify-center text-sm text-gray-400">
          {daysInPrevMonth - i}
        </div>
      );
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const today = isToday(day);
      const selected = isSelected(day);

      days.push(
        <button
          key={day}
          onClick={() => handleDateSelect(day)}
          className={`h-8 w-8 rounded-lg text-sm font-medium transition-colors
            ${selected 
              ? 'bg-teal-600 text-white hover:bg-teal-700' 
              : today
              ? 'bg-teal-50 text-teal-600 hover:bg-teal-100'
              : 'text-gray-700 hover:bg-gray-100'
            }`}
        >
          {day}
        </button>
      );
    }

    // Next month days
    const remainingCells = 42 - days.length;
    for (let day = 1; day <= remainingCells; day++) {
      days.push(
        <div key={`next-${day}`} className="h-8 flex items-center justify-center text-sm text-gray-400">
          {day}
        </div>
      );
    }

    return days;
  };

  const renderMonths = () => {
    return MONTHS_SHORT.map((month, index) => {
      const current = isCurrentMonth(index);
      const selected = isSelectedMonth(index);

      return (
        <button
          key={month}
          onClick={() => handleMonthSelect(index)}
          className={`h-10 rounded-lg text-sm font-medium transition-colors
            ${selected
              ? 'bg-teal-600 text-white hover:bg-teal-700'
              : current
              ? 'bg-teal-50 text-teal-600 hover:bg-teal-100'
              : 'text-gray-700 hover:bg-gray-100'
            }`}
        >
          {month}
        </button>
      );
    });
  };

  const renderYears = () => {
    return (
      <div className="flex flex-col h-full">
        <button
          onClick={() => navigateYearRange('up')}
          className="p-2 hover:bg-gray-100 rounded transition-colors flex items-center justify-center"
        >
          <ChevronUp className="w-4 h-4 text-gray-600" />
        </button>
        
        <div className="flex-1 py-2">
          {yearRange.map((year) => {
            const current = isCurrentYear(year);
            const selected = isSelectedYear(year);

            return (
              <button
                key={year}
                onClick={() => handleYearSelect(year)}
                className={`w-full h-10 rounded-lg text-sm font-medium transition-colors mb-1
                  ${selected
                    ? 'bg-teal-600 text-white hover:bg-teal-700'
                    : current
                    ? 'bg-teal-50 text-teal-600 hover:bg-teal-100'
                    : 'text-gray-700 hover:bg-gray-100'
                  }`}
              >
                {year}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => navigateYearRange('down')}
          className="p-2 hover:bg-gray-100 rounded transition-colors flex items-center justify-center"
        >
          <ChevronDown className="w-4 h-4 text-gray-600" />
        </button>
      </div>
    );
  };

  const renderHeader = () => {
    switch (view) {
      case 'days':
        return (
          <>
            <button onClick={() => navigateMonth('prev')} className="p-1 hover:bg-gray-100 rounded transition-colors">
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            <button onClick={() => setView('months')} className="font-medium text-sm text-gray-900 hover:bg-gray-100 px-2 py-1 rounded transition-colors">
              {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()} ▼
            </button>
            <button onClick={() => navigateMonth('next')} className="p-1 hover:bg-gray-100 rounded transition-colors">
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </>
        );
      case 'months':
        return (
          <>
            <button onClick={() => setView('days')} className="p-1 hover:bg-gray-100 rounded transition-colors">
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            <button onClick={() => setView('years')} className="font-medium text-sm text-gray-900 hover:bg-gray-100 px-2 py-1 rounded transition-colors">
              {currentDate.getFullYear()} ▼
            </button>
            <div className="w-6" />
          </>
        );
      case 'years':
        return (
          <>
            <button onClick={() => setView('months')} className="p-1 hover:bg-gray-100 rounded transition-colors">
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            <span className="font-medium text-sm text-gray-900">Select Year</span>
            <div className="w-6" />
          </>
        );
    }
  };

  const renderView = () => {
    switch (view) {
      case 'days':
        return (
          <>
            <div className="grid grid-cols-7 gap-1 mb-2">
              {WEEK_DAYS.map((day) => (
                <div key={day} className="h-8 flex items-center justify-center text-xs font-medium text-gray-500">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">{renderCalendarDays()}</div>
          </>
        );
      case 'months':
        return <div className="grid grid-cols-4 gap-2">{renderMonths()}</div>;
      case 'years':
        return renderYears();
    }
  };

  // Effects
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setView('days');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const currentYear = currentDate.getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);
    setYearRange(years);
  }, [currentDate]);

  return (
    <div ref={containerRef} className="relative">
      {label && (
        <label className="block text-xs text-gray-500 mb-1">{label}</label>
      )}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full px-4 py-2 border border-gray-200 rounded-lg text-left focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 hover:border-teal-400 transition-colors flex items-center justify-between text-sm
          ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white cursor-pointer'}`}
      >
        <span className={selectedDate ? 'text-gray-900' : 'text-gray-400'}>
          {selectedDate ? formatDisplayDate(selectedDate) : placeholder}
        </span>
        <Calendar className="w-4 h-4 text-gray-400" />
      </button>

      {isOpen && !disabled && (
        <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50 w-72">
          <div className="flex items-center justify-between mb-4">
            {renderHeader()}
          </div>

          <div className="min-h-[240px]">
            {renderView()}
          </div>

          {view === 'days' && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
              <button onClick={clearDate} className="text-sm text-teal-600 hover:text-teal-700 font-medium">
                Clear
              </button>
              <button onClick={setToday} className="text-sm text-teal-600 hover:text-teal-700 font-medium">
                Today
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Main Combined Report Component
const CombinedReportPage: React.FC = () => {
  const [filters, setFilters] = useState({
    fromDate: '',
    toDate: '',
    selectedType: '',
    documentType: 'Attendance' as 'Attendance' | 'Leaves',
    leaveStatus: '',
  });
  const [currentPage, setCurrentPage] = useState(1);

  // Mock data for both attendance and leaves
  const attendanceData: AttendanceRecord[] = [
    { date: '2024-01-01', timeIn: '09:00 AM', timeOut: '05:00 PM', totalHours: '8 hours', status: 'Present' },
    { date: '2024-01-02', timeIn: '09:05 AM', timeOut: '05:00 PM', totalHours: '7.92 hours', status: 'Late' },
    { date: '2024-01-03', timeIn: '09:00 AM', timeOut: '05:00 PM', totalHours: '8 hours', status: 'Present' },
    { date: '2024-01-04', timeIn: '09:00 AM', timeOut: '05:00 PM', totalHours: '8 hours', status: 'Present' },
    { date: '2024-01-05', timeIn: '09:00 AM', timeOut: '05:00 PM', totalHours: '8 hours', status: 'Present' },
    { date: '2024-01-06', timeIn: '09:00 AM', timeOut: '05:00 PM', totalHours: '8 hours', status: 'Overtime' },
    { date: '2024-01-07', timeIn: '-', timeOut: '-', totalHours: '-', status: 'Leave' },
    { date: '2024-01-08', timeIn: '09:00 AM', timeOut: '05:00 PM', totalHours: '8 hours', status: 'Present' },
    { date: '2024-01-09', timeIn: '09:00 AM', timeOut: '05:00 PM', totalHours: '8 hours', status: 'Present' },
    { date: '2024-01-10', timeIn: '09:00 AM', timeOut: '05:00 PM', totalHours: '8 hours', status: 'Present' },
  ];

  const leaveData: LeaveRecord[] = [
    { leaveType: 'Casual', from: '31 Dec 2024', to: '10 Jan 2025', days: 1, status: 'Pending', reason: 'Travelling to village', approver: 'Avinash' },
    { leaveType: 'Casual', from: '31 Dec 2024', to: '31 Dec 2024', days: 2, status: 'Rejected', reason: 'Sorry I I can\'t approve', approver: 'Avinash' },
    { leaveType: 'Casual', from: '25 Dec 2024', to: '25 Dec 2024', days: 1, status: 'Approved', reason: 'Travelling to village', approver: 'Avinash' },
    { leaveType: 'Casual', from: '10 Dec 2024', to: '13 Dec 2024', days: 3, status: 'Approved', reason: 'Travelling to village', approver: 'Avinash' },
    { leaveType: 'Casual', from: '8 Nov 2024', to: '13 Nov 2024', days: 5, status: 'Approved', reason: 'Travelling to village', approver: 'Avinash' },
    { leaveType: 'Casual', from: '8 Nov 2024', to: '13 Nov 2024', days: 5, status: 'Approved', reason: 'Travelling to village', approver: 'Avinash' },
    { leaveType: 'Medical', from: '15 Nov 2024', to: '16 Nov 2024', days: 2, status: 'Approved', reason: 'Medical appointment', approver: 'Avinash' },
    { leaveType: 'Annual', from: '20 Dec 2024', to: '24 Dec 2024', days: 4, status: 'Pending', reason: 'Family vacation', approver: 'Avinash' },
  ];

  // Data processing utilities for attendance
  const getStartOfWeek = (date: Date): Date => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };

  const groupByWeek = (data: AttendanceRecord[]): AttendanceRecord[] => {
    const weeks: { [key: string]: AttendanceRecord[] } = {};
    
    data.forEach(record => {
      const recordDate = new Date(record.date);
      const weekStart = getStartOfWeek(recordDate);
      const weekKey = weekStart.toISOString().split('T')[0];
      
      if (!weeks[weekKey]) weeks[weekKey] = [];
      weeks[weekKey].push(record);
    });

    return Object.entries(weeks).map(([weekStart, records]) => {
      const totalHours = records.reduce((sum, r) => 
        sum + (parseFloat(r.totalHours.replace(' hours', '')) || 0), 0
      );
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      
      return { 
        date: `${weekStart} to ${weekEnd.toISOString().split('T')[0]}`, 
        timeIn: '-', 
        timeOut: '-', 
        totalHours: `${totalHours.toFixed(2)} hours`, 
        status: 'Present' as const 
      };
    });
  };

  const groupByMonth = (data: AttendanceRecord[]): AttendanceRecord[] => {
    const months: { [key: string]: AttendanceRecord[] } = {};
    
    data.forEach(record => {
      const monthKey = record.date.substring(0, 7);
      if (!months[monthKey]) months[monthKey] = [];
      months[monthKey].push(record);
    });

    return Object.entries(months).map(([month, records]) => {
      const totalHours = records.reduce((sum, r) => 
        sum + (parseFloat(r.totalHours.replace(' hours', '')) || 0), 0
      );
      const presentDays = records.filter(r => 
        r.status === 'Present' || r.status === 'Late' || r.status === 'Overtime'
      ).length;
      
      return { 
        date: month, 
        timeIn: '-', 
        timeOut: '-', 
        totalHours: `${totalHours.toFixed(2)} hours (${presentDays} days)`, 
        status: 'Present' as const 
      };
    });
  };

  // Filtered data - FIXED DATE FILTERING
  const filteredData = useMemo(() => {
    if (filters.documentType === 'Attendance') {
      let baseData = attendanceData;
      
      // Custom date range filter for attendance
      if (filters.selectedType === 'custom' && (filters.fromDate || filters.toDate)) {
        baseData = baseData.filter(record => {
          const recordDate = new Date(record.date);
          return isDateInRange(recordDate, filters.fromDate, filters.toDate);
        });
      }

      // Group by time period
      switch (filters.selectedType) {
        case 'daily': return baseData;
        case 'weekly': return groupByWeek(baseData);
        case 'monthly': return groupByMonth(baseData);
        case 'custom': return baseData;
        default: return baseData;
      }
    } else {
      // Leaves data - FIXED DATE FILTERING
      let baseData = leaveData;
      
      // Date range filter for leaves
      if (filters.fromDate || filters.toDate) {
        baseData = baseData.filter(record => {
          const recordFromDate = parseLeaveDate(record.from);
          return isDateInRange(recordFromDate, filters.fromDate, filters.toDate);
        });
      }

      // Status filter for leaves
      if (filters.leaveStatus) {
        baseData = baseData.filter(record => record.status.toLowerCase() === filters.leaveStatus.toLowerCase());
      }

      return baseData;
    }
  }, [filters]);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return filters.fromDate || filters.toDate || filters.selectedType || filters.leaveStatus;
  }, [filters]);

  // Clear all filters
  const handleClearFilters = () => {
    setFilters({
      fromDate: '',
      toDate: '',
      selectedType: '',
      documentType: filters.documentType,
      leaveStatus: '',
    });
  };

  // Pagination
  const totalPages = Math.ceil(filteredData.length / RECORDS_PER_PAGE);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * RECORDS_PER_PAGE;
    return filteredData.slice(startIndex, startIndex + RECORDS_PER_PAGE);
  }, [filteredData, currentPage]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // UI helpers
  const getStatusColor = (status: string): string => {
    const colors = {
      Present: 'text-teal-600',
      Late: 'text-red-500',
      Leave: 'text-red-500',
      Overtime: 'text-blue-500',
      Approved: 'text-green-600 bg-green-50',
      Pending: 'text-yellow-600 bg-yellow-50',
      Rejected: 'text-red-600 bg-red-50',
    };
    return colors[status as keyof typeof colors] || 'text-gray-600';
  };

  const getReportTitle = (): string => {
    const titles = {
      daily: 'Daily Report',
      weekly: 'Weekly Report',
      monthly: 'Monthly Report',
      custom: 'Custom Report',
    };
    return titles[filters.selectedType as keyof typeof titles] || `${filters.documentType} Report`;
  };

  const calculateSummary = (): SummaryStats => {
    if (filters.documentType === 'Attendance') {
      const presentDays = filteredData.filter(record => 
        (record as AttendanceRecord).status === 'Present' || (record as AttendanceRecord).status === 'Overtime'
      ).length;
      
      const totalHours = filteredData.reduce((sum, record) => {
        return sum + (parseFloat((record as AttendanceRecord).totalHours.replace(' hours', '')) || 0);
      }, 0);
      
      const attendanceRate = filteredData.length > 0 
        ? Math.round((presentDays / filteredData.length) * 100)
        : 0;

      return { totalHours, attendanceRate, presentDays };
    } else {
      const totalLeaves = filteredData.length;
      const approvedLeaves = filteredData.filter(record => (record as LeaveRecord).status === 'Approved').length;
      const pendingLeaves = filteredData.filter(record => (record as LeaveRecord).status === 'Pending').length;
      const rejectedLeaves = filteredData.filter(record => (record as LeaveRecord).status === 'Rejected').length;

      return { totalLeaves, approvedLeaves, pendingLeaves, rejectedLeaves };
    }
  };

  const summary = calculateSummary();

  // Event handlers
  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Export handlers
  const handleExportPDF = () => {
    console.log('Exporting PDF with data:', filteredData);
    alert('PDF export functionality would be implemented here');
  };

  const handleExportExcel = () => {
    console.log('Exporting Excel with data:', filteredData);
    alert('Excel export functionality would be implemented here');
  };

  const renderPagination = () => (
    <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
      <button 
        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
        disabled={currentPage === 1} 
        onClick={() => handlePageChange(currentPage - 1)}
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Previous</span>
      </button>
      
      <div className="flex space-x-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button 
            key={page} 
            onClick={() => handlePageChange(page)} 
            className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
              currentPage === page ? 'bg-teal-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {page}
          </button>
        ))}
      </div>
      
      <button 
        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
        disabled={currentPage === totalPages} 
        onClick={() => handlePageChange(currentPage + 1)}
      >
        <span>Next</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );

  const renderAttendanceTable = () => (
    <table className="w-full">
      <thead className="bg-gray-50 sticky top-0">
        <tr>
          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            {filters.selectedType === 'weekly' ? 'Week' : filters.selectedType === 'monthly' ? 'Month' : 'Date'}
          </th>
          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time In</th>
          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Out</th>
          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Hours</th>
          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {paginatedData.length > 0 ? paginatedData.map((record, index) => (
          <tr key={index} className="hover:bg-gray-50 transition-colors">
            <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{(record as AttendanceRecord).date}</td>
            <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">{(record as AttendanceRecord).timeIn}</td>
            <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">{(record as AttendanceRecord).timeOut}</td>
            <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">{(record as AttendanceRecord).totalHours}</td>
            <td className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${getStatusColor((record as AttendanceRecord).status)}`}>
              {(record as AttendanceRecord).status}
            </td>
          </tr>
        )) : (
          <tr>
            <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
              No attendance records found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );

  const renderLeavesTable = () => (
    <table className="w-full">
      <thead className="bg-gray-50 sticky top-0">
        <tr>
          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leave Type</th>
          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To</th>
          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days</th>
          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approver</th>
          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {paginatedData.length > 0 ? paginatedData.map((record, index) => (
          <tr key={index} className="hover:bg-gray-50 transition-colors">
            <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{(record as LeaveRecord).leaveType}</td>
            <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">{(record as LeaveRecord).from}</td>
            <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">{(record as LeaveRecord).to}</td>
            <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">{(record as LeaveRecord).days}</td>
            <td className="px-6 py-4 text-sm whitespace-nowrap">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor((record as LeaveRecord).status)}`}>
                {(record as LeaveRecord).status}
              </span>
            </td>
            <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate" title={(record as LeaveRecord).reason}>
              {(record as LeaveRecord).reason}
            </td>
            <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">{(record as LeaveRecord).approver}</td>
            <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
              <input type="checkbox" className="rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
            </td>
          </tr>
        )) : (
          <tr>
            <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
              No leave records found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );

  const renderSummaryCards = () => {
    if (filters.documentType === 'Attendance') {
      return (
        <div className="grid grid-cols-3 gap-12 text-sm">
          <div>
            <div className="text-gray-500 text-xs mb-1">Report Period</div>
            <div className="font-medium text-gray-900">
              {filters.selectedType === 'custom' && filters.fromDate && filters.toDate 
                ? `${filters.fromDate} to ${filters.toDate}` 
                : 'Jan 1 - Jan 20, 2024'}
            </div>
          </div>
          <div>
            <div className="text-gray-500 text-xs mb-1">Total Hours</div>
            <div className="font-medium text-gray-900">{summary.totalHours?.toFixed(1)} hours</div>
          </div>
          <div>
            <div className="text-gray-500 text-xs mb-1">Attendance Rate</div>
            <div className="font-medium text-gray-900">{summary.attendanceRate}%</div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="grid grid-cols-4 gap-8 text-sm">
          <div>
            <div className="text-gray-500 text-xs mb-1">Report Period</div>
            <div className="font-medium text-gray-900">
              {filters.fromDate && filters.toDate 
                ? `${filters.fromDate} to ${filters.toDate}` 
                : 'All Time'}
            </div>
          </div>
          <div>
            <div className="text-gray-500 text-xs mb-1">Total Days</div>
            <div className="font-medium text-gray-900">
              {filteredData.reduce((sum, record) => sum + (record as LeaveRecord).days, 0)} days
            </div>
          </div>
          <div>
            <div className="text-gray-500 text-xs mb-1">Approval Rate</div>
            <div className="font-medium text-gray-900">
              {summary.totalLeaves && summary.totalLeaves > 0 
                ? Math.round((summary.approvedLeaves! / summary.totalLeaves) * 100) 
                : 0}%
            </div>
          </div>
          <div>
            <div className="text-gray-500 text-xs mb-1">Total Leaves</div>
            <div className="font-medium text-gray-900">{summary.totalLeaves}</div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Report & History</h1>
      
      <div className="bg-white rounded-3xl shadow-sm p-8 max-w-7xl mx-auto">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className="w-80 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Date range</label>
              <div className="flex gap-3">
                <div className="flex-1">
                  <CustomDatePicker 
                    value={filters.fromDate} 
                    onChange={(value) => handleFilterChange('fromDate', value)} 
                    disabled={filters.documentType === 'Attendance' && filters.selectedType !== 'custom'} 
                    label="From" 
                    placeholder="Select date" 
                  />
                </div>
                <div className="flex-1">
                  <CustomDatePicker 
                    value={filters.toDate} 
                    onChange={(value) => handleFilterChange('toDate', value)} 
                    disabled={filters.documentType === 'Attendance' && filters.selectedType !== 'custom'} 
                    label="To" 
                    placeholder="Select date" 
                  />
                </div>
              </div>
            </div>
            
            {filters.documentType === 'Attendance' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Types</label>
                <p className="text-xs text-gray-500 mb-3">Daily, Weekly, Monthly, Custom</p>
                <Select 
                  value={filters.selectedType} 
                  onChange={(e) => handleFilterChange('selectedType', e.target.value)} 
                  placeholder="Select an option"
                >
                  <Option value="daily">Daily</Option>
                  <Option value="weekly">Weekly</Option>
                  <Option value="monthly">Monthly</Option>
                  <Option value="custom">Custom</Option>
                </Select>
              </div>
            )}

            {filters.documentType === 'Leaves' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Leave Status</label>
                <p className="text-xs text-gray-500 mb-3">Filter by approval status</p>
                <Select 
                  value={filters.leaveStatus} 
                  onChange={(e) => handleFilterChange('leaveStatus', e.target.value)} 
                  placeholder="All Status"
                >
                  <Option value="">All Status</Option>
                  <Option value="approved">Approved</Option>
                  <Option value="pending">Pending</Option>
                  <Option value="rejected">Rejected</Option>
                </Select>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Document Types</label>
              <p className="text-xs text-gray-500 mb-3">Attendance, Leaves</p>
              <Select 
                value={filters.documentType} 
                onChange={(e) => handleFilterChange('documentType', e.target.value as 'Attendance' | 'Leaves')} 
                placeholder="Select document type"
              >
                <Option value="Attendance">Attendance</Option>
                <Option value="Leaves">Leaves</Option>
              </Select>
            </div>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <div>
                <button 
                  onClick={handleClearFilters}
                  className="w-full flex items-center justify-center gap-2 bg-gray-200 text-gray-700 py-2 rounded-xl font-medium hover:bg-gray-300 transition-colors group"
                >
                  <X className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>Clear Filters</span>
                </button>
              </div>
            )}
            
            <div>
              <p className="text-sm font-medium text-gray-700 mb-4">
                Download your report in PDF or Excel format.
              </p>
              <div className="space-y-3">
                <button 
                  onClick={handleExportPDF}
                  className="w-full flex items-center justify-center gap-2 bg-teal-600 text-white py-2 rounded-xl font-medium hover:bg-teal-700 transition-colors group"
                >
                  <FileText className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>Export as PDF</span>
                  <Download className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </button>
                <button 
                  onClick={handleExportExcel}
                  className="w-full flex items-center justify-center gap-2 bg-white text-teal-700 py-2 rounded-xl font-medium hover:bg-teal-50 transition-colors border border-teal-200 group"
                >
                  <Table className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>Export as Excel</span>
                  <Download className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* Report Content */}
          <div className="flex-1 bg-white rounded-3xl shadow-sm p-6">
            <div className="mb-8 flex items-start justify-between">
              <div className="space-y-4">
                <h6 className="text-lg font-semibold text-gray-800 mb-4">Prabath Perera</h6>
                {renderSummaryCards()}
              </div>
              
              <div className="text-right">
                <h6 className="text-lg font-semibold text-gray-800">{getReportTitle()}</h6>
                <p className="text-sm text-gray-500 mt-1">
                  Showing {paginatedData.length} of {filteredData.length} records
                </p>
              </div>
            </div>

            {/* Data Table */}
            <div className="border border-gray-200 rounded-lg overflow-hidden mt-6 max-h-[500px] overflow-y-auto">
              {filters.documentType === 'Attendance' ? renderAttendanceTable() : renderLeavesTable()}
            </div>
            
            {renderPagination()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CombinedReportPage;