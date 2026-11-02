import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  Plus,
  Compass,
  Home,
  Sun,
  Moon,
  Download,
  Shield,
  X,
  Clock,
  Sparkles,
  Bookmark,
  Users,
  Check,
  Hash,
  Layers,
  Radio,
  UserCheck,
} from 'lucide-react';
import { useCodext } from '../context/CodextContext';

interface SuggestionData {
  userSuggestions: Array<{
    id: string;
    name: string;
    username: string;
    avatar: string;
    pinsCount: number;
    matchType: string;
  }>;
  contentSuggestions: Array<{
    id: string;
    title: string;
    category: string;
    imageUrl: string;
    creatorName: string;
    creatorId: string;
  }>;
  tagSuggestions: Array<{
    tag: string;
    count: number;
  }>;
  categorySuggestions: string[];
}

export const Navbar: React.FC = () => {
  const {
    currentUser,
    allUsers,
    switchCurrentUser,
    currentView,
    setCurrentView,
    searchQuery,
    setSearchQuery,
    setSearchUserId,
    addRecentSearch,
    recentSearches,
    clearRecentSearches,
    notifications,
    markNotificationsAsRead,
    openCreatePin,
    openPinDetail,
    setIsAdminModalOpen,
    setIsExportZipOpen,
    theme,
    toggleTheme,
    reports,
    isLiveConnected,
    pins,
  } = useCodext();

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isUserSwitcherOpen, setIsUserSwitcherOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestionData>({
    userSuggestions: [],
    contentSuggestions: [],
    tagSuggestions: [],
    categorySuggestions: [],
  });
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadNotifsCount = notifications.filter((n) => !n.read).length;
  const pendingReportsCount = reports.filter((r) => r.status === 'pending').length;

  // Debounced search suggestions fetching (searches for user ID, handles, titles, and tags)
  useEffect(() => {
    const q = searchQuery.trim();
    if (!q) {
      setSuggestions({
        userSuggestions: [],
        contentSuggestions: [],
        tagSuggestions: [],
        categorySuggestions: [],
      });
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoadingSuggestions(true);
      try {
        const res = await fetch(`/api/search/suggestions?q=${encodeURIComponent(q)}`);
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data);
        } else {
          // Client-side fallback if server endpoint is busy
          computeClientSuggestions(q);
        }
      } catch {
        computeClientSuggestions(q);
      } finally {
        setIsLoadingSuggestions(false);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [searchQuery, allUsers, pins]);

  const computeClientSuggestions = (query: string) => {
    const q = query.toLowerCase();
    const cleanUserQuery = q.replace(/^@/, '');

    // User ID & handle suggestions
    const matchedUsers = allUsers
      .filter(
        (u) =>
          u.id.toLowerCase().includes(q) ||
          u.username.toLowerCase().includes(cleanUserQuery) ||
          u.name.toLowerCase().includes(q)
      )
      .slice(0, 4)
      .map((u) => ({
        id: u.id,
        name: u.name,
        username: u.username,
        avatar: u.avatar,
        pinsCount: pins.filter((p) => p.userId === u.id).length,
        matchType: u.id.toLowerCase().includes(q) ? 'User ID' : 'Creator',
      }));

    // Content suggestions
    const matchedContent = pins
      .filter((p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
      .slice(0, 4)
      .map((p) => ({
        id: p.id,
        title: p.title,
        category: p.category,
        imageUrl: p.imageUrl,
        creatorName: p.creator.name,
        creatorId: p.creator.id,
      }));

    // Tags
    const allTags = new Set<string>();
    pins.forEach((p) => p.tags.forEach((t) => allTags.add(t.toLowerCase())));
    const cleanTag = q.replace(/^#/, '');
    const matchedTags = Array.from(allTags)
      .filter((t) => t.includes(cleanTag))
      .slice(0, 4)
      .map((tag) => ({
        tag,
        count: pins.filter((p) => p.tags.some((t) => t.toLowerCase() === tag)).length,
      }));

    setSuggestions({
      userSuggestions: matchedUsers,
      contentSuggestions: matchedContent,
      tagSuggestions: matchedTags,
      categorySuggestions: [],
    });
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileMenuOpen(false);
        setIsUserSwitcherOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      addRecentSearch(searchQuery);
      setSearchUserId(null);
      setCurrentView('search');
      setIsSearchFocused(false);
    }
  };

  const handleSelectUserSuggestion = (userId: string, username: string) => {
    setSearchUserId(userId);
    setSearchQuery(userId);
    addRecentSearch(userId);
    setCurrentView('search');
    setIsSearchFocused(false);
  };

  const handleSelectContentSuggestion = (pinId: string, title: string) => {
    const targetPin = pins.find((p) => p.id === pinId);
    if (targetPin) {
      openPinDetail(targetPin);
    } else {
      setSearchQuery(title);
      setCurrentView('search');
    }
    setIsSearchFocused(false);
  };

  const handleSelectTagSuggestion = (tag: string) => {
    setSearchQuery(`#${tag}`);
    setSearchUserId(null);
    addRecentSearch(`#${tag}`);
    setCurrentView('search');
    setIsSearchFocused(false);
  };

  const handleSelectRecentSearch = (term: string) => {
    setSearchQuery(term);
    if (term.startsWith('usr_')) {
      setSearchUserId(term);
    } else {
      setSearchUserId(null);
    }
    addRecentSearch(term);
    setCurrentView('search');
    setIsSearchFocused(false);
  };

  const hasSuggestions =
    suggestions.userSuggestions.length > 0 ||
    suggestions.contentSuggestions.length > 0 ||
    suggestions.tagSuggestions.length > 0 ||
    suggestions.categorySuggestions.length > 0;

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4 md:gap-8">
        
        {/* Zone 1: Brand & Primary Navigation */}
        <div className="flex items-center gap-3 md:gap-5 shrink-0">
          <button
            onClick={() => {
              setSearchQuery('');
              setSearchUserId(null);
              setCurrentView('feed');
            }}
            className="flex items-center gap-2.5 group cursor-pointer text-left"
            title="Codasa Home"
          >
            {/* Original Geometric Prism Logo */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 flex items-center justify-center shadow-sm shadow-rose-500/20 group-hover:scale-105 transition-transform">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-white">
                <path
                  d="M16 6.5C14.6 5.5 12.8 5 11 5C6.58 5 3 8.58 3 13C3 17.42 6.58 21 11 21C13.5 21 15.8 19.8 17.2 18"
                  stroke="currentColor"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                />
                <circle cx="16.5" cy="7.5" r="2.5" fill="#fef08a" />
              </svg>
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white block leading-none">
                Codasa
              </span>
              <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                <span>Live Feed</span>
              </span>
            </div>
          </button>

          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => {
                setSearchQuery('');
                setSearchUserId(null);
                setCurrentView('feed');
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold rounded-full transition-colors ${
                currentView === 'feed' && !searchQuery
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
              }`}
            >
              <Home className="w-4 h-4" />
              <span className="hidden md:inline">Home</span>
            </button>

            <button
              onClick={() => {
                setSearchQuery('');
                setSearchUserId(null);
                setCurrentView('explore');
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold rounded-full transition-colors ${
                currentView === 'explore'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span className="hidden md:inline">Explore</span>
            </button>

            <button
              onClick={() => openCreatePin()}
              className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-sm shadow-rose-600/20 transition-all cursor-pointer"
              title="Upload post (visible to all viewers)"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden md:inline">Create Post</span>
            </button>
          </nav>
        </div>

        {/* Zone 2: Universal Search Bar with Automatic Live Suggestions */}
        <div ref={searchContainerRef} className="flex-1 max-w-3xl relative">
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              placeholder="Search user ID (e.g. usr_kenji), creator @handle, title, or tags..."
              className="w-full pl-10 pr-9 py-2.5 text-sm bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-full border border-transparent focus:border-slate-300 dark:focus:border-slate-700 focus:bg-white dark:focus:bg-slate-950 focus:outline-none transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSearchUserId(null);
                }}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>

          {/* Automatic Live Search Suggestions Dropdown */}
          {isSearchFocused && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-4 z-50 max-h-[80vh] overflow-y-auto">
              
              {/* 1. Real-time User ID & Creator Suggestions */}
              {searchQuery.trim() && suggestions.userSuggestions.length > 0 && (
                <div className="mb-4">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-2 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    <span>Creators & User IDs</span>
                  </div>
                  <div className="space-y-1.5">
                    {suggestions.userSuggestions.map((u) => (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => handleSelectUserSuggestion(u.id, u.username)}
                        className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={u.avatar}
                            alt={u.name}
                            className="w-8 h-8 rounded-full object-cover bg-slate-200 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                {u.name}
                              </span>
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                {u.id}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-400">@{u.username}</span>
                          </div>
                        </div>
                        <span className="text-[11px] text-slate-400 group-hover:text-rose-600 font-medium tabular-nums shrink-0">
                          {u.pinsCount} posts →
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. Content & Post Suggestions */}
              {searchQuery.trim() && suggestions.contentSuggestions.length > 0 && (
                <div className="mb-4">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                    <span>Matching Posts</span>
                  </div>
                  <div className="space-y-1">
                    {suggestions.contentSuggestions.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleSelectContentSuggestion(p.id, p.title)}
                        className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors cursor-pointer"
                      >
                        <img
                          src={p.imageUrl}
                          alt={p.title}
                          className="w-8 h-10 object-cover rounded-md bg-slate-200 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                            {p.title}
                          </h4>
                          <span className="text-[11px] text-slate-400">
                            by {p.creatorName} · {p.category}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Matching Tags */}
              {searchQuery.trim() && suggestions.tagSuggestions.length > 0 && (
                <div className="mb-4">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 flex items-center gap-1.5">
                    <Hash className="w-3.5 h-3.5" />
                    <span>Tags & Topics</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.tagSuggestions.map((t) => (
                      <button
                        key={t.tag}
                        type="button"
                        onClick={() => handleSelectTagSuggestion(t.tag)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs text-slate-700 dark:text-slate-300 font-medium flex items-center gap-1.5 cursor-pointer"
                      >
                        <span className="text-rose-500 font-bold">#</span>
                        <span>{t.tag}</span>
                        <span className="text-[10px] text-slate-400 tabular-nums">({t.count})</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-400 dark:text-slate-500 mb-2">
                    <span>Recent Searches</span>
                    <button
                      onClick={clearRecentSearches}
                      className="hover:text-rose-500 transition-colors cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((term, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSelectRecentSearch(term)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                      >
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{term}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 5. Quick Inspiration Pills */}
              <div>
                <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 mb-2">
                  Popular Searches
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {[
                    { label: 'usr_kenji (Kenji Sato)', query: 'usr_kenji' },
                    { label: 'usr_maya (Maya Lin Chen)', query: 'usr_maya' },
                    { label: 'Alpine Aurora Cabin', query: 'aurora cabin' },
                    { label: 'Amalfi Plunge Pool Villa', query: 'amalfi villa' },
                    { label: 'Tokyo Cyber Cafe in Rain', query: 'coffee tokyo' },
                    { label: 'Sculptural Terracotta Vases', query: 'ceramics terracotta' },
                  ].map((topic, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSelectRecentSearch(topic.query)}
                      className="flex items-center gap-2 p-2 text-left text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span className="font-medium truncate">{topic.label}</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>

        {/* Zone 3: Actions, Viewer Switcher & Profile */}
        <div className="flex items-center gap-2 shrink-0">
          
          {/* Viewer / Creator Profile Switcher Button (Allows testing multi-user visibility) */}
          <div className="relative">
            <button
              onClick={() => setIsUserSwitcherOpen(!isUserSwitcherOpen)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
              title="Switch active viewer to test post visibility"
            >
              <Users className="w-3.5 h-3.5 text-rose-500" />
              <span className="truncate max-w-[100px]">{currentUser.name.split(' ')[0]}</span>
              <span className="text-[10px] text-slate-400">({currentUser.id})</span>
            </button>

            {isUserSwitcherOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Switch Viewer Profile
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Upload posts as one viewer and see them instantly appear for other viewers!
                  </p>
                </div>
                <div className="space-y-1 max-h-60 overflow-y-auto">
                  {allUsers.map((u) => {
                    const isSelected = u.id === currentUser.id;
                    return (
                      <button
                        key={u.id}
                        onClick={() => {
                          switchCurrentUser(u.id);
                          setIsUserSwitcherOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <img
                            src={u.avatar}
                            alt={u.name}
                            className="w-7 h-7 rounded-full object-cover bg-slate-200"
                            referrerPolicy="no-referrer"
                          />
                          <div className="min-w-0">
                            <span className="text-xs font-bold truncate block">{u.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono block">
                              ID: {u.id}
                            </span>
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-rose-500 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Download Project ZIP Button */}
          <button
            onClick={() => setIsExportZipOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
            title="Download full project code as ZIP"
          >
            <Download className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
            <span className="hidden xl:inline">Download ZIP</span>
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-full transition-colors cursor-pointer"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Notifications Popover */}
          <div ref={notifRef} className="relative">
            <button
              onClick={() => {
                setIsNotifOpen(!isNotifOpen);
                if (!isNotifOpen && unreadNotifsCount > 0) {
                  markNotificationsAsRead();
                }
              }}
              className="p-2 relative text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-full transition-colors cursor-pointer"
              title="Notifications"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-600 rounded-full ring-2 ring-white dark:ring-slate-950" />
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-84 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-4 z-50">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Activity Updates</h3>
                  <button
                    onClick={markNotificationsAsRead}
                    className="text-xs text-rose-600 hover:underline cursor-pointer"
                  >
                    Mark read
                  </button>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-80 overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className="py-3 flex items-start gap-3">
                      <img
                        src={n.actor.avatar}
                        alt={n.actor.name}
                        className="w-8 h-8 rounded-full bg-slate-100 shrink-0 object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-800 dark:text-slate-200 leading-snug">
                          <span className="font-semibold">{n.actor.name}</span> {n.message}
                        </p>
                        <span className="text-[11px] text-slate-400 mt-1 block">{n.createdAt}</span>
                      </div>
                      {n.pinImage && (
                        <img
                          src={n.pinImage}
                          alt="Pin thumbnail"
                          className="w-9 h-12 object-cover rounded-md shrink-0 bg-slate-200"
                          referrerPolicy="no-referrer"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Trigger */}
          <div ref={profileRef} className="relative">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-1.5 p-1 rounded-full hover:ring-2 hover:ring-rose-500/50 transition-all cursor-pointer"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full bg-slate-200 object-cover"
                referrerPolicy="no-referrer"
              />
            </button>

            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl py-2 z-50">
                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {currentUser.name}
                  </p>
                  <p className="text-xs text-slate-400 truncate">@{currentUser.username}</p>
                  <span className="text-[10px] font-mono text-rose-500 dark:text-rose-400 block mt-0.5">
                    User ID: {currentUser.id}
                  </span>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setCurrentView('profile');
                      setIsProfileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <Bookmark className="w-4 h-4 text-slate-400" />
                    <span>View Profile & Change Photo</span>
                  </button>

                  <button
                    onClick={() => {
                      openCreatePin();
                      setIsProfileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-slate-400" />
                    <span>Create & Broadcast Post</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsUserSwitcherOpen(true);
                      setIsProfileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <Users className="w-4 h-4 text-slate-400" />
                    <span>Switch Viewer Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsAdminModalOpen(true);
                      setIsProfileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-amber-500" />
                      <span>Moderation Queue</span>
                    </div>
                    {pendingReportsCount > 0 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-rose-600 text-white font-bold">
                        {pendingReportsCount}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setIsExportZipOpen(true);
                      setIsProfileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-rose-500" />
                    <span>Download Project ZIP</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </header>
  );
};
