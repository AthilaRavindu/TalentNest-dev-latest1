import { ReactNode } from "react";
import { ChevronRight } from "lucide-react";

interface DashboardCardProps {
  title: string;
  children?: ReactNode;
  showViewButton?: boolean;
  isSelected?: boolean;
  className?: string;
}

export const DashboardCard = ({
  title,
  children,
  showViewButton = true,
  isSelected = false,
  className = "",
}: DashboardCardProps) => {
  return (
    <div
      className={`relative bg-card rounded-2xl p-6 transition-all duration-300 border border-gray-200/50 transform hover:-translate-y-1 group ${
        isSelected
          ? "shadow-2xl shadow-green-500/30 hover:shadow-green-400/40 hover:shadow-2xl"
          : "shadow-2xl hover:shadow-black/25 hover:shadow-2xl"
      } ${className}`}
      data-selected={isSelected}
    >
      {/* Title pill */}
      <div className="absolute -top-3 left-6">
        <div
          className={`px-4 py-1.5 rounded-full border border-white/20 text-xs text-white font-medium ${
            isSelected
              ? "shadow-2xl shadow-green-500/50"
              : "shadow-2xl shadow-black/40"
          }`}
          style={{
            background: "linear-gradient(135deg, #009688 0%, #00796b 100%)",
            filter: isSelected
              ? "drop-shadow(0 8px 16px rgba(34, 197, 94, 0.4))"
              : "drop-shadow(0 8px 16px rgba(0, 0, 0, 0.3))",
          }}
        >
          {title}
        </div>
      </div>

      <div className="pt-2">{children}</div>

      {showViewButton && (
        <div className="absolute -bottom-3 right-6">
          <button
            className={`px-4 py-1.5 rounded-full border text-sm inline-flex items-center gap-1.5 transition-all duration-300 transform hover:scale-105 ${
              isSelected
                ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white border-green-300 shadow-xl shadow-green-500/30 hover:from-green-500 hover:to-emerald-600 hover:shadow-green-400/40 hover:shadow-2xl"
                : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border-gray-300 shadow-xl hover:from-gray-200 hover:to-gray-300 hover:shadow-2xl"
            }`}
          >
            View{" "}
            <ChevronRight
              className={`w-4 h-4 ${isSelected ? "text-white" : ""}`}
              style={isSelected ? {} : { color: "#009688" }}
            />
          </button>
        </div>
      )}
    </div>
  );
};
