'use client';

import React, { useState, useMemo } from 'react';
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react';

interface AttendanceRecord {
  id: string;
  date: string;
  status: 'Present' | 'Absent' | 'Late' | 'Leave';
  checkIn: string;
  checkOut: string;
  totalHours: string;
  hoursWorked: number;
}

const mockAttendance: AttendanceRecord[] = [
  { id: '1', date: '12 Jan 2025', status: 'Present', checkIn: '09:02 AM', checkOut: '06:15 PM', totalHours: '8h 52m', hoursWorked: 8.87 },
  { id: '2', date: '13 Jan 2025', status: 'Late', checkIn: '09:35 AM', checkOut: '06:02 PM', totalHours: '8h 27m', hoursWorked: 8.45 },
  { id: '3', date: '14 Jan 2025', status: 'Present', checkIn: '09:00 AM', checkOut: '06:00 PM', totalHours: '9h 0m', hoursWorked: 9 },
  { id: '4', date: '15 Jan 2025', status: 'Absent', checkIn: '-', checkOut: '-', totalHours: '-', hoursWorked: 0 },
  { id: '5', date: '16 Jan 2025', status: 'Present', checkIn: '08:58 AM', checkOut: '05:50 PM', totalHours: '8h 52m', hoursWorked: 8.87 },
  { id: '6', date: '17 Jan 2025', status: 'Leave', checkIn: '-', checkOut: '-', totalHours: '-', hoursWorked: 0 },
  { id: '7', date: '18 Jan 2025', status: 'Present', checkIn: '09:05 AM', checkOut: '06:10 PM', totalHours: '9h 5m', hoursWorked: 9.08 },
  { id: '8', date: '19 Jan 2025', status: 'Late', checkIn: '09:40 AM', checkOut: '06:05 PM', totalHours: '8h 25m', hoursWorked: 8.42 },
  { id: '9', date: '20 Jan 2025', status: 'Present', checkIn: '09:00 AM', checkOut: '06:00 PM', totalHours: '9h 0m', hoursWorked: 9 },
  { id: '10', date: '21 Jan 2025', status: 'Present', checkIn: '08:55 AM', checkOut: '05:55 PM', totalHours: '9h 0m', hoursWorked: 9 },
  { id: '11', date: '11 Dec 2024', status: 'Present', checkIn: '09:02 AM', checkOut: '05:45 PM', totalHours: '8h 43m', hoursWorked: 8.72 },
  { id: '12', date: '12 Dec 2024', status: 'Present', checkIn: '09:00 AM', checkOut: '06:00 PM', totalHours: '9h 0m', hoursWorked: 9 },
  { id: '13', date: '13 Dec 2024', status: 'Late', checkIn: '09:35 AM', checkOut: '06:02 PM', totalHours: '8h 27m', hoursWorked: 8.45 },
  { id: '14', date: '25 Dec 2024', status: 'Absent', checkIn: '-', checkOut: '-', totalHours: '-', hoursWorked: 0 },
  { id: '15', date: '11 Dec 2023', status: 'Present', checkIn: '09:02 AM', checkOut: '06:05 PM', totalHours: '9h 3m', hoursWorked: 9.05 },
];

const ITEMS_PER_PAGE = 8;

