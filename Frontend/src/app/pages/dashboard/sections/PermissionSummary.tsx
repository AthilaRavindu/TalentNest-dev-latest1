import { ChevronDown } from "lucide-react";
import { DashboardCard } from "../components/DashboardCard";

const permissionData = [
  {
    role: "CEO",
    permissions: 25,
    users: 1,
  },
  {
    role: "Manager",
    permissions: 18,
    users: 12,
  },
  {
    role: "Employee",
    permissions: 12,
    users: 156,
  },
  {
    role: "Intern",
    permissions: 8,
    users: 45,
  },
];

export const PermissionSummary = () => {
  return (
    <DashboardCard title="Permission Summary">
      <div className="space-y-4">
        {permissionData.map((item, index) => (
          <div
            key={item.role}
            className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 shadow-md hover:shadow-lg group-data-[selected=true]:shadow-green-500/20 group-data-[selected=true]:hover:shadow-green-400/30 group-data-[selected=true]:border-green-200 transition-shadow duration-200"
          >
            <div>
              <div className="text-sm font-medium text-black">{item.role}</div>
              <div className="text-xs text-black">
                {item.permissions} permissions
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-black">
                {item.users}
              </div>
              <div className="text-xs text-black">users</div>
            </div>
          </div>
        ))}
        <div className="flex items-center justify-between pt-2">
          <span className="text-sm font-medium text-black">System Admin</span>
          <button className="flex items-center gap-1 px-3 py-1 text-sm text-black border border-border rounded hover:bg-accent transition-colors">
            Update
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>
    </DashboardCard>
  );
};
