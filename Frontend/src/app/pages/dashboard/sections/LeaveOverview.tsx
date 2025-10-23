import { DashboardCard } from "../components/DashboardCard";

const leaveData = [
  { type: "Sick Leave", count: 54, total: 100 },
  { type: "Permanent Leave", count: 35, total: 100 },
];

export const LeaveOverview = () => {
  return (
    <DashboardCard title="Leave Overview">
      <div className="space-y-6">
        {leaveData.map((leave) => (
          <div
            key={leave.type}
            className="space-y-2 p-4 bg-white rounded-lg shadow-md hover:shadow-lg group-data-[selected=true]:shadow-green-500/20 group-data-[selected=true]:hover:shadow-green-400/30 group-data-[selected=true]:bg-green-50 transition-shadow duration-200"
          >
            <div className="text-sm font-medium text-black">{leave.type}</div>
            <div className="relative w-full">
              <div className="w-full bg-gray-200 rounded-full h-2 shadow-inner" />
              <div
                className="absolute left-0 top-0 h-2 rounded-full bg-teal-500 shadow-sm"
                style={{ width: `${(leave.count / leave.total) * 100}%` }}
              />
              <div className="absolute -right-2 -top-3 px-2 py-0.5 rounded-full bg-teal-600 text-white text-xs font-semibold shadow-md group-data-[selected=true]:shadow-green-500/30 group-data-[selected=true]:bg-green-600">
                {leave.count}
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
};
