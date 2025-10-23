"use client";
import { useState } from "react";
import PersonalInfo from "@/app/components/ProfileTabs/PersonalInfo"
import Qualifications from "@/app/components/ProfileTabs/Qualifications";

export default function ProfileTabs() {
  const [activeTab, setActiveTab] = useState<"personal" | "shift" | "qualifications">("personal");

  return (
    
      <div className="max-w-6xl mx-auto">
        {/* Tab Navigation */}
        <div className="flex gap-8 mb-6 border-b border-gray-200">
          {["personal", "qualifications"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as "personal" | "shift" | "qualifications")}
              className={`pb-3 px-2 font-medium transition-colors relative ${
                activeTab === tab
                  ? "text-teal-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab === "personal"
                ? "Personal info"
                : "Qualifications"}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600"></div>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="transition-all duration-300">
          {activeTab === "personal" && <PersonalInfo />}
          {activeTab === "qualifications" && <Qualifications />}
        </div>
      </div>
    
  );
}