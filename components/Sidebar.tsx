'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Search,
  Settings,
  Calendar,
  LogOut,
  Mail,
  Users,
  ChevronDown,
  Check,
  MoreHorizontal,
  Plus,
} from 'lucide-react';
import { CertEvent } from '@/lib/types';
import { setActiveOrg, logout, createOrg } from '@/app/actions/auth';
import { Modal } from '@/components/Modal';

interface SidebarProps {
  events: CertEvent[];
  currentOrg: {
    id: string;
    name: string;
    [key: string]: any;
  };
  memberships: Array<{
    organization: {
      id: string;
      name: string;
      [key: string]: any;
    };
    role?: string;
    [key: string]: any;
  }>;
  userName: string;
  userEmail: string;
  incomingInviteCount?: number;
}

export function Sidebar({
  events = [],
  currentOrg,
  memberships = [],
  userName,
  userEmail,
  incomingInviteCount = 0,
}: SidebarProps) {
  const pathname = usePathname();
  const [isOrgSwitcherOpen, setIsOrgSwitcherOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [orgSearch, setOrgSearch] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isCreateOrgModalOpen, setIsCreateOrgModalOpen] = useState(false);
  const [newOrgName, setNewOrgName] = useState('');
  const [isCreatingOrg, setIsCreatingOrg] = useState(false);

  const orgSwitcherRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const orgSearchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        orgSwitcherRef.current &&
        !orgSwitcherRef.current.contains(event.target as Node)
      ) {
        setIsOrgSwitcherOpen(false);
      }
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut listeners: "/" to search, "Escape" to close popovers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOrgSwitcherOpen(false);
        setIsUserMenuOpen(false);
      }

      if (
        e.key === '/' &&
        document.activeElement !== searchInputRef.current &&
        (e.target as HTMLElement).tagName !== 'INPUT' &&
        (e.target as HTMLElement).tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus org search field when popover opens
  useEffect(() => {
    if (isOrgSwitcherOpen) {
      setTimeout(() => {
        orgSearchInputRef.current?.focus();
      }, 50);
    } else {
      setOrgSearch('');
    }
  }, [isOrgSwitcherOpen]);

  const handleOrgSwitch = async (orgId: string) => {
    if (orgId === currentOrg.id) {
      setIsOrgSwitcherOpen(false);
      return;
    }
    await setActiveOrg(orgId);
    setIsOrgSwitcherOpen(false);
    window.location.reload();
  };

  const handleLogout = async () => {
    await logout();
  };

  const filteredMemberships = memberships.filter((m) =>
    m.organization.name.toLowerCase().includes(orgSearch.toLowerCase())
  );

  const filteredEvents = events.filter((e) =>
    e.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (name?: string, email?: string) => {
    if (name && name.trim()) {
      const parts = name.trim().split(/\s+/);
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      }
      return parts[0].slice(0, 2).toUpperCase();
    }
    if (email && email.trim()) {
      return email.slice(0, 2).toUpperCase();
    }
    return 'US';
  };

  const isEventsActive = pathname === '/dashboard' || pathname.startsWith('/events');
  const isMembersActive = pathname.startsWith('/settings/members');
  const isInvitesActive = pathname === '/invites' || pathname.startsWith('/invites/');
  const isSettingsActive = pathname === '/settings';

  return (
    <aside className="w-64 bg-black text-white flex flex-col h-screen border-r border-[#222] select-none text-sm shrink-0">
      {/* Top Section: Org Switcher */}
      <div className="p-3 border-b border-[#222] relative" ref={orgSwitcherRef}>
        <button
          type="button"
          onClick={() => setIsOrgSwitcherOpen((prev) => !prev)}
          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md hover:bg-[#111] transition-colors group cursor-pointer"
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-green-500 shrink-0 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
            <span className="text-xs font-semibold text-white truncate tracking-tight">
              {currentOrg.name}
            </span>
          </div>
          <ChevronDown
            className={`w-3.5 h-3.5 text-[#666] transition-transform duration-150 shrink-0 ml-1.5 ${
              isOrgSwitcherOpen ? 'rotate-180 text-white' : 'group-hover:text-white'
            }`}
          />
        </button>

        {/* Org Switcher Popover */}
        {isOrgSwitcherOpen && (
          <div className="absolute top-full left-3 right-3 mt-1.5 z-50 bg-[#0a0a0a] border border-[#222] rounded-lg shadow-2xl p-1.5 backdrop-blur-md">
            {/* Popover Search Field */}
            <div className="flex items-center gap-2 px-2 py-1.5 mb-1.5 bg-[#121212] border border-[#262626] rounded text-xs">
              <Search className="w-3.5 h-3.5 text-[#666] shrink-0" />
              <input
                ref={orgSearchInputRef}
                type="text"
                placeholder="Find Org..."
                value={orgSearch}
                onChange={(e) => setOrgSearch(e.target.value)}
                className="bg-transparent text-white placeholder-[#555] text-xs outline-none w-full"
              />
              <kbd className="text-[10px] bg-[#1a1a1a] text-[#777] px-1 py-0.5 rounded border border-[#2e2e2e] font-mono leading-none shrink-0">
                Esc
              </kbd>
            </div>

            {/* Organizations List */}
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#666] px-2 py-1">
              Organizations
            </div>
            <div className="max-h-44 overflow-y-auto space-y-0.5 pr-0.5">
              {filteredMemberships.length === 0 ? (
                <div className="px-2 py-2 text-xs text-[#555] text-center font-mono">
                  No teams found
                </div>
              ) : (
                filteredMemberships.map((m) => {
                  const isActive = m.organization.id === currentOrg.id;
                  return (
                    <button
                      key={m.organization.id}
                      type="button"
                      onClick={() => handleOrgSwitch(m.organization.id)}
                      className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-xs transition-colors text-left ${
                        isActive
                          ? 'bg-[#161616] text-white font-medium'
                          : 'text-[#888] hover:text-white hover:bg-[#111]'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span
                          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                            isActive ? 'bg-green-500' : 'bg-[#444]'
                          }`}
                        />
                        <span className="truncate">{m.organization.name}</span>
                      </div>
                      {isActive && (
                        <Check className="w-3.5 h-3.5 text-white shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })
              )}
            </div>

            <div className="h-px bg-[#222] my-1" />

            <button
              type="button"
              onClick={() => {
                setIsOrgSwitcherOpen(false);
                setIsCreateOrgModalOpen(true);
              }}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-xs text-[#888] hover:text-white hover:bg-[#111] transition-colors text-left cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#888]" />
              <span>Create Org</span>
            </button>
          </div>
        )}
      </div>

      {/* Search Input styled like Vercel "Find..." */}
      <div className="p-3 pb-2">
        <div className="relative flex items-center w-full bg-[#0a0a0a] border border-[#222] rounded-md px-2.5 py-1.5 text-xs text-[#888] hover:border-[#333] focus-within:border-[#444] transition-colors">
          <Search className="w-3.5 h-3.5 text-[#666] mr-2 shrink-0" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Find..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-white placeholder-[#555] text-xs outline-none w-full"
          />
          <kbd className="text-[10px] text-[#666] bg-[#141414] border border-[#262626] rounded px-1.5 py-0.5 font-mono leading-none select-none">
            /
          </kbd>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 flex flex-col min-h-0 px-3 py-1">
        {/* Core Nav Items */}
        <div className="space-y-1">
          <Link
            href="/dashboard"
            className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
              isEventsActive
                ? 'bg-[#111] text-white'
                : 'text-[#888] hover:text-white hover:bg-[#111]'
            }`}
          >
            <Calendar className="w-4 h-4 shrink-0" />
            <span>Events</span>
          </Link>
          <Link
            href="/settings/members"
            className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
              isMembersActive
                ? 'bg-[#111] text-white'
                : 'text-[#888] hover:text-white hover:bg-[#111]'
            }`}
          >
            <Users className="w-4 h-4 shrink-0" />
            <span>Members</span>
          </Link>
          <Link
            href="/invites"
            className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
              isInvitesActive
                ? 'bg-[#111] text-white'
                : 'text-[#888] hover:text-white hover:bg-[#111]'
            }`}
          >
            <Mail className="w-4 h-4 shrink-0" />
            <span>Invitations</span>
            {incomingInviteCount > 0 && (
              <span className="ml-auto min-w-4 h-4 px-1 rounded-full bg-white text-black text-[10px] font-mono flex items-center justify-center">
                {incomingInviteCount > 9 ? '9+' : incomingInviteCount}
              </span>
            )}
          </Link>
          <Link
            href="/settings"
            className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
              isSettingsActive
                ? 'bg-[#111] text-white'
                : 'text-[#888] hover:text-white hover:bg-[#111]'
            }`}
          >
            <Settings className="w-4 h-4 shrink-0" />
            <span>Settings</span>
          </Link>
        </div>

        {/* Events Section Label */}
        <div className="pt-5 pb-1.5 px-2.5 flex items-center justify-between text-[#666]">
          <span className="text-[10px] font-mono uppercase tracking-wider">
            Events
          </span>
          <span className="text-[10px] font-mono text-[#555]">
            {filteredEvents.length}
          </span>
        </div>

        {/* Event Links List */}
        <div className="flex-1 overflow-y-auto space-y-0.5 pr-1 min-h-0 scrollbar-thin">
          {filteredEvents.length === 0 ? (
            <div className="px-2.5 py-2 text-xs text-[#555] italic font-mono">
              {searchQuery ? 'No matching events' : 'No events yet'}
            </div>
          ) : (
            filteredEvents.map((event) => {
              const isActive = pathname === `/events/${event.id}`;
              return (
                <Link
                  key={event.id}
                  href={`/events/${event.id}`}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-colors truncate ${
                    isActive
                      ? 'bg-[#111] text-white font-medium'
                      : 'text-[#888] hover:text-white hover:bg-[#111]'
                  }`}
                  title={event.name}
                >
                  <span className="truncate">{event.name}</span>
                </Link>
              );
            })
          )}
        </div>
      </div>

      {/* User Section at Bottom */}
      <div className="p-3 border-t border-[#222] relative" ref={userMenuRef}>
        <div className="flex items-center justify-between gap-2">
          {/* Avatar and User Details */}
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="w-7 h-7 rounded-full bg-[#181818] border border-[#2e2e2e] text-white text-[11px] font-mono font-medium flex items-center justify-center shrink-0">
              {getInitials(userName, userEmail)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-medium text-white truncate leading-tight">
                {userName || 'User'}
              </div>
            </div>
          </div>

          {/* Action Buttons: "..." and LogOut */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => setIsUserMenuOpen((prev) => !prev)}
              className="p-1.5 text-[#666] hover:text-white hover:bg-[#161616] rounded transition-colors cursor-pointer"
              title="More options"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="p-1.5 text-[#666] hover:text-red-400 hover:bg-[#161616] rounded transition-colors cursor-pointer"
              title="Log out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* User Options Popover */}
        {isUserMenuOpen && (
          <div className="absolute bottom-full left-3 right-3 mb-1.5 z-50 bg-[#0a0a0a] border border-[#222] rounded-lg shadow-2xl p-1.5 backdrop-blur-md">
            <div className="px-2 py-1.5 border-b border-[#222] mb-1">
              <div className="text-xs font-medium text-white truncate">
                {userName || 'User'}
              </div>
              <div className="text-[11px] text-[#666] font-mono truncate">
                {userEmail}
              </div>
            </div>
            <Link
              href="/user-settings"
              onClick={() => setIsUserMenuOpen(false)}
              className="flex items-center gap-2 px-2 py-1.5 rounded text-xs text-[#888] hover:text-white hover:bg-[#111] transition-colors"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>User Settings</span>
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-xs text-red-400 hover:text-red-300 hover:bg-[#1a1111] transition-colors text-left cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log out</span>
            </button>
          </div>
        )}
      </div>

      <Modal 
        isOpen={isCreateOrgModalOpen} 
        onClose={() => setIsCreateOrgModalOpen(false)}
        title="Create Organization"
      >
        <div className="space-y-4">
          <div>
            <label className="text-[#888] text-xs mb-1.5 block" htmlFor="orgName">
              Organization Name
            </label>
            <input
              id="orgName"
              type="text"
              placeholder="e.g. Acme Corp"
              value={newOrgName}
              onChange={(e) => setNewOrgName(e.target.value)}
              className="bg-black border border-[#333] rounded-md h-9 px-3 text-white text-sm focus:border-[#666] focus:outline-none w-full transition-colors"
              autoFocus
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setIsCreateOrgModalOpen(false)}
              className="px-4 h-9 rounded-md text-sm text-[#888] hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                if (!newOrgName.trim() || isCreatingOrg) return;
                setIsCreatingOrg(true);
                await createOrg(newOrgName.trim());
                window.location.reload();
              }}
              disabled={isCreatingOrg || !newOrgName.trim()}
              className="bg-white text-black px-4 h-9 rounded-md text-sm font-medium hover:bg-[#ccc] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreatingOrg ? 'Creating...' : 'Create'}
            </button>
          </div>
        </div>
      </Modal>
    </aside>
  );
}

export default Sidebar;
