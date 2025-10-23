"use client";

import { useState, useMemo, useEffect } from "react";
import { ArrowLeft, ArrowRight, Search, X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Dropdown } from "./ui/dropdown";
import employeeAvatars from "../assets/employee-avatars.jpg";
import { StaticImageData } from "next/image";
import SummaryApi from "@/app/common/apis";
import { toast } from "react-toastify";

interface Employee {
  id: string;
  name: string;
  department: string;
  role: string;
  permissions: string;
  leaveBalance: number;
  leavePolicy?: string;
  systemRole: string;
  avatar: StaticImageData | string;
  email?: string;
  createdAt?: string;
}

const ITEMS_PER_PAGE = 8;

export default function EmployeeTable() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAllUsers = async () => {
    setIsLoading(true);
    try {
      console.log("🔄 Fetching users from:", SummaryApi.allUser.url);
      
      const res = await fetch(SummaryApi.allUser.url, {
        method: SummaryApi.allUser.method,
        credentials: "include",
      });

      console.log("📡 Response status:", res.status);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const response = await res.json();
      console.log("📦 API Response:", response);

      // ✅ Fix: Check for response.data array (not just response as array)
      if (response.success && Array.isArray(response.data)) {
        const users = response.data.map((user: any) => ({
          id: user._id,
          name: user.fullName || "Unknown User",
          department: user.department || "Not Assigned",
          role: user.role || "Employee",
          permissions: user.permissions || "Employee Permission",
          leaveBalance: user.leaveBalance || 0,
          leavePolicy: user.leavePolicy || "",
          systemRole: user.systemRole || "Employee",
          avatar: user.avatar || employeeAvatars,
          email: user.workEmail || user.personalEmail || "",
          createdAt: user.createdAt,
        }));

        console.log("✅ Loaded users:", users.length);
        setEmployees(users);
        
        if (users.length === 0) {
          toast.info("No users found in the database");
        }
      } else if (Array.isArray(response)) {
        // ✅ Fallback: Handle if API returns array directly
        const users = response.map((user: any) => ({
          id: user._id,
          name: user.fullName || "Unknown User",
          department: user.department || "Not Assigned",
          role: user.role || "Employee",
          permissions: user.permissions || "Employee Permission",
          leaveBalance: user.leaveBalance || 0,
          leavePolicy: user.leavePolicy || "",
          systemRole: user.systemRole || "Employee",
          avatar: user.avatar || employeeAvatars,
          email: user.workEmail || user.personalEmail || "",
          createdAt: user.createdAt,
        }));

        console.log("✅ Loaded users (direct array):", users.length);
        setEmployees(users);
      } else {
        console.error("❌ Unexpected API response format:", response);
        toast.error(response.error || "Failed to fetch users - unexpected format");
      }
    } catch (err) {
      console.error("❌ Error fetching user data:", err);
      toast.error("Error fetching user data. Please check console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const departments = Array.from(
    new Set(employees.map((emp) => emp.department))
  );
  const roles = Array.from(new Set(employees.map((emp) => emp.role)));

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const matchesSearch = employee.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesDepartment =
        selectedDepartment === "all" ||
        employee.department === selectedDepartment;
      const matchesRole =
        selectedRole === "all" || employee.role === selectedRole;
      return matchesSearch && matchesDepartment && matchesRole;
    });
  }, [employees, searchTerm, selectedDepartment, selectedRole]);

  const totalPages = Math.ceil(filteredEmployees.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedEmployees = filteredEmployees.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handleSelectEmployee = (employeeId: string) => {
    setSelectedEmployees((prev) =>
      prev.includes(employeeId)
        ? prev.filter((id) => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const handleSelectAll = () => {
    if (selectedEmployees.length === paginatedEmployees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(paginatedEmployees.map((emp) => emp.id));
    }
  };

  // Assign Role Function
  const assignRole = async (role: string) => {
    if (!role || selectedEmployees.length === 0) {
      toast.warning("Please select employees and a role");
      return;
    }

    setIsUpdating(true);
    try {
      console.log("🔄 Assigning role:", role, "to users:", selectedEmployees);

      const res = await fetch(SummaryApi.assignRole.url, {
        method: SummaryApi.assignRole.method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userIds: selectedEmployees,
          role: role,
        }),
      });

      const data = await res.json();
      console.log("📦 Assign role response:", data);

      if (res.ok) {
        toast.success(data.message || `Role "${role}" assigned successfully`);
        await fetchAllUsers();
        setSelectedEmployees([]);
      } else {
        toast.error(data.error || "Failed to assign role");
      }
    } catch (err) {
      console.error("❌ Error assigning role:", err);
      toast.error("Error assigning role");
    } finally {
      setIsUpdating(false);
    }
  };

  // Assign Permissions Function
  const assignPermissions = async (permissions: string) => {
    if (!permissions || selectedEmployees.length === 0) {
      toast.warning("Please select employees and permissions");
      return;
    }

    setIsUpdating(true);
    try {
      console.log("🔄 Assigning permissions:", permissions);

      const res = await fetch(SummaryApi.assignPermissions.url, {
        method: SummaryApi.assignPermissions.method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userIds: selectedEmployees,
          permissions: permissions,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(
          data.message || `Permissions "${permissions}" assigned successfully`
        );
        await fetchAllUsers();
        setSelectedEmployees([]);
      } else {
        toast.error(data.error || "Failed to assign permissions");
      }
    } catch (err) {
      console.error("❌ Error assigning permissions:", err);
      toast.error("Error assigning permissions");
    } finally {
      setIsUpdating(false);
    }
  };

  // Assign Leave Policy Function
  const assignLeaves = async (leavePolicy: string) => {
    if (!leavePolicy || selectedEmployees.length === 0) {
      toast.warning("Please select employees and a leave policy");
      return;
    }

    setIsUpdating(true);
    try {
      console.log("🔄 Assigning leave policy:", leavePolicy);

      const res = await fetch(SummaryApi.assignLeavePolicy.url, {
        method: SummaryApi.assignLeavePolicy.method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userIds: selectedEmployees,
          leavePolicy: leavePolicy,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(
          data.message || `Leave policy "${leavePolicy}" assigned successfully`
        );
        await fetchAllUsers();
        setSelectedEmployees([]);
      } else {
        toast.error(data.error || "Failed to assign leave policy");
      }
    } catch (err) {
      console.error("❌ Error assigning leave policy:", err);
      toast.error("Error assigning leave policy");
    } finally {
      setIsUpdating(false);
    }
  };

  // Assign System Role Function
  const assignSystemRole = async (systemRole: string) => {
    if (!systemRole || selectedEmployees.length === 0) {
      toast.warning("Please select employees and a system role");
      return;
    }

    setIsUpdating(true);
    try {
      console.log("🔄 Assigning system role:", systemRole);

      const res = await fetch(SummaryApi.assignSystemRole.url, {
        method: SummaryApi.assignSystemRole.method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userIds: selectedEmployees,
          systemRole: systemRole,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(
          data.message || `System role "${systemRole}" assigned successfully`
        );
        await fetchAllUsers();
        setSelectedEmployees([]);
      } else {
        toast.error(data.error || "Failed to assign system role");
      }
    } catch (err) {
      console.error("❌ Error assigning system role:", err);
      toast.error("Error assigning system role");
    } finally {
      setIsUpdating(false);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedDepartment("all");
    setSelectedRole("all");
    setCurrentPage(1);
  };

  // ✅ Loading State
  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto p-6 bg-background">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-foreground">Loading employees...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-background">
      {/* Header Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Filter Employee
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

          {(searchTerm ||
            selectedDepartment !== "all" ||
            selectedRole !== "all") && (
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          )}
        </div>

        {/* Selection Info and Action Buttons */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          {selectedEmployees.length > 0 && (
            <div className="px-6 py-3 bg-background rounded-full shadow-lg shadow-gray-300 flex items-center justify-center">
              <span className="text-sm text-foreground font-bold">
                {selectedEmployees.length} Employee
                {selectedEmployees.length !== 1 ? "s" : ""} Selected
              </span>
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            <Dropdown
              items={[
                { value: "CEO", label: "CEO" },
                { value: "COO", label: "COO" },
                { value: "Manager", label: "Manager" },
                { value: "Employee", label: "Employee" },
              ]}
              placeholder="Assign Role"
              onChange={assignRole}
              disabled={isUpdating}
              className="w-44 appearance-none bg-card rounded-xl border-none !border-0 !border-transparent hover:border-transparent !outline-none transition-shadow shadow-[0_8px_24px_rgba(0,0,0,0.25)]"
            />
            <Dropdown
              items={[
                { value: "CEO Permission", label: "CEO Permission" },
                { value: "COO Permission", label: "COO Permission" },
                { value: "Manager Permission", label: "Manager Permission" },
                { value: "Employee Permission", label: "Employee Permission" },
              ]}
              placeholder="Assign Permission"
              onChange={assignPermissions}
              disabled={isUpdating}
              className="w-56 appearance-none bg-card rounded-xl border-none !border-0 !border-transparent hover:border-transparent !outline-none transition-shadow shadow-[0_8px_24px_rgba(0,0,0,0.25)]"
            />
            <Dropdown
              items={[
                { value: "CEO Leaves", label: "CEO Leaves" },
                { value: "COO Leaves", label: "COO Leaves" },
                { value: "Manager Leaves", label: "Manager Leaves" },
                { value: "Employee Leaves", label: "Employee Leaves" },
                { value: "Sick Leaves", label: "Sick Leaves" },
              ]}
              placeholder="Assign Leaves"
              onChange={assignLeaves}
              disabled={isUpdating}
              className="w-56 appearance-none bg-card rounded-xl border-none !border-0 !border-transparent hover:border-transparent !outline-none transition-shadow shadow-[0_8px_24px_rgba(0,0,0,0.25)]"
            />
            <Dropdown
              items={[
                { value: "Manager", label: "Manager" },
                { value: "Employee", label: "Employee" },
              ]}
              placeholder="Assign System Role"
              onChange={assignSystemRole}
              disabled={isUpdating}
              className="w-56 appearance-none bg-card rounded-xl border-none !border-0 !border-transparent hover:border-transparent !outline-none transition-shadow shadow-[0_8px_24px_rgba(0,0,0,0.25)]"
            />
          </div>
        </div>
      </div>

      {/* ✅ Empty State */}
      {employees.length === 0 ? (
        <div className="border border-primary/30 rounded-lg bg-card p-12">
          <div className="text-center">
            <p className="text-xl text-foreground mb-2">No employees found</p>
            <p className="text-sm text-muted-foreground">
              Add employees to see them here
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="border border-primary/30 rounded-lg overflow-hidden bg-card">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#E0F2F1] border-b border-primary/30">
                  <tr>
                    <th className="p-4 text-left">
                      <Checkbox
                        checked={
                          paginatedEmployees.length === 0
                            ? false
                            : paginatedEmployees.every((emp) =>
                                selectedEmployees.includes(emp.id)
                              )
                            ? true
                            : paginatedEmployees.some((emp) =>
                                selectedEmployees.includes(emp.id)
                              )
                            ? "indeterminate"
                            : false
                        }
                        onCheckedChange={handleSelectAll}
                      />
                    </th>
                    <th className="p-4 text-left text-sm font-medium text-foreground uppercase tracking-wider">
                      NAME
                    </th>
                    <th className="p-4 text-left text-sm font-medium text-foreground uppercase tracking-wider">
                      DEPARTMENT
                    </th>
                    <th className="p-4 text-left text-sm font-medium text-foreground uppercase tracking-wider">
                      ROLE
                    </th>
                    <th className="p-4 text-left text-sm font-medium text-foreground uppercase tracking-wider">
                      PERMISSIONS
                    </th>
                    <th className="p-4 text-left text-sm font-medium text-foreground uppercase tracking-wider">
                      LEAVE BALANCE
                    </th>
                    <th className="p-4 text-left text-sm font-medium text-foreground uppercase tracking-wider">
                      SYSTEM ROLE
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedEmployees.map((employee) => (
                    <tr
                      key={employee.id}
                      className="border-b border-primary/20 hover:bg-primary/5 transition-colors"
                    >
                      <td className="p-4">
                        <Checkbox
                          checked={selectedEmployees.includes(employee.id)}
                          onCheckedChange={() =>
                            handleSelectEmployee(employee.id)
                          }
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={
                                typeof employee.avatar === "string"
                                  ? employee.avatar
                                  : employee.avatar.src
                              }
                              alt={employee.name}
                            />
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              {employee.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-foreground">
                            {employee.name}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-foreground">
                        {employee.department}
                      </td>
                      <td className="p-4 text-foreground">{employee.role}</td>
                      <td className="p-4 text-foreground">
                        {employee.permissions}
                      </td>
                      <td className="p-4 text-foreground">
                        {employee.leaveBalance}
                        {employee.leavePolicy
                          ? ` (${employee.leavePolicy})`
                          : ""}
                      </td>
                      <td className="p-4 text-foreground">
                        {employee.systemRole}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
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
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      variant={page === currentPage ? "default" : "outline"}
                      onClick={() => setCurrentPage(page)}
                      className="w-10 h-10"
                    >
                      {page}
                    </Button>
                  )
                )}
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
        </>
      )}
    </div>
  );
}