"use client"

import { useState, useEffect, useRef } from "react"
import { Camera, Mail, Phone, MapPin, Calendar, Clock, Building, Award, Users, ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from "lucide-react"
import { BarChart, Bar, XAxis, ResponsiveContainer } from 'recharts'

interface Employee {
  _id?: string;
  id?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  userId: string;
  username: string;
  workEmail: string;
  personalEmail?: string;
  personalPhoneNumber?: string;
  department?: string;
  position?: string;
  workLocation?: string;
  employmentStatus?: string;
  hireDate?: string;
  team?: string;
  skills?: string[];
  managerId?: {
    _id: string;
    userId: string;
    firstName: string;
    lastName: string;
    fullName?: string;
    position?: string;
    department?: string;
    workEmail?: string;
  } | string;
}

interface HolidayMap {
  [key: number]: string;
}

const Button = ({ children, className = "", variant = "default", size = "default", onClick }: any) => (
  <button 
    onClick={onClick}
    className={`inline-flex items-center justify-center rounded-md font-medium transition-colors
      ${variant === "outline" ? "border border-gray-300 bg-white hover:bg-gray-50" : "bg-teal-500 text-white hover:bg-teal-600"}
      ${size === "sm" ? "h-8 px-3 text-sm" : "h-10 px-4 py-2"}
      ${className}`}
  >
    {children}
  </button>
)

const Badge = ({ children, className = "" }: any) => (
  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${className}`}>
    {children}
  </span>
)

const Avatar = ({ children, className = "" }: any) => (
  <div className={`relative flex shrink-0 overflow-hidden rounded-full ${className}`}>
    {children}
  </div>
)

const AvatarImage = ({ src, alt }: any) => (
  <img src={src} alt={alt} className="aspect-square h-full w-full" />
)

const AvatarFallback = ({ children, className = "" }: any) => (
  <div className={`flex h-full w-full items-center justify-center ${className}`}>
    {children}
  </div>
)

const CustomDatePicker = ({ 
  value, 
  onChange, 
  disabled = false, 
  placeholder = 'Select date',
  label 
}: {
  value: string;
  onChange: (date: string) => void;
  disabled?: boolean;
  placeholder?: string;
  label?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    value ? new Date(value) : null
  );
  const [view, setView] = useState<'days' | 'months' | 'years'>('days');
  const [yearRange, setYearRange] = useState<number[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const WEEK_DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

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

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    const prevMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1);
    const daysInPrevMonth = getDaysInMonth(prevMonthDate);
    
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push(
        <div key={`prev-${i}`} className="h-8 flex items-center justify-center text-sm text-gray-400">
          {daysInPrevMonth - i}
        </div>
      );
    }

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
        className={`w-full px-3 py-2 border border-gray-300 rounded-md text-left focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 hover:border-teal-400 transition-colors flex items-center justify-between text-sm
          ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white cursor-pointer'}`}
      >
        <span className={selectedDate ? 'text-gray-900' : 'text-gray-400'}>
          {selectedDate ? formatDisplayDate(selectedDate) : placeholder}
        </span>
        <Calendar className="w-4 h-4 text-gray-400" />
      </button>

      {isOpen && !disabled && (
        <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 p-3 z-50 w-64">
          <div className="flex items-center justify-between mb-3">
            {renderHeader()}
          </div>

          <div className="min-h-[200px]">
            {renderView()}
          </div>

          {view === 'days' && (
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
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

const CustomSelect = ({ 
  value, 
  onChange, 
  children, 
  placeholder = "Select an option",
  disabled = false,
  label
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
  placeholder?: string;
  disabled?: boolean;
  label?: string;
}) => {
  return (
    <div>
      {label && (
        <label className="block text-xs text-gray-500 mb-1">{label}</label>
      )}
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 hover:border-teal-400 transition-colors bg-white"
      >
        <option value="" className="text-gray-400">{placeholder}</option>
        {children}
      </select>
    </div>
  );
};

const Option = ({ value, children }: { value: string; children: React.ReactNode }) => {
  return <option value={value}>{children}</option>;
};

const DashboardCard = ({ title, children, showViewButton = true, className = "" }: {
  title: string;
  children: React.ReactNode;
  showViewButton?: boolean;
  className?: string;
}) => {
  return (
    <div
      className={`relative bg-white rounded-2xl p-6 transition-all duration-300 border border-teal-100 transform hover:-translate-y-1 shadow-lg hover:shadow-xl ${className}`}
    >
      <div className="absolute -top-3 left-6">
        <div
          className="px-4 py-1.5 rounded-full border border-white/20 text-xs text-white font-medium shadow-lg"
          style={{
            background: "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)",
          }}
        >
          {title}
        </div>
      </div>

      <div className="pt-2">{children}</div>

      {showViewButton && (
        <div className="absolute -bottom-3 right-6">
          <button
            className="px-4 py-1.5 rounded-full border text-sm inline-flex items-center gap-1.5 transition-all duration-300 transform hover:scale-105 bg-teal-50 text-teal-800 border-teal-200 shadow-md hover:bg-teal-100 hover:shadow-lg"
          >
            View <span className="text-teal-600">›</span>
          </button>
        </div>
      )}
    </div>
  )
}

export { Dashboard }

const ProfileInfoItem = ({ icon: Icon, label, value, className = "" }: {
  icon: any;
  label: string;
  value: string;
  className?: string;
}) => (
  <div className={`flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-teal-100 ${className}`}>
    <div className="p-2 bg-gray-50 rounded-lg">
      <Icon className="h-4 w-4 text-teal-600" />
    </div>
    <div className="flex-1">
      <div className="text-xs text-teal-600 font-medium">{label}</div>
      <div className="text-sm font-medium text-gray-800">{value || "Not specified"}</div>
    </div>
  </div>
)

function Dashboard() {
  const [currentTime, setCurrentTime] = useState("")
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [manager, setManager] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const attendanceData = [
    { day: '01', value: 85 },
    { day: '02', value: 75 },
    { day: '03', value: 95 },
    { day: '04', value: 82 },
    { day: '05', value: 90 },
    { day: '06', value: 98 },
    { day: '07', value: 70 },
  ]

  useEffect(() => {
    setIsClient(true)
    setCurrentTime(new Date().toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    }))
  }, [])

  useEffect(() => {
    const loadEmployeeData = async () => {
      try {
        setLoading(true)
        
        const userStr = localStorage.getItem('user') || sessionStorage.getItem('user')
        
        if (!userStr) {
          console.log("No user data found in storage")
          setLoading(false)
          return
        }

        const userData = JSON.parse(userStr)
        console.log("Loaded employee data:", userData)
        
        setEmployee(userData)
        
        // Fetch manager details if managerId exists
        if (userData.managerId) {
          if (typeof userData.managerId === 'string') {
            await fetchManagerDetails(userData.managerId)
          } else if (typeof userData.managerId === 'object') {
            setManager(userData.managerId)
          }
        }
        
      } catch (error) {
        console.error('Error loading employee data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadEmployeeData()
  }, [])

  const fetchManagerDetails = async (managerId: string) => {
    if (!managerId) return
    
    try {
      const response = await fetch(`http://localhost:5000/api/users/${managerId}`)
      const data = await response.json()
      
      if (data && data.data) {
        setManager(data.data)
      } else if (data && data._id) {
        setManager(data)
      }
    } catch (error) {
      console.error('Error fetching manager details:', error)
    }
  }

  const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleEditProfilePicture = () => {
    fileInputRef.current?.click()
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    
    return { daysInMonth, startingDayOfWeek: startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1 }
  }

  const getHolidays = (year: number, month: number): HolidayMap => {
    const holidays: { [key: string]: string } = {
      [`${year}-01-01`]: 'New Year\'s Day',
      [`${year}-12-25`]: 'Christmas Day',
      [`${year}-12-26`]: 'Boxing Day',
      [`${year}-07-04`]: 'Independence Day (US)',
      [`${year}-11-11`]: 'Veterans Day',
      [`${year}-02-14`]: 'Valentine\'s Day',
      [`${year}-10-31`]: 'Halloween',
      [`${year}-05-01`]: 'Labour Day',
    }
    
    const monthHolidays: HolidayMap = {}
    Object.keys(holidays).forEach(dateKey => {
      const [y, m] = dateKey.split('-').map(Number)
      if (y === year && m === month + 1) {
        const day = parseInt(dateKey.split('-')[2])
        monthHolidays[day] = holidays[dateKey]
      }
    })
    
    return monthHolidays
  }

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate)
  const today = new Date()
  const isCurrentMonth = currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear()
  const holidays = getHolidays(currentDate.getFullYear(), currentDate.getMonth())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      }))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const getPosition = (): string => {
    if (!employee) return 'N/A'
    return employee.position || employee.department || 'Employee'
  }

  const formatHireDate = (dateString?: string): string => {
    if (!dateString) return 'Not specified'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getManagerDisplayName = () => {
    if (!manager) return 'Not assigned'
    if (typeof manager === 'string') return manager
    return manager.fullName || `${manager.firstName} ${manager.lastName}` || 'Unknown Manager'
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">
            <span className="bg-gradient-to-r from-teal-500 via-teal-600 to-teal-700 bg-clip-text text-transparent">
              Employee Dashboard
            </span>
          </h1>

          {loading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading dashboard...</p>
              </div>
            </div>
          ) : !employee ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <p className="text-red-600 mb-4">Unable to load employee data</p>
                <p className="text-gray-600 text-sm">Please log in again</p>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3">
                  <DashboardCard title="Employee Profile" showViewButton={false}>
                    <div className="space-y-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-6">
                          <div className="relative">
                            <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                              {profileImage ? (
                                <AvatarImage src={profileImage} alt="Profile" />
                              ) : null}
                              <AvatarFallback className="text-xl bg-teal-100 text-teal-700 font-bold">
                                {employee?.firstName?.[0] || employee?.fullName?.[0] || 'E'}
                                {employee?.lastName?.[0] || employee?.fullName?.split(' ')[1]?.[0] || 'M'}
                              </AvatarFallback>
                            </Avatar>
                            <Button
                              size="sm"
                              onClick={handleEditProfilePicture}
                              className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-teal-500 hover:bg-teal-600 text-white p-0 shadow-lg border-2 border-white"
                            >
                              <Camera className="h-4 w-4" />
                            </Button>
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              onChange={handleProfilePictureChange}
                              className="hidden"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <div>
                              <h2 className="text-2xl font-bold text-gray-800">
                                {employee?.fullName || `${employee?.firstName || ''} ${employee?.lastName || ''}`.trim()}
                              </h2>
                              <p className="text-lg font-semibold text-teal-600">
                                {getPosition()}
                              </p>
                              {employee?.department && (
                                <p className="text-sm text-gray-600 flex items-center gap-1">
                                  <Building className="h-4 w-4" />
                                  {employee.department}
                                </p>
                              )}
                            </div>
                            
                            <div className="flex flex-wrap gap-4 text-sm">
                              <div className="flex items-center gap-1 text-gray-700">
                                <Award className="h-4 w-4 text-teal-500" />
                                <span>Employee ID: <strong className="text-teal-600">{employee?.userId || 'N/A'}</strong></span>
                              </div>
                              <div className="flex items-center gap-1 text-gray-700">
                                <Calendar className="h-4 w-4 text-teal-500" />
                                <span>Since: <strong className="text-teal-600">{formatHireDate(employee?.hireDate)}</strong></span>
                              </div>
                              <div className="flex items-center gap-1 text-gray-700">
                                <Users className="h-4 w-4 text-teal-500" />
                                <span>Team: <strong className="text-teal-600">{employee?.team || 'Not specified'}</strong></span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <Badge className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                          {employee?.employmentStatus === 'active' ? 'Active' : employee?.employmentStatus || 'Active'}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ProfileInfoItem
                          icon={Mail}
                          label="Work Email"
                          value={employee.workEmail}
                        />
                        
                        <ProfileInfoItem
                          icon={MapPin}
                          label="Work Location"
                          value={employee.workLocation}
                        />
                        
                        <ProfileInfoItem
                          icon={Building}
                          label="Department"
                          value={employee.department}
                        />
                        
                        {manager && (
                          <ProfileInfoItem
                            icon={Users}
                            label="Manager"
                            value={getManagerDisplayName()}
                          />
                        )}
                      </div>
                    </div>
                  </DashboardCard>
                </div>

                <DashboardCard title="Time Clock" showViewButton={false}>
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-gray-800 mb-2 font-mono">
                        {isClient ? currentTime : "--:--:--"}
                      </div>
                      <div className="text-sm text-teal-600 font-medium">
                        {new Date().toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </div>
                    </div>
                    
                    <div className="space-y-3 bg-teal-50 rounded-lg p-4 border border-teal-100">
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-gray-700 font-medium">Status: Clocked Out</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                        <span className="text-gray-600">Location: {employee.workLocation || 'Main Office'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-teal-500" />
                        <span className="text-gray-600">Last punch: Today at 09:15 AM</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Button className="flex-1 bg-teal-500 hover:bg-teal-600 text-white shadow-lg transform hover:scale-105 transition-all duration-200">
                        Punch In
                      </Button>
                      <Button variant="outline" className="flex-1 border-teal-300 text-teal-700 hover:bg-teal-50 hover:border-teal-400 shadow-sm">
                        Break
                      </Button>
                    </div>
                  </div>
                </DashboardCard>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <DashboardCard title="Calendar" showViewButton={false}>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <button 
                        onClick={goToPreviousMonth}
                        className="p-2 hover:bg-teal-50 rounded-lg transition-colors text-teal-700"
                        title="Previous Month"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <div className="text-center flex-1">
                        <div className="flex gap-2 justify-center items-center">
                          <select 
                            value={currentDate.getMonth()}
                            onChange={(e) => setCurrentDate(new Date(currentDate.getFullYear(), parseInt(e.target.value), 1))}
                            className="text-sm font-bold text-gray-800 bg-white border border-teal-200 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-teal-500"
                          >
                            {monthNames.map((month, index) => (
                              <option key={index} value={index}>{month}</option>
                            ))}
                          </select>
                          <select 
                            value={currentDate.getFullYear()}
                            onChange={(e) => setCurrentDate(new Date(parseInt(e.target.value), currentDate.getMonth(), 1))}
                            className="text-sm font-bold text-gray-800 bg-white border border-teal-200 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-teal-500"
                          >
                            {Array.from({ length: 21 }, (_, i) => new Date().getFullYear() - 10 + i).map(year => (
                              <option key={year} value={year}>{year}</option>
                            ))}
                          </select>
                        </div>
                        <button 
                          onClick={goToToday}
                          className="text-xs text-teal-600 hover:text-teal-800 font-medium mt-1"
                        >
                          Go to Today
                        </button>
                      </div>
                      <button 
                        onClick={goToNextMonth}
                        className="p-2 hover:bg-teal-50 rounded-lg transition-colors text-teal-700"
                        title="Next Month"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => (
                        <div key={day} className={`p-2 font-semibold ${index >= 5 ? 'text-teal-600' : 'text-gray-700'}`}>{day}</div>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-7 gap-1 text-center text-sm">
                      {Array.from({ length: startingDayOfWeek }).map((_, i) => (
                        <div key={`empty-${i}`} className="p-2 h-8"></div>
                      ))}
                      {Array.from({ length: daysInMonth }).map((_, i) => {
                        const date = i + 1
                        const dayOfWeek = (startingDayOfWeek + i) % 7
                        const isWeekend = dayOfWeek >= 5
                        const isToday = isCurrentMonth && date === today.getDate()
                        const isHoliday = holidays[date]
                        
                        return (
                          <div 
                            key={date} 
                            className={`p-2 h-8 flex items-center justify-center rounded-lg cursor-pointer transition-all duration-200 relative ${
                              isToday 
                                ? 'bg-teal-500 text-white font-bold shadow-lg scale-105' 
                                : isHoliday 
                                ? 'bg-purple-100 text-purple-900 font-bold border border-purple-300' 
                                : isWeekend 
                                ? 'bg-teal-50 text-teal-700 hover:bg-teal-100' 
                                : 'bg-white text-gray-800 hover:bg-teal-50 hover:text-teal-700'
                            }`}
                            title={isHoliday ? `${holidays[date]} - ${monthNames[currentDate.getMonth()]} ${date}, ${currentDate.getFullYear()}` : `${monthNames[currentDate.getMonth()]} ${date}, ${currentDate.getFullYear()}`}
                          >
                            {date}
                            {isHoliday && (
                              <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-purple-600 rounded-full"></div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                    
                    {Object.keys(holidays).length > 0 && (
                      <div className="mt-4 pt-4 border-t border-teal-200">
                        <div className="text-xs font-semibold text-teal-600 mb-2">Upcoming Holidays:</div>
                        <div className="space-y-2">
                          {Object.entries(holidays).map(([day, name]) => (
                            <div key={day} className="flex items-center gap-2 text-xs">
                              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                              <span className="text-gray-700">
                                {monthNames[currentDate.getMonth()]} {day}: <span className="font-medium text-purple-700">{name}</span>
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </DashboardCard>

                <DashboardCard title="Performance Metrics" showViewButton={false}>
                  <div className="space-y-4">
                    <div className="flex gap-3 flex-wrap">
                      <div className="flex-1 min-w-[140px]">
                        <div className="flex gap-1.5">
                          <div className="flex-1">
                            <CustomDatePicker 
                              value={dateFrom} 
                              onChange={setDateFrom}
                              disabled={selectedType !== 'custom'}
                              placeholder="From date"
                              label="From"
                            />
                          </div>
                          <div className="flex-1">
                            <CustomDatePicker 
                              value={dateTo} 
                              onChange={setDateTo}
                              disabled={selectedType !== 'custom'}
                              placeholder="To date"
                              label="To"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-[140px]">
                        <CustomSelect 
                          value={selectedType} 
                          onChange={(e) => {
                            setSelectedType(e.target.value);
                            if (e.target.value !== 'custom') {
                              setDateFrom('');
                              setDateTo('');
                            }
                          }}
                          placeholder="Select report type"
                          label="Report Type"
                        >
                          <Option value="daily">Daily Report</Option>
                          <Option value="weekly">Weekly Report</Option>
                          <Option value="monthly">Monthly Report</Option>
                          <Option value="custom">Custom Range</Option>
                        </CustomSelect>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between items-center mb-1.5">
                              <span className="text-xs text-gray-600">2% Lateness</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div className="bg-teal-500 h-1.5 rounded-full" style={{ width: '2%' }}></div>
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between items-center mb-1.5">
                              <span className="text-xs text-gray-600">5% Overtime</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div className="bg-teal-600 h-1.5 rounded-full" style={{ width: '5%' }}></div>
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between items-center mb-1.5">
                              <span className="text-xs text-gray-600">95% Attendance Rate</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div className="bg-teal-500 h-1.5 rounded-full" style={{ width: '95%' }}></div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="mb-3">
                            <h3 className="text-xs text-gray-600 mb-0.5">Attendance Trend</h3>
                            <div className="flex items-baseline gap-2">
                              <span className="text-2xl font-bold text-gray-800">95%</span>
                              <span className="text-xs text-gray-500">Last 30 Days</span>
                            </div>
                          </div>
                          
                          <ResponsiveContainer width="100%" height={140}>
                            <BarChart data={attendanceData}>
                              <XAxis 
                                dataKey="day" 
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#9CA3AF', fontSize: 11 }}
                              />
                              <Bar 
                                dataKey="value" 
                                fill="#14B8A6"
                                radius={[3, 3, 0, 0]}
                                background={{ fill: '#D1D5DB', radius: [3, 3, 0, 0] }}
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  </div>
                </DashboardCard>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <DashboardCard title="Recent Attendance">
                  <div className="space-y-4">
                    {[
                      { date: "Today", status: "Present", hours: "8hr 04min", in: "09:15 AM", out: "05:19 PM", badgeColor: "bg-green-500" },
                      { date: "Oct 22", status: "Absent", hours: "0hr 00min", in: "--:--", out: "--:--", badgeColor: "bg-red-500" },
                      { date: "Oct 21", status: "Late", hours: "7hr 59min", in: "09:45 AM", out: "05:44 PM", badgeColor: "bg-orange-500" },
                      { date: "Oct 20", status: "Present", hours: "8hr 12min", in: "09:12 AM", out: "05:24 PM", badgeColor: "bg-green-500" },
                    ].map((record, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-teal-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-center gap-4">
                          <div className="text-sm font-medium w-16 text-gray-800">{record.date}</div>
                          <Badge className={`${record.badgeColor} text-white border-0`}>
                            {record.status}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-gray-800">{record.hours}</div>
                          <div className="text-xs text-gray-600">
                            <span className="text-green-600">IN:</span> {record.in} <span className="text-red-600">OUT:</span> {record.out}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </DashboardCard>

                <DashboardCard title="Leave Balance">
                  <div className="space-y-6">
                    <div className="flex flex-col items-center justify-center w-40 h-40 rounded-full bg-gradient-to-br from-teal-50 to-white border border-teal-200 shadow-md mx-auto">
                      <div className="text-4xl font-bold text-teal-600 mb-2">12</div>
                      <div className="text-sm text-gray-700 font-medium">Days Remaining</div>
                      <div className="text-xs text-teal-500 mt-1">Out of 20 annual days</div>
                    </div>
                    
                    <div className="space-y-4">
                      {[
                        { type: "Annual Leave", used: 8, total: 20, color: "bg-blue-500", width: "40%" },
                        { type: "Sick Leave", used: 2, total: 10, color: "bg-red-500", width: "20%" },
                        { type: "Personal Leave", used: 1, total: 5, color: "bg-green-500", width: "20%" },
                      ].map((leave, index) => (
                        <div key={index}>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-700 font-medium">{leave.type}</span>
                            <span className="text-gray-800 font-semibold">{leave.used}/{leave.total}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5 shadow-inner">
                            <div 
                              className={`${leave.color} h-2.5 rounded-full shadow-sm transition-all duration-500`}
                              style={{ width: leave.width }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="bg-teal-50 rounded-lg p-3 border border-teal-200">
                      <div className="text-xs text-teal-700 text-center">
                        Next planned leave: <strong>December 15-20, 2024</strong>
                      </div>
                    </div>
                  </div>
                </DashboardCard>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}