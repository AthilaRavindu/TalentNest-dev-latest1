"use client";
import React, { useState } from "react";
import { Grid, Users, FileText, ChevronRight, ChevronLeft, Plus } from "lucide-react";
import styles from "./sidebar.module.css";

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

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [orgOpen, setOrgOpen] = useState(true);
  const [empOpen, setEmpOpen] = useState(true);
  const [submenuOpen, setSubmenuOpen] = useState<string | null>(null);

  // PopupMenuItem component with hover effects for collapsed sidebar
  const PopupMenuItem = ({ text }: { text: string }) => {
    const [isHovered, setIsHovered] = useState(false);
    
    return (
      <div 
        style={{
          fontSize: '14px',
          margin: '8px 0',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          padding: '6px 12px',
          borderRadius: '20px',
          color: isHovered ? '#004d40' : '#189484',
          fontWeight: isHovered ? '600' : '500',
          background: isHovered ? 'rgba(0, 77, 64, 0.1)' : 'transparent',
          paddingLeft: isHovered ? '16px' : '12px',
          transition: 'all 0.2s ease'
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
    );
  };

  // DropdownMenuItem component with hover effects for expanded sidebar
  const DropdownMenuItem = ({ text }: { text: string }) => {
    const [isHovered, setIsHovered] = useState(false);
    
    return (
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
    );
  };

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
            src="https://randomuser.me/api/portraits/men/32.jpg"
            alt="avatar"
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
          <div className={styles.navIconActive}>
            <Grid size={20} />
          </div>

          {/* Organization Management Icon with Popup */}
          <div
            className={styles.navIconWrapper}
            onMouseEnter={() => setSubmenuOpen("organization")}
            onMouseLeave={() => setSubmenuOpen(null)}
          >
            <div 
              className={styles.navIconInactive}
              style={{
                ...(submenuOpen === "organization" ? {background: '#189484', color: '#fff'} : {})
              }}
            >
              <FileText size={20} />
            </div>

            {submenuOpen === "organization" && (
              <div className={styles.submenuPopup}>
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '-20px',
                  width: '20px',
                  height: '2px',
                  background: '#189484',
                  transform: 'translateY(-50%)',
                  borderRadius: '2px'
                }}></div>
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
                    borderRadius: '6px'
                  }} />
                  {["Roles management", "Organization hierarchy", "Leave management", "Permission management"].map((item) => (
                    <PopupMenuItem key={item} text={item} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Employee Management Icon with Popup */}
          <div
            className={styles.navIconWrapper}
            onMouseEnter={() => setSubmenuOpen("employee")}
            onMouseLeave={() => setSubmenuOpen(null)}
          >
            <div 
              className={styles.navIconInactive}
              style={{
                ...(submenuOpen === "employee" ? {background: '#189484', color: '#fff'} : {})
              }}
            >
              <Users size={20} />
            </div>

            {submenuOpen === "employee" && (
              <div className={styles.submenuPopup}>
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '-20px',
                  width: '20px',
                  height: '2px',
                  background: '#189484',
                  transform: 'translateY(-50%)',
                  borderRadius: '2px'
                }}></div>
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
                  {["Profiles Management", "Employee Onboarding"].map((item) => (
                    <PopupMenuItem key={item} text={item} />
                  ))}
                </div>
              </div>
            )}
          </div>
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

        {/* Add Button at Bottom */}
        <button className={styles.addButton}>
          <Plus size={20} />
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
          src="https://randomuser.me/api/portraits/men/32.jpg"
          alt="avatar"
          className={styles.avatarExpanded}
        />
        <div>
          <div className={styles.userRole}>ADMIN</div>
          <div className={styles.userName}>Andrew Smith</div>
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
          {/* Dashboard - Left Aligned */}
          <div className={styles.dropdownSection}>
            <button className={`${styles.dropdownButton} ${styles.dropdownActive}`}>
              <span className={styles.dropdownButtonContent}>
                <Grid size={18} />
                <span className={styles.dropdownLabel}>Dashboard</span>
              </span>
            </button>
          </div>

          {/* Organization */}
          <div className={styles.dropdownSection}>
            <button
              onClick={() => setOrgOpen((o) => !o)}
              className={`${styles.dropdownButton} ${
                orgOpen ? styles.dropdownActive : styles.dropdownInactive
              }`}
            >
              <span className={styles.dropdownButtonContent}>
                <FileText size={18} />
                <span className={styles.dropdownLabel}>Organization</span>
              </span>
              <span>{orgOpen ? "⌄" : "›"}</span>
            </button>
            {orgOpen && (
              <div className={styles.dropdownSubmenu}>
                <div className={styles.dropdownVerticalLine} />
                {[
                  "Roles management",
                  "Organization hierarchy",
                  "Leave management",
                  "Permission management",
                ].map((item) => (
                  <DropdownMenuItem key={item} text={item} />
                ))}
              </div>
            )}
          </div>

          {/* Employee Management */}
          <div className={styles.dropdownSection}>
            <button
              onClick={() => setEmpOpen((o) => !o)}
              className={`${styles.dropdownButton} ${
                empOpen ? styles.dropdownActive : styles.dropdownInactive
              }`}
            >
              <span className={styles.dropdownButtonContent}>
                <Users size={18} />
                <span className={styles.dropdownLabel}>Employee management</span>
              </span>
              <span>{empOpen ? "⌄" : "›"}</span>
            </button>
            {empOpen && (
              <div className={styles.dropdownSubmenu}>
                <div className={styles.dropdownVerticalLine} />
                {["Profiles Management", "Employee Onboarding" ].map((item) => (
                  <DropdownMenuItem key={item} text={item} />
                ))}
              </div>
            )}
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

export default Sidebar;