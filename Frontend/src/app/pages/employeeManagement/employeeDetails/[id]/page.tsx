"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { 
  ArrowLeft, 
  Edit2, 
  Save, 
  X, 
  Trash2, 
  User, 
  Mail, 
  Phone, 
  Building, 
  Calendar, 
  MapPin, 
  Key, 
  Eye, 
  EyeOff, 
  AlertTriangle,
  Briefcase,
  DollarSign,
  Shield,
  ChevronRight,
  Heart,
  Droplets,
  Users,
  Globe,
  FileText,
  Fingerprint,
  Send,
  Copy,
  Check,
  RefreshCw
} from 'lucide-react';
import { Roboto } from "next/font/google";
import toast from "react-hot-toast";
import { State, IState, Country } from "country-state-city";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

// Interfaces
interface Currency {
  value: string;
  label: string;
  symbol: string;
}

interface CountryData {
  name: { common: string };
  cca2: string;
  idd?: { root: string; suffixes: string[] };
}

interface Employee {
  _id: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  userId: string;
  username: string;
  workEmail: string;
  personalPhoneNumber: string;
  whatsappPhoneNumber?: string;
  department: string;
  position: string;
  workLocation: string;
  employmentType: string;
  employmentStatus: string;
  hireDate: string;
  basicSalary?: number;
  salaryCurrency?: string;
  dateOfBirth?: string;
  NIC?: string;
  passportNumber?: string;
  gender?: string;
  maritalStatus?: string;
  nationality?: string;
  bloodGroup?: string;
  religion?: string;
  forcePasswordChange?: boolean;
  emergencyContact?: {
    name: string;
    phoneNumber: string;
    relationship: string;
  };
  currentAddress?: {
    addressLine: string;
    city: string;
    province: string;
    postalCode: string;
    country?: string;
  };
  permanentAddress?: {
    addressLine: string;
    city: string;
    province: string;
    postalCode: string;
    country?: string;
  };
  workingHours?: string;
  biometrics?: {
    fingerprint: boolean;
    faceId: boolean;
  };
  // Add manager information
  managerId?: {
    _id: string;
    userId: string;
    firstName: string;
    lastName: string;
    fullName?: string;
    position?: string;
    department?: string;
    workEmail?: string;
  } | string; // Can be ObjectId string or populated manager object
}

interface PersonalEditData {
  firstName: string;
  lastName: string;
  fullName?: string;
  dateOfBirth?: string;
  NIC?: string;
  passportNumber?: string;
  gender?: string;
  maritalStatus?: string;
  nationality?: string;
  bloodGroup?: string;
  religion?: string;
}

interface ContactEditData {
  workEmail: string;
  personalPhoneNumber: string;
  whatsappPhoneNumber?: string;
  currentAddress?: {
    addressLine: string;
    city: string;
    province: string;
    postalCode: string;
    country?: string;
  };
  permanentAddress?: {
    addressLine: string;
    city: string;
    province: string;
    postalCode: string;
    country?: string;
  };
  emergencyContact?: {
    name: string;
    phoneNumber: string;
    relationship: string;
  };
}

interface WorkEditData {
  department: string;
  position: string;
  workLocation: string;
  employmentType: string;
  employmentStatus: string;
  basicSalary?: number;
  salaryCurrency?: string;
  workingHours?: string;
}

interface EmergencyEditData {
  emergencyContact: {
    name: string;
    phoneNumber: string;
    relationship: string;
  };
}

interface AddressEditData {
  currentAddress: {
    addressLine: string;
    city: string;
    province: string;
    postalCode: string;
    country?: string;
  };
  permanentAddress: {
    addressLine: string;
    city: string;
    province: string;
    postalCode: string;
    country?: string;
  };
}

interface CredentialsEditData {
  username: string;
  password: string;
}

type EditData = PersonalEditData | ContactEditData | WorkEditData | EmergencyEditData | AddressEditData | CredentialsEditData;

