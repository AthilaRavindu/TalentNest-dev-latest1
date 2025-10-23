"use client";

import { useState, useRef, useEffect } from "react";
import { Filter, Calendar, MoreVertical, Eye, Download, Clock, Ban, MessageCircle, X, Edit, User, Users, AlertCircle, CheckCircle, ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from "lucide-react";
import { FaClock, FaMapMarkerAlt, FaUserTie, FaBuilding } from "react-icons/fa";
import Select, { Option } from './components/select';

// Calendar constants
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WEEK_DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

// Custom Date Picker Component (same as report page)
const CustomDatePicker: React.FC<{
  value: string;
  onChange: (date: string) => void;
  disabled?: boolean;
  placeholder?: string;
  label?: string;
}> = ({
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

export default function ShiftInformation() {
  const [activeTab, setActiveTab] = useState("shift-info");
  const [filterDate, setFilterDate] = useState("");
  const [historyFilterDate, setHistoryFilterDate] = useState("");
  
  // Pagination states for both tables
  const [upcomingShiftsPage, setUpcomingShiftsPage] = useState(1);
  const [shiftHistoryPage, setShiftHistoryPage] = useState(1);
  const itemsPerPage = 3;

  // Action menu states
  const [activeActionMenu, setActiveActionMenu] = useState<number | null>(null);

  // Modal states
  const [selectedShift, setSelectedShift] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  
  // Employee notes state
  const [employeeNotes, setEmployeeNotes] = useState<{[key: number]: string}>({});
  const [editingNote, setEditingNote] = useState<number | null>(null);

  // Form states for different modals
  const [swapShiftData, setSwapShiftData] = useState({ colleague: "", reason: "" });
  const [requestChangeData, setRequestChangeData] = useState({ reason: "", preferredDate: "", notes: "" });
  const [timeOffData, setTimeOffData] = useState({ reason: "", startDate: "", endDate: "", notes: "" });
  const [reportIssueData, setReportIssueData] = useState({ issueType: "", description: "", urgency: "medium" });

  const upcomingShifts = [
    { 
      id: 1, 
      from: "2025-09-24", 
      to: "2025-09-26", 
      days: 2, 
      shift: "Morning Shift", 
      time: "8:00 AM - 4:00 PM", 
      location: "Main Office", 
      department: "Engineering",
      status: "Scheduled",
      assignedBy: "Sarah Johnson (HR)",
      notes: "Project work",
      contactPerson: "Mike Chen (Team Lead)",
      contactPhone: "+1 (555) 123-4567"
    },
    { 
      id: 2, 
      from: "2025-09-27", 
      to: "2025-09-27", 
      days: 1, 
      shift: "Evening Shift", 
      time: "4:00 PM - 12:00 AM", 
      location: "Main Office", 
      department: "Engineering",
      status: "Scheduled",
      assignedBy: "Sarah Johnson (HR)",
      notes: "Client support",
      contactPerson: "Sarah Johnson (HR)",
      contactPhone: "+1 (555) 123-4568"
    },
    { 
      id: 3, 
      from: "2025-09-28", 
      to: "2025-09-30", 
      days: 3, 
      shift: "Morning Shift", 
      time: "8:00 AM - 4:00 PM", 
      location: "Remote Work", 
      department: "Engineering",
      status: "Approved",
      assignedBy: "Mike Chen (Team Lead)",
      notes: "Remote work days",
      contactPerson: "Mike Chen (Team Lead)",
      contactPhone: "+1 (555) 123-4567"
    },
  ];

  const shiftHistory = [
    { 
      id: 1, 
      date: "September 20, 2025", 
      shift: "Morning Shift", 
      time: "8:00 AM - 4:00 PM", 
      location: "Main Office", 
      hours: 8,
      status: "Completed",
      overtime: "2 hours",
      notes: "Project deployment",
      actualHours: "10 hours",
      breakTime: "1 hour",
      tasks: "Code deployment"
    },
    { 
      id: 2, 
      date: "September 19, 2025", 
      shift: "Evening Shift", 
      time: "4:00 PM - 12:00 AM", 
      location: "Remote", 
      hours: 8,
      status: "Completed",
      overtime: "0 hours",
      notes: "Regular work",
      actualHours: "8 hours",
      breakTime: "45 minutes",
      tasks: "Code review"
    },
  ];

  // Filter shifts based on selected date
  const filteredShifts = filterDate 
    ? upcomingShifts.filter(shift => 
        shift.from === filterDate || 
        (new Date(shift.from) <= new Date(filterDate) && new Date(shift.to) >= new Date(filterDate))
      )
    : upcomingShifts;

  // Filter history based on selected date
  const filteredHistory = historyFilterDate 
    ? shiftHistory.filter(shift => {
        const shiftDate = new Date(shift.date);
        const filterDateObj = new Date(historyFilterDate);
        return shiftDate.toDateString() === filterDateObj.toDateString();
      })
    : shiftHistory;

  // Pagination logic for upcoming shifts
  const upcomingShiftsStartIndex = (upcomingShiftsPage - 1) * itemsPerPage;
  const upcomingShiftsEndIndex = upcomingShiftsStartIndex + itemsPerPage;
  const paginatedUpcomingShifts = filteredShifts.slice(upcomingShiftsStartIndex, upcomingShiftsEndIndex);
  const totalUpcomingPages = Math.ceil(filteredShifts.length / itemsPerPage);

  // Pagination logic for shift history
  const shiftHistoryStartIndex = (shiftHistoryPage - 1) * itemsPerPage;
  const shiftHistoryEndIndex = shiftHistoryStartIndex + itemsPerPage;
  const paginatedShiftHistory = filteredHistory.slice(shiftHistoryStartIndex, shiftHistoryEndIndex);
  const totalHistoryPages = Math.ceil(filteredHistory.length / itemsPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Scheduled":
        return "bg-emerald-100 text-emerald-700";
      case "Approved":
        return "bg-emerald-100 text-emerald-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Completed":
        return "bg-orange-100 text-orange-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatDateForDisplay = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // Action menu functions
  const toggleActionMenu = (id: number) => {
    setActiveActionMenu(activeActionMenu === id ? null : id);
  };

  // Close action menu when clicking outside
  const handleClickOutside = () => {
    setActiveActionMenu(null);
  };

  // Employee notes functions
  const handleAddNote = (shiftId: number) => {
    setEditingNote(shiftId);
    setActiveActionMenu(null);
  };

  const handleSaveNote = (shiftId: number) => {
    setEditingNote(null);
    setActiveModal("note-success");
  };

  const handleCancelNote = () => {
    setEditingNote(null);
  };

  // Modal management functions
  const openModal = (modalType: string, shift?: any) => {
    setActiveModal(modalType);
    if (shift) setSelectedShift(shift);
    setActiveActionMenu(null);
  };

  const closeModal = () => {
    setActiveModal(null);
    setIsModalOpen(false);
    setSelectedShift(null);
    // Reset form data
    setSwapShiftData({ colleague: "", reason: "" });
    setRequestChangeData({ reason: "", preferredDate: "", notes: "" });
    setTimeOffData({ reason: "", startDate: "", endDate: "", notes: "" });
    setReportIssueData({ issueType: "", description: "", urgency: "medium" });
  };

  const handleViewDetails = (shift: any) => {
    setSelectedShift(shift);
    setIsModalOpen(true);
    setActiveActionMenu(null);
  };

  // Form submission handlers
  const handleSwapSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Swap shift request:", { shift: selectedShift, ...swapShiftData });
    setActiveModal("swap-success");
  };

  const handleRequestChangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Change request:", { shift: selectedShift, ...requestChangeData });
    setActiveModal("change-success");
  };

  const handleTimeOffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Time off request:", { shift: selectedShift, ...timeOffData });
    setActiveModal("timeoff-success");
  };

  const handleReportIssueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Issue report:", { shift: selectedShift, ...reportIssueData });
    setActiveModal("issue-success");
  };

  const handleDownloadShift = (shift: any) => {
    console.log("Download shift:", shift);
    setActiveActionMenu(null);
    setActiveModal("download-success");
  };

  // Upcoming shifts filter functions
  const handleUpcomingFilter = () => {
    console.log("Filtering upcoming shifts for date:", filterDate);
    setUpcomingShiftsPage(1);
  };

  const clearUpcomingFilter = () => {
    setFilterDate("");
    setUpcomingShiftsPage(1);
  };

  // Shift history filter functions
  const handleHistoryFilter = () => {
    console.log("Filtering history for date:", historyFilterDate);
    setShiftHistoryPage(1);
  };

  const clearHistoryFilter = () => {
    setHistoryFilterDate("");
    setShiftHistoryPage(1);
  };

  // Pagination handlers
  const handleUpcomingPrevious = () => {
    if (upcomingShiftsPage > 1) {
      setUpcomingShiftsPage(upcomingShiftsPage - 1);
    }
  };

  const handleUpcomingNext = () => {
    if (upcomingShiftsPage < totalUpcomingPages) {
      setUpcomingShiftsPage(upcomingShiftsPage + 1);
    }
  };

  const handleUpcomingPageClick = (page: number) => {
    setUpcomingShiftsPage(page);
  };

  const handleHistoryPrevious = () => {
    if (shiftHistoryPage > 1) {
      setShiftHistoryPage(shiftHistoryPage - 1);
    }
  };

  const handleHistoryNext = () => {
    if (shiftHistoryPage < totalHistoryPages) {
      setShiftHistoryPage(shiftHistoryPage + 1);
    }
  };

  const handleHistoryPageClick = (page: number) => {
    setShiftHistoryPage(page);
  };

  // Generate page numbers for pagination
  const generatePageNumbers = (currentPage: number, totalPages: number) => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  // Sample colleagues for swap shift
  const colleagues = ["John Smith", "Sarah Wilson", "Mike Johnson", "Emily Brown", "David Lee"];

  return (
    <div className="min-h-screen">
      <div className="mb-8 p-4">
        <h1 className="text-2xl font-bold text-gray-800">Shift Management</h1>
        <p className="text-sm text-gray-500 mt-1">Track and Manage your Shift Information</p>
      </div>
      <div className="bg-white rounded-3xl mb-8 shadow-sm max-w-7xl mx-auto">
        <div className="min-h-screen py-2 px-1 flex justify-center" onClick={handleClickOutside}>
          <div className="bg-white rounded-2xl w-full max-w-[1200px] p-6">
            
            {/* Current Shift */}
            <div className="bg-teal-50 rounded-2xl border border-gray-200 shadow-sm p-5 mb-10">
              <h3 className="text-lg font-semibold text-teal-900 mb-3">
                Current Shift
              </h3>
             
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                      <FaClock className="text-teal-600 text-md" />
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xl font-semibold text-gray-900">Morning Shift</span> 
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 ml-11">
                    8:00 AM - 4:00 PM | September 20, 2025 to September 20, 2025
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-teal-500 text-sm" />
                  <span className="text-md font-semibold text-gray-500">Main office</span>
                </div>
              </div>
            </div>

            {/* Upcoming Shift Section */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-10">
              <div className="px-6 py-4 border-b border-gray-100">
                <div className="bg-teal-50 rounded-full border border-gray-200 shadow-sm px-6 py-2 inline-block mb-4">
                  <h3 className="text-lg font-bold text-gray-800">Upcoming Shift</h3>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-4">
                    <CustomDatePicker 
                      value={filterDate} 
                      onChange={setFilterDate}
                      placeholder="Select date"
                    />
                    <button
                      onClick={handleUpcomingFilter}
                      className="flex items-center gap-2 px-6 py-2 bg-teal-600 text-white rounded-full text-sm font-semibold hover:bg-teal-700 transition-colors shadow-md"
                    >
                      <Filter size={16} />
                      Filter
                    </button>
                    {filterDate && (
                      <button
                        onClick={clearUpcomingFilter}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-full text-sm font-semibold hover:bg-gray-600 transition-colors"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-600 text-xs uppercase border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 font-medium">FROM</th>
                      <th className="px-6 py-3 font-medium">TO</th>
                      <th className="px-6 py-3 font-medium">DAYS</th>
                      <th className="px-6 py-3 font-medium">SHIFT</th>
                      <th className="px-6 py-3 font-medium">TIME</th>
                      <th className="px-6 py-3 font-medium">LOCATION</th>
                      <th className="px-6 py-3 font-medium">DEPARTMENT</th>
                      <th className="px-6 py-3 font-medium">STATUS</th>
                      <th className="px-6 py-3 font-medium">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginatedUpcomingShifts.length > 0 ? (
                      paginatedUpcomingShifts.map((shift) => (
                        <tr
                          key={shift.id}
                          className="hover:bg-gray-50 text-sm text-gray-700"
                        >
                          <td className="px-6 py-4 font-medium">
                            {formatDateForDisplay(shift.from)}
                          </td>
                          <td className="px-6 py-4">
                            {formatDateForDisplay(shift.to)}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-sm font-medium">
                              {shift.days}
                            </span>
                          </td>
                          <td className="px-6 py-4">{shift.shift}</td>
                          <td className="px-6 py-4">{shift.time}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <FaMapMarkerAlt className="text-gray-400 text-xs" />
                              <span className="max-w-[120px] truncate">{shift.location}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{shift.department}</td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                shift.status
                              )}`}
                            >
                              {shift.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleActionMenu(shift.id);
                              }}
                              className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100"
                            >
                              <MoreVertical size={16} />
                            </button>
                            
                            {activeActionMenu === shift.id && (
                              <div className="absolute right-6 top-12 z-10 bg-white border border-gray-200 rounded-lg shadow-lg py-2 w-48">
                                <button
                                  onClick={() => handleViewDetails(shift)}
                                  className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                  <Eye size={16} />
                                  View Details
                                </button>
                                <button
                                  onClick={() => openModal("swap", shift)}
                                  className="flex items-center gap-3 w-full px-4 py-2 text-sm text-blue-600 hover:bg-blue-50"
                                >
                                  <Users size={16} />
                                  Swap Shift
                                </button>
                                <button
                                  onClick={() => openModal("change", shift)}
                                  className="flex items-center gap-3 w-full px-4 py-2 text-sm text-orange-600 hover:bg-orange-50"
                                >
                                  <Clock size={16} />
                                  Request Change
                                </button>
                                <button
                                  onClick={() => openModal("timeoff", shift)}
                                  className="flex items-center gap-3 w-full px-4 py-2 text-sm text-purple-600 hover:bg-purple-50"
                                >
                                  <Ban size={16} />
                                  Request Time Off
                                </button>
                                <button
                                  onClick={() => handleAddNote(shift.id)}
                                  className="flex items-center gap-3 w-full px-4 py-2 text-sm text-green-600 hover:bg-green-50"
                                >
                                  <Edit size={16} />
                                  Add Note
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={9} className="px-6 py-4 text-center text-gray-500">
                          No shifts found for the selected date.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Upcoming Shifts Pagination */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 text-sm text-gray-600">
                <button 
                  onClick={handleUpcomingPrevious}
                  disabled={upcomingShiftsPage === 1}
                  className={`font-medium ${
                    upcomingShiftsPage === 1 
                      ? "text-gray-400 cursor-not-allowed" 
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  ← Previous
                </button>
                <div className="flex gap-1">
                  {generatePageNumbers(upcomingShiftsPage, totalUpcomingPages).map((page, index) => (
                    <button
                      key={index}
                      onClick={() => typeof page === 'number' ? handleUpcomingPageClick(page) : null}
                      className={`w-8 h-8 rounded-md text-sm font-medium ${
                        page === upcomingShiftsPage
                          ? "bg-teal-600 text-white"
                          : typeof page === 'number'
                          ? "text-gray-700 hover:bg-gray-100"
                          : "text-gray-400 cursor-default"
                      }`}
                      disabled={page === '...'}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button 
                  onClick={handleUpcomingNext}
                  disabled={upcomingShiftsPage === totalUpcomingPages}
                  className={`font-medium ${
                    upcomingShiftsPage === totalUpcomingPages 
                      ? "text-gray-400 cursor-not-allowed" 
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Next →
                </button>
              </div>
            </div>

            {/* Shift History Section */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
              <div className="px-6 py-4 border-b border-gray-100">
                <div className="bg-teal-50 rounded-full border border-gray-200 shadow-sm px-6 py-2 inline-block mb-4">
                  <h3 className="text-lg font-bold text-gray-800">Shift History</h3>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-4">
                    <CustomDatePicker 
                      value={historyFilterDate} 
                      onChange={setHistoryFilterDate}
                      placeholder="Select date"
                    />
                    <button
                      onClick={handleHistoryFilter}
                      className="flex items-center gap-2 px-6 py-2 bg-teal-600 text-white rounded-full text-sm font-semibold hover:bg-teal-700 transition-colors shadow-md"
                    >
                      <Filter size={16} />
                      Filter
                    </button>
                    {historyFilterDate && (
                      <button
                        onClick={clearHistoryFilter}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-full text-sm font-semibold hover:bg-gray-600 transition-colors"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-600 text-xs uppercase border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 font-medium">DATE</th>
                      <th className="px-6 py-3 font-medium">SHIFT</th>
                      <th className="px-6 py-3 font-medium">TIME</th>
                      <th className="px-6 py-3 font-medium">LOCATION</th>
                      <th className="px-6 py-3 font-medium">HOURS</th>
                      <th className="px-6 py-3 font-medium">OVERTIME</th>
                      <th className="px-6 py-3 font-medium">STATUS</th>
                      <th className="px-6 py-3 font-medium">NOTES</th>
                      <th className="px-6 py-3 font-medium">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginatedShiftHistory.map((shift) => (
                      <tr
                        key={shift.id}
                        className="hover:bg-gray-50 text-sm text-gray-700"
                      >
                        <td className="px-6 py-4 font-medium">{shift.date}</td>
                        <td className="px-6 py-4">{shift.shift}</td>
                        <td className="px-6 py-4">{shift.time}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <FaMapMarkerAlt className="text-gray-400 text-xs" />
                            <span className="max-w-[100px] truncate">{shift.location}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-semibold">{shift.hours}h</td>
                        <td className="px-6 py-4 text-orange-600 font-medium">{shift.overtime}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              shift.status
                            )}`}
                          >
                            {shift.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {editingNote === shift.id ? (
                            <div className="flex flex-col gap-2">
                              <textarea
                                value={employeeNotes[shift.id] || ""}
                                onChange={(e) => setEmployeeNotes(prev => ({
                                  ...prev,
                                  [shift.id]: e.target.value
                                }))}
                                placeholder="Add your notes here..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                                rows={2}
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleSaveNote(shift.id)}
                                  className="px-3 py-1 bg-teal-600 text-white text-xs rounded hover:bg-teal-700"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={handleCancelNote}
                                  className="px-3 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="text-gray-600 max-w-[150px] truncate" title={employeeNotes[shift.id] || shift.notes}>
                                {employeeNotes[shift.id] || shift.notes}
                              </span>
                              <button
                                onClick={() => handleAddNote(shift.id)}
                                className="text-gray-400 hover:text-teal-600 p-1"
                              >
                                <Edit size={12} />
                              </button>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleActionMenu(shift.id + 1000);
                            }}
                            className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100"
                          >
                            <MoreVertical size={16} />
                          </button>
                          
                          {activeActionMenu === shift.id + 1000 && (
                            <div className="absolute right-6 top-12 z-10 bg-white border border-gray-200 rounded-lg shadow-lg py-2 w-48">
                              <button
                                onClick={() => handleViewDetails(shift)}
                                className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                <Eye size={16} />
                                View Details
                              </button>
                              <button
                                onClick={() => handleDownloadShift(shift)}
                                className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                <Download size={16} />
                                Download
                              </button>
                              <button
                                onClick={() => handleAddNote(shift.id)}
                                className="flex items-center gap-3 w-full px-4 py-2 text-sm text-green-600 hover:bg-green-50"
                              >
                                <Edit size={16} />
                                Add Note
                              </button>
                              <button
                                onClick={() => openModal("report", shift)}
                                className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                              >
                                <AlertCircle size={16} />
                                Report Issue
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Shift History Pagination */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 text-sm text-gray-600">
                <button 
                  onClick={handleHistoryPrevious}
                  disabled={shiftHistoryPage === 1}
                  className={`font-medium ${
                    shiftHistoryPage === 1 
                      ? "text-gray-400 cursor-not-allowed" 
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  ← Previous
                </button>
                <div className="flex gap-1">
                  {generatePageNumbers(shiftHistoryPage, totalHistoryPages).map((page, index) => (
                    <button
                      key={index}
                      onClick={() => typeof page === 'number' ? handleHistoryPageClick(page) : null}
                      className={`w-8 h-8 rounded-md text-sm font-medium ${
                        page === shiftHistoryPage
                          ? "bg-teal-600 text-white"
                          : typeof page === 'number'
                          ? "text-gray-700 hover:bg-gray-100"
                          : "text-gray-400 cursor-default"
                      }`}
                      disabled={page === '...'}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button 
                  onClick={handleHistoryNext}
                  disabled={shiftHistoryPage === totalHistoryPages}
                  className={`font-medium ${
                    shiftHistoryPage === totalHistoryPages 
                      ? "text-gray-400 cursor-not-allowed" 
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Next →
                </button>
              </div>
            </div>
          </div>

          {/* Shift Details Modal */}
          {isModalOpen && selectedShift && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Shift Details</h2>
                    <p className="text-gray-600 mt-1">Complete information about your shift</p>
                  </div>
                  <button
                    onClick={closeModal}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X size={24} className="text-gray-500" />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="p-6">
                  {/* Shift Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Shift Type</label>
                        <p className="text-lg font-semibold text-gray-900">{selectedShift.shift}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Date & Duration</label>
                        <p className="text-gray-900">
                          {selectedShift.from ? 
                            `${formatDateForDisplay(selectedShift.from)} to ${formatDateForDisplay(selectedShift.to)}` : 
                            selectedShift.date
                          }
                          {selectedShift.days && <span className="text-gray-600"> ({selectedShift.days} days)</span>}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Time</label>
                        <p className="text-gray-900">{selectedShift.time}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Status</label>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedShift.status)}`}>
                          {selectedShift.status}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Location</label>
                        <div className="flex items-center gap-2 mt-1">
                          <FaMapMarkerAlt className="text-gray-400" />
                          <p className="text-gray-900">{selectedShift.location}</p>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Department</label>
                        <div className="flex items-center gap-2 mt-1">
                          <FaBuilding className="text-gray-400" />
                          <p className="text-gray-900">{selectedShift.department}</p>
                        </div>
                      </div>
                      {selectedShift.assignedBy && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Assigned By</label>
                          <div className="flex items-center gap-2 mt-1">
                            <FaUserTie className="text-gray-400" />
                            <p className="text-gray-900">{selectedShift.assignedBy}</p>
                          </div>
                        </div>
                      )}
                      {selectedShift.contactPerson && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Contact Person</label>
                          <p className="text-gray-900">{selectedShift.contactPerson}</p>
                          {selectedShift.contactPhone && (
                            <p className="text-gray-600 text-sm">{selectedShift.contactPhone}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="space-y-4">
                    {selectedShift.notes && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Notes</label>
                        <p className="text-gray-900 bg-gray-50 p-3 rounded-lg mt-1">{selectedShift.notes}</p>
                      </div>
                    )}

                    {/* Employee Notes */}
                    <div>
                      <label className="text-sm font-medium text-gray-500">Your Notes</label>
                      {employeeNotes[selectedShift.id] ? (
                        <p className="text-gray-900 bg-teal-50 p-3 rounded-lg mt-1 border border-teal-200">
                          {employeeNotes[selectedShift.id]}
                        </p>
                      ) : (
                        <p className="text-gray-500 italic bg-gray-50 p-3 rounded-lg mt-1">
                          No personal notes added yet
                        </p>
                      )}
                    </div>

                    {/* For Completed Shifts */}
                    {selectedShift.actualHours && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-orange-50 rounded-lg">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Actual Hours</label>
                          <p className="text-lg font-semibold text-gray-900">{selectedShift.actualHours}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Break Time</label>
                          <p className="text-lg font-semibold text-gray-900">{selectedShift.breakTime}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Overtime</label>
                          <p className="text-lg font-semibold text-orange-600">{selectedShift.overtime}</p>
                        </div>
                      </div>
                    )}

                    {selectedShift.tasks && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Tasks Completed</label>
                        <p className="text-gray-900 bg-gray-50 p-3 rounded-lg mt-1">{selectedShift.tasks}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
                  <button
                    onClick={closeModal}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => handleDownloadShift(selectedShift)}
                    className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2"
                  >
                    <Download size={16} />
                    Download Details
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* All Other Modals with Consistent Styling */}
          {activeModal && activeModal !== "swap" && activeModal !== "change" && activeModal !== "timeoff" && activeModal !== "report" && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl max-w-md w-full">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {activeModal === "swap-success" && "Swap Request Submitted"}
                      {activeModal === "change-success" && "Change Request Submitted"}
                      {activeModal === "timeoff-success" && "Time Off Request Submitted"}
                      {activeModal === "issue-success" && "Issue Reported"}
                      {activeModal === "download-success" && "Download Started"}
                      {activeModal === "note-success" && "Note Saved"}
                    </h2>
                    <p className="text-gray-600 mt-1">
                      {activeModal === "swap-success" && "Your shift swap request has been submitted"}
                      {activeModal === "change-success" && "Your shift change request has been submitted"}
                      {activeModal === "timeoff-success" && "Your time off request has been submitted"}
                      {activeModal === "issue-success" && "Your issue has been reported successfully"}
                      {activeModal === "download-success" && "Shift details are being downloaded"}
                      {activeModal === "note-success" && "Your note has been saved successfully"}
                    </p>
                  </div>
                  <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-full">
                    <X size={20} />
                  </button>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-center mb-4">
                    <CheckCircle className="w-16 h-16 text-green-500" />
                  </div>
                  <p className="text-gray-600 text-center mb-6">
                    {activeModal === "swap-success" && "Your colleague will be notified of your swap request."}
                    {activeModal === "change-success" && "Your manager will review your request shortly."}
                    {activeModal === "timeoff-success" && "You will be notified once your request is reviewed."}
                    {activeModal === "issue-success" && "HR will contact you within 24 hours regarding this issue."}
                    {activeModal === "download-success" && "Check your downloads folder for the shift details file."}
                    {activeModal === "note-success" && "Your personal note has been added to this shift."}
                  </p>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={closeModal}
                      className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Swap Shift Modal */}
          {activeModal === "swap" && selectedShift && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl max-w-md w-full">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Swap Shift</h2>
                    <p className="text-gray-600 mt-1">Request to swap with a colleague</p>
                  </div>
                  <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-full">
                    <X size={20} />
                  </button>
                </div>
                
                <form onSubmit={handleSwapSubmit} className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Colleague
                    </label>
                    <Select
                      value={swapShiftData.colleague}
                      onChange={(e) => setSwapShiftData({...swapShiftData, colleague: e.target.value})}
                      placeholder="Choose a colleague"
                    >
                      <Option value="">Choose a colleague</Option>
                      {colleagues.map(colleague => (
                        <Option key={colleague} value={colleague}>{colleague}</Option>
                      ))}
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reason for Swap
                    </label>
                    <textarea
                      value={swapShiftData.reason}
                      onChange={(e) => setSwapShiftData({...swapShiftData, reason: e.target.value})}
                      placeholder="Explain why you need to swap this shift..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none text-black"
                      rows={3}
                      required
                    />
                  </div>

                  <div className="bg-teal-50 p-4 rounded-lg">
                    <h4 className="font-medium text-teal-900 mb-2">Shift Details</h4>
                    <p className="text-sm text-teal-600">
                      {selectedShift.shift} on {formatDateForDisplay(selectedShift.from)} ({selectedShift.time})
                    </p>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                    >
                      Submit Request
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Request Change Modal */}
          {activeModal === "change" && selectedShift && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl max-w-md w-full">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Request Shift Change</h2>
                    <p className="text-gray-600 mt-1">Modify your scheduled shift</p>
                  </div>
                  <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-full">
                    <X size={20} />
                  </button>
                </div>
                
                <form onSubmit={handleRequestChangeSubmit} className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reason for Change
                    </label>
                    <Select
                      value={requestChangeData.reason}
                      onChange={(e) => setRequestChangeData({...requestChangeData, reason: e.target.value})}
                      placeholder="Select a reason"
                    >
                      <Option value="">Select a reason</Option>
                      <Option value="personal">Personal reasons</Option>
                      <Option value="medical">Medical appointment</Option>
                      <Option value="family">Family emergency</Option>
                      <Option value="transportation">Transportation issues</Option>
                      <Option value="other">Other</Option>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Date
                    </label>
                    <CustomDatePicker
                      value={requestChangeData.preferredDate}
                      onChange={(value) => setRequestChangeData({...requestChangeData, preferredDate: value})}
                      placeholder="Select preferred date"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Notes
                    </label>
                    <textarea
                      value={requestChangeData.notes}
                      onChange={(e) => setRequestChangeData({...requestChangeData, notes: e.target.value})}
                      placeholder="Provide any additional details..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none text-black"
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                    >
                      Submit Request
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Time Off Request Modal */}
          {activeModal === "timeoff" && selectedShift && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl max-w-md w-full">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Request Time Off</h2>
                    <p className="text-gray-600 mt-1">Submit a time off request</p>
                  </div>
                  <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-full">
                    <X size={20} />
                  </button>
                </div>
                
                <form onSubmit={handleTimeOffSubmit} className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reason for Time Off
                    </label>
                    <Select
                      value={timeOffData.reason}
                      onChange={(e) => setTimeOffData({...timeOffData, reason: e.target.value})}
                      placeholder="Select a reason"
                    >
                      <Option value="">Select a reason</Option>
                      <Option value="vacation">Vacation</Option>
                      <Option value="sick">Sick leave</Option>
                      <Option value="personal">Personal day</Option>
                      <Option value="family">Family emergency</Option>
                      <Option value="other">Other</Option>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Date
                      </label>
                      <CustomDatePicker
                        value={timeOffData.startDate}
                        onChange={(value) => setTimeOffData({...timeOffData, startDate: value})}
                        placeholder="Select start date"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Date
                      </label>
                      <CustomDatePicker
                        value={timeOffData.endDate}
                        onChange={(value) => setTimeOffData({...timeOffData, endDate: value})}
                        placeholder="Select end date"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Notes
                    </label>
                    <textarea
                      value={timeOffData.notes}
                      onChange={(e) => setTimeOffData({...timeOffData, notes: e.target.value})}
                      placeholder="Provide any additional details..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none text-black"
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                    >
                      Submit Request
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Report Issue Modal */}
          {activeModal === "report" && selectedShift && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl max-w-md w-full">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Report Issue</h2>
                    <p className="text-gray-600 mt-1">Report a problem with this shift</p>
                  </div>
                  <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-full">
                    <X size={20} />
                  </button>
                </div>
                
                <form onSubmit={handleReportIssueSubmit} className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Issue Type
                    </label>
                    <Select
                      value={reportIssueData.issueType}
                      onChange={(e) => setReportIssueData({...reportIssueData, issueType: e.target.value})}
                      placeholder="Select issue type"
                    >
                      <Option value="">Select issue type</Option>
                      <Option value="payroll">Payroll discrepancy</Option>
                      <Option value="hours">Hours not recorded</Option>
                      <Option value="overtime">Overtime issue</Option>
                      <Option value="scheduling">Scheduling error</Option>
                      <Option value="other">Other</Option>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Urgency Level
                    </label>
                    <div className="flex gap-4">
                      {["low", "medium", "high"].map(level => (
                        <label key={level} className="flex items-center">
                          <input
                            type="radio"
                            name="urgency"
                            value={level}
                            checked={reportIssueData.urgency === level}
                            onChange={(e) => setReportIssueData({...reportIssueData, urgency: e.target.value})}
                            className="mr-2"
                          />
                          <span className="capitalize">{level}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={reportIssueData.description}
                      onChange={(e) => setReportIssueData({...reportIssueData, description: e.target.value})}
                      placeholder="Describe the issue in detail..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none text-black"
                      rows={4}
                      required
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Report Issue
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}