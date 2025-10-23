"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ArrowLeft, ArrowRight, Search, X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface EmployeeApi {
  _id: string;
  firstName: string;
  lastName: string;
  userId: string;
  username: string;
  workEmail: string;
  personalEmail: string;
  personalPhoneNumber: string;
  department: string;
  position: string;
  workLocation: string;
  employmentType: string;
  employmentStatus: string;
  hireDate: string;
}

// Define the expected API response structure
interface ApiResponse {
  success?: boolean;
  data?: EmployeeApi[];
  users?: EmployeeApi[];
  message?: string;
}

const ITEMS_PER_PAGE = 8;

export default function ProfileDetails() {
  const router = useRouter();
  const [employees, setEmployees] = useState<EmployeeApi[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedRole, setSelectedRole] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<ApiResponse>("http://localhost:5000/api/users/");
      
      console.log("API Response:", response.data); // Debug log
      
      // Handle different API response structures
      let employeesData: EmployeeApi[] = [];
      
      if (Array.isArray(response.data)) {
        // If response is directly an array
        employeesData = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        // If response has { data: [] } structure
        employeesData = response.data.data;
      } else if (response.data?.users && Array.isArray(response.data.users)) {
        // If response has { users: [] } structure
        employeesData = response.data.users;
      } else if (response.data?.success && Array.isArray(response.data.data)) {
        // If response has { success: true, data: [] } structure
        employeesData = response.data.data;
      } else {
        console.warn("Unexpected API response structure:", response.data);
        setError("Unexpected data format received from server");
      }
      
      console.log("Processed employees data:", employeesData); // Debug log
      setEmployees(employeesData || []);
      
    } catch (err) {
      console.error("Error fetching employees:", err);
      setError("Failed to fetch employees. Please try again later.");
      setEmployees([]); // Ensure it's always an array
    } finally {
      setLoading(false);
    }
  };

  // Safe extraction of unique departments and positions
  const departments = useMemo(() => {
    if (!Array.isArray(employees)) {
      console.warn("Employees is not an array:", employees);
      return ["N/A"];
    }
    
    const uniqueDepts = [
      ...new Set(employees
        .map((emp) => emp?.department)
        .filter(Boolean)
        .filter((dept): dept is string => typeof dept === 'string')
      ),
    ];
    return uniqueDepts.length > 0 ? uniqueDepts : ["N/A"];
  }, [employees]);

  const roles = useMemo(() => {
    if (!Array.isArray(employees)) {
      return ["N/A"];
    }
    
    const uniqueRoles = [
      ...new Set(employees
        .map((emp) => emp?.position)
        .filter(Boolean)
        .filter((role): role is string => typeof role === 'string')
      ),
    ];
    return uniqueRoles.length > 0 ? uniqueRoles : ["N/A"];
  }, [employees]);

  const filteredEmployees = useMemo(() => {
    if (!Array.isArray(employees)) {
      return [];
    }
    
    return employees.filter((employee) => {
      if (!employee) return false;
      
      const name = `${employee.firstName || ''} ${employee.lastName || ''}`.toLowerCase();
      const matchesSearch = name.includes(searchTerm.toLowerCase());
      const matchesDepartment =
        selectedDepartment === "all" || employee.department === selectedDepartment;
      const matchesRole =
        selectedRole === "all" || employee.position === selectedRole;
      return matchesSearch && matchesDepartment && matchesRole;
    });
  }, [employees, searchTerm, selectedDepartment, selectedRole]);

  const totalPages = Math.ceil(filteredEmployees.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedEmployees = filteredEmployees.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedDepartment("all");
    setSelectedRole("all");
    setCurrentPage(1);
  };

  const handleRowClick = (employeeId: string) => {
    router.push(`/pages/employeeManagement/employeeDetails/${employeeId}`);
  };

  const handleKeyDown = (event: React.KeyboardEvent, employeeId: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleRowClick(employeeId);
    }
  };

  // Add retry function
  const handleRetry = () => {
    fetchEmployees();
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-background">
      {/* Header Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Filter Employees
        </h2>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-foreground" />
            <Input
              placeholder="Search by Employee name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 appearance-none bg-card rounded-xl !border-0 hover:border-transparent !outline-none focus:!outline-none focus:!ring-0 focus:!ring-offset-0 focus-visible:!outline-none focus-visible:!ring-0 focus-visible:!ring-offset-0 transition-shadow shadow-[0_8px_24px_rgba(0,0,0,0.25)]"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-3 text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <Select
            value={selectedDepartment}
            onValueChange={setSelectedDepartment}
          >
            <SelectTrigger className="w-full md:w-48 appearance-none bg-card rounded-xl !border-0 hover:border-transparent !outline-none focus:!outline-none focus:!ring-0 focus:!ring-offset-0 focus-visible:!outline-none focus-visible:!ring-0 focus-visible:!ring-offset-0 transition-shadow shadow-[0_8px_24px_rgba(0,0,0,0.25)]">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger className="w-full md:w-48 appearance-none bg-card rounded-xl !border-0 hover:border-transparent !outline-none focus:!outline-none focus:!ring-0 focus:!ring-offset-0 focus-visible:!outline-none focus-visible:!ring-0 focus-visible:!ring-offset-0 transition-shadow shadow-[0_8px_24px_rgba(0,0,0,0.25)]">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {roles.map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {(searchTerm || selectedDepartment !== "all" || selectedRole !== "all") && (
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Error State with Retry */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-800 font-medium">{error}</p>
              <p className="text-red-600 text-sm mt-1">
                Please check your API endpoint and try again.
              </p>
            </div>
            <Button variant="outline" onClick={handleRetry} className="border-red-300 text-red-700">
              Retry
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="border border-primary/30 rounded-lg overflow-hidden bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#E0F2F1] border-b border-primary/30">
              <tr>
                <th className="p-4 text-left text-sm font-medium text-foreground uppercase tracking-wider">
                  NAME
                </th>
                <th className="p-4 text-left text-sm font-medium text-foreground uppercase tracking-wider">
                  DEPARTMENT
                </th>
                <th className="p-4 text-left text-sm font-medium text-foreground uppercase tracking-wider">
                  POSITION
                </th>
                <th className="p-4 text-left text-sm font-medium text-foreground uppercase tracking-wider">
                  EMAIL
                </th>
                <th className="p-4 text-left text-sm font-medium text-foreground uppercase tracking-wider">
                  STATUS
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    Loading employees...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-red-500">
                    {error}
                  </td>
                </tr>
              ) : paginatedEmployees.length > 0 ? (
                paginatedEmployees.map((employee) => (
                  <tr
                    key={employee._id}
                    className="border-b border-primary/20 hover:bg-primary/5 transition-colors cursor-pointer"
                    onClick={() => handleRowClick(employee._id)}
                    onKeyDown={(e) => handleKeyDown(e, employee._id)}
                    tabIndex={0}
                    role="button"
                    aria-label={`View details for ${employee.firstName} ${employee.lastName}`}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {employee.firstName?.[0] || ""}
                            {employee.lastName?.[0] || ""}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-foreground">
                          {employee.firstName} {employee.lastName}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-foreground">{employee.department || "N/A"}</td>
                    <td className="p-4 text-foreground">{employee.position || "N/A"}</td>
                    <td className="p-4 text-foreground">{employee.workEmail}</td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          employee.employmentStatus === "active"
                            ? "bg-green-100 text-green-800"
                            : employee.employmentStatus === "inactive"
                            ? "bg-gray-100 text-gray-600"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {employee.employmentStatus || "Unknown"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    {employees.length === 0 
                      ? "No employees found in the system."
                      : "No employees match your current filters."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {filteredEmployees.length > ITEMS_PER_PAGE && (
        <div className="flex items-center justify-between mt-6">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="border-border rounded-xl text-foreground shadow-lg"
          >
            <ArrowLeft />
            Previous
          </Button>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                onClick={() => setCurrentPage(page)}
                className="w-10 h-10"
              >
                {page}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages}
            className="border-border rounded-xl text-foreground shadow-lg"
          >
            Next
            <ArrowRight />
          </Button>
        </div>
      )}
    </div>
  );
}