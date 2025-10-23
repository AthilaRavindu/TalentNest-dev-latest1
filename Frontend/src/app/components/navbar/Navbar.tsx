"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

import IconButton from "./Components/Button1";
import IconCircle from "./Components/IconCircle";
import Profile from "./Components/Profile";
import {
  FaHome,
  FaUser,
  FaBell,
  FaEnvelope,
  FaUserCircle,
} from "react-icons/fa";

interface NavbarProps {
  isAuthorized?: boolean;
}

export default function Navbar({ isAuthorized = true }: NavbarProps) {
  const [showProfile, setShowProfile] = React.useState(false);
  const profileBtnRef = useRef<HTMLSpanElement>(null);
  const profileCardRef = useRef<HTMLDivElement>(null);

  // Click-away handler
  useEffect(() => {
    if (!showProfile) return;
    function handleClick(e: MouseEvent) {
      const path = e.composedPath ? e.composedPath() : [];
      if (
        profileCardRef.current &&
        profileBtnRef.current &&
        !path.includes(profileCardRef.current) &&
        !path.includes(profileBtnRef.current)
      ) {
        setShowProfile(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showProfile]);

  return (
    <nav className="w-full flex justify-center pt-1 md:pt-2 pb-2 md:pb-4 yellow-600">
      <div
        className={[
          "flex items-center justify-between",
          "w-full",
          "h-[56px] sm:h-[63px] lg:h-[73px]",
          "flex-shrink-0",
          "rounded-[25px] sm:rounded-[35px] lg:rounded-[50px]",
          "transition-all duration-300",
          "shadow-[0_4px_20px_0_rgba(0,0,0,0.25)]",
          "pl-3 sm:pl-6 lg:pl-8 pr-8 sm:pr-12 lg:pr-16",
        ].join(" ")}
      >
        {/* left: brand */}
        <Link href="/" className="flex items-center gap-2 sm:gap-3">
          <Image
            src="/Talent Nest logo new1.png"
            alt="TalentNest Logo"
            width={40}
            height={40}
            className="sm:w-[50px] sm:h-[50px] lg:w-[60px] lg:h-[60px] object-contain drop-shadow-lg transition-transform duration-300 hover:scale-110 hover:rotate-3 cursor-pointer"
          />
          <Image
            src="/TalentNest.png"
            alt="TalentNest"
            width={80}
            height={80}
            className="sm:w-[100px] sm:h-[100px] lg:w-[120px] lg:h-[120px] object-contain transition-all duration-300 hover:scale-105 cursor-pointer hidden sm:block"
          />
        </Link>

        {/* center: nav links - hidden on small screens */}
        <div className="hidden md:flex items-end gap-4 lg:gap-8">
          <IconButton
            icon={<FaHome />}
            label="Home"
            className={!isAuthorized ? "opacity-50 pointer-events-none" : ""}
          />
          <IconButton
            icon={<FaUser />}
            label="Teams"
            className={!isAuthorized ? "opacity-50 pointer-events-none" : ""}
          />
          {/* standard button instead of dropdown */}
          <IconButton
            icon={<FaBell />}
            label="Services"
            className={!isAuthorized ? "opacity-50 pointer-events-none" : ""}
          />
        </div>

        {/* right: action buttons */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Message, Notification, and Profile icons */}
          <IconCircle
            icon={<FaEnvelope />}
            ariaLabel="messages"
            className={!isAuthorized ? "opacity-50 pointer-events-none" : ""}
          />
          <IconCircle
            icon={<FaBell />}
            ariaLabel="notifications"
            className={!isAuthorized ? "opacity-50 pointer-events-none" : ""}
          />
          <span
            ref={profileBtnRef}
            onClick={() => isAuthorized && setShowProfile((prev) => !prev)}
            style={{ cursor: isAuthorized ? "pointer" : "not-allowed" }}
            className={`relative ${
              !isAuthorized ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            <IconCircle
              icon={<FaUserCircle />}
              ariaLabel="profile"
              className={!isAuthorized ? "opacity-50 pointer-events-none" : ""}
            />
            {/* Profile card - toggled by profile icon */}
            {showProfile && isAuthorized && (
              <>
                {/* Overlay for focus */}
                {/* Removed transparent overlay behind navbar */}
                {/* Dropdown card with pointer */}
                <div
                  ref={profileCardRef}
                  className="absolute right-0 mt-3 z-50 animate-profile-dropdown"
                  style={{ minWidth: 320 }}
                >
                  {/* Pointer arrow */}
                  <div
                    className="absolute -top-2 right-6 w-4 h-4 bg-white/80 rotate-45 shadow-md border-t border-l border-gray-200"
                    style={{ zIndex: 51 }}
                  />
                  <Profile />
                </div>
              </>
            )}
          </span>

          {/* Mobile menu button - shown only on small screens */}
          <div className="md:hidden">
            <IconButton
              icon={<FaUser />}
              label="Menu"
              className={!isAuthorized ? "opacity-50 pointer-events-none" : ""}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
