import React from "react";
import { EmployeeSummary } from "./sections/EmployeeSummary";
import { OrganizationSummary } from "./sections/OrganizationSummary";
import { LeaveOverview } from "./sections/LeaveOverview";
import { PermissionSummary } from "./sections/PermissionSummary";
import { RoleSummary } from "./sections/RoleSummary";

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-background">
      <div className="bg-background/80 backdrop-blur-sm p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">
            <span className="bg-gradient-to-r from-green-500 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
              HR Analytics Dashboard
            </span>
          </h1>

          <div className="space-y-8">
            {/* First row - Organization Summary spans 2 columns, Role Summary spans 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <RoleSummary />
              </div>
              <div className="lg:col-span-1">
                <OrganizationSummary />
              </div>
            </div>

            {/* Second row - Three equal columns */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <LeaveOverview />
              </div>
              <div className="lg:col-span-1">
                <PermissionSummary />
              </div>
              <div className="lg:col-span-1">
                <EmployeeSummary />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