// InfoField Component
const InfoField = ({ 
  label, 
  value, 
  editing = false, 
  type = 'text', 
  onChange, 
  name, 
  className = '',
  fieldKey
}: { 
  label: string; 
  value: string | number | undefined | null; 
  editing?: boolean; 
  type?: string; 
  onChange?: (value: string) => void; 
  name?: string; 
  className?: string;
  fieldKey?: string;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleBlur = () => {
    if (inputRef.current && onChange) {
      onChange(inputRef.current.value);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputRef.current && onChange) {
      onChange(inputRef.current.value);
      inputRef.current.blur();
    }
  };

  // Safely convert value to display string
  const displayValue = (value: string | number | undefined | null): string => {
    if (value === undefined || value === null) return '';
    if (typeof value === 'number') return value.toString();
    return value;
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-sm font-medium text-gray-600">{label}</label>
      {editing ? (
        <input
          ref={inputRef}
          type={type}
          defaultValue={displayValue(value)}
          onBlur={handleBlur}
          onKeyPress={handleKeyPress}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors duration-200"
        />
      ) : (
        <p className="text-gray-900 font-medium">{displayValue(value) || 'N/A'}</p>
      )}
    </div>
  );
};

// Main Component
const EmployeeDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const employeeId = params?.id as string;
  
  // Local state for currencies and countries
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [countries, setCountries] = useState<CountryData[]>([]);
  const [dialCodes, setDialCodes] = useState<{ [key: string]: string }>({});
  const [dataLoading, setDataLoading] = useState(true);
  
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editData, setEditData] = useState<EditData>({} as EditData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);
  
  // Password management states
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [showGeneratedPassword, setShowGeneratedPassword] = useState(false);

  // Country and states
  const [selectedCountry, setSelectedCountry] = useState<any | null>(null);
  const [countryIsoCode, setCountryIsoCode] = useState<string>("");

  // Add state for manager details
  const [manager, setManager] = useState<any>(null);
  const [managerLoading, setManagerLoading] = useState(false);

  // Fix the getStatusColor function to always return a valid string
  const getStatusColor = (status: string | undefined | null): string => {
    if (!status) return 'bg-gray-100 text-gray-600 border-gray-200';
    
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'active': 
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive': 
        return 'bg-gray-100 text-gray-600 border-gray-200';
      case 'pending': 
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'terminated':
        return 'bg-red-100 text-red-800 border-red-200';
      default: 
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  // Fix the formatDate function to handle invalid dates
  const formatDate = (dateString: string | undefined | null): string => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'N/A';
    }
  };

  // Fix the getCurrencySymbol function
  const getCurrencySymbol = (currencyCode?: string): string => {
    if (!currencyCode) return '$';
    const currency = currencies.find(c => c.value === currencyCode);
    return currency?.symbol || currencyCode;
  };

  // Fix the getSafeValue function
  const getSafeValue = (obj: any, path: string, defaultValue: any = 'N/A') => {
    try {
      const value = path.split('.').reduce((acc, part) => {
        if (acc === null || acc === undefined) return undefined;
        return acc[part];
      }, obj);
      return value !== undefined && value !== null ? value : defaultValue;
    } catch (error) {
      return defaultValue;
    }
  };

  // Fix the capitalizeFirstLetter function
  const capitalizeFirstLetter = (str: string | undefined | null): string => {
    if (!str) return 'N/A';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  // Fix the getInitials function
  const getInitials = (firstName?: string, lastName?: string): string => {
    const firstInitial = firstName?.[0] || '';
    const lastInitial = lastName?.[0] || '';
    return (firstInitial + lastInitial).toUpperCase() || '?';
  };

  // Fetch currencies and countries
  useEffect(() => {
    const fetchData = async () => {
      try {
        setDataLoading(true);
        
        const [currenciesRes, countriesRes] = await Promise.all([
          fetch('https://api.frankfurter.app/currencies'),
          fetch('https://restcountries.com/v3.1/all?fields=name,cca2,idd')
        ]);

        if (currenciesRes.ok) {
          const currenciesData = await currenciesRes.json();
          const currencyList: Currency[] = Object.keys(currenciesData).map(code => ({
            value: code,
            label: `${code} - ${currenciesData[code]}`,
            symbol: code
          }));
          setCurrencies(currencyList);
        } else {
          setCurrencies([
            { value: "USD", label: "USD - US Dollar", symbol: "$" },
            { value: "EUR", label: "EUR - Euro", symbol: "€" },
            { value: "GBP", label: "GBP - British Pound", symbol: "£" },
            { value: "LKR", label: "LKR - Sri Lankan Rupee", symbol: "Rs" },
            { value: "INR", label: "INR - Indian Rupee", symbol: "₹" },
          ]);
        }

        if (countriesRes.ok) {
          const countriesData: CountryData[] = await countriesRes.json();
          const sortedCountries = countriesData.sort((a, b) => 
            a.name.common.localeCompare(b.name.common)
          );
          setCountries(sortedCountries);

          const codes: { [key: string]: string } = {};
          sortedCountries.forEach(country => {
            const root = country.idd?.root || '+';
            const suffixes = country.idd?.suffixes || [''];
            codes[country.name.common] = root + suffixes[0];
          });
          setDialCodes(codes);
        }

      } catch (error) {
        console.error('Failed to fetch data:', error);
        setCurrencies([
          { value: "USD", label: "USD - US Dollar", symbol: "$" },
          { value: "EUR", label: "EUR - Euro", symbol: "€" },
          { value: "GBP", label: "GBP - British Pound", symbol: "£" },
          { value: "LKR", label: "LKR - Sri Lankan Rupee", symbol: "Rs" },
          { value: "INR", label: "INR - Indian Rupee", symbol: "₹" },
        ]);
      } finally {
        setDataLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (employeeId) {
      fetchEmployee();
    }
  }, [employeeId]);

  useEffect(() => {
    if (employee?.nationality && countries.length > 0) {
      const countryData = countries.find(
        (c) => c.name.common === employee.nationality
      );
      if (countryData) {
        setSelectedCountry(countryData);
        
        const countryStateData = Country.getAllCountries().find(
          (c) => c.name === employee.nationality
        );
        
        if (countryStateData) {
          setCountryIsoCode(countryStateData.isoCode);
        }
      }
    }
  }, [employee?.nationality, countries]);

  // Add function to fetch manager details
  const fetchManagerDetails = async (managerId: string) => {
    if (!managerId) return;
    
    try {
      setManagerLoading(true);
      const response = await axios.get(`http://localhost:5000/api/users/${managerId}`);
      
      if (response.data && response.data.data) {
        setManager(response.data.data);
      } else if (response.data && response.data._id) {
        setManager(response.data);
      }
    } catch (error) {
      console.error('Error fetching manager details:', error);
    } finally {
      setManagerLoading(false);
    }
  };

  const fetchEmployee = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching employee with ID:', employeeId);
      
      const response = await axios.get(`http://localhost:5000/api/users/${employeeId}`);
      
      console.log('API Response:', response.data);
      
      // Handle different API response structures
      let employeeData: Employee | null = null;
      
      if (response.data && typeof response.data === 'object') {
        // If response has { data: employee } structure
        if (response.data.data && typeof response.data.data === 'object') {
          employeeData = response.data.data;
        } 
        // If response has { success: true, data: employee } structure
        else if (response.data.success && response.data.data) {
          employeeData = response.data.data;
        }
        // If response is the employee object directly
        else if (response.data._id) {
          employeeData = response.data;
        }
        // If response has nested user data
        else if (response.data.user) {
          employeeData = response.data.user;
        }
      }
      
      if (employeeData) {
        console.log('Processed employee data:', employeeData);
        
        // Ensure all required fields have default values
        const safeEmployeeData: Employee = {
          _id: employeeData._id || '',
          firstName: employeeData.firstName || '',
          lastName: employeeData.lastName || '',
          userId: employeeData.userId || '',
          username: employeeData.username || '',
          workEmail: employeeData.workEmail || '',
          personalPhoneNumber: employeeData.personalPhoneNumber || '',
          whatsappPhoneNumber: employeeData.whatsappPhoneNumber || '',
          department: employeeData.department || '',
          position: employeeData.position || '',
          workLocation: employeeData.workLocation || '',
          employmentType: employeeData.employmentType || '',
          employmentStatus: employeeData.employmentStatus || 'inactive',
          hireDate: employeeData.hireDate || '',
          basicSalary: employeeData.basicSalary || 0,
          salaryCurrency: employeeData.salaryCurrency || 'USD',
          dateOfBirth: employeeData.dateOfBirth || '',
          NIC: employeeData.NIC || '',
          passportNumber: employeeData.passportNumber || '',
          gender: employeeData.gender || '',
          maritalStatus: employeeData.maritalStatus || '',
          nationality: employeeData.nationality || '',
          bloodGroup: employeeData.bloodGroup || '',
          religion: employeeData.religion || '',
          forcePasswordChange: employeeData.forcePasswordChange || false,
          emergencyContact: employeeData.emergencyContact || { name: '', phoneNumber: '', relationship: '' },
          currentAddress: employeeData.currentAddress || { addressLine: '', city: '', province: '', postalCode: '', country: '' },
          permanentAddress: employeeData.permanentAddress || { addressLine: '', city: '', province: '', postalCode: '', country: '' },
          workingHours: employeeData.workingHours || '',
          biometrics: employeeData.biometrics || { fingerprint: false, faceId: false },
          managerId: employeeData.managerId || null
        };
        
        setEmployee(safeEmployeeData);
        
        // Fetch manager details if managerId exists and is a string (ObjectId)
        if (employeeData.managerId && typeof employeeData.managerId === 'string') {
          fetchManagerDetails(employeeData.managerId);
        } else if (employeeData.managerId && typeof employeeData.managerId === 'object') {
          // If manager is already populated in the response
          setManager(employeeData.managerId);
        }
      } else {
        console.error('Unexpected API response structure:', response.data);
        setError('Unexpected data format received from server');
      }
      
    } catch (err: any) {
      console.error('Error fetching employee:', err);
      
      let errorMessage = 'Failed to fetch employee details';
      
      if (err.response) {
        // Server responded with error status
        if (err.response.status === 404) {
          errorMessage = 'Employee not found';
        } else if (err.response.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        } else if (err.response.data?.error) {
          errorMessage = err.response.data.error;
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        }
      } else if (err.request) {
        // Network error
        errorMessage = 'Network error. Please check your connection.';
      }
      
      setError(errorMessage);
      setEmployee(null);
    } finally {
      setLoading(false);
    }
  };

  const getFlagUrl = (countryCode: string) => {
    return `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`;
  };

  const getCountryDialCode = () => {
    if (employee?.nationality && dialCodes[employee.nationality]) {
      return dialCodes[employee.nationality];
    }
    return "+94";
  };

  const getStatesForCountry = (): IState[] => {
    if (!countryIsoCode) return [];
    
    try {
      const states = State.getStatesOfCountry(countryIsoCode);
      
      if (states.length === 0) {
        const countriesWithoutStates = [
          'SG', 'MC', 'VA', 'SM', 'LI', 'AD', 'MT', 'SC', 'MV', 'BH', 'QA', 'CY',
          'LU', 'IS', 'MT', 'FO', 'GL', 'GI', 'BM', 'KY', 'VG', 'FK', 'PN', 'TC',
          'WF', 'NR', 'TV', 'KI', 'CK', 'NU', 'TO', 'WS', 'FM', 'MH', 'PW', 'AQ'
        ];
        
        if (countriesWithoutStates.includes(countryIsoCode)) {
          return [];
        }
      }
      
      return states;
    } catch (error) {
      console.error('Error fetching states:', error);
      return [];
    }
  };

  // Helper function to get manager display name
  const getManagerDisplayName = () => {
    if (!manager) return 'Not assigned';
    
    if (typeof manager === 'string') {
      return manager; // In case it's just a string ID
    }
    
    return manager.fullName || `${manager.firstName} ${manager.lastName}` || 'Unknown Manager';
  };

  // Helper function to get manager position
  const getManagerPosition = () => {
    if (!manager || typeof manager === 'string') return '';
    return manager.position || '';
  };

  // Helper function to get manager department
  const getManagerDepartment = () => {
    if (!manager || typeof manager === 'string') return '';
    return manager.department || '';
  };

  // Helper function to get manager email
  const getManagerEmail = () => {
    if (!manager || typeof manager === 'string') return '';
    return manager.workEmail || '';
  };

  const generatePassword = (length: number = 12): string => {
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const special = "!@#$%^&*";
    
    let password = "";
    
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += special[Math.floor(Math.random() * special.length)];
    
    const allChars = lowercase + uppercase + numbers + special;
    for (let i = 4; i < length; i++) {
      password += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }
    
    return password.split('').sort(() => Math.random() - 0.5).join('');
  };

  const handleGeneratePassword = () => {
    const newPassword = generatePassword();
    setGeneratedPassword(newPassword);
    setShowGeneratedPassword(true);
    toast.success("One-time password generated successfully");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSendCredentials = async () => {
    if (!generatedPassword) {
      toast.error("Please generate a password first");
      return;
    }

    if (!employee) {
      toast.error("Employee data not available");
      return;
    }

    const employeeName = employee.fullName || `${employee.firstName} ${employee.lastName}`;

    if (!employee.NIC) {
      toast.error("Employee NIC is required to send credentials");
      return;
    }

    setIsSending(true);

    try {
      const loadingToast = toast.loading("Sending credentials and updating employee...");
      
      const emailRes = await fetch("http://localhost:5000/api/otp/send-credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: employee.username,
          password: generatedPassword,
          employeeName: employeeName,
          NIC: employee.NIC,
          userId: employee.userId,
        }),
      });

      const emailData = await emailRes.json();

      if (!emailRes.ok) {
        toast.dismiss(loadingToast);
        toast.error(emailData.message || `Failed to send credentials: ${emailRes.status}`);
        return;
      }

      if (!emailData.emailSent) {
        toast.dismiss(loadingToast);
        toast.error("Failed to send credentials email.");
        return;
      }

      try {
        const updateRes = await axios.put(`http://localhost:5000/api/users/${employeeId}`, {
          password: generatedPassword,
          forcePasswordChange: true
        });

        setEmployee(prev => prev ? {
          ...prev,
          forcePasswordChange: true
        } : null);

        toast.dismiss(loadingToast);
        toast.success("✅ Credentials sent and password updated successfully!");
        
        setGeneratedPassword('');
        setShowGeneratedPassword(false);
        
      } catch (updateError) {
        console.error("Error updating password in database:", updateError);
        toast.dismiss(loadingToast);
        toast.error("Email sent but failed to update database. Please try updating the password manually.");
      }

    } catch (error) {
      console.error("Network error:", error);
      toast.error("Error connecting to server. Please check if backend is running.");
    } finally {
      setIsSending(false);
    }
  };

  const getPasswordStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    return strength;
  };

  const handleEdit = (section: string) => {
    setEditingSection(section);
    if (employee) {
      // Add null checks for nested objects
      if (section === 'personal') {
        setEditData({
          firstName: employee.firstName || '',
          lastName: employee.lastName || '',
          fullName: employee.fullName || '',
          dateOfBirth: employee.dateOfBirth || '',
          NIC: employee.NIC || '',
          passportNumber: employee.passportNumber || '',
          gender: employee.gender || '',
          maritalStatus: employee.maritalStatus || '',
          nationality: employee.nationality || '',
          bloodGroup: employee.bloodGroup || '',
          religion: employee.religion || ''
        } as PersonalEditData);
      } else if (section === 'contact') {
        setEditData({
          workEmail: employee.workEmail || '',
          personalPhoneNumber: employee.personalPhoneNumber || '',
          whatsappPhoneNumber: employee.whatsappPhoneNumber || ''
        } as ContactEditData);
      } else if (section === 'address') {
        setEditData({
          currentAddress: employee.currentAddress || { addressLine: '', city: '', province: '', postalCode: '', country: '' },
          permanentAddress: employee.permanentAddress || { addressLine: '', city: '', province: '', postalCode: '', country: '' }
        } as AddressEditData);
      } else if (section === 'work') {
        setEditData({
          department: employee.department || '',
          position: employee.position || '',
          workLocation: employee.workLocation || '',
          employmentType: employee.employmentType || '',
          employmentStatus: employee.employmentStatus || '',
          basicSalary: employee.basicSalary || 0,
          salaryCurrency: employee.salaryCurrency || '',
          workingHours: employee.workingHours || ''
        } as WorkEditData);
      } else if (section === 'emergency') {
        setEditData({
          emergencyContact: employee.emergencyContact || { name: '', phoneNumber: '', relationship: '' }
        } as EmergencyEditData);
      } else if (section === 'credentials') {
        setEditData({
          username: employee.username || '',
          password: ''
        } as CredentialsEditData);
      }
    }
  };

  const handleSave = async () => {
    if (!employee) return;
    
    try {
      setSaving(true);
      console.log('Saving data:', editData);
      
      const response = await axios.put(`http://localhost:5000/api/users/${employeeId}`, editData);
      
      // Handle different response structures
      let updatedEmployee: Employee | null = null;
      
      if (response.data && typeof response.data === 'object') {
        if (response.data.data && typeof response.data.data === 'object') {
          updatedEmployee = response.data.data;
        } else if (response.data.success && response.data.data) {
          updatedEmployee = response.data.data;
        } else if (response.data._id) {
          updatedEmployee = response.data;
        }
      }
      
      if (updatedEmployee) {
        setEmployee(updatedEmployee);
        setEditingSection(null);
        setEditData({} as EditData);
        toast.success("Employee updated successfully!");
      } else {
        throw new Error('Unexpected response format');
      }
      
    } catch (err: any) {
      console.error('Error updating employee:', err);
      
      let errorMessage = 'Failed to update employee';
      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingSection(null);
    setEditData({} as EditData);
    setGeneratedPassword('');
    setShowGeneratedPassword(false);
  };

  const updateEditData = (field: string, value: string | number | object) => {
    setEditData(prevData => {
      if (editingSection === 'personal') {
        const data = prevData as PersonalEditData;
        return { ...data, [field]: value } as PersonalEditData;
      } else if (editingSection === 'contact') {
        const data = prevData as ContactEditData;
        return { ...data, [field]: value } as ContactEditData;
      } else if (editingSection === 'address') {
        const data = prevData as AddressEditData;
        if (field.startsWith('currentAddress.')) {
          const subField = field.split('.')[1];
          return { 
            ...data, 
            currentAddress: { ...data.currentAddress, [subField]: value } 
          } as AddressEditData;
        } else if (field.startsWith('permanentAddress.')) {
          const subField = field.split('.')[1];
          return { 
            ...data, 
            permanentAddress: { ...data.permanentAddress, [subField]: value } 
          } as AddressEditData;
        }
        return data;
      } else if (editingSection === 'work') {
        const data = prevData as WorkEditData;
        return { ...data, [field]: field === 'basicSalary' ? Number(value) : value } as WorkEditData;
      } else if (editingSection === 'emergency') {
        const data = prevData as EmergencyEditData;
        if (field.startsWith('emergencyContact.')) {
          const subField = field.split('.')[1];
          return { 
            ...data, 
            emergencyContact: { ...data.emergencyContact, [subField]: value } 
          } as EmergencyEditData;
        }
        return data;
      } else if (editingSection === 'credentials') {
        const data = prevData as CredentialsEditData;
        return { ...data, [field]: value } as CredentialsEditData;
      }
      return prevData;
    });
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${employeeId}`);
      toast.success("Employee deleted successfully!");
      router.push('/pages/employeeManagement/profilesManagement');
    } catch (err) {
      console.error('Error deleting employee:', err);
      setError('Failed to delete employee');
      toast.error("Failed to delete employee");
    }
  };

  const InfoCard = ({ 
    title, 
    icon: Icon, 
    children, 
    section, 
    editable = true 
  }: { 
    title: string; 
    icon: React.ElementType; 
    children: React.ReactNode; 
    section: string;
    editable?: boolean;
  }) => (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 mb-6 employee-detail-form">
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg">
            <Icon className="w-5 h-5 text-teal-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        {editable && (
          <button
            onClick={() => editingSection === section ? handleCancel() : handleEdit(section)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
              editingSection === section 
                ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                : 'bg-teal-50 text-teal-600 hover:bg-teal-100'
            }`}
          >
            {editingSection === section ? 
              <X className="w-4 h-4" /> : 
              <Edit2 className="w-4 h-4" />
            }
            <span className="text-sm font-medium">
              {editingSection === section ? 'Cancel' : 'Edit'}
            </span>
          </button>
        )}
      </div>
      <div className="p-6 employee-detail-form">
        {children}
      </div>
    </div>
  );

  const AddressField = ({ label, address, editing = false, prefix, onChange }: {
    label: string;
    address: { addressLine: string; city: string; province: string; postalCode: string; country?: string };
    editing?: boolean;
    prefix: string;
    onChange?: (field: string, value: string) => void;
  }) => {
    const states = getStatesForCountry();
    const hasStates = states.length > 0;

    return (
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">{label}</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-4">
          <InfoField
            label="Address Line"
            value={address?.addressLine || ''}
            editing={editing}
            onChange={(value) => onChange?.(`${prefix}.addressLine`, value)}
          />
          <InfoField
            label="City"
            value={address?.city || ''}
            editing={editing}
            onChange={(value) => onChange?.(`${prefix}.city`, value)}
          />
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">Country</label>
            {editing ? (
              <div className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
                {selectedCountry && (
                  <img 
                    src={getFlagUrl(selectedCountry.cca2)} 
                    alt={`${selectedCountry.name.common} flag`}
                    className="w-6 h-4 object-cover rounded-sm"
                  />
                )}
                <span className="text-gray-600">
                  {employee?.nationality || "Not specified"}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {selectedCountry && (
                  <img 
                    src={getFlagUrl(selectedCountry.cca2)} 
                    alt={`${selectedCountry.name.common} flag`}
                    className="w-6 h-4 object-cover rounded-sm"
                  />
                )}
                <p className="text-gray-900 font-medium">{address?.country || employee?.nationality || 'N/A'}</p>
              </div>
            )}
          </div>

          {editing && hasStates ? (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">Province/State</label>
              <select
                value={address?.province || ''}
                onChange={(e) => onChange?.(`${prefix}.province`, e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              >
                <option value="">Select province/state</option>
                {states.map((s) => (
                  <option key={s.isoCode} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <InfoField
              label="Province/Region"
              value={address?.province || ''}
              editing={editing}
              onChange={(value) => onChange?.(`${prefix}.province`, value)}
            />
          )}
          
          <InfoField
            label="Postal Code"
            value={address?.postalCode || ''}
            editing={editing}
            onChange={(value) => onChange?.(`${prefix}.postalCode`, value)}
          />
        </div>
      </div>
    );
  };

  const PhoneField = ({ label, value, editing, onChange }: {
    label: string;
    value: string;
    editing?: boolean;
    onChange?: (value: string) => void;
  }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-600">{label}</label>
      {editing ? (
        <div className="flex gap-2">
          <div className="flex items-center gap-2 px-3 border border-gray-300 rounded-lg bg-gray-50 min-w-[100px]">
            {selectedCountry && (
              <img 
                src={getFlagUrl(selectedCountry.cca2)} 
                alt={`${selectedCountry.name.common} flag`}
                className="w-5 h-3 object-cover rounded-sm"
              />
            )}
            <span className="text-sm font-medium text-gray-600">
              {getCountryDialCode()}
            </span>
          </div>
          <input
            type="tel"
            defaultValue={value || ''}
            onBlur={(e) => onChange?.(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                onChange?.((e.target as HTMLInputElement).value);
                (e.target as HTMLInputElement).blur();
              }
            }}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          />
        </div>
      ) : (
        <div className="flex items-center gap-2">
          {selectedCountry && (
            <img 
              src={getFlagUrl(selectedCountry.cca2)} 
              alt={`${selectedCountry.name.common} flag`}
              className="w-5 h-3 object-cover rounded-sm"
            />
          )}
          <span className="text-sm text-gray-500">{getCountryDialCode()}</span>
          <p className="text-gray-900 font-medium">{value || 'N/A'}</p>
        </div>
      )}
    </div>
  );

  const passwordStrength = getPasswordStrength(generatedPassword);
  const strengthColors = [
    "bg-red-500",
    "bg-orange-500", 
    "bg-yellow-500",
    "bg-teal-500",
    "bg-emerald-500",
  ];
  const strengthLabels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];

  if (loading || dataLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading employee details...</p>
        </div>
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Employee</h2>
          <p className="text-gray-600 mb-4">{error || 'Employee not found'}</p>
          <div className="flex gap-3 justify-center">
            <button 
              onClick={() => router.back()} 
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
            >
              Go Back
            </button>
            <button 
              onClick={fetchEmployee} 
              className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen employee-detail-page ${roboto.className} ${showDeleteModal ? 'overflow-hidden' : ''}`}>
      <div className={`transition-all duration-300 ${showDeleteModal ? 'blur-sm pointer-events-none' : ''}`}>
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => router.back()} 
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Employee Profile</h1>
                  <p className="text-gray-500">Manage employee information and details</p>
                </div>
              </div>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                <Trash2 className="w-4 h-4" />
                Delete Employee
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Employee Header - UPDATED WITH MANAGER INFO */}
          <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-2xl p-8 text-white mb-8 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center text-3xl font-bold backdrop-blur-sm">
                  {getInitials(employee.firstName, employee.lastName)}
                </div>
                <div>
                  <h2 className="text-3xl font-bold mb-2">
                    {employee.fullName || `${employee.firstName} ${employee.lastName}`}
                  </h2>
                  <p className="text-teal-100 text-lg mb-3">{employee.position} • {employee.department}</p>
                  <div className="flex items-center gap-4">
                    <span className={`px-4 py-1 rounded-full text-sm font-medium border ${getStatusColor(employee.employmentStatus)}`}>
                      {capitalizeFirstLetter(employee.employmentStatus)}
                    </span>
                    <span className="text-teal-100">Employee ID: {employee.userId}</span>
                    {/* Add Manager Info */}
                    {manager && (
                      <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                        <Users className="w-4 h-4" />
                        <span className="text-teal-100 text-sm">
                          Manager: {getManagerDisplayName()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-teal-100">Hire Date</p>
                <p className="text-xl font-semibold">{formatDate(employee.hireDate)}</p>
                {/* Add Manager Details on the right side */}
                {manager && (
                  <div className="mt-4 p-3 bg-white/10 rounded-lg">
                    <p className="text-teal-100 text-sm font-medium">Reporting To</p>
                    <p className="text-white font-semibold">{getManagerDisplayName()}</p>
                    {getManagerPosition() && (
                      <p className="text-teal-100 text-xs">{getManagerPosition()}</p>
                    )}
                    {getManagerDepartment() && (
                      <p className="text-teal-100 text-xs">{getManagerDepartment()}</p>
                    )}
                    {getManagerEmail() && (
                      <p className="text-teal-100 text-xs">{getManagerEmail()}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Information Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Personal Information */}
              <InfoCard title="Personal Information" icon={User} section="personal">
                {editingSection === 'personal' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InfoField
                      label="First Name"
                      value={(editData as PersonalEditData).firstName || ''}
                      editing
                      onChange={(value) => updateEditData('firstName', value)}
                    />
                    <InfoField
                      label="Last Name"
                      value={(editData as PersonalEditData).lastName || ''}
                      editing
                      onChange={(value) => updateEditData('lastName', value)}
                    />
                    <InfoField
                      label="Full Name"
                      value={(editData as PersonalEditData).fullName || ''}
                      editing
                      onChange={(value) => updateEditData('fullName', value)}
                    />
                    <InfoField
                      label="Date of Birth"
                      value={(editData as PersonalEditData).dateOfBirth ? new Date((editData as PersonalEditData).dateOfBirth!).toISOString().split('T')[0] : ''}
                      editing
                      type="date"
                      onChange={(value) => updateEditData('dateOfBirth', value)}
                    />
                    <InfoField
                      label="NIC"
                      value={(editData as PersonalEditData).NIC || ''}
                      editing
                      onChange={(value) => updateEditData('NIC', value)}
                    />
                    <InfoField
                      label="Passport Number"
                      value={(editData as PersonalEditData).passportNumber || ''}
                      editing
                      onChange={(value) => updateEditData('passportNumber', value)}
                    />
                    <InfoField
                      label="Gender"
                      value={(editData as PersonalEditData).gender || ''}
                      editing
                      onChange={(value) => updateEditData('gender', value)}
                    />
                    <InfoField
                      label="Marital Status"
                      value={(editData as PersonalEditData).maritalStatus || ''}
                      editing
                      onChange={(value) => updateEditData('maritalStatus', value)}
                    />
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-600">Nationality</label>
                      <div className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
                        {selectedCountry && (
                          <img 
                            src={getFlagUrl(selectedCountry.cca2)} 
                            alt={`${selectedCountry.name.common} flag`}
                            className="w-6 h-4 object-cover rounded-sm"
                          />
                        )}
                        <span className="text-gray-600">{employee.nationality || "Not specified"}</span>
                      </div>
                    </div>

                    <InfoField
                      label="Blood Group"
                      value={(editData as PersonalEditData).bloodGroup || ''}
                      editing
                      onChange={(value) => updateEditData('bloodGroup', value)}
                    />
                    <InfoField
                      label="Religion"
                      value={(editData as PersonalEditData).religion || ''}
                      editing
                      onChange={(value) => updateEditData('religion', value)}
                    />
                    <div className="md:col-span-2 flex gap-3 pt-4">
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 transition-colors duration-200"
                      >
                        <Save className="w-4 h-4" />
                        {saving ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InfoField label="Full Name" value={employee.fullName || `${employee.firstName} ${employee.lastName}`} />
                    <InfoField label="Date of Birth" value={formatDate(employee.dateOfBirth || '')} />
                    <InfoField label="NIC" value={employee.NIC || ''} />
                    <InfoField label="Passport Number" value={employee.passportNumber || ''} />
                    <InfoField label="Gender" value={employee.gender || ''} />
                    <InfoField label="Marital Status" value={employee.maritalStatus || ''} />
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-600">Nationality</label>
                      <div className="flex items-center gap-2">
                        {selectedCountry && (
                          <img 
                            src={getFlagUrl(selectedCountry.cca2)} 
                            alt={`${selectedCountry.name.common} flag`}
                            className="w-6 h-4 object-cover rounded-sm"
                          />
                        )}
                        <p className="text-gray-900 font-medium">{employee.nationality || 'N/A'}</p>
                      </div>
                    </div>

                    <InfoField label="Blood Group" value={employee.bloodGroup || ''} />
                    <InfoField label="Religion" value={employee.religion || ''} />
                  </div>
                )}
              </InfoCard>

              {/* Contact Information */}
              <InfoCard title="Contact Information" icon={Mail} section="contact">
                {editingSection === 'contact' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InfoField
                      label="Work Email"
                      value={(editData as ContactEditData).workEmail || ''}
                      editing
                      type="email"
                      onChange={(value) => updateEditData('workEmail', value)}
                    />
                    <PhoneField
                      label="Phone Number"
                      value={(editData as ContactEditData).personalPhoneNumber || ''}
                      editing
                      onChange={(value) => updateEditData('personalPhoneNumber', value)}
                    />
                    <PhoneField
                      label="WhatsApp"
                      value={(editData as ContactEditData).whatsappPhoneNumber || ''}
                      editing
                      onChange={(value) => updateEditData('whatsappPhoneNumber', value)}
                    />
                    <div className="md:col-span-2 flex gap-3 pt-4">
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 transition-colors duration-200"
                      >
                        <Save className="w-4 h-4" />
                        {saving ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InfoField label="Work Email" value={employee.workEmail} />
                    <PhoneField label="Phone Number" value={employee.personalPhoneNumber} />
                    <PhoneField label="WhatsApp" value={employee.whatsappPhoneNumber || ''} />
                  </div>
                )}
              </InfoCard>

              {/* Address Information */}
              <InfoCard title="Address Information" icon={MapPin} section="address">
                {editingSection === 'address' ? (
                  <div className="space-y-6">
                    <AddressField
                      label="Current Address"
                      address={(editData as AddressEditData).currentAddress || { addressLine: '', city: '', province: '', postalCode: '', country: '' }}
                      editing
                      prefix="currentAddress"
                      onChange={updateEditData}
                    />
                    <AddressField
                      label="Permanent Address"
                      address={(editData as AddressEditData).permanentAddress || { addressLine: '', city: '', province: '', postalCode: '', country: '' }}
                      editing
                      prefix="permanentAddress"
                      onChange={updateEditData}
                    />
                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 transition-colors duration-200"
                      >
                        <Save className="w-4 h-4" />
                        {saving ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <AddressField
                      label="Current Address"
                      address={employee.currentAddress || { addressLine: '', city: '', province: '', postalCode: '', country: '' }}
                      prefix="currentAddress"
                    />
                    <AddressField
                      label="Permanent Address"
                      address={employee.permanentAddress || { addressLine: '', city: '', province: '', postalCode: '', country: '' }}
                      prefix="permanentAddress"
                    />
                  </div>
                )}
              </InfoCard>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Work Information */}
              <InfoCard title="Work Information" icon={Briefcase} section="work">
                {editingSection === 'work' ? (
                  <div className="grid grid-cols-1 gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InfoField
                        label="Position"
                        value={(editData as WorkEditData).position || ''}
                        editing
                        onChange={(value) => updateEditData('position', value)}
                      />
                      <InfoField
                        label="Department"
                        value={(editData as WorkEditData).department || ''}
                        editing
                        onChange={(value) => updateEditData('department', value)}
                      />
                      <InfoField
                        label="Work Location"
                        value={(editData as WorkEditData).workLocation || ''}
                        editing
                        onChange={(value) => updateEditData('workLocation', value)}
                      />
                      <InfoField
                        label="Employment Type"
                        value={(editData as WorkEditData).employmentType || ''}
                        editing
                        onChange={(value) => updateEditData('employmentType', value)}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-600">Employment Status</label>
                        <select
                          value={(editData as WorkEditData).employmentStatus || ''}
                          onChange={(e) => updateEditData('employmentStatus', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="terminated">Terminated</option>
                        </select>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-600">Basic Salary</label>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            defaultValue={(editData as WorkEditData).basicSalary || ''}
                            onBlur={(e) => updateEditData('basicSalary', e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                updateEditData('basicSalary', (e.target as HTMLInputElement).value);
                                (e.target as HTMLInputElement).blur();
                              }
                            }}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                          />
                          <select
                            value={(editData as WorkEditData).salaryCurrency || ''}
                            onChange={(e) => updateEditData('salaryCurrency', e.target.value)}
                            className="w-24 px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                          >
                            <option value="">Currency</option>
                            {currencies.map((currency) => (
                              <option key={currency.value} value={currency.value}>
                                {currency.value}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <InfoField
                        label="Working Hours"
                        value={(editData as WorkEditData).workingHours || ''}
                        editing
                        onChange={(value) => updateEditData('workingHours', value)}
                      />
                    </div>
                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 transition-colors duration-200"
                      >
                        <Save className="w-4 h-4" />
                        {saving ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InfoField label="Position" value={employee.position} />
                    <InfoField label="Department" value={employee.department} />
                    <InfoField label="Work Location" value={employee.workLocation} />
                    <InfoField label="Employment Type" value={employee.employmentType} />
                    <InfoField label="Employment Status" value={employee.employmentStatus} />
                    <InfoField label="Hire Date" value={formatDate(employee.hireDate)} />
                    <InfoField 
                      label="Basic Salary" 
                      value={employee.basicSalary 
                        ? `${getCurrencySymbol(employee.salaryCurrency)} ${employee.basicSalary.toLocaleString()} ${employee.salaryCurrency || ''}` 
                        : 'N/A'
                      } 
                    />
                    <InfoField label="Working Hours" value={employee.workingHours || ''} />
                  </div>
                )}
              </InfoCard>

              {/* Emergency Contact */}
              <InfoCard title="Emergency Contact" icon={Heart} section="emergency">
                {editingSection === 'emergency' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InfoField
                      label="Contact Name"
                      value={(editData as EmergencyEditData).emergencyContact?.name || ''}
                      editing
                      onChange={(value) => updateEditData('emergencyContact.name', value)}
                    />
                    <PhoneField
                      label="Phone Number"
                      value={(editData as EmergencyEditData).emergencyContact?.phoneNumber || ''}
                      editing
                      onChange={(value) => updateEditData('emergencyContact.phoneNumber', value)}
                    />
                    <InfoField
                      label="Relationship"
                      value={(editData as EmergencyEditData).emergencyContact?.relationship || ''}
                      editing
                      onChange={(value) => updateEditData('emergencyContact.relationship', value)}
                    />
                    <div className="md:col-span-2 flex gap-3 pt-4">
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 transition-colors duration-200"
                      >
                        <Save className="w-4 h-4" />
                        {saving ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InfoField label="Contact Name" value={employee.emergencyContact?.name || ''} />
                    <PhoneField label="Phone Number" value={employee.emergencyContact?.phoneNumber || ''} />
                    <InfoField label="Relationship" value={employee.emergencyContact?.relationship || ''} />
                  </div>
                )}
              </InfoCard>

              {/* Access Credentials */}
              <InfoCard title="Access Credentials" icon={Shield} section="credentials">
                {editingSection === 'credentials' ? (
                  <div className="space-y-6">
                    <InfoField
                      label="Username"
                      value={(editData as CredentialsEditData).username || ''}
                      editing
                      onChange={(value) => updateEditData('username', value)}
                    />

                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-2">Regenerate One-Time Password</h4>
                        <p className="text-sm text-blue-700 mb-4">
                          Generate a new secure one-time password that will be emailed to the employee for their next login.
                        </p>
                        
                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={handleGeneratePassword}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors"
                          >
                            <RefreshCw className="w-4 h-4" />
                            Regenerate Password
                          </button>
                        </div>
                      </div>

                      {generatedPassword && (
                        <div className="p-4 bg-teal-50 border border-teal-200 rounded-lg">
                          <h4 className="font-semibold text-teal-800 mb-3">New One-Time Password Generated:</h4>
                          
                          <div className="space-y-3">
                            <div className="flex items-center justify-center p-3 bg-white border border-teal-300 rounded">
                              <div className="flex items-center gap-2">
                                <div className="flex gap-1">
                                  {Array.from({length: 12}).map((_, index) => (
                                    <div key={index} className="w-2 h-2 bg-teal-600 rounded-full"></div>
                                  ))}
                                </div>
                                <span className="text-sm font-medium text-teal-700 ml-2">••••••••••••</span>
                              </div>
                            </div>

                            <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                              <p className="text-xs text-blue-700 text-center">
                                🔒 New password has been generated securely and will be sent to the employee's email.
                                For security reasons, the password is not displayed here.
                              </p>
                            </div>

                            <div>
                              <div className="flex gap-1 mb-1">
                                {[0, 1, 2, 3, 4].map((index) => (
                                  <div
                                    key={index}
                                    className={`h-1 flex-1 rounded-full transition-colors duration-200 ${
                                      index < passwordStrength
                                        ? strengthColors[passwordStrength - 1]
                                        : "bg-gray-200"
                                    }`}
                                  />
                                ))}
                              </div>
                              <p className={`text-xs text-center ${
                                passwordStrength >= 4
                                  ? "text-emerald-600"
                                  : passwordStrength >= 2
                                  ? "text-yellow-600"
                                  : "text-red-600"
                              }`}>
                                Password strength: {strengthLabels[passwordStrength - 1] || "Very Weak"}
                              </p>
                            </div>

                            <div className="flex gap-3">
                              <button
                                type="button"
                                onClick={handleSendCredentials}
                                disabled={isSending || !generatedPassword}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white 
                                          bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors 
                                          disabled:bg-gray-400 disabled:cursor-not-allowed"
                              >
                                <Send className="w-4 h-4" />
                                {isSending ? "Sending..." : "Send New Password to Employee"}
                              </button>
                              
                              <button
                                type="button"
                                onClick={handleGeneratePassword}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 
                                          bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                              >
                                <RefreshCw className="w-4 h-4" />
                                Regenerate Again
                              </button>
                            </div>
                            
                            <p className="text-xs text-teal-600 text-center">
                              This will email the new credentials to {employee.workEmail}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 transition-colors duration-200"
                      >
                        <Save className="w-4 h-4" />
                        {saving ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InfoField label="Username" value={employee.username} />
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-600">Password Status</label>
                        <div className="flex items-center gap-3">
                          <p className="text-gray-900 font-medium tracking-wider">••••••••••••</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Password Change Required</p>
                          <p className="text-xs text-gray-500">Employee must change password on next login</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${employee.forcePasswordChange ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                          <span className={`text-sm font-medium ${employee.forcePasswordChange ? 'text-yellow-700' : 'text-green-700'}`}>
                            {employee.forcePasswordChange ? 'Required' : 'Not Required'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-700">
                        <strong>💡 Password Management:</strong><br/>
                        Click Edit to regenerate a new one-time password and send it to the employee's email. 
                        This will automatically require them to change their password on next login.
                      </p>
                    </div>
                  </div>
                )}
              </InfoCard>

              {/* Biometric Information */}
              <InfoCard title="Biometric Information" icon={Fingerprint} section="biometric" editable={false}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">Fingerprint Status</label>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${employee.biometrics?.fingerprint ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <p className="text-gray-900 font-medium">
                        {employee.biometrics?.fingerprint ? 'Enrolled' : 'Not Enrolled'}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">Face ID Status</label>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${employee.biometrics?.faceId ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <p className="text-gray-900 font-medium">
                        {employee.biometrics?.faceId ? 'Enrolled' : 'Not Enrolled'}
                      </p>
                    </div>
                  </div>
                </div>
              </InfoCard>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 opacity-100 bg-teal-100/50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-auto shadow-2xl transform transition-transform duration-300 scale-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Delete Employee</h3>
                <p className="text-sm text-gray-600">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <span className="font-semibold">{employee.firstName} {employee.lastName}</span>? 
              This will permanently remove all their data from the system.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                Delete Employee
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDetailPage;