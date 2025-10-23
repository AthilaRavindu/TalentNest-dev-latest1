import ProfileTabs from "@/app/components/ProfileTabs/ProfileTabs"

export default function ProfilePage() {
  return (
    <div className="flex">
      {/* Your Sidebar here */}
      <div className="flex-1">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="inline-flex font-bold text-gray-900 px-6 py-3 bg-background rounded-full items-center justify-center
               shadow-[0_0_16px_rgba(0,0,0,0.24)]"> My Profile </h1>
        </div>
        <ProfileTabs />
      </div>
    </div>
  );
}