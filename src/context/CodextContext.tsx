import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  User,
  Pin,
  Board,
  NotificationItem,
  PinComment,
  PinReport,
  ActiveTab,
  BoardCollaborator,
} from '../types';
import {
  CURRENT_USER,
  CREATORS,
  INITIAL_PINS,
  INITIAL_BOARDS,
  INITIAL_COMMENTS,
  INITIAL_NOTIFICATIONS,
} from '../data/seedData';

interface CodextContextType {
  currentUser: User;
  allUsers: User[];
  switchCurrentUser: (userId: string) => void;
  pins: Pin[];
  boards: Board[];
  creators: User[];
  savedPinIds: string[];
  likedPinIds: string[];
  followingUserIds: string[];
  comments: PinComment[];
  notifications: NotificationItem[];
  reports: PinReport[];
  recentSearches: string[];
  activeCategory: string;
  searchQuery: string;
  searchUserId: string | null;
  currentView: ActiveTab;
  selectedBoardId: string | null;
  selectedPin: Pin | null;
  isCreatePinOpen: boolean;
  createPinDefaultBoardId: string | null;
  isAdminModalOpen: boolean;
  isOnboardingOpen: boolean;
  isShareModalOpen: boolean;
  shareTarget: { title: string; url: string; imageUrl?: string } | null;
  isExportZipOpen: boolean;
  theme: 'light' | 'dark';
  isLiveConnected: boolean;
  
  // Navigation & View actions
  setCurrentView: (view: ActiveTab) => void;
  setActiveCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  setSearchUserId: (userId: string | null) => void;
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
  openBoardDetail: (boardId: string) => void;
  openPinDetail: (pin: Pin | null) => void;
  openCreatePin: (defaultBoardId?: string) => void;
  closeCreatePin: () => void;
  setIsAdminModalOpen: (open: boolean) => void;
  setIsOnboardingOpen: (open: boolean) => void;
  openShareModal: (pin: Pin) => void;
  closeShareModal: () => void;
  setIsExportZipOpen: (open: boolean) => void;
  toggleTheme: () => void;

  // Pin & Board Actions
  toggleLikePin: (pinId: string) => void;
  savePinToBoard: (pinId: string, boardId: string) => void;
  removePinFromBoard: (boardId: string, pinId: string) => void;
  createPin: (data: {
    title: string;
    description: string;
    imageUrl: string;
    destinationUrl?: string;
    category: string;
    tags: string[];
    boardId?: string;
    aspectRatio?: number;
  }) => Pin;
  deletePin: (pinId: string) => void;
  createBoard: (title: string, description: string, isPrivate: boolean, initialPinId?: string) => Board;
  updateBoard: (boardId: string, title: string, description: string, isPrivate: boolean) => void;
  deleteBoard: (boardId: string) => void;
  addBoardSection: (boardId: string, title: string) => void;
  addBoardCollaborator: (boardId: string, collaborator: { name: string; username: string }) => void;
  movePinToSection: (boardId: string, pinId: string, sectionId?: string) => void;

  // Social Actions
  toggleFollowUser: (userId: string) => void;
  addComment: (pinId: string, text: string) => void;
  addCommentReply: (pinId: string, commentId: string, text: string) => void;
  deleteComment: (commentId: string) => void;
  markNotificationsAsRead: () => void;

  // Moderation
  fileReport: (pinId: string, reason: PinReport['reason'], details: string) => void;
  resolveReport: (reportId: string, action: 'remove' | 'dismiss') => void;

  // Profile Edit
  updateProfile: (data: Partial<User>) => void;
  resetToDefaults: () => void;
}

const CodextContext = createContext<CodextContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PINS: 'codasa_pins_v3',
  BOARDS: 'codasa_boards_v3',
  LIKED: 'codasa_liked_v3',
  SAVED: 'codasa_saved_v3',
  FOLLOWING: 'codasa_following_v3',
  COMMENTS: 'codasa_comments_v3',
  NOTIFICATIONS: 'codasa_notifs_v3',
  REPORTS: 'codasa_reports_v3',
  SEARCHES: 'codasa_searches_v3',
  USER: 'codasa_user_v3',
  THEME: 'codasa_theme_v3',
  ONBOARDED: 'codasa_onboarded_v3',
};

