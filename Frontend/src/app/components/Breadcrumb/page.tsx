import { Home, ChevronRight } from "lucide-react";

export default function Breadcrumb() {
  return (
    <div className="flex items-center gap-1 text-sm text-gray-500 mb-6">
      <Home className="w-3.5 h-3.5" />
      <span>Home</span>
      <ChevronRight className="w-3.5 h-3.5" />
      <span>Employee</span>
      <ChevronRight className="w-3.5 h-3.5" />
      <span className="text-gray-700 font-medium">Add New Employee</span>
    </div>
  );
}
