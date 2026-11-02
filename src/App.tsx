import React, { useState } from 'react';
import { CodextProvider, useCodext } from './context/CodextContext';
import { Navbar } from './components/Navbar';
import { CategoryChips } from './components/CategoryChips';
import { PinCard } from './components/PinCard';
import { PinDetailModal } from './components/PinDetailModal';
import { CreatePinModal } from './components/CreatePinModal';
import { BoardDetailView } from './components/BoardDetailView';
import { ExploreView } from './components/ExploreView';
import { ProfileView } from './components/ProfileView';
import { AdminModerationModal } from './components/AdminModerationModal';
import { ShareModal } from './components/ShareModal';
import { OnboardingModal } from './components/OnboardingModal';
import { ExportZipModal } from './components/ExportZipModal';
import {
  Search,
  Sparkles,
  Users,
  Bookmark,
  Layers,
  ArrowRight,
  RefreshCw,
  Plus,
} from 'lucide-react';

const MainContent: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    activeCategory,
    searchQuery,
    setSearchQuery,
    searchUserId,
    setSearchUserId,
    pins,
    boards,
    creators,
    followingUserIds,
    toggleFollowUser,
    openBoardDetail,
    openCreatePin,
  } = useCodext();

  const [searchTab, setSearchTab] = useState<'pins' | 'boards' | 'creators'>('pins');
  const [visibleCount, setVisibleCount] = useState<number>(24);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  // Filter Pins for Feed
  const feedPins = pins.filter((pin) => {
    if (activeCategory === 'All') return true;
    return pin.category.toLowerCase() === activeCategory.toLowerCase();
  });

  // User ID / Creator Detection
  const rawQuery = searchQuery.trim();
  const queryLower = rawQuery.toLowerCase();

  const matchedCreatorByQuery = creators.find(
    (c) =>
      c.id.toLowerCase() === queryLower ||
      c.username.toLowerCase() === queryLower.replace(/^@/, '') ||
      `@${c.username.toLowerCase()}` === queryLower ||
      (searchUserId && c.id.toLowerCase() === searchUserId.toLowerCase())
  );

  const activeUserId = searchUserId || (rawQuery.startsWith('usr_') ? rawQuery : matchedCreatorByQuery?.id || null);
  const spotlightCreator = matchedCreatorByQuery || (activeUserId ? creators.find((c) => c.id.toLowerCase() === activeUserId.toLowerCase()) : null);

  // Filter Pins for Search (matches user ID, creator handle, title, description, category, tags)
  const matchedPins = pins.filter((p) => {
    if (activeUserId) {
      const matchUserId = p.userId?.toLowerCase() === activeUserId.toLowerCase();
      const matchCreatorId = p.creator.id?.toLowerCase() === activeUserId.toLowerCase();
      const matchUsername = spotlightCreator && p.creator.username?.toLowerCase() === spotlightCreator.username.toLowerCase();
      if (matchUserId || matchCreatorId || matchUsername) {
        return true;
      }
    }

    if (!queryLower) return true;

    return (
      p.title.toLowerCase().includes(queryLower) ||
      p.description.toLowerCase().includes(queryLower) ||
      p.category.toLowerCase().includes(queryLower) ||
      p.tags.some((t) => t.toLowerCase().includes(queryLower)) ||
      p.creator.name.toLowerCase().includes(queryLower) ||
      p.creator.username.toLowerCase().includes(queryLower) ||
      (p.userId && p.userId.toLowerCase().includes(queryLower))
    );
  });

  // Filter Boards for Search
  const matchedBoards = boards.filter((b) => {
    if (activeUserId && b.userId) {
      if (b.userId.toLowerCase() === activeUserId.toLowerCase()) return true;
    }
    return (
      b.title.toLowerCase().includes(queryLower) ||
      b.description.toLowerCase().includes(queryLower)
    );
  });

  // Filter Creators for Search
  const matchedCreators = creators.filter((c) => {
    if (activeUserId && c.id.toLowerCase() === activeUserId.toLowerCase()) return true;
    return (
      c.id.toLowerCase().includes(queryLower) ||
      c.name.toLowerCase().includes(queryLower) ||
      c.username.toLowerCase().includes(queryLower) ||
      c.bio.toLowerCase().includes(queryLower)
    );
  });

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + 12);
      setIsLoadingMore(false);
    }, 400);
  };

  // Render Based on View
  if (currentView === 'explore') {
    return <ExploreView />;
  }

  if (currentView === 'profile') {
    return <ProfileView />;
  }

  if (currentView === 'board-detail') {
    return <BoardDetailView />;
  }

  // Search Results View
  if (currentView === 'search' || (searchQuery.trim().length > 0 && currentView === 'feed') || searchUserId) {
    return (
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 py-6 animate-in fade-in duration-200">
        
        {/* Creator Spotlight Header if searching a User ID or creator */}
        {spotlightCreator && (
          <div className="mb-6 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-slate-50 via-rose-50/20 to-white dark:from-slate-900 dark:via-rose-950/20 dark:to-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={spotlightCreator.avatar}
                  alt={spotlightCreator.name}
                  className="w-16 h-16 rounded-full object-cover ring-2 ring-rose-500/30 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      {spotlightCreator.name}
                    </h2>
                    <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-md bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      ID: {spotlightCreator.id}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    @{spotlightCreator.username} · {spotlightCreator.followersCount.toLocaleString()} followers · {matchedPins.length} posts uploaded
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 max-w-xl">
                    {spotlightCreator.bio}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                <button
                  type="button"
                  onClick={() => toggleFollowUser(spotlightCreator.id)}
                  className={`px-4 py-2 text-xs font-bold rounded-full transition-all cursor-pointer ${
                    followingUserIds.includes(spotlightCreator.id)
                      ? 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
                      : 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs'
                  }`}
                >
                  {followingUserIds.includes(spotlightCreator.id) ? 'Following' : 'Follow Creator'}
                </button>
                {searchUserId && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchUserId(null);
                      setSearchQuery('');
                      setCurrentView('feed');
                    }}
                    className="px-3 py-2 text-xs font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
                  >
                    Clear Filter
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Search Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-xs font-semibold text-slate-400">
                {activeUserId ? `Matching User ID: ${activeUserId}` : 'Search Results'}
              </span>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
                "{searchQuery || activeUserId || 'All Content'}"
              </h1>
            </div>

            {/* Results Type Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-full border border-slate-200 dark:border-slate-800 self-start sm:self-auto">
              <button
                onClick={() => setSearchTab('pins')}
                className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-colors cursor-pointer ${
                  searchTab === 'pins'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Pins ({matchedPins.length})
              </button>
              <button
                onClick={() => setSearchTab('boards')}
                className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-colors cursor-pointer ${
                  searchTab === 'boards'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Boards ({matchedBoards.length})
              </button>
              <button
                onClick={() => setSearchTab('creators')}
                className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-colors cursor-pointer ${
                  searchTab === 'creators'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Creators ({matchedCreators.length})
              </button>
            </div>
          </div>
        </div>

        {/* Tab 1: Pins Results */}
        {searchTab === 'pins' && (
          <div>
            {matchedPins.length === 0 ? (
              <div className="py-20 text-center max-w-md mx-auto">
                <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  No matching Pins found
                </h3>
                <p className="text-xs text-slate-400 mt-1 mb-4">
                  Try searching for user IDs like "usr_kenji", "usr_maya", or content like "Tokyo Rain", "Brutalism", "Ceramics".
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {[
                    { label: 'usr_kenji (User ID)', val: 'usr_kenji' },
                    { label: 'usr_maya (User ID)', val: 'usr_maya' },
                    { label: 'Tokyo Rain', val: 'Tokyo Rain' },
                    { label: 'Brutalism', val: 'Brutalism' },
                    { label: 'Matcha Bowl', val: 'Matcha Bowl' },
                  ].map((item) => (
                    <button
                      key={item.val}
                      onClick={() => {
                        if (item.val.startsWith('usr_')) {
                          setSearchUserId(item.val);
                          setSearchQuery(item.val);
                        } else {
                          setSearchUserId(null);
                          setSearchQuery(item.val);
                        }
                      }}
                      className="px-3 py-1.5 text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full cursor-pointer transition-colors"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Showing <strong className="text-slate-900 dark:text-white">{matchedPins.length}</strong> matching {matchedPins.length === 1 ? 'post' : 'posts'}
                  </span>
                  {activeUserId && (
                    <span className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                      Filtered by User ID: {activeUserId}
                    </span>
                  )}
                </div>
                <div className="masonry-grid">
                  {matchedPins.map((pin) => (
                    <PinCard key={pin.id} pin={pin} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Boards Results */}
        {searchTab === 'boards' && (
          <div>
            {matchedBoards.length === 0 ? (
              <div className="py-20 text-center text-slate-400">
                <p className="text-sm font-semibold">No matching boards found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {matchedBoards.map((b) => {
                  const pinsInBoard = pins.filter((p) => b.pinIds.includes(p.id));
                  return (
                    <div
                      key={b.id}
                      onClick={() => openBoardDetail(b.id)}
                      className="group cursor-pointer rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 shadow-xs hover:shadow-xl transition-all"
                    >
                      <div className="h-44 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 mb-3">
                        <img
                          src={b.coverImage || pins[0]?.imageUrl}
                          alt={b.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {b.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5 tabular-nums">
                        {pinsInBoard.length} Pins
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Creators Results */}
        {searchTab === 'creators' && (
          <div>
            {matchedCreators.length === 0 ? (
              <div className="py-20 text-center text-slate-400">
                <p className="text-sm font-semibold">No creators found matching "{searchQuery}".</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {matchedCreators.map((c) => {
                  const isFollowing = followingUserIds.includes(c.id);
                  return (
                    <div
                      key={c.id}
                      className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shadow-xs"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={c.avatar}
                          alt={c.name}
                          className="w-12 h-12 rounded-full object-cover bg-slate-100 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                            {c.name}
                          </h4>
                          <p className="text-xs text-slate-400 truncate">@{c.username}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                            {c.bio}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleFollowUser(c.id)}
                        className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all shrink-0 cursor-pointer ${
                          isFollowing
                            ? 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
                            : 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 hover:bg-slate-800'
                        }`}
                      >
                        {isFollowing ? 'Following' : 'Follow'}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>
    );
  }

  // Default Home Feed View with Masonry
  const displayedPins = feedPins.slice(0, visibleCount);

  return (
    <div className="animate-in fade-in duration-200">
      <CategoryChips />

      <main className="max-w-[1720px] mx-auto px-4 sm:px-6 pt-2 pb-16">
        
        {displayedPins.length === 0 ? (
          <div className="py-24 text-center max-w-md mx-auto">
            <Sparkles className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              No pins found in {activeCategory}
            </h3>
            <p className="text-xs text-slate-400 mt-1 mb-5">
              Be the first to create and pin an idea in this category!
            </p>
            <button
              onClick={() => openCreatePin()}
              className="px-5 py-2.5 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-full shadow-md shadow-rose-600/20"
            >
              Create Pin
            </button>
          </div>
        ) : (
          <>
            {/* Masonry Feed Grid */}
            <div className="masonry-grid">
              {displayedPins.map((pin) => (
                <PinCard key={pin.id} pin={pin} />
              ))}
            </div>

            {/* Load More Trigger */}
            {visibleCount < feedPins.length && (
              <div className="text-center mt-12">
                <button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="px-8 py-3 rounded-full bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold border border-slate-200 dark:border-slate-800 transition-all inline-flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  {isLoadingMore ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-rose-500" />
                      <span>Loading more inspiration...</span>
                    </>
                  ) : (
                    <>
                      <span>Load more ideas</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default function App() {
  return (
    <CodextProvider>
      <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
        <Navbar />
        <div className="flex-1">
          <MainContent />
        </div>

        {/* Global Modals & Lightboxes */}
        <PinDetailModal />
        <CreatePinModal />
        <AdminModerationModal />
        <ShareModal />
        <OnboardingModal />
        <ExportZipModal />
      </div>
    </CodextProvider>
  );
}
