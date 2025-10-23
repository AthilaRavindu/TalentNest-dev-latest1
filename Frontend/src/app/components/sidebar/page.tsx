"use client";
import React, { useState, useCallback, useMemo } from "react";
import { Grid, Users, FileText, ChevronRight, ChevronLeft, Plus } from "lucide-react";
import styles from "./page.module.css";
import Link from "next/link";

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

// Move path mapping outside component
const PATH_MAP: { [key: string]: string } = {
  "Dashboard": "/pages/dashboard",
  "Organization hierarchy": "/pages/organization/organizationHierarchy",
  "Roles Management": "/pages/organization/rolesManagement",
  "Profiles Management": "/pages/employeeManagement/profilesManagement",
  "Employee Onboarding": "/pages/employeeManagement/employeeOnboarding"
};

// Organization menu items
const organizationItems = [
  { id: "organizationHierarchy", name: "Organization hierarchy" },
  { id: "rolesManagement", name: "Roles Management" }
];

// Employee menu items
const employeeItems = [
  { id: "profilesManagement", name: "Profiles Management" },
  { id: "employeeOnboarding", name: "Employee Onboarding" }
];

// Optimized PopupMenuItem - no state management
const PopupMenuItem = React.memo(({ text }: { text: string }) => {
  return (
    <Link href={PATH_MAP[text] || "/"} className={styles.popupMenuItem}>
      <div className={styles.popupConnectorLine} />
      <div className={styles.popupConnectorDot} />
      {text}
    </Link>
  );
});
PopupMenuItem.displayName = "PopupMenuItem";

// Optimized DropdownMenuItem - no state management
const DropdownMenuItem = React.memo(({ text }: { text: string }) => {
  return (
    <Link href={PATH_MAP[text] || "/"} className={styles.dropdownMenuItemInactive}>
      <div className={styles.dropdownHorizontalConnector} />
      <div className={styles.dropdownConnectorDot} />
      {text}
    </Link>
  );
});
DropdownMenuItem.displayName = "DropdownMenuItem";

// Memoized message item for collapsed view
const MessageItemCollapsed = React.memo(({ msg }: { msg: typeof messages[0] }) => (
  <div className={styles.messageItem}>
    <img
      src={msg.avatar}
      alt={msg.name}
      className={styles.messageAvatarCollapsed}
      loading="lazy"
    />
    {msg.online && <span className={styles.onlineIndicatorCollapsed} />}
  </div>
));
MessageItemCollapsed.displayName = "MessageItemCollapsed";

