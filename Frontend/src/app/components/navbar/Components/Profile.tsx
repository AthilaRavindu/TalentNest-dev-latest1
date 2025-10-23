import { UserCog, Settings2, LogOut } from "lucide-react";

const Profile = () => {
  return (
    <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
      {/* Top section: gradient background */}
      <div
        className="p-5 sm:p-7 flex flex-col items-center relative"
        style={{
          background:
            "linear-gradient(135deg, #4ef2b8 0%, #009688 60%, #00796b 100%)",
        }}
      >
        {/* Avatar with glowing border, camera overlay, and hover effect */}
        <div className="relative group mb-2">
          <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-emerald-300/60 via-emerald-500/80 to-cyan-500/80 p-1 shadow-xl group-hover:scale-105 group-hover:shadow-emerald-400/60 transition-all duration-300">
            <div className="w-full h-full rounded-full bg-white/20 border-4 border-white flex items-center justify-center overflow-hidden relative">
              {/* Avatar image fallback logic */}
              {/* <img src="/path/to/avatar.jpg" alt="Profile" className="w-full h-full object-cover rounded-full" /> */}
              <span className="text-white text-2xl sm:text-3xl md:text-4xl font-extrabold select-none drop-shadow-lg">
                JD
              </span>
            </div>
          </div>
        </div>
        {/* Name */}
        <div className="text-lg sm:text-xl md:text-2xl font-bold text-white tracking-tight drop-shadow text-center break-words">
          John Doe
        </div>
      </div>
      {/* Bottom section: enhanced glassmorphism */}
      <div className="relative bg-white/70 backdrop-blur-2xl flex flex-col items-center gap-3 px-4 sm:px-7 pt-5 pb-7 shadow-inner rounded-b-2xl overflow-hidden">
        {/* Role and email */}
        <div className="text-sm sm:text-base text-emerald-700 font-semibold tracking-wide text-center break-words">
          HR Manager
        </div>
        <div className="text-xs text-gray-500 mb-1 break-all text-center">
          john.doe@talentnest.com
        </div>
        {/* Motivational quote/status */}
        <div className="italic text-xs text-emerald-700/80 text-center mb-2">
          “Empowering teams, building futures.”
        </div>
        {/* Profile completeness progress bar */}
        <div className="w-full flex flex-col items-center mb-2">
          <div className="flex justify-between w-full text-[10px] text-gray-400 mb-1">
            <span>Profile Complete</span>
            <span className="text-emerald-600 font-bold">80%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-600 rounded-full transition-all duration-500"
              style={{ width: "80%" }}
            />
          </div>
        </div>
        {/* Glowing divider */}
        <div className="w-full h-1 bg-gradient-to-r from-transparent via-emerald-300/60 to-transparent blur-[2px] my-2" />
        {/* Action buttons with neumorphic/glassy effect */}
        <div className="flex gap-5 w-full justify-center mt-2">
          {/* Edit Button */}
          <button
            className="flex flex-col items-center group focus:outline-none"
            title="Edit Profile"
          >
            <span className="bg-gradient-to-br from-white/70 via-emerald-100/80 to-emerald-200/80 group-hover:from-emerald-200/80 group-hover:to-emerald-300/90 transition-all p-3 rounded-2xl shadow-xl border border-emerald-200 group-hover:scale-110 text-emerald-700 group-hover:text-emerald-900 backdrop-blur-md ring-1 ring-emerald-300/30 group-hover:ring-emerald-400/40">
              <UserCog size={22} />
            </span>
            <span className="text-xs text-emerald-700 mt-1 group-hover:text-emerald-900 font-semibold tracking-wide drop-shadow-sm">
              Edit
            </span>
          </button>
          {/* Settings Button */}
          <button
            className="flex flex-col items-center group focus:outline-none"
            title="Settings"
          >
            <span className="bg-gradient-to-br from-white/70 via-teal-100/80 to-emerald-200/80 group-hover:from-teal-200/80 group-hover:to-emerald-300/90 transition-all p-3 rounded-2xl shadow-xl border border-teal-200 group-hover:scale-110 text-teal-700 group-hover:text-emerald-900 backdrop-blur-md ring-1 ring-teal-300/30 group-hover:ring-emerald-400/40">
              <Settings2 size={22} />
            </span>
            <span className="text-xs text-teal-700 mt-1 group-hover:text-emerald-900 font-semibold tracking-wide drop-shadow-sm">
              Settings
            </span>
          </button>
          {/* Logout Button */}
          <button
            className="flex flex-col items-center group focus:outline-none"
            title="Logout"
          >
            <span className="bg-gradient-to-br from-white/70 via-red-100/80 to-red-300/80 group-hover:from-red-200/80 group-hover:to-red-400/90 transition-all p-3 rounded-2xl shadow-xl border border-red-200 group-hover:scale-110 text-red-500 group-hover:text-red-700 backdrop-blur-md ring-1 ring-red-300/30 group-hover:ring-red-400/40">
              <LogOut size={22} />
            </span>
            <span className="text-xs text-red-500 mt-1 group-hover:text-red-700 font-semibold tracking-wide drop-shadow-sm">
              Logout
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
