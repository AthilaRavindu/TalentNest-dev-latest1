import { DashboardCard } from "../components/DashboardCard";

const orgStats = [
  {
    label: "Departments",
    value: "12",
    icon: "🏢",
  },
  {
    label: "Teams",
    value: "48",
    icon: "👥",
  },
  {
    label: "Locations",
    value: "8",
    icon: "📍",
  },
  {
    label: "Projects",
    value: "156",
    icon: "📊",
  },
];

export const OrganizationSummary = () => {
  return (
    <DashboardCard title="Organization Summary">
      <div className="grid grid-cols-2 gap-4">
        {orgStats.map((stat, index) => (
          <div
            key={stat.label}
            className="text-center p-4 bg-white rounded-lg border border-gray-200 shadow-md hover:shadow-lg group-data-[selected=true]:shadow-green-500/20 group-data-[selected=true]:hover:shadow-green-400/30 group-data-[selected=true]:border-green-200 transition-shadow duration-200"
          >
            <div className="text-2xl mb-2 text-black">{stat.icon}</div>
            <div className="text-2xl font-bold text-black">{stat.value}</div>
            <div className="text-sm text-black break-words whitespace-pre-line">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
};