const AttendanceManagement = () => {
  const today = new Date();
  const [displayDateRange, setDisplayDateRange] = useState('Select date range');
  const [showDateModal, setShowDateModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState<'custom' | 'last7' | 'last30' | 'last90' | 'weeks' | 'months' | 'years'>('custom');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isSelectingStart, setIsSelectingStart] = useState(true);
  const [leftCalendarMonth, setLeftCalendarMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [rightCalendarMonth, setRightCalendarMonth] = useState(new Date(today.getFullYear(), today.getMonth() + 1, 1));
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showWeekPicker, setShowWeekPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [selectedMonths, setSelectedMonths] = useState<{month: string, year: number}[]>([]);
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [selectedWeeks, setSelectedWeeks] = useState<{week: number, year: number}[]>([]);
  
  const employeeHireDate = new Date(2020, 0, 1);
  const currentYear = new Date().getFullYear();
  const hireYear = employeeHireDate.getFullYear();
  const yearsEmployed = Array.from({ length: currentYear - hireYear + 1 }, (_, i) => hireYear + i);

  const filteredAttendance = useMemo(() => {
    if (!startDate || !endDate) return mockAttendance;
    
    return mockAttendance.filter(record => {
      const parts = record.date.split(' ');
      const day = parseInt(parts[0]);
      const month = parts[1];
      const year = parseInt(parts[2]);
      
      const monthIndex = new Date(`${month} 1, 2000`).getMonth();
      const recordDate = new Date(year, monthIndex, day);
      
      const startOfDay = new Date(startDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(endDate);
      endOfDay.setHours(23, 59, 59, 999);
      
      return recordDate >= startOfDay && recordDate <= endOfDay;
    });
  }, [startDate, endDate]);

  const stats = useMemo(() => {
    const present = filteredAttendance.filter(r => r.status === 'Present').length;
    const absent = filteredAttendance.filter(r => r.status === 'Absent').length;
    const late = filteredAttendance.filter(r => r.status === 'Late').length;
    const leave = filteredAttendance.filter(r => r.status === 'Leave').length;

    return [
      { value: present.toString(), label: 'Present Days', bg: 'bg-emerald-100', text: 'text-emerald-700' },
      { value: absent.toString(), label: 'Absent Days', bg: 'bg-red-200', text: 'text-red-700' },
      { value: late.toString(), label: 'Late Days', bg: 'bg-yellow-100', text: 'text-yellow-700' },
      { value: leave.toString(), label: 'Leaves Taken', bg: 'bg-gray-200', text: 'text-gray-700' },
    ];
  }, [filteredAttendance]);

  const totalPages = Math.ceil(filteredAttendance.length / ITEMS_PER_PAGE);
  const paginatedAttendance = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredAttendance.slice(startIndex, endIndex);
  }, [filteredAttendance, currentPage]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [filteredAttendance]);

  const getFilterTypeColor = (type: typeof filterType) => {
    const colors = {
      last7: 'bg-purple-50 text-purple-700 border-purple-200',
      last30: 'bg-blue-50 text-blue-700 border-blue-200',
      last90: 'bg-green-50 text-green-700 border-green-200',
      custom: 'bg-gray-50 text-gray-700 border-gray-200',
      weeks: 'bg-orange-50 text-orange-700 border-orange-200',
      months: 'bg-red-50 text-red-700 border-red-200',
      years: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    };
    return colors[type] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const quarters = [
    { name: 'Q1', months: ['Jan', 'Feb', 'Mar'] },
    { name: 'Q2', months: ['Apr', 'May', 'Jun'] },
    { name: 'Q3', months: ['Jul', 'Aug', 'Sep'] },
    { name: 'Q4', months: ['Oct', 'Nov', 'Dec'] }
  ];

  const getStatusBadge = (status: string) => {
    const styles = {
      Present: 'bg-emerald-100 text-emerald-700',
      Late: 'bg-yellow-100 text-yellow-700',
      Absent: 'bg-red-100 text-red-700',
      Leave: 'bg-gray-200 text-gray-700',
    };
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-700';
  };

  const generateCalendarDays = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  };

  const handleDateClick = (day: number, month: Date) => {
    const selectedDate = new Date(month.getFullYear(), month.getMonth(), day);
    if (isSelectingStart || !startDate) {
      setStartDate(selectedDate);
      setEndDate(null);
      setIsSelectingStart(false);
    } else {
      if (selectedDate >= startDate) {
        setEndDate(selectedDate);
        setIsSelectingStart(true);
      } else {
        setStartDate(selectedDate);
        setEndDate(null);
      }
    }
  };

  const isDateInRange = (day: number, month: Date) => {
    if (!startDate || !endDate) return false;
    const date = new Date(month.getFullYear(), month.getMonth(), day);
    return date >= startDate && date <= endDate;
  };

  const isStartDate = (day: number, month: Date) => {
    if (!startDate) return false;
    return startDate.getDate() === day && startDate.getMonth() === month.getMonth() && startDate.getFullYear() === month.getFullYear();
  };

  const isEndDate = (day: number, month: Date) => {
    if (!endDate) return false;
    return endDate.getDate() === day && endDate.getMonth() === month.getMonth() && endDate.getFullYear() === month.getFullYear();
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newLeftMonth = new Date(leftCalendarMonth);
    newLeftMonth.setMonth(newLeftMonth.getMonth() + (direction === 'next' ? 1 : -1));
    setLeftCalendarMonth(newLeftMonth);
    setRightCalendarMonth(new Date(newLeftMonth.getFullYear(), newLeftMonth.getMonth() + 1));
  };

  const navigateYear = (direction: 'prev' | 'next') => {
    setSelectedYear(prev => direction === 'next' ? prev + 1 : prev - 1);
  };

  const handlePresetFilter = (type: typeof filterType) => {
    setFilterType(type);
    setShowMonthPicker(false);
    setShowWeekPicker(false);
    setShowYearPicker(false);
    
    const today = new Date();
    if (type === 'last7') {
      const start = new Date(today);
      start.setDate(today.getDate() - 6);
      setStartDate(start);
      setEndDate(today);
    } else if (type === 'last30') {
      const start = new Date(today);
      start.setDate(today.getDate() - 29);
      setStartDate(start);
      setEndDate(today);
    } else if (type === 'last90') {
      const start = new Date(today);
      start.setDate(today.getDate() - 89);
      setStartDate(start);
      setEndDate(today);
    } else if (type === 'custom') {
      setStartDate(null);
      setEndDate(null);
      setIsSelectingStart(true);
    } else if (type === 'months') {
      setShowMonthPicker(true);
      setSelectedMonths([]);
    } else if (type === 'weeks') {
      setShowWeekPicker(true);
      setSelectedWeeks([]);
    } else if (type === 'years') {
      setShowYearPicker(true);
      setSelectedYear(today.getFullYear());
    }
  };

  const toggleMonthSelection = (month: string) => {
    setSelectedMonths(prev => {
      const exists = prev.find(m => m.month === month && m.year === selectedYear);
      if (exists) {
        return prev.filter(m => !(m.month === month && m.year === selectedYear));
      }
      return [...prev, { month, year: selectedYear }];
    });
  };

  const toggleWeekSelection = (week: number) => {
    setSelectedWeeks(prev => {
      const exists = prev.find(w => w.week === week && w.year === selectedYear);
      if (exists) {
        return prev.filter(w => !(w.week === week && w.year === selectedYear));
      }
      return [...prev, { week, year: selectedYear }];
    });
  };

  const removeSelectedMonth = (month: string, year: number) => {
    setSelectedMonths(prev => prev.filter(m => !(m.month === month && m.year === year)));
  };

  const removeSelectedWeek = (week: number, year: number) => {
    setSelectedWeeks(prev => prev.filter(w => !(w.week === week && w.year === year)));
  };

  const isMonthSelected = (month: string) => {
    return selectedMonths.some(m => m.month === month && m.year === selectedYear);
  };

  const isWeekSelected = (week: number) => {
    return selectedWeeks.some(w => w.week === week && w.year === selectedYear);
  };

  const applyFilter = () => {
    if (filterType === 'months' && selectedMonths.length > 0) {
      const sortedMonths = [...selectedMonths].sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return monthNames.indexOf(a.month) - monthNames.indexOf(b.month);
      });
      
      const firstMonth = sortedMonths[0];
      const lastMonth = sortedMonths[sortedMonths.length - 1];
      
      const start = new Date(firstMonth.year, monthNames.indexOf(firstMonth.month), 1);
      const end = new Date(lastMonth.year, monthNames.indexOf(lastMonth.month) + 1, 0);
      
      setStartDate(start);
      setEndDate(end);
      
      const monthsDisplay = selectedMonths.map(m => `${m.month} ${m.year}`).join(', ');
      setDisplayDateRange(monthsDisplay);
    } else if (filterType === 'weeks' && selectedWeeks.length > 0) {
      const sortedWeeks = [...selectedWeeks].sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return a.week - b.week;
      });
      
      const firstWeek = sortedWeeks[0];
      const lastWeek = sortedWeeks[sortedWeeks.length - 1];
      
      const firstDayOfYear = new Date(firstWeek.year, 0, 1);
      const firstDayOfWeek = firstDayOfYear.getDay();
      const daysToAdd = (firstWeek.week - 1) * 7 - firstDayOfWeek;
      const start = new Date(firstWeek.year, 0, 1 + daysToAdd);
      
      const lastDayOfYear = new Date(lastWeek.year, 0, 1);
      const lastDayOfWeek = lastDayOfYear.getDay();
      const daysToAddLast = (lastWeek.week - 1) * 7 - lastDayOfWeek + 6;
      const end = new Date(lastWeek.year, 0, 1 + daysToAddLast);
      
      setStartDate(start);
      setEndDate(end);
      
      const weeksDisplay = selectedWeeks.map(w => `W${w.week} ${w.year}`).join(', ');
      setDisplayDateRange(weeksDisplay);
    } else if (filterType === 'years') {
      const start = new Date(selectedYear, 0, 1);
      const end = new Date(selectedYear, 11, 31);
      
      setStartDate(start);
      setEndDate(end);
      setDisplayDateRange(`Year ${selectedYear}`);
    } else if (startDate && endDate) {
      const start = startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      const end = endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      
      if (filterType === 'last7') {
        setDisplayDateRange(`Last 7 Days: ${start} - ${end}`);
      } else if (filterType === 'last30') {
        setDisplayDateRange(`Last 30 Days: ${start} - ${end}`);
      } else if (filterType === 'last90') {
        setDisplayDateRange(`Last 90 Days: ${start} - ${end}`);
      } else {
        setDisplayDateRange(`${start} - ${end}`);
      }
    }
    setShowDateModal(false);
  };
  
  const formatDateLong = (date: Date | null) => {
    if (!date) return 'Select date';
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const leftDays = generateCalendarDays(leftCalendarMonth);
  const rightDays = generateCalendarDays(rightCalendarMonth);

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 6;
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="min-h-screen p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Attendance Management</h1>
        <p className="text-sm text-gray-500 mt-1">Track and manage your attendance records</p>
      </div>
      
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl shadow-sm p-8">
          <div className="grid grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className={`${stat.bg} rounded-2xl w-20 h-20 flex items-center justify-center shadow-sm`}>
                    <div className={`text-3xl font-bold ${stat.text}`}>{stat.value}</div>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-800">{stat.label.split(' ')[0]}</div>
                    <div className="text-sm font-semibold text-gray-800">{stat.label.split(' ').slice(1).join(' ')}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${getFilterTypeColor(filterType)}`}>
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-medium">{displayDateRange}</span>
              </div>
              <button onClick={() => setShowDateModal(true)} className="px-5 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors">
                Filter
              </button>
              {(startDate || endDate || selectedMonths.length > 0 || selectedWeeks.length > 0 || (filterType === 'years' && displayDateRange !== 'Select date range')) && (
                <button 
                  onClick={() => {
                    setStartDate(null);
                    setEndDate(null);
                    setDisplayDateRange('Select date range');
                    setFilterType('custom');
                    setSelectedMonths([]);
                    setSelectedWeeks([]);
                    setSelectedYear(today.getFullYear());
                  }} 
                  className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-200">
                  <th className="pb-4 text-sm font-semibold text-gray-700">Date</th>
                  <th className="pb-4 text-sm font-semibold text-gray-700">Status</th>
                  <th className="pb-4 text-sm font-semibold text-gray-700">Check In</th>
                  <th className="pb-4 text-sm font-semibold text-gray-700">Check out</th>
                  <th className="pb-4 text-sm font-semibold text-gray-700">Total hours</th>
                  <th className="pb-4 text-sm font-semibold text-gray-700">Hours Worked</th>
                </tr>
              </thead>
              <tbody>
                {paginatedAttendance.length > 0 ? (
                  paginatedAttendance.map((record) => (
                    <tr key={record.id} className="border-b border-gray-200 last:border-0">
                      <td className="py-4 text-sm text-gray-900">{record.date}</td>
                      <td className="py-4">
                        <span className={`px-3 py-1.5 rounded-lg text-xs font-medium ${getStatusBadge(record.status)}`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="py-4 text-sm text-gray-900">{record.checkIn}</td>
                      <td className="py-4 text-sm text-gray-900">{record.checkOut}</td>
                      <td className="py-4 text-sm text-gray-900">{record.totalHours}</td>
                      <td className="py-4 text-sm text-gray-900">{record.hoursWorked}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-sm text-gray-500">
                      No attendance records found for the selected date range
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {totalPages > 0 && (
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                <button 
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className={`flex items-center text-sm transition-colors ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </button>
                <div className="flex items-center space-x-2">
                  {getPageNumbers().map((page, idx) => (
                    page === '...' ? (
                      <span key={`ellipsis-${idx}`} className="text-gray-400 px-2">...</span>
                    ) : (
                      <button 
                        key={page} 
                        onClick={() => setCurrentPage(page as number)} 
                        className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${currentPage === page ? 'bg-teal-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                      >
                        {page}
                      </button>
                    )
                  ))}
                </div>
                <button 
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className={`flex items-center text-sm transition-colors ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            )}
          </div>

          <div className="flex justify-end mt-6">
            <button className="px-6 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-medium hover:bg-teal-700 shadow-sm transition-colors">
              Export Attendance
            </button>
          </div>
        </div>

        {showDateModal && (
          <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] flex flex-col">
              <div className="px-8 py-5 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-teal-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Date Range Filter</h3>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {filterType === 'months' && selectedMonths.length > 0 ? `${selectedMonths.length} month${selectedMonths.length > 1 ? 's' : ''} selected` : filterType === 'weeks' && selectedWeeks.length > 0 ? `${selectedWeeks.length} week${selectedWeeks.length > 1 ? 's' : ''} selected` : filterType === 'years' ? `Year ${selectedYear}` : startDate && endDate ? `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}` : 'Select a date range to filter attendance'}
                      </p>
                    </div>
                  </div>
                  <button onClick={() => setShowDateModal(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>

              <div className="flex flex-1 overflow-hidden">
                <div className="w-64 bg-gray-50 border-r border-gray-200 p-6">
                  <div className="mb-4">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Filter Options</h4>
                  </div>
                  <div className="space-y-1">
                    {[
                      { type: 'custom', label: 'Custom Range', icon: '📅' },
                      { type: 'last7', label: 'Last 7 days', icon: '📆' },
                      { type: 'last30', label: 'Last 30 days', icon: '📊' },
                      { type: 'last90', label: 'Last 90 days', icon: '📈' },
                      { type: 'weeks', label: 'By Weeks', icon: '🗓️' },
                      { type: 'months', label: 'By Months', icon: '📋' },
                      { type: 'years', label: 'By Years', icon: '🗂️' }
                    ].map((item) => (
                      <button 
                        key={item.type}
                        onClick={() => handlePresetFilter(item.type as typeof filterType)} 
                        className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center space-x-3 ${filterType === item.type ? 'bg-teal-600 text-white shadow-md' : 'text-gray-700 hover:bg-white hover:shadow-sm'}`}
                      >
                        <span className="text-lg">{item.icon}</span>
                        <span className="text-sm font-medium">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex-1 p-8 overflow-y-auto bg-white">
                  {(filterType === 'custom' || filterType === 'last7' || filterType === 'last30' || filterType === 'last90') && (
                    <div>
                      <div className="mb-8">
                        <div className="grid grid-cols-2 gap-6">
                          <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-5 border border-teal-200">
                            <div className="text-xs font-semibold text-teal-600 uppercase tracking-wider mb-2">Start Date</div>
                            <div className="text-lg font-bold text-teal-900">{startDate ? formatDateLong(startDate) : 'Not selected'}</div>
                          </div>
                          <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-5 border border-teal-200">
                            <div className="text-xs font-semibold text-teal-600 uppercase tracking-wider mb-2">End Date</div>
                            <div className="text-lg font-bold text-teal-900">{endDate ? formatDateLong(endDate) : 'Not selected'}</div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border border-gray-200">
                        <div className="flex items-center justify-between mb-8">
                          <button onClick={() => navigateMonth('prev')} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white hover:bg-gray-50 border border-gray-200 transition-colors shadow-sm">
                            <ChevronLeft className="w-5 h-5 text-gray-600" />
                          </button>
                          
                          <div className="flex items-center space-x-12">
                            <div className="flex items-center space-x-3 bg-white rounded-xl px-5 py-3 shadow-sm border border-gray-200">
                              <button onClick={() => { const newMonth = new Date(leftCalendarMonth); newMonth.setFullYear(newMonth.getFullYear() - 1); setLeftCalendarMonth(newMonth); setRightCalendarMonth(new Date(newMonth.getFullYear(), newMonth.getMonth() + 1)); }} className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors">
                                <ChevronLeft className="w-4 h-4 text-gray-500" />
                              </button>
                              <span className="text-base font-bold text-gray-900 min-w-[160px] text-center">{monthNames[leftCalendarMonth.getMonth()]} {leftCalendarMonth.getFullYear()}</span>
                              <button onClick={() => { const newMonth = new Date(leftCalendarMonth); newMonth.setFullYear(newMonth.getFullYear() + 1); setLeftCalendarMonth(newMonth); setRightCalendarMonth(new Date(newMonth.getFullYear(), newMonth.getMonth() + 1)); }} className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors">
                                <ChevronRight className="w-4 h-4 text-gray-500" />
                              </button>
                            </div>
                            
                            <div className="flex items-center space-x-3 bg-white rounded-xl px-5 py-3 shadow-sm border border-gray-200">
                              <button onClick={() => { const newMonth = new Date(rightCalendarMonth); newMonth.setFullYear(newMonth.getFullYear() - 1); setRightCalendarMonth(newMonth); }} className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors">
                                <ChevronLeft className="w-4 h-4 text-gray-500" />
                              </button>
                              <span className="text-base font-bold text-gray-900 min-w-[160px] text-center">{monthNames[rightCalendarMonth.getMonth()]} {rightCalendarMonth.getFullYear()}</span>
                              <button onClick={() => { const newMonth = new Date(rightCalendarMonth); newMonth.setFullYear(newMonth.getFullYear() + 1); setRightCalendarMonth(newMonth); }} className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors">
                                <ChevronRight className="w-4 h-4 text-gray-500" />
                              </button>
                            </div>
                          </div>
                          
                          <button onClick={() => navigateMonth('next')} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white hover:bg-gray-50 border border-gray-200 transition-colors shadow-sm">
                            <ChevronRight className="w-5 h-5 text-gray-600" />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-10">
                          {[leftCalendarMonth, rightCalendarMonth].map((calMonth, calIdx) => {
                            const days = calIdx === 0 ? leftDays : rightDays;
                            return (
                              <div key={calIdx} className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                                <div className="grid grid-cols-7 gap-2 mb-3">
                                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                                    <div key={day} className="text-center text-xs font-bold text-gray-500 py-2">{day}</div>
                                  ))}
                                </div>
                                <div className="grid grid-cols-7 gap-2">
                                  {days.map((day, idx) => {
                                    const isStart = day ? isStartDate(day, calMonth) : false;
                                    const isEnd = day ? isEndDate(day, calMonth) : false;
                                    const inRange = day ? isDateInRange(day, calMonth) : false;
                                    const isToday = day ? (new Date().getDate() === day && new Date().getMonth() === calMonth.getMonth() && new Date().getFullYear() === calMonth.getFullYear()) : false;
                                    
                                    return (
                                      <button 
                                        key={idx} 
                                        disabled={day === null} 
                                        onClick={() => day && handleDateClick(day, calMonth)} 
                                        className={`h-11 text-sm rounded-xl transition-all font-semibold relative ${day === null ? 'invisible' : isStart || isEnd ? 'bg-gradient-to-br from-teal-500 to-teal-600 text-white shadow-md scale-105' : inRange ? 'bg-teal-50 text-teal-900 border border-teal-200' : isToday ? 'bg-gray-900 text-white font-bold ring-2 ring-gray-400' : 'hover:bg-gray-100 text-gray-700 border border-transparent hover:border-gray-300'}`}
                                      >
                                        {day}
                                        {(isStart || isEnd) && (
                                          <div className="absolute -top-1 -right-1">
                                            <div className="w-3 h-3 bg-yellow-400 rounded-full border-2 border-white"></div>
                                          </div>
                                        )}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {filterType === 'months' && showMonthPicker && (
                    <div>
                      {selectedMonths.length > 0 && (
                        <div className="mb-8 bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-6 border border-teal-200">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-2">
                              <div className="w-5 h-5 bg-teal-600 rounded flex items-center justify-center">
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <span className="text-sm font-semibold text-teal-900">{selectedMonths.length} Month{selectedMonths.length > 1 ? 's' : ''} Selected</span>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {selectedMonths.map((item, idx) => (
                              <div key={idx} className="flex items-center bg-white text-teal-700 px-4 py-2 rounded-lg text-sm font-semibold shadow-sm border border-teal-200">
                                <span>{item.month} {item.year}</span>
                                <button onClick={() => removeSelectedMonth(item.month, item.year)} className="ml-3 hover:bg-teal-100 rounded-full p-1 transition-colors">
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between mb-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                        <button onClick={() => navigateYear('prev')} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white hover:bg-gray-50 shadow-sm border border-gray-200 transition-colors">
                          <ChevronLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 rounded-full bg-teal-600"></div>
                          <span className="text-2xl font-bold text-gray-900">{selectedYear}</span>
                          <div className="w-2 h-2 rounded-full bg-teal-600"></div>
                        </div>
                        <button onClick={() => navigateYear('next')} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white hover:bg-gray-50 shadow-sm border border-gray-200 transition-colors">
                          <ChevronRight className="w-5 h-5 text-gray-600" />
                        </button>
                      </div>

                      <div className="space-y-5">
                        {quarters.map((quarter) => (
                          <div key={quarter.name} className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 border border-gray-200">
                            <div className="flex items-center mb-4">
                              <div className="bg-gradient-to-br from-teal-500 to-teal-600 text-white rounded-lg px-4 py-2 mr-4 shadow-sm">
                                <span className="text-sm font-bold">{quarter.name}</span>
                              </div>
                              <div className="h-px flex-1 bg-gradient-to-r from-gray-300 to-transparent"></div>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                              {quarter.months.map((month) => (
                                <button key={month} onClick={() => toggleMonthSelection(month)} className={`px-5 py-4 rounded-xl text-sm font-semibold transition-all shadow-sm ${isMonthSelected(month) ? 'bg-gradient-to-br from-teal-500 to-teal-600 text-white scale-105 shadow-md' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-teal-300'}`}>
                                  {month}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {filterType === 'weeks' && showWeekPicker && (
                    <div>
                      {selectedWeeks.length > 0 && (
                        <div className="mb-8 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-2">
                              <div className="w-5 h-5 bg-orange-600 rounded flex items-center justify-center">
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <span className="text-sm font-semibold text-orange-900">{selectedWeeks.length} Week{selectedWeeks.length > 1 ? 's' : ''} Selected</span>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {selectedWeeks.map((item, idx) => (
                              <div key={idx} className="flex items-center bg-white text-orange-700 px-4 py-2 rounded-lg text-sm font-semibold shadow-sm border border-orange-200">
                                <span>Week {item.week}, {item.year}</span>
                                <button onClick={() => removeSelectedWeek(item.week, item.year)} className="ml-3 hover:bg-orange-100 rounded-full p-1 transition-colors">
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between mb-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                        <button onClick={() => navigateYear('prev')} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white hover:bg-gray-50 shadow-sm border border-gray-200 transition-colors">
                          <ChevronLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 rounded-full bg-orange-600"></div>
                          <span className="text-2xl font-bold text-gray-900">{selectedYear}</span>
                          <div className="w-2 h-2 rounded-full bg-orange-600"></div>
                        </div>
                        <button onClick={() => navigateYear('next')} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white hover:bg-gray-50 shadow-sm border border-gray-200 transition-colors">
                          <ChevronRight className="w-5 h-5 text-gray-600" />
                        </button>
                      </div>

                      <div className="space-y-5">
                        {[
                          { name: 'Q1', weeks: Array.from({ length: 13 }, (_, i) => i + 1) },
                          { name: 'Q2', weeks: Array.from({ length: 13 }, (_, i) => i + 14) },
                          { name: 'Q3', weeks: Array.from({ length: 13 }, (_, i) => i + 27) },
                          { name: 'Q4', weeks: Array.from({ length: 13 }, (_, i) => i + 40) }
                        ].map((quarter) => (
                          <div key={quarter.name} className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 border border-gray-200">
                            <div className="flex items-center mb-4">
                              <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg px-4 py-2 mr-4 shadow-sm">
                                <span className="text-sm font-bold">{quarter.name}</span>
                              </div>
                              <div className="h-px flex-1 bg-gradient-to-r from-gray-300 to-transparent"></div>
                            </div>
                            <div className="grid grid-cols-13 gap-2">
                              {quarter.weeks.map((week) => (
                                <button key={week} onClick={() => toggleWeekSelection(week)} className={`px-2 py-3 rounded-lg text-xs font-bold transition-all ${isWeekSelected(week) ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-md scale-105' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-orange-300'}`}>
                                  {week}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {filterType === 'years' && showYearPicker && (
                    <div>
                      <div className="mb-8 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl p-6">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-md">
                            <Calendar className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h4 className="text-base font-bold text-blue-900 mb-2">Employee Tenure Period</h4>
                            <p className="text-sm text-blue-700 leading-relaxed">Showing available years since employment start date: <span className="font-bold ml-1">{employeeHireDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span></p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                        <button onClick={() => setSelectedYear(Math.max(hireYear, selectedYear - 1))} disabled={selectedYear <= hireYear} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white hover:bg-gray-50 shadow-sm border border-gray-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                          <ChevronLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
                          <span className="text-2xl font-bold text-gray-900">{selectedYear}</span>
                          <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
                        </div>
                        <button onClick={() => setSelectedYear(Math.min(currentYear, selectedYear + 1))} disabled={selectedYear >= currentYear} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white hover:bg-gray-50 shadow-sm border border-gray-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                          <ChevronRight className="w-5 h-5 text-gray-600" />
                        </button>
                      </div>

                      <div className="space-y-5">
                        {Array.from({ length: Math.ceil(yearsEmployed.length / 4) }, (_, groupIdx) => {
                          const startYear = hireYear + (groupIdx * 4);
                          const yearsInGroup = yearsEmployed.filter(y => y >= startYear && y < startYear + 4);
                          return (
                            <div key={groupIdx} className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 border border-gray-200">
                              <div className="flex items-center mb-4">
                                <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-lg px-4 py-2 mr-4 shadow-sm">
                                  <span className="text-sm font-bold">{startYear} - {Math.min(startYear + 3, currentYear)}</span>
                                </div>
                                <div className="h-px flex-1 bg-gradient-to-r from-gray-300 to-transparent"></div>
                              </div>
                              <div className="grid grid-cols-4 gap-4">
                                {yearsInGroup.map((year) => (
                                  <button key={year} onClick={() => setSelectedYear(year)} className={`px-8 py-5 rounded-xl text-base font-bold transition-all shadow-sm ${selectedYear === year ? 'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white scale-105 shadow-lg' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-indigo-300'}`}>
                                    {year}
                                  </button>
                                ))}
                                {Array.from({ length: 4 - yearsInGroup.length }).map((_, idx) => (
                                  <div key={`empty-${idx}`} className="invisible"></div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center gap-4 px-8 py-5 border-t border-gray-200 bg-gray-50">
                <div className="text-sm text-gray-500">
                  {filterType === 'custom' && startDate && endDate && (
                    <span className="font-medium">{Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1} days selected</span>
                  )}
                  {filterType === 'months' && selectedMonths.length > 0 && (
                    <span className="font-medium">{selectedMonths.length} month{selectedMonths.length > 1 ? 's' : ''} selected</span>
                  )}
                  {filterType === 'weeks' && selectedWeeks.length > 0 && (
                    <span className="font-medium">{selectedWeeks.length} week{selectedWeeks.length > 1 ? 's' : ''} selected</span>
                  )}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setShowDateModal(false)} className="px-6 py-2.5 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 hover:bg-gray-50 rounded-xl transition-colors">
                    Cancel
                  </button>
                  <button onClick={applyFilter} className="px-8 py-2.5 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-xl text-sm font-semibold hover:from-teal-700 hover:to-teal-800 transition-all shadow-md hover:shadow-lg">
                    Apply Filter
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceManagement;