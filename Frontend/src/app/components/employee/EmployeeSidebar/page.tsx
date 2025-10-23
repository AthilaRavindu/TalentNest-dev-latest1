"use client";
import React, { useState } from "react";
import { 
  Grid, 
  User, 
  Calendar, 
  ChevronRight, 
  ChevronLeft, 
  Plus,
  LogOut,
  CreditCard
} from "lucide-react";
import styles from "./EmployeeSidebar.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

const messages = [
  {
    name: "Erik Gursel",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    online: true,
  },
  {
    name: "Emily Smith",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    online: false,
  },
  {
    name: "Arthur Adelk",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    online: true,
  },
];

// Leave & Attendance menu items (combined: leaves, shift, attendance)
const leaveItems = [
  {
    id: "leaves",
    name: "Leaves Management",
    href: "/pages/employee/leaves"
  },
  {
    id: "shift",
    name: "Shift Management",
    href: "/pages/employee/Shift"
  },
  {
    id: "attendance",
    name: "Attendance Management ",
    href: "/pages/employee/Attendance"
  }
];

const EmployeeSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [leaveOpen, setLeaveOpen] = useState(true);
  const [submenuOpen, setSubmenuOpen] = useState<string | null>(null);
  const pathname = usePathname();
 
  // PopupMenuItem component with hover effects for collapsed sidebar
  const PopupMenuItem = ({ text, href }: { text: string; href: string }) => {
    const [isHovered, setIsHovered] = useState(false);
    
    return (
      <Link href={href}>
        <div 
          className={styles.popupItem}
          style={{
            color: isHovered ? '#004d40' : '#189484',
            fontWeight: isHovered ? '600' : '500',
            background: isHovered ? 'rgba(0, 77, 64, 0.1)' : 'transparent',
            paddingLeft: isHovered ? '16px' : '12px',
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div style={{
            position: 'absolute',
            left: '-16px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '16px',
            height: '16px',
            borderLeft: '2px solid #189484',
            borderBottom: '2px solid #189484',
            borderBottomLeftRadius: '12px'
          }} />
          <div style={{
            position: 'absolute',
            left: '-4px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '6px',
            height: '6px',
            background: '#189484',
            borderRadius: '50%'
          }} />
          {text}
        </div>
      </Link>
    );
  };

  // DropdownMenuItem component with hover effects for expanded sidebar
  const DropdownMenuItem = ({ text, href }: { text: string; href: string }) => {
    const [isHovered, setIsHovered] = useState(false);
    
    return (
      <Link href={href}>
        <div 
          className={styles.dropdownMenuItemInactive}
          style={{
            color: isHovered ? '#004d40' : '#189484',
            fontWeight: isHovered ? '600' : '500',
            background: isHovered ? 'rgba(0, 77, 64, 0.1)' : 'transparent',
            paddingLeft: isHovered ? '16px' : '12px',
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className={styles.dropdownHorizontalConnector} />
          <div className={styles.dropdownConnectorDot} />
          {text}
        </div>
      </Link>
    );
  };

  // Check active state
  const isActive = (href: string) => pathname === href;

  // Collapsed Sidebar
  if (collapsed) {
    return (
      <aside className={styles.sidebarCollapsed}>
        {/* Three Dots */}
        <div className={styles.dotsCollapsed}>
          <span className={styles.dot1} />
          <span className={styles.dot2} />
          <span className={styles.dot3} />
        </div>

        {/* Profile Avatar */}
        <div className={styles.profileWrapper}>
          <img
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face"
            alt="John Doe"
            className={styles.avatarCollapsed}
          />
        </div>

        {/* Expand Button */}
        <button
          className={styles.toggleButton}
          aria-label="Expand sidebar"
          onClick={() => setCollapsed(false)}
        >
          <ChevronRight size={16} strokeWidth={3} color="#fff" />
        </button>

        {/* MAIN Section */}
        <div className={`${styles.sectionHeader} ${styles.sectionHeaderCollapsed}`}>
          MAIN
        </div>
        <div className={styles.navIcons}>
          {/* Dashboard Icon */}
          <Link href="/pages/employee/employee_dashboard">
            <div className={isActive("/pages/employee/employee_dashboard") ? styles.navIconActive : styles.navIconInactive}>
              <Grid size={20} />
            </div>
          </Link>

          {/* Leave & Attendance Icon with Popup */}
          <div
            className={styles.navIconWrapper}
            onMouseEnter={() => setSubmenuOpen("leave")}
            onMouseLeave={() => setSubmenuOpen(null)}
          >
            <div 
              className={isActive("/pages/employee/leaves") || isActive("/pages/employee/Shift") || isActive("/pages/employee/Attendance") ? styles.navIconActive : styles.navIconInactive}
              style={{
                ...(submenuOpen === "leave" ? {background: '#189484', color: '#fff'} : {})
              }}
            >
              <Calendar size={20} />
            </div>

            {submenuOpen === "leave" && (
              <div className={styles.submenuPopup}>
                <div className={styles.connectorLine}></div>
                <div style={{
                  marginLeft: '16px',
                  marginTop: '4px',
                  position: 'relative',
                  paddingLeft: '16px'
                }}>
                  <div style={{
                    position: 'absolute',
                    left: '0',
                    top: '0',
                    bottom: '8px',
                    width: '2px',
                    background: '#189484',
                    borderRadius: '4px'
                  }} />
                  {leaveItems.map((item) => (
                    <PopupMenuItem key={item.id} text={item.name} href={item.href} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Personal Info Icon */}
          <Link href="/pages/employee/personal-info">
            <div className={isActive("/pages/employee/profile") ? styles.navIconActive : styles.navIconInactive}>
              <User size={20} />
            </div>
          </Link>

          {/* Report Export Icon */}
          <Link href="/pages/employee/DocumentExport">
            <div className={isActive("/pages/employee/DocumentExport") ? styles.navIconActive : styles.navIconInactive}>
              <CreditCard size={20} />
            </div>
          </Link>
        </div>

        {/* MESSAGES Section */}
        <div className={`${styles.sectionHeader} ${styles.sectionHeaderCollapsed}`}>
          MESSAGES
        </div>
        <div className={styles.messagesCollapsed}>
          {messages.map((msg, idx) => (
            <div key={idx} className={styles.messageItem}>
              <img
                src={msg.avatar}
                alt={msg.name}
                className={styles.messageAvatarCollapsed}
              />
              {msg.online && (
                <span className={styles.onlineIndicatorCollapsed} />
              )}
            </div>
          ))}
        </div>

        {/* Logout Button at Bottom */}
        <button className={styles.logoutButton}>
          <LogOut size={20} />
        </button>
      </aside>
    );
  }

  // Expanded Sidebar
  return (
    <aside className={styles.sidebarExpanded}>
      <div className={styles.dots}>
        <span className={styles.dot1} />
        <span className={styles.dot2} />
        <span className={styles.dot3} />
      </div>

      <div className={styles.userInfo}>
        <img
          src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face"
          alt="John Doe"
          className={styles.avatarExpanded}
        />
        <div>
          <div className={styles.userRole}>EMPLOYEE</div>
          <div className={styles.userName}>John Doe</div>
          <div className={styles.userId}>EMP • 12345</div>
        </div>
        <button
          className={styles.toggleButton}
          aria-label="Collapse sidebar"
          onClick={() => setCollapsed(true)}
        >
          <ChevronLeft size={16} strokeWidth={3} color="#fff" />
        </button>
      </div>

      <nav className={styles.navContainer}>
        <div className={`${styles.sectionHeader} ${styles.sectionHeaderExpanded}`}>
          MAIN
        </div>
        <div className={styles.navMain}>
          {/* Dashboard */}
          <div className={styles.dropdownSection}>
            <Link href="/pages/employee/employee_dashboard">
              <button className={`${styles.dropdownButton} ${isActive("/pages/employee/employee_dashboard") ? styles.dropdownActive : styles.dropdownInactive}`}>
                <span className={styles.dropdownButtonContent}>
                  <Grid size={18} />
                  <span className={styles.dropdownLabel}>Dashboard</span>
                </span>
              </button>
            </Link>
          </div>

          {/* Leave & Attendance (with submenu) */}
          <div className={styles.dropdownSection}>
            <button
              onClick={() => setLeaveOpen((o) => !o)}
              className={`${styles.dropdownButton} ${
                leaveOpen ? styles.dropdownActive : styles.dropdownInactive
              }`}
            >
              <span className={styles.dropdownButtonContent}>
                <Calendar size={18} />
                <span className={styles.dropdownLabel}>Leave & Attendance</span>
              </span>
              <span>{leaveOpen ? "⌄" : "›"}</span>
            </button>
            {leaveOpen && (
              <div className={styles.dropdownSubmenu}>
                <div className={styles.dropdownVerticalLine} />
                {leaveItems.map((item) => (
                  <DropdownMenuItem key={item.id} text={item.name} href={item.href} />
                ))}
              </div>
            )}
          </div>

          {/* Profile */}
          <div className={styles.dropdownSection}>
            <Link href="/pages/employee/profile">
              <button className={`${styles.dropdownButton} ${isActive("/pages/employee/profile") ? styles.dropdownActive : styles.dropdownInactive}`}>
                <span className={styles.dropdownButtonContent}>
                  <User size={18} />
                  <span className={styles.dropdownLabel}>Personal Info</span>
                </span>
              </button>
            </Link>
          </div>

          {/* Document Export */}
          <div className={styles.dropdownSection}>
            <Link href="/pages/employee/DocumentExport">
              <button className={`${styles.dropdownButton} ${isActive("/pages/employee/DocumentExport") ? styles.dropdownActive : styles.dropdownInactive}`}>
                <span className={styles.dropdownButtonContent}>
                  <CreditCard size={18} />
                  <span className={styles.dropdownLabel}>Document Export</span>
                </span>
              </button>
            </Link>
          </div>
        </div>

        {/* Messages Section with Plus Button */}
        <div className={styles.messagesContainer}>
          <div className={`${styles.sectionHeaderExpanded} ${styles.messagesHeaderWithButton}`}>
            <span>MESSAGES</span>
            <button className={styles.messagePlusButton}>
              <Plus size={14} />
            </button>
          </div>
          <div className={styles.messagesExpanded}>
            {messages.map((msg, idx) => (
              <div key={idx} className={styles.messageItemExpanded}>
                <div style={{ position: "relative" }}>
                  <img
                    src={msg.avatar}
                    alt={msg.name}
                    className={styles.messageAvatarExpanded}
                  />
                  {msg.online && (
                    <span className={styles.onlineIndicatorExpanded} />
                  )}
                </div>
                <span className={styles.messageName}>{msg.name}</span>
                {idx === 0 && <span className={styles.messageBadge}>3</span>}
                {idx === 2 && <span className={styles.messageBadge}>9</span>}
              </div>
            ))}
          </div>
        </div>   
      </nav>
    </aside>
  );
};

export default EmployeeSidebar;