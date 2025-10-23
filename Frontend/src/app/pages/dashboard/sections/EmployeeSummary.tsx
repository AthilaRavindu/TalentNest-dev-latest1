"use client";

import { DashboardCard } from "../components/DashboardCard";
import { useState, useEffect } from "react";

interface EmployeeStat {
  label: string;
  value: string;
  change: string;
  color: string;
}

interface User {
  _id: string;
  employmentStatus: 'active' | 'inactive' | 'terminated';
  hireDate?: string;
  firstName: string;
  lastName: string;
}

interface EmployeeData {
  totalEmployees: number;
  activeEmployees: number;
  newHires: number;
  previousMonth?: {
    totalEmployees: number;
    activeEmployees: number;
    newHires: number;
  };
}

export const EmployeeSummary = () => {
  const [employeeData, setEmployeeData] = useState<EmployeeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployeeData = async () => {
    try {
      setLoading(true);
      setError(null); // Clear any previous errors
      
      // Try to fetch data with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      // Extract users array from the response
      let users: User[];
      if (Array.isArray(result)) {
        // Direct array response
        users = result;
      } else if (result.success && Array.isArray(result.data)) {
        // Wrapped response with success flag
        users = result.data;
      } else {
        console.error('Received data:', result);
        throw new Error('Invalid response format: Expected array of users');
      }
      
      // Calculate stats from the user data
      const totalEmployees = users.length;
      const activeEmployees = users.filter((user: User) => 
        user.employmentStatus === 'active'
      ).length;
      
      // Calculate new hires (hired in the last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const newHires = users.filter((user: User) => 
        user.hireDate && new Date(user.hireDate) >= thirtyDaysAgo
      ).length;

      setEmployeeData({
        totalEmployees,
        activeEmployees,
        newHires,
      });
      
    } catch (err) {
      console.error('Error fetching employee data:', err);
      
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          setError('Request timed out. Please try again.');
        } else if (err.message.includes('Failed to fetch')) {
          setError('Cannot connect to server. Please check if the backend is running.');
        } else {
          setError(err.message);
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployeeData();
  }, []);

  // Calculate percentage changes (mock for now - you can implement actual historical comparison)
  const calculateChange = (current: number, label: string): string => {
    // For demo purposes, using mock percentage changes
    // In a real application, you'd compare with historical data
    switch (label) {
      case 'Total Employees':
        return '+12%';
      case 'Active Employees':
        return '+8%';
      case 'New Hires':
        return '+15%';
      default:
        return '0%';
    }
  };

  const employeeStats: EmployeeStat[] = employeeData ? [
    {
      label: "Total Employees",
      value: employeeData.totalEmployees.toString(),
      change: calculateChange(employeeData.totalEmployees, 'Total Employees'),
      color: "#009688",
    },
    {
      label: "Active Employees",
      value: employeeData.activeEmployees.toString(),
      change: calculateChange(employeeData.activeEmployees, 'Active Employees'),
      color: "#00796b",
    },
    {
      label: "New Hires",
      value: employeeData.newHires.toString(),
      change: calculateChange(employeeData.newHires, 'New Hires'),
      color: "#19706c",
    },
  ] : [];

  if (loading) {
    return (
      <DashboardCard title="Employee Summary">
        <div className="space-y-4">
          {[1, 2, 3].map((index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 animate-pulse"
            >
              <div>
                <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
                <div className="h-6 bg-gray-300 rounded w-16"></div>
              </div>
              <div className="text-right">
                <div className="h-4 bg-gray-300 rounded w-12 mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-20"></div>
              </div>
            </div>
          ))}
        </div>
      </DashboardCard>
    );
  }

  const retryFetch = () => {
    setError(null);
    setLoading(true);
    fetchEmployeeData();
  };

  if (error) {
    return (
      <DashboardCard title="Employee Summary">
        <div className="text-center py-8">
          <div className="text-red-500 text-sm mb-4">⚠️ {error}</div>
          <button 
            onClick={retryFetch}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 text-sm"
          >
            {loading ? 'Retrying...' : 'Try Again'}
          </button>
        </div>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard title="Employee Summary">
      <div className="space-y-4">
        {employeeStats.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 shadow-md hover:shadow-lg group-data-[selected=true]:from-green-50 group-data-[selected=true]:to-emerald-100 group-data-[selected=true]:shadow-green-500/20 group-data-[selected=true]:hover:shadow-green-400/30 transition-shadow duration-200"
          >
            <div>
              <div className="text-sm text-black font-medium">{stat.label}</div>
              <div className="text-2xl font-bold text-black">{stat.value}</div>
            </div>
            <div className="text-right">
              <div
                className="text-sm font-semibold"
                style={{ color: stat.color }}
              >
                {stat.change}
              </div>
              <div className="text-xs text-black">vs last month</div>
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
};