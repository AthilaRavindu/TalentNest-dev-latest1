import React from "react";
import ProfileDetails from "./components/ProfileTable";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

const Page = () => {
  return (
    <div
      className={`roles-theme min-h-screen bg-background text-foreground p-6 ${roboto.className}`}
    >
      <h1 className="inline-flex text-black font-bold px-6 py-3 bg-background rounded-full items-center justify-center
               shadow-[0_0_16px_rgba(0,0,0,0.24)]">
        Profile Management
      </h1>
      <div className="mt-6">
        <ProfileDetails />
      </div>
    </div>
  );
};

export default Page;