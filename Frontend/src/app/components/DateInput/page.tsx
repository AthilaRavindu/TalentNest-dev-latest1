"use client";

import { useState, useRef, useEffect } from "react";
import { Calendar, ChevronLeft, ChevronRight, X, ChevronDown } from "lucide-react";

interface DateInputProps {
  label?: string;
  helperText?: string;
  value: string;
  onChange: (e: { target: { value: string } }) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  required?: boolean;
  minDate?: string;
  maxDate?: string;
  dateFormat?: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'outline';
}

export default function DateInput({ 
  label, 
  helperText, 
  value, 
  onChange, 
  placeholder = "DD/MM/YYYY",
  disabled = false,
  error,
  required = false,
  minDate,
  maxDate,
  dateFormat = 'DD/MM/YYYY',
  size = 'md',
  variant = 'default'
}: DateInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(() => {
    if (value) {
      return new Date(value);
    }
    return new Date();
  });
  const [showYearSelect, setShowYearSelect] = useState(false);
  const [showMonthSelect, setShowMonthSelect] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowYearSelect(false);
        setShowMonthSelect(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case 'Escape':
          setIsOpen(false);
          setShowYearSelect(false);
          setShowMonthSelect(false);
          inputRef.current?.focus();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    switch (dateFormat) {
      case 'MM/DD/YYYY':
        return `${month}/${day}/${year}`;
      case 'YYYY-MM-DD':
        return `${year}-${month}-${day}`;
      default:
        return `${day}/${month}/${year}`;
    }
  };

  const handleDateClick = (date: Date) => {
    if (disabled) return;
    
    const dateString = date.toISOString().split('T')[0];
    
    // Check date constraints
    if (minDate && dateString < minDate) return;
    if (maxDate && dateString > maxDate) return;
    
    onChange({ target: { value: dateString } });
    setIsOpen(false);
    setShowYearSelect(false);
    setShowMonthSelect(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange({ target: { value: "" } });
  };

  // Simplified calendar generation - only current month
  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay(); // 0 = Sunday
    
    const days = [];
    
    // Add empty cells for days before the first day of month
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    if (!value) return false;
    const selectedDate = new Date(value);
    return date.toDateString() === selectedDate.toDateString();
  };

  const isDisabledDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    if (minDate && dateString < minDate) return true;
    if (maxDate && dateString > maxDate) return true;
    return false;
  };

  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"
  ];

  const shortMonthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    const todayString = today.toISOString().split('T')[0];
    
    if (!isDisabledDate(today)) {
      onChange({ target: { value: todayString } });
      setIsOpen(false);
      setShowYearSelect(false);
      setShowMonthSelect(false);
    }
  };

  // Year and Month selection
  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - 80 + i);
  
  const handleYearChange = (year: number) => {
    setCurrentMonth(new Date(year, currentMonth.getMonth(), 1));
    setShowYearSelect(false);
  };

  const handleMonthChange = (month: number) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), month, 1));
    setShowMonthSelect(false);
  };

  // Dynamic sizing
  const sizeClasses = {
    sm: "h-[42px] text-sm px-3",
    md: "h-[52px] text-base px-4", 
    lg: "h-[62px] text-lg px-5"
  };

  // Dynamic variants
  const variantClasses = {
    default: "border-gray-300 bg-white hover:border-teal-500 focus:border-emerald-500",
    filled: "border-gray-200 bg-gray-50 hover:border-teal-400 hover:bg-white focus:border-emerald-500 focus:bg-white",
    outline: "border-2 border-gray-300 bg-transparent hover:border-teal-500 focus:border-emerald-600"
  };

  const inputClasses = `
    ${sizeClasses[size]} w-full rounded-xl border shadow-sm outline-none
    transition-all cursor-pointer flex items-center justify-between
    ${disabled 
      ? 'bg-gray-100 border-gray-200 cursor-not-allowed text-gray-400' 
      : variantClasses[variant]
    }
    ${error ? 'border-red-500 hover:border-red-600 focus:border-red-600' : ''}
    ${isOpen ? 'ring-2 ring-teal-500/20 border-teal-500' : 'hover:ring-1 hover:ring-teal-500/30'}
  `;

  return (
    <div className="flex flex-col gap-1 w-full" ref={dropdownRef}>
      {label && (
        <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className="relative">
        <div
          ref={inputRef}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={inputClasses}
          tabIndex={disabled ? -1 : 0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              !disabled && setIsOpen(!isOpen);
            }
          }}
          role="button"
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-label={label || "Date picker"}
        >
          <span className={value ? "text-gray-900" : "text-gray-500"}>
            {value ? formatDate(value) : placeholder}
          </span>
          <div className="flex items-center gap-2">
            {value && !disabled && (
              <button
                onClick={handleClear}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Clear date"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
            <Calendar className={`w-5 h-5 ${disabled ? 'text-gray-300' : 'text-gray-400'}`} />
          </div>
        </div>

        {isOpen && !disabled && (
          <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 
                          rounded-xl shadow-xl z-50 p-4 w-80 animate-in fade-in-0 zoom-in-95 duration-100">
            
            {/* Calendar Header with Year/Month Selectors */}
            <div className="flex items-center justify-between mb-4 gap-2">
              <button
                onClick={prevMonth}
                className="p-2 hover:bg-teal-50 hover:text-teal-600 rounded-lg transition-colors"
                aria-label="Previous month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <div className="flex items-center gap-2 flex-1 justify-center">
                {/* Month Selector */}
                <div className="relative">
                  <button
                    onClick={() => setShowMonthSelect(!showMonthSelect)}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-900 
                             bg-white border border-gray-300 rounded-lg hover:bg-gray-50 
                             transition-colors min-w-[80px] justify-between"
                  >
                    {shortMonthNames[currentMonth.getMonth()]}
                    <ChevronDown className="w-3 h-3 text-gray-500" />
                  </button>
                  
                  {showMonthSelect && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 
                                    rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                      {monthNames.map((month, index) => (
                        <button
                          key={month}
                          onClick={() => handleMonthChange(index)}
                          className={`w-full px-3 py-2 text-left text-sm hover:bg-teal-50 
                                   ${currentMonth.getMonth() === index ? 'bg-teal-50 text-teal-700 font-medium' : 'text-gray-700'}`}
                        >
                          {month}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Year Selector */}
                <div className="relative">
                  <button
                    onClick={() => setShowYearSelect(!showYearSelect)}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-900 
                             bg-white border border-gray-300 rounded-lg hover:bg-gray-50 
                             transition-colors min-w-[70px] justify-between"
                  >
                    {currentMonth.getFullYear()}
                    <ChevronDown className="w-3 h-3 text-gray-500" />
                  </button>
                  
                  {showYearSelect && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 
                                    rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                      {years.map((year) => (
                        <button
                          key={year}
                          onClick={() => handleYearChange(year)}
                          className={`w-full px-3 py-2 text-left text-sm hover:bg-teal-50 
                                   ${currentMonth.getFullYear() === year ? 'bg-teal-50 text-teal-700 font-medium' : 'text-gray-700'}`}
                        >
                          {year}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <button
                onClick={nextMonth}
                className="p-2 hover:bg-teal-50 hover:text-teal-600 rounded-lg transition-colors"
                aria-label="Next month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Today Button */}
            <div className="flex justify-center mb-3">
              <button
                onClick={goToToday}
                className="px-3 py-1.5 text-xs bg-teal-100 text-teal-700 rounded-lg 
                         hover:bg-teal-200 transition-colors font-medium"
              >
                Go to Today
              </button>
            </div>

            {/* Week Days */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map((day) => (
                <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {getDaysInMonth().map((date, index) => {
                if (!date) {
                  return <div key={index} className="p-2" />;
                }

                const isDisabled = isDisabledDate(date);
                const isSelectedDate = isSelected(date);
                const isTodayDate = isToday(date);

                return (
                  <button
                    key={index}
                    onClick={() => !isDisabled && handleDateClick(date)}
                    disabled={isDisabled}
                    className={`
                      p-2 text-sm rounded-lg transition-all duration-150
                      ${isDisabled
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'hover:bg-teal-50 hover:text-teal-700 hover:scale-105'
                      }
                      ${isSelectedDate 
                        ? 'bg-teal-500 text-white hover:bg-teal-600 shadow-md scale-105' 
                        : isTodayDate
                        ? 'bg-teal-50 text-teal-700 font-semibold ring-2 ring-teal-200'
                        : 'text-gray-700'
                      }
                    `}
                    aria-label={`${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>

            {/* Selected Date Display */}
            {value && (
              <div className="mt-3 pt-3 border-t border-gray-100 text-center">
                <p className="text-sm text-gray-600">
                  Selected: <span className="font-medium text-teal-600">{formatDate(value)}</span>
                </p>
              </div>
            )}

            {/* Quick Actions */}
            <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
              <button
                onClick={() => {
                  onChange({ target: { value: "" } });
                  setIsOpen(false);
                  setShowYearSelect(false);
                  setShowMonthSelect(false);
                }}
                className="flex-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 
                         hover:bg-gray-50 rounded-lg transition-colors"
              >
                Clear
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setShowYearSelect(false);
                  setShowMonthSelect(false);
                }}
                className="flex-1 px-3 py-2 text-sm bg-teal-500 text-white 
                         hover:bg-teal-600 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Helper Text / Error */}
      {(helperText || error) && (
        <span className={`text-xs ${error ? 'text-red-600' : 'text-gray-500'}`}>
          {error || helperText}
        </span>
      )}
    </div>
  );
}