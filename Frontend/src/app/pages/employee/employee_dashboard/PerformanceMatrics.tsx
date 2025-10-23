"use client";

import React from 'react';
import { TrendingUp, Clock, AlertCircle } from 'lucide-react';

const PerformanceMetrics: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-800">Performance Metrics</h2>
      </div>

      <div className="space-y-6">
        {/* Date Range and Type Section */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date range</label>
            <div className="relative">
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none">
                <option>Fresh</option>
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type:</label>
            <p className="text-sm text-gray-600">Daily, Weekly, Monthly, Custom</p>
          </div>
        </div>

        {/* Date Inputs */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
            <div className="relative">
              <input
                type="text"
                placeholder="MM/DD/YYYY"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
            <div className="relative">
              <input
                type="text"
                placeholder="MM/DD/YYYY"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Select Option */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Metrics Type</label>
          <div className="relative">
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none">
              <option>Select an option</option>
              <option>Attendance Rate</option>
              <option>Punctuality</option>
              <option>Productivity</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          {/* Lateness Card */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span className="text-sm font-medium text-red-700">Lateness</span>
              </div>
              <span className="text-lg font-bold text-red-700">2%</span>
            </div>
            <div className="w-full bg-red-200 rounded-full h-2">
              <div className="bg-red-600 h-2 rounded-full" style={{ width: '2%' }}></div>
            </div>
          </div>

          {/* Overtime Card */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">Overtime</span>
              </div>
              <span className="text-lg font-bold text-blue-700">5%</span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '5%' }}></div>
            </div>
          </div>
        </div>

        {/* Attendance Trend */}
        <div className="bg-gradient-to-r from-blue-50 to-teal-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Attendance Trend</span>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-blue-700">95%</div>
              <div className="text-xs text-blue-600">Last 30 Days</div>
            </div>
          </div>

          {/* Main Attendance Rate */}
          <div className="text-center mb-4">
            <div className="text-2xl font-bold text-gray-800 mb-1">95% Attendance Rate</div>
            <div className="text-sm text-gray-600">Overall performance</div>
          </div>

          {/* Week Days */}
          <div className="flex justify-between items-end space-x-1">
            {[
              { day: '01', value: 85 },
              { day: '02', value: 90 },
              { day: '03', value: 88 },
              { day: '04', value: 95 },
              { day: '05', value: 92 },
              { day: '06', value: 98 },
              { day: '07', value: 95 }
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center space-y-2 flex-1">
                <div 
                  className="w-full bg-blue-200 rounded-t-lg transition-all duration-300 hover:bg-blue-300"
                  style={{ height: `${item.value * 0.4}px` }}
                ></div>
                <span className="text-xs text-gray-600 font-medium">{item.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetrics;