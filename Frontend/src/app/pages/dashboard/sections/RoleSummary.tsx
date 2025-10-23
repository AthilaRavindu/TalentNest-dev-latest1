"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { DashboardCard } from "../components/DashboardCard";

const data = [
  { name: "Software", value: 30, count: 540 },
  { name: "Human Resource", value: 15, count: 270 },
  { name: "Product", value: 25, count: 450 },
  { name: "Quality Assurance", value: 20, count: 360 },
  { name: "Others", value: 10, count: 180 },
];

const COLORS = [
  "hsl(var(--dashboard-purple))",
  "hsl(var(--dashboard-blue))",
  "hsl(var(--dashboard-pink))",
  "hsl(var(--dashboard-orange))",
  "hsl(var(--dashboard-teal))",
];

export const RoleSummary = () => {
  const totalEmployees = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <DashboardCard title="Role Summary">
      <div className="grid grid-cols-2 gap-4 items-center">
        {/* Legend */}
        <div className="space-y-2">
          {data.map((item, index) => (
            <div key={item.name} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[index] }}
              />
              <span className="text-sm text-black flex items-center gap-1">
                {item.name}
                <span className="inline-block px-2 py-0.5 rounded-full text-white font-bold text-xs shadow-sm ml-1" style={{ backgroundColor: '#00796b' }}>
                  {item.value}%
                </span>
              </span>
            </div>
          ))}
        </div>

        {/* Donut Chart */}
        <div className="relative w-48 h-48 justify-self-end">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-black">
                {totalEmployees}
              </div>
              <div className="text-sm text-black">Total Employees</div>
            </div>
          </div>
        </div>
      </div>
    </DashboardCard>
  );
};