const ALL_INITIAL_USERS: User[] = [CURRENT_USER, ...CREATORS];

export const CodextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    if (saved === 'light' || saved === 'dark') return saved;
    return 'dark';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // User Profile
  const [allUsers, setAllUsers] = useState<User[]>(ALL_INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    return saved ? JSON.parse(saved) : CURRENT_USER;
  });

  // Pins state
  const [pins, setPins] = useState<Pin[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PINS);
    return saved ? JSON.parse(saved) : INITIAL_PINS;
  });

  // Boards
  const [boards, setBoards] = useState<Board[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BOARDS);
    return saved ? JSON.parse(saved) : INITIAL_BOARDS;
  });

  // Liked Pins
  const [likedPinIds, setLikedPinIds] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LIKED);
    return saved ? JSON.parse(saved) : ['pin_aurora', 'pin_mediterranean'];
  });

  // Saved Pins (Aggregate across boards)
  const [savedPinIds, setSavedPinIds] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SAVED);
    if (saved) return JSON.parse(saved);
    const initialSaved = new Set<string>();
    INITIAL_BOARDS.forEach((b) => b.pinIds.forEach((p) => initialSaved.add(p)));
    return Array.from(initialSaved);
  });

  // Following Creators
  const [followingUserIds, setFollowingUserIds] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FOLLOWING);
    return saved ? JSON.parse(saved) : ['usr_elena', 'usr_kenji', 'usr_maya'];
  });

  // Comments
  const [comments, setComments] = useState<PinComment[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COMMENTS);
    return saved ? JSON.parse(saved) : INITIAL_COMMENTS;
  });

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // Moderation Reports
  const [reports, setReports] = useState<PinReport[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REPORTS);
    if (saved) return JSON.parse(saved);
    return [];
  });

  // Recent Searches
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SEARCHES);
    return saved ? JSON.parse(saved) : ['usr_kenji', 'Alpine aurora', 'Tokyo cyber cafe', 'Amalfi coast'];
  });

  // Navigation & Dialog states
  const [currentView, setCurrentView] = useState<ActiveTab>('feed');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchUserId, setSearchUserId] = useState<string | null>(null);
  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null);
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null);
  const [isCreatePinOpen, setIsCreatePinOpen] = useState<boolean>(false);
  const [createPinDefaultBoardId, setCreatePinDefaultBoardId] = useState<string | null>(null);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(() => {
    return !localStorage.getItem(STORAGE_KEYS.ONBOARDED);
  });
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [shareTarget, setShareTarget] = useState<{ title: string; url: string; imageUrl?: string } | null>(null);
  const [isExportZipOpen, setIsExportZipOpen] = useState<boolean>(false);
  const [isLiveConnected, setIsLiveConnected] = useState<boolean>(true);

  // Broadcast channel for multi-tab sync
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);

  // Switch current viewer/creator profile
  const switchCurrentUser = (userId: string) => {
    const target = allUsers.find((u) => u.id === userId);
    if (target) {
      setCurrentUser(target);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(target));
      const notif: NotificationItem = {
        id: 'notif_' + Date.now(),
        type: 'follow',
        userId: target.id,
        actor: {
          name: target.name,
          username: target.username,
          avatar: target.avatar,
        },
        message: `Switched viewer profile to ${target.name} (${target.id})`,
        read: false,
        createdAt: 'Just now',
      };
      setNotifications((prev) => [notif, ...prev]);
    }
  };

  // --- SERVER SYNCHRONIZATION (Ensures posts from any viewer/creator are visible to all other viewers) ---
  const fetchServerPins = async () => {
    try {
      const res = await fetch('/api/pins');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.pins) && data.pins.length > 0) {
          setPins(data.pins);
          localStorage.setItem(STORAGE_KEYS.PINS, JSON.stringify(data.pins));
        }
      }
    } catch (err) {
      // Fallback to local storage if offline
    }
  };

  const fetchServerUsers = async () => {
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.users)) {
          setAllUsers(data.users);
        }
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    // 1. Initial fetch from server
    fetchServerPins();
    fetchServerUsers();

    // 2. Setup Server-Sent Events (SSE) for immediate live updates across viewers
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource('/api/live/stream');
      
      eventSource.addEventListener('pin_created', (e: MessageEvent) => {
        try {
          const newPin = JSON.parse(e.data) as Pin;
          setPins((prevPins) => {
            if (prevPins.some((p) => p.id === newPin.id)) return prevPins;
            return [newPin, ...prevPins];
          });
          setIsLiveConnected(true);
        } catch {
          // ignore
        }
      });

      eventSource.addEventListener('pin_deleted', (e: MessageEvent) => {
        try {
          const { id } = JSON.parse(e.data);
          setPins((prev) => prev.filter((p) => p.id !== id));
        } catch {
          // ignore
        }
      });

      eventSource.addEventListener('pin_updated', (e: MessageEvent) => {
        try {
          const updatedPin = JSON.parse(e.data) as Pin;
          setPins((prev) => prev.map((p) => (p.id === updatedPin.id ? updatedPin : p)));
        } catch {
          // ignore
        }
      });

      eventSource.onopen = () => setIsLiveConnected(true);
      eventSource.onerror = () => setIsLiveConnected(false);
    } catch {
      setIsLiveConnected(false);
    }

    // 3. Setup BroadcastChannel for zero-latency multi-tab updates
    try {
      const bc = new BroadcastChannel('codasa_live_pins_v3');
      broadcastChannelRef.current = bc;
      bc.onmessage = (event) => {
        if (event.data?.type === 'PIN_CREATED' && event.data.pin) {
          const incomingPin = event.data.pin;
          setPins((prev) => (prev.some((p) => p.id === incomingPin.id) ? prev : [incomingPin, ...prev]));
        } else if (event.data?.type === 'USER_UPDATED' && event.data.user) {
          setAllUsers((prev) => prev.map((u) => (u.id === event.data.user.id ? event.data.user : u)));
        }
      };
    } catch {
      // BroadcastChannel unsupported
    }

    // 4. Polling fallback every 5 seconds to ensure any new posts from other devices appear
    const pollInterval = setInterval(() => {
      fetchServerPins();
    }, 5000);

    return () => {
      clearInterval(pollInterval);
      if (eventSource) eventSource.close();
      if (broadcastChannelRef.current) broadcastChannelRef.current.close();
    };
  }, []);

  // Persistence effects
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PINS, JSON.stringify(pins));
  }, [pins]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BOARDS, JSON.stringify(boards));
  }, [boards]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LIKED, JSON.stringify(likedPinIds));
  }, [likedPinIds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SAVED, JSON.stringify(savedPinIds));
  }, [savedPinIds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FOLLOWING, JSON.stringify(followingUserIds));
  }, [followingUserIds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(comments));
  }, [comments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SEARCHES, JSON.stringify(recentSearches));
  }, [recentSearches]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
  }, [currentUser]);

  // Handlers
  const addRecentSearch = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setRecentSearches((prev) => [trimmed, ...prev.filter((q) => q.toLowerCase() !== trimmed.toLowerCase())].slice(0, 8));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  const openBoardDetail = (boardId: string) => {
    setSelectedBoardId(boardId);
    setCurrentView('board-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openPinDetail = (pin: Pin | null) => {
    setSelectedPin(pin);
  };

  const openCreatePin = (defaultBoardId?: string) => {
    setCreatePinDefaultBoardId(defaultBoardId || null);
    setIsCreatePinOpen(true);
  };

  const closeCreatePin = () => {
    setIsCreatePinOpen(false);
    setCreatePinDefaultBoardId(null);
  };

  const openShareModal = (pin: Pin) => {
    setShareTarget({
      title: pin.title,
      url: window.location.origin + '?pin=' + pin.id,
      imageUrl: pin.imageUrl,
    });
    setIsShareModalOpen(true);
  };

  const closeShareModal = () => {
    setIsShareModalOpen(false);
    setShareTarget(null);
  };

  const toggleLikePin = (pinId: string) => {
    setLikedPinIds((prev) => {
      const isLiked = prev.includes(pinId);
      const next = isLiked ? prev.filter((id) => id !== pinId) : [...prev, pinId];
      // Update pin counter
      setPins((currPins) =>
        currPins.map((p) => {
          if (p.id === pinId) {
            return {
              ...p,
              likesCount: Math.max(0, p.likesCount + (isLiked ? -1 : 1)),
            };
          }
          return p;
        })
      );
      if (selectedPin && selectedPin.id === pinId) {
        setSelectedPin((curr) =>
          curr ? { ...curr, likesCount: Math.max(0, curr.likesCount + (isLiked ? -1 : 1)) } : null
        );
      }

      // Notify server
      fetch(`/api/pins/${pinId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isLiked: !isLiked }),
      }).catch(() => {});

      return next;
    });
  };

  const savePinToBoard = (pinId: string, boardId: string) => {
    setBoards((prevBoards) =>
      prevBoards.map((b) => {
        if (b.id === boardId) {
          if (b.pinIds.includes(pinId)) return b;
          return {
            ...b,
            pinIds: [pinId, ...b.pinIds],
            coverImage: b.coverImage || (pins.find((p) => p.id === pinId)?.imageUrl || ''),
          };
        }
        return b;
      })
    );

    setSavedPinIds((prev) => (prev.includes(pinId) ? prev : [...prev, pinId]));

    setPins((prevPins) =>
      prevPins.map((p) => {
        if (p.id === pinId) {
          return { ...p, savesCount: p.savesCount + 1 };
        }
        return p;
      })
    );

    if (selectedPin && selectedPin.id === pinId) {
      setSelectedPin((curr) => (curr ? { ...curr, savesCount: curr.savesCount + 1 } : null));
    }

    // Notify server
    fetch(`/api/pins/${pinId}/save`, { method: 'POST' }).catch(() => {});

    // Add activity notification
    const targetBoard = boards.find((b) => b.id === boardId);
    const targetPin = pins.find((p) => p.id === pinId);
    if (targetPin && targetBoard) {
      const newNotif: NotificationItem = {
        id: 'notif_' + Date.now(),
        type: 'save',
        userId: currentUser.id,
        actor: {
          name: currentUser.name,
          username: currentUser.username,
          avatar: currentUser.avatar,
        },
        pinId,
        pinImage: targetPin.imageUrl,
        boardId,
        boardTitle: targetBoard.title,
        message: `saved "${targetPin.title}" to board "${targetBoard.title}"`,
        read: false,
        createdAt: 'Just now',
      };
      setNotifications((prev) => [newNotif, ...prev]);
    }
  };

  const removePinFromBoard = (boardId: string, pinId: string) => {
    setBoards((prevBoards) =>
      prevBoards.map((b) => {
        if (b.id === boardId) {
          const nextPinIds = b.pinIds.filter((id) => id !== pinId);
          const nextSections = b.sections.map((s) => ({
            ...s,
            pinIds: s.pinIds.filter((id) => id !== pinId),
          }));
          return {
            ...b,
            pinIds: nextPinIds,
            sections: nextSections,
          };
        }
        return b;
      })
    );
  };

  // UPLOAD A POST: Visible to this creator AND ALL OTHER VIEWERS
  const createPin = (data: {
    title: string;
    description: string;
    imageUrl: string;
    destinationUrl?: string;
    category: string;
    tags: string[];
    boardId?: string;
    aspectRatio?: number;
  }): Pin => {
    const newPin: Pin = {
      id: 'pin_' + Date.now(),
      title: data.title || 'Untitled Pin',
      description: data.description || '',
      imageUrl: data.imageUrl,
      aspectRatio: data.aspectRatio || 0.75,
      dominantColor: '#1e293b',
      destinationUrl: data.destinationUrl,
      category: data.category || 'General',
      tags: data.tags.length > 0 ? data.tags : ['inspiration'],
      userId: currentUser.id,
      creator: {
        id: currentUser.id,
        name: currentUser.name,
        username: currentUser.username,
        avatar: currentUser.avatar,
      },
      likesCount: 0,
      savesCount: 0,
      createdAt: new Date().toISOString(),
    };

    // 1. Optimistically update local state & localStorage
    setPins((prev) => [newPin, ...prev]);

    if (data.boardId) {
      savePinToBoard(newPin.id, data.boardId);
    }

    // 2. Broadcast via BroadcastChannel to other open tabs
    try {
      broadcastChannelRef.current?.postMessage({
        type: 'PIN_CREATED',
        pin: newPin,
      });
    } catch {
      // ignore
    }

    // 3. Send to Server API so ALL other viewers and devices see this upload!
    fetch('/api/pins', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...newPin,
        userId: currentUser.id,
        creator: newPin.creator,
      }),
    })
      .then((res) => res.json())
      .then((serverData) => {
        if (serverData.pin) {
          // Sync server pin ID if needed
          setPins((prev) => prev.map((p) => (p.id === newPin.id ? serverData.pin : p)));
        }
      })
      .catch((err) => {
        console.warn('Server offline, pin stored locally in browser:', err);
      });

    // 4. Add notification for upload
    const uploadNotif: NotificationItem = {
      id: 'notif_' + Date.now(),
      type: 'save',
      userId: currentUser.id,
      actor: {
        name: currentUser.name,
        username: currentUser.username,
        avatar: currentUser.avatar,
      },
      pinId: newPin.id,
      pinImage: newPin.imageUrl,
      message: `published new post: "${newPin.title}" (visible to all viewers)`,
      read: false,
      createdAt: 'Just now',
    };
    setNotifications((prev) => [uploadNotif, ...prev]);

    return newPin;
  };

  const deletePin = (pinId: string) => {
    setPins((prev) => prev.filter((p) => p.id !== pinId));
    setBoards((prevBoards) =>
      prevBoards.map((b) => ({
        ...b,
        pinIds: b.pinIds.filter((id) => id !== pinId),
        sections: b.sections.map((s) => ({
          ...s,
          pinIds: s.pinIds.filter((id) => id !== pinId),
        })),
      }))
    );
    setSavedPinIds((prev) => prev.filter((id) => id !== pinId));
    setLikedPinIds((prev) => prev.filter((id) => id !== pinId));
    if (selectedPin?.id === pinId) {
      setSelectedPin(null);
    }

    // Notify server
    fetch(`/api/pins/${pinId}`, { method: 'DELETE' }).catch(() => {});
  };

  const createBoard = (
    title: string,
    description: string,
    isPrivate: boolean,
    initialPinId?: string
  ): Board => {
    const pin = initialPinId ? pins.find((p) => p.id === initialPinId) : null;
    const newBoard: Board = {
      id: 'board_' + Date.now(),
      userId: currentUser.id,
      title: title.trim() || 'Untitled Board',
      description: description.trim() || '',
      coverImage: pin ? pin.imageUrl : pins[0]?.imageUrl || '',
      isPrivate,
      pinIds: initialPinId ? [initialPinId] : [],
      sections: [],
      collaborators: [],
      createdAt: new Date().toISOString(),
    };

    setBoards((prev) => [newBoard, ...prev]);

    // Send to server
    fetch('/api/boards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBoard),
    }).catch(() => {});

    return newBoard;
  };

  const updateBoard = (boardId: string, title: string, description: string, isPrivate: boolean) => {
    setBoards((prev) =>
      prev.map((b) =>
        b.id === boardId
          ? {
              ...b,
              title: title.trim(),
              description: description.trim(),
              isPrivate,
            }
          : b
      )
    );
  };

  const deleteBoard = (boardId: string) => {
    setBoards((prev) => prev.filter((b) => b.id !== boardId));
    if (selectedBoardId === boardId) {
      setSelectedBoardId(null);
      setCurrentView('profile');
    }
  };

  const addBoardSection = (boardId: string, title: string) => {
    if (!title.trim()) return;
    setBoards((prev) =>
      prev.map((b) => {
        if (b.id === boardId) {
          const newSection = {
            id: 'sec_' + Date.now(),
            boardId,
            title: title.trim(),
            pinIds: [],
          };
          return {
            ...b,
            sections: [...b.sections, newSection],
          };
        }
        return b;
      })
    );
  };

  const addBoardCollaborator = (
    boardId: string,
    collaborator: { name: string; username: string }
  ) => {
    setBoards((prev) =>
      prev.map((b) => {
        if (b.id === boardId) {
          const newCollab: BoardCollaborator = {
            id: 'collab_' + Date.now(),
            name: collaborator.name,
            username: collaborator.username,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${collaborator.username}`,
            role: 'editor',
          };
          return {
            ...b,
            collaborators: [...b.collaborators, newCollab],
          };
        }
        return b;
      })
    );
  };

  const movePinToSection = (boardId: string, pinId: string, sectionId?: string) => {
    setBoards((prev) =>
      prev.map((b) => {
        if (b.id === boardId) {
          const updatedSections = b.sections.map((sec) => {
            if (sec.id === sectionId) {
              return sec.pinIds.includes(pinId) ? sec : { ...sec, pinIds: [...sec.pinIds, pinId] };
            } else {
              return { ...sec, pinIds: sec.pinIds.filter((id) => id !== pinId) };
            }
          });
          return {
            ...b,
            sections: updatedSections,
          };
        }
        return b;
      })
    );
  };

  const toggleFollowUser = (userId: string) => {
    setFollowingUserIds((prev) => {
      const isFollowing = prev.includes(userId);
      const next = isFollowing ? prev.filter((id) => id !== userId) : [...prev, userId];

      // Update following count
      setCurrentUser((curr) => ({
        ...curr,
        followingCount: Math.max(0, curr.followingCount + (isFollowing ? -1 : 1)),
      }));

      // Create notification
      const creator = allUsers.find((c) => c.id === userId);
      if (!isFollowing && creator) {
        const notif: NotificationItem = {
          id: 'notif_' + Date.now(),
          type: 'follow',
          userId: currentUser.id,
          actor: {
            name: currentUser.name,
            username: currentUser.username,
            avatar: currentUser.avatar,
          },
          message: `started following ${creator.name}`,
          read: false,
          createdAt: 'Just now',
        };
        setNotifications((n) => [notif, ...n]);
      }

      return next;
    });
  };

  const addComment = (pinId: string, text: string) => {
    if (!text.trim()) return;
    const newComment: PinComment = {
      id: 'cmt_' + Date.now(),
      pinId,
      userId: currentUser.id,
      user: {
        name: currentUser.name,
        username: currentUser.username,
        avatar: currentUser.avatar,
      },
      text: text.trim(),
      createdAt: 'Just now',
      likesCount: 0,
      replies: [],
    };
    setComments((prev) => [newComment, ...prev]);

    // Send to server
    fetch(`/api/pins/${pinId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, user: currentUser }),
    }).catch(() => {});

    // Send notification
    const pin = pins.find((p) => p.id === pinId);
    if (pin && pin.userId !== currentUser.id) {
      const notif: NotificationItem = {
        id: 'notif_' + Date.now(),
        type: 'comment',
        userId: pin.userId,
        actor: {
          name: currentUser.name,
          username: currentUser.username,
          avatar: currentUser.avatar,
        },
        pinId,
        pinImage: pin.imageUrl,
        message: `commented: "${text.substring(0, 40)}${text.length > 40 ? '...' : ''}"`,
        read: false,
        createdAt: 'Just now',
      };
      setNotifications((n) => [notif, ...n]);
    }
  };

  const addCommentReply = (pinId: string, commentId: string, text: string) => {
    if (!text.trim()) return;
    const newReply = {
      id: 'rep_' + Date.now(),
      userId: currentUser.id,
      user: {
        name: currentUser.name,
        username: currentUser.username,
        avatar: currentUser.avatar,
      },
      text: text.trim(),
      createdAt: 'Just now',
      likesCount: 0,
    };

    setComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId) {
          return {
            ...c,
            replies: [...(c.replies || []), newReply],
          };
        }
        return c;
      })
    );
  };

  const deleteComment = (commentId: string) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  };

  const markNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const fileReport = (pinId: string, reason: PinReport['reason'], details: string) => {
    const pin = pins.find((p) => p.id === pinId);
    const newReport: PinReport = {
      id: 'rep_' + Date.now(),
      pinId,
      pinTitle: pin ? pin.title : 'Reported Pin',
      pinImage: pin ? pin.imageUrl : '',
      reporterName: currentUser.name,
      reason,
      details,
      status: 'pending',
      createdAt: 'Just now',
    };
    setReports((prev) => [newReport, ...prev]);
  };

  const resolveReport = (reportId: string, action: 'remove' | 'dismiss') => {
    setReports((prev) =>
      prev.map((r) => {
        if (r.id === reportId) {
          if (action === 'remove') {
            deletePin(r.pinId);
            return { ...r, status: 'resolved' };
          }
          return { ...r, status: 'dismissed' };
        }
        return r;
      })
    );
  };

  const updateProfile = (data: Partial<User>) => {
    setCurrentUser((prev) => {
      const updated = { ...prev, ...data };
      
      // Sync creator info in existing pins
      if (data.avatar || data.name || data.username) {
        setPins((currentPins) =>
          currentPins.map((p) => {
            if (p.userId === updated.id) {
              return {
                ...p,
                creator: {
                  ...p.creator,
                  name: data.name || p.creator.name,
                  username: data.username || p.creator.username,
                  avatar: data.avatar || p.creator.avatar,
                },
              };
            }
            return p;
          })
        );

        // Sync author info in user comments
        setComments((currComments) =>
          currComments.map((c) => {
            if (c.userId === updated.id) {
              return {
                ...c,
                user: {
                  ...c.user,
                  name: data.name || c.user.name,
                  username: data.username || c.user.username,
                  avatar: data.avatar || c.user.avatar,
                },
              };
            }
            return c;
          })
        );
      }

      // Sync allUsers
      setAllUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === updated.id ? updated : u))
      );

      // Save to server
      fetch('/api/users/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      }).catch(() => {});

      return updated;
    });
  };

  const resetToDefaults = () => {
    localStorage.clear();
    setPins(INITIAL_PINS);
    setBoards(INITIAL_BOARDS);
    setComments(INITIAL_COMMENTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setCurrentUser(CURRENT_USER);
    setLikedPinIds(['pin_aurora', 'pin_mediterranean']);
    const initialSaved = new Set<string>();
    INITIAL_BOARDS.forEach((b) => b.pinIds.forEach((p) => initialSaved.add(p)));
    setSavedPinIds(Array.from(initialSaved));
    setFollowingUserIds(['usr_elena', 'usr_kenji', 'usr_maya']);
    setCurrentView('feed');
    setSearchQuery('');
    setSearchUserId(null);
  };

  return (
    <CodextContext.Provider
      value={{
        currentUser,
        allUsers,
        switchCurrentUser,
        pins,
        boards,
        creators: allUsers.filter((u) => u.id !== currentUser.id),
        savedPinIds,
        likedPinIds,
        followingUserIds,
        comments,
        notifications,
        reports,
        recentSearches,
        activeCategory,
        searchQuery,
        searchUserId,
        currentView,
        selectedBoardId,
        selectedPin,
        isCreatePinOpen,
        createPinDefaultBoardId,
        isAdminModalOpen,
        isOnboardingOpen,
        isShareModalOpen,
        shareTarget,
        isExportZipOpen,
        theme,
        isLiveConnected,
        setCurrentView,
        setActiveCategory,
        setSearchQuery,
        setSearchUserId,
        addRecentSearch,
        clearRecentSearches,
        openBoardDetail,
        openPinDetail,
        openCreatePin,
        closeCreatePin,
        setIsAdminModalOpen,
        setIsOnboardingOpen,
        openShareModal,
        closeShareModal,
        setIsExportZipOpen,
        toggleTheme,
        toggleLikePin,
        savePinToBoard,
        removePinFromBoard,
        createPin,
        deletePin,
        createBoard,
        updateBoard,
        deleteBoard,
        addBoardSection,
        addBoardCollaborator,
        movePinToSection,
        toggleFollowUser,
        addComment,
        addCommentReply,
        deleteComment,
        markNotificationsAsRead,
        fileReport,
        resolveReport,
        updateProfile,
        resetToDefaults,
      }}
    >
      {children}
    </CodextContext.Provider>
  );
};

export const useCodext = () => {
  const context = useContext(CodextContext);
  if (!context) {
    throw new Error('useCodext must be used within a CodextProvider');
  }
  return context;
};
