"use client";

import { useState, useRef, useEffect } from "react";
import { Calendar, ChevronLeft, ChevronRight, X } from "lucide-react";

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
      // Parse date correctly without timezone issues
      const [year, month, day] = value.split('-').map(Number);
      return new Date(year, month - 1, day);
    }
    return new Date();
  });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
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
          inputRef.current?.focus();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    
    // Parse date string as local date (YYYY-MM-DD format)
    const [year, month, day] = dateString.split('-').map(Number);
    
    const dayStr = day.toString().padStart(2, '0');
    const monthStr = month.toString().padStart(2, '0');
    const yearStr = year.toString();

    switch (dateFormat) {
      case 'MM/DD/YYYY':
        return `${monthStr}/${dayStr}/${yearStr}`;
      case 'YYYY-MM-DD':
        return `${yearStr}-${monthStr}-${dayStr}`;
      default:
        return `${dayStr}/${monthStr}/${yearStr}`;
    }
  };

  const handleDateClick = (date: Date) => {
    if (disabled) return;
    
    // Format date as YYYY-MM-DD without timezone conversion
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;
    
    // Check date constraints
    if (minDate && dateString < minDate) return;
    if (maxDate && dateString > maxDate) return;
    
    onChange({ target: { value: dateString } });
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange({ target: { value: "" } });
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    for (let i = 0; i < 42; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      days.push(currentDate);
    }
    return days;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    if (!value) return false;
    
    // Parse the value as local date
    const [year, month, day] = value.split('-').map(Number);
    const selectedDate = new Date(year, month - 1, day);
    
    return date.toDateString() === selectedDate.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentMonth.getMonth() && 
           date.getFullYear() === currentMonth.getFullYear();
  };

  const isDisabledDate = (date: Date) => {
    // Format date as YYYY-MM-DD without timezone conversion
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;
    
    if (minDate && dateString < minDate) return true;
    if (maxDate && dateString > maxDate) return true;
    return false;
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
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
    
    // Format today as YYYY-MM-DD without timezone conversion
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayString = `${year}-${month}-${day}`;
    
    if (!isDisabledDate(today)) {
      onChange({ target: { value: todayString } });
      setIsOpen(false);
    }
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
    ${isOpen ? 'ring-2 ring-teal-500/20' : 'hover:ring-1 hover:ring-teal-500/30'}
  `;

  return (
    <div className="flex flex-col w-full gap-1" ref={dropdownRef}>
      {label && (
        <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
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
                className="p-1 transition-colors rounded-full hover:bg-gray-100"
                aria-label="Clear date"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
            <Calendar className={`w-5 h-5 ${disabled ? 'text-gray-300' : 'text-gray-400'}`} />
          </div>
        </div>

        {isOpen && !disabled && (
          <div className="absolute left-0 right-0 z-50 p-4 mt-2 duration-100 bg-white border border-gray-200 shadow-xl top-full rounded-xl w-80 animate-in fade-in-0 zoom-in-95">
            
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={prevMonth}
                className="p-2 transition-colors rounded-lg hover:bg-teal-50 hover:text-teal-600"
                aria-label="Previous month"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-center text-gray-900">
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </h3>
                <button
                  onClick={goToToday}
                  className="px-2 py-1 text-xs font-medium text-teal-700 transition-colors bg-teal-100 rounded-md hover:bg-teal-200"
                >
                  Today
                </button>
              </div>
              
              <button
                onClick={nextMonth}
                className="p-2 transition-colors rounded-lg hover:bg-teal-50 hover:text-teal-600"
                aria-label="Next month"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Week Days */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map((day) => (
                <div key={day} className="py-2 text-sm font-medium text-center text-gray-500">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {getDaysInMonth(currentMonth).map((date, index) => {
                const isDisabled = isDisabledDate(date);
                const isSelectedDate = isSelected(date);
                const isTodayDate = isToday(date);
                const isCurrentMonthDate = isCurrentMonth(date);

                return (
                  <button
                    key={index}
                    onClick={() => !isDisabled && handleDateClick(date)}
                    disabled={isDisabled}
                    className={`
                      p-2 text-sm rounded-lg transition-all duration-150 relative
                      ${isDisabled
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'hover:bg-teal-50 hover:text-teal-700 hover:scale-105'
                      }
                      ${isSelectedDate 
                        ? 'bg-teal-500 text-white hover:bg-teal-600 shadow-md scale-105' 
                        : isTodayDate
                        ? 'bg-teal-50 text-teal-700 font-semibold ring-2 ring-teal-200'
                        : isCurrentMonthDate
                        ? 'text-gray-900'
                        : 'text-gray-400'
                      }
                    `}
                    aria-label={`${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`}
                  >
                    {date.getDate()}
                    {isTodayDate && !isSelectedDate && (
                      <div className="absolute w-1 h-1 transform -translate-x-1/2 bg-teal-500 rounded-full bottom-1 left-1/2" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2 pt-3 mt-4 border-t border-gray-100">
              <button
                onClick={() => {
                  onChange({ target: { value: "" } });
                  setIsOpen(false);
                }}
                className="flex-1 px-3 py-2 text-sm text-gray-600 transition-colors rounded-lg hover:text-gray-800 hover:bg-gray-50"
              >
                Clear
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 px-3 py-2 text-sm text-white transition-colors bg-teal-500 rounded-lg hover:bg-teal-600"
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