// Memoized message item for expanded view
const MessageItemExpanded = React.memo(({ msg, badge }: { msg: typeof messages[0], badge?: number }) => (
  <div className={styles.messageItemExpanded}>
    <div style={{ position: "relative" }}>
      <img
        src={msg.avatar}
        alt={msg.name}
        className={styles.messageAvatarExpanded}
        loading="lazy"
      />
      {msg.online && <span className={styles.onlineIndicatorExpanded} />}
    </div>
    <span className={styles.messageName}>{msg.name}</span>
    {badge && <span className={styles.messageBadge}>{badge}</span>}
  </div>
));
MessageItemExpanded.displayName = "MessageItemExpanded";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [orgOpen, setOrgOpen] = useState(true);
  const [empOpen, setEmpOpen] = useState(true);
  const [submenuOpen, setSubmenuOpen] = useState<string | null>(null);

  const toggleCollapse = useCallback(() => setCollapsed(prev => !prev), []);
  const toggleOrgOpen = useCallback(() => setOrgOpen(prev => !prev), []);
  const toggleEmpOpen = useCallback(() => setEmpOpen(prev => !prev), []);
  
  const handleOrgMouseEnter = useCallback(() => setSubmenuOpen("organization"), []);
  const handleEmpMouseEnter = useCallback(() => setSubmenuOpen("employee"), []);
  const handleMouseLeave = useCallback(() => setSubmenuOpen(null), []);

  // Memoize menu items
  const organizationMenuItems = useMemo(() => 
    organizationItems.map((item) => (
      <PopupMenuItem key={item.id} text={item.name} />
    )), []
  );

  const employeeMenuItems = useMemo(() => 
    employeeItems.map((item) => (
      <PopupMenuItem key={item.id} text={item.name} />
    )), []
  );

  // Memoize collapsed messages
  const collapsedMessages = useMemo(() =>
    messages.map((msg, idx) => <MessageItemCollapsed key={idx} msg={msg} />), []
  );

  // Collapsed Sidebar
  if (collapsed) {
    return (
      <aside className={styles.sidebarCollapsed}>
        <div className={styles.dotsCollapsed}>
          <span className={styles.dot1} />
          <span className={styles.dot2} />
          <span className={styles.dot3} />
        </div>

        <div className={styles.profileWrapper}>
          <img
            src="https://randomuser.me/api/portraits/men/32.jpg"
            alt="avatar"
            className={styles.avatarCollapsed}
            loading="eager"
          />
        </div>

        <button
          className={styles.toggleButton}
          aria-label="Expand sidebar"
          onClick={toggleCollapse}
        >
          <ChevronRight size={16} strokeWidth={3} color="#fff" />
        </button>

        <div className={`${styles.sectionHeader} ${styles.sectionHeaderCollapsed}`}>
          MAIN
        </div>
        <div className={styles.navIcons}>
          <Link href="/pages/dashboard">
            <div className={styles.navIconActive}>
              <Grid size={20} />
            </div>
          </Link>

          <div
            className={styles.navIconWrapper}
            onMouseEnter={handleOrgMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className={`${styles.navIconInactive} ${submenuOpen === "organization" ? styles.navIconActiveState : ''}`}>
              <FileText size={20} />
            </div>

            {submenuOpen === "organization" && (
              <div className={styles.submenuPopup}>
                <div className={styles.submenuConnector}></div>
                <div className={styles.submenuContent}>
                  <div className={styles.submenuVerticalLine} />
                  {organizationMenuItems}
                </div>
              </div>
            )}
          </div>

          <div
            className={styles.navIconWrapper}
            onMouseEnter={handleEmpMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className={`${styles.navIconInactive} ${submenuOpen === "employee" ? styles.navIconActiveState : ''}`}>
              <Users size={20} />
            </div>

            {submenuOpen === "employee" && (
              <div className={styles.submenuPopup}>
                <div className={styles.submenuConnector}></div>
                <div className={styles.submenuContent}>
                  <div className={styles.submenuVerticalLine} />
                  {employeeMenuItems}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={`${styles.sectionHeader} ${styles.sectionHeaderCollapsed}`}>
          MESSAGES
        </div>
        <div className={styles.messagesCollapsed}>
          {collapsedMessages}
        </div>

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
          loading="eager"
        />
        <div>
          <div className={styles.userRole}>ADMIN</div>
          <div className={styles.userName}>Andrew Smith</div>
        </div>
        <button
          className={styles.toggleButton}
          aria-label="Collapse sidebar"
          onClick={toggleCollapse}
        >
          <ChevronLeft size={16} strokeWidth={3} color="#fff" />
        </button>
      </div>

      <nav className={styles.navContainer}>
        <div className={`${styles.sectionHeader} ${styles.sectionHeaderExpanded}`}>
          MAIN
        </div>
        <div className={styles.navMain}>
          <div className={styles.dropdownSection}>
            <Link href="/pages/dashboard" className={styles.linkWrapper}>
              <button className={`${styles.dropdownButton} ${styles.dropdownActive}`}>
                <span className={styles.dropdownButtonContent}>
                  <Grid size={18} />
                  <span className={styles.dropdownLabel}>Dashboard</span>
                </span>
              </button>
            </Link>
          </div>

          <div className={styles.dropdownSection}>
            <button
              onClick={toggleOrgOpen}
              className={`${styles.dropdownButton} ${orgOpen ? styles.dropdownActive : styles.dropdownInactive}`}
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
                <DropdownMenuItem text="Organization hierarchy" />
                <DropdownMenuItem text="Roles Management" />
              </div>
            )}
          </div>

          <div className={styles.dropdownSection}>
            <button
              onClick={toggleEmpOpen}
              className={`${styles.dropdownButton} ${empOpen ? styles.dropdownActive : styles.dropdownInactive}`}
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
                <DropdownMenuItem text="Profiles Management" />
                <DropdownMenuItem text="Employee Onboarding" />
              </div>
            )}
          </div>
        </div>

        <div className={styles.messagesContainer}>
          <div className={`${styles.sectionHeaderExpanded} ${styles.messagesHeaderWithButton}`}>
            <span>MESSAGES</span>
            <button className={styles.messagePlusButton}>
              <Plus size={14} />
            </button>
          </div>
          <div className={styles.messagesExpanded}>
            <MessageItemExpanded msg={messages[0]} badge={3} />
            <MessageItemExpanded msg={messages[1]} />
            <MessageItemExpanded msg={messages[2]} badge={9} />
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;