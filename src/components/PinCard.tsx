import React, { useState, useRef, useEffect } from 'react';
import {
  Heart,
  Share2,
  ExternalLink,
  MoreHorizontal,
  Download,
  Flag,
  Copy,
  Check,
  BookmarkCheck,
  ChevronDown,
} from 'lucide-react';
import { Pin } from '../types';
import { useCodext } from '../context/CodextContext';

interface PinCardProps {
  pin: Pin;
}

export const PinCard: React.FC<PinCardProps> = ({ pin }) => {
  const {
    boards,
    savedPinIds,
    likedPinIds,
    savePinToBoard,
    toggleLikePin,
    openPinDetail,
    openShareModal,
    fileReport,
    setSearchUserId,
    setSearchQuery,
    setCurrentView,
  } = useCodext();

  const [isHovered, setIsHovered] = useState(false);
  const [isBoardDropdownOpen, setIsBoardDropdownOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [selectedBoardId, setSelectedBoardId] = useState<string>(boards[0]?.id || '');
  const [copied, setCopied] = useState(false);

  const boardDropdownRef = useRef<HTMLDivElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  const isSaved = savedPinIds.includes(pin.id);
  const isLiked = likedPinIds.includes(pin.id);

  // Close menus on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (boardDropdownRef.current && !boardDropdownRef.current.contains(e.target as Node)) {
        setIsBoardDropdownOpen(false);
      }
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
        setIsMoreMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedBoardId) {
      savePinToBoard(pin.id, selectedBoardId);
    }
  };

  const handleQuickCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${window.location.origin}?pin=${pin.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setIsMoreMenuOpen(false);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = pin.imageUrl;
    link.download = `${pin.title.replace(/\s+/g, '-').toLowerCase()}.jpg`;
    link.target = '_blank';
    link.click();
    setIsMoreMenuOpen(false);
  };

  const handleReport = (e: React.MouseEvent) => {
    e.stopPropagation();
    fileReport(pin.id, 'inappropriate', 'Flagged by user via card options menu');
    alert('Thank you. This Pin has been submitted for moderation review.');
    setIsMoreMenuOpen(false);
  };

  return (
    <div
      className="masonry-item relative mb-5 transition-transform duration-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsBoardDropdownOpen(false);
        setIsMoreMenuOpen(false);
      }}
    >
      {/* Visual Image Container with Hover Canvas */}
      <div
        onClick={() => openPinDetail(pin)}
        className="group relative rounded-2xl overflow-hidden cursor-zoom-in bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 shadow-sm hover:shadow-xl transition-all duration-300"
      >
        <img
          src={pin.imageUrl}
          alt={pin.title}
          loading="lazy"
          className="w-full h-auto block object-cover group-hover:scale-[1.02] transition-transform duration-500 ease-out"
          referrerPolicy="no-referrer"
          onError={(e) => {
            // Elegant zero-broken-image fallback
            (e.target as HTMLImageElement).src =
              '/src/assets/images/pin_minimal_architecture_1793369196557.jpg';
          }}
        />

        {/* Hover Overlay Controls */}
        <div
          className={`absolute inset-0 bg-black/35 backdrop-blur-[1px] p-3 flex flex-col justify-between transition-opacity duration-200 ${
            isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Top Bar: Board Picker + Save Button */}
          <div className="flex items-center justify-between gap-2">
            <div ref={boardDropdownRef} className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsBoardDropdownOpen(!isBoardDropdownOpen);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-xs font-semibold max-w-[140px] truncate transition-colors"
              >
                <span className="truncate">
                  {boards.find((b) => b.id === selectedBoardId)?.title || 'Select Board'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 shrink-0" />
              </button>

              {isBoardDropdownOpen && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute left-0 top-full mt-1.5 w-52 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 py-1.5 z-30 max-h-48 overflow-y-auto"
                >
                  <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Save to Board
                  </div>
                  {boards.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => {
                        setSelectedBoardId(b.id);
                        savePinToBoard(pin.id, b.id);
                        setIsBoardDropdownOpen(false);
                      }}
                      className="w-full px-3 py-1.5 text-left text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between transition-colors"
                    >
                      <span className="truncate">{b.title}</span>
                      {b.pinIds.includes(pin.id) && (
                        <BookmarkCheck className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Primary Save Action Button */}
            <button
              type="button"
              onClick={handleSave}
              className={`px-4 py-2 text-xs font-bold rounded-full transition-all shadow-md cursor-pointer flex items-center gap-1 ${
                isSaved
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950'
                  : 'bg-rose-600 hover:bg-rose-700 text-white'
              }`}
            >
              {isSaved ? 'Saved' : 'Save'}
            </button>
          </div>

          {/* Bottom Bar: Destination link, Share, Like, More Options */}
          <div className="flex items-center justify-between gap-1 pt-2">
            {pin.destinationUrl ? (
              <a
                href={pin.destinationUrl}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs font-semibold max-w-[130px] truncate shadow-sm transition-colors"
                title={pin.destinationUrl}
              >
                <ExternalLink className="w-3 h-3 shrink-0" />
                <span className="truncate">
                  {pin.destinationUrl.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}
                </span>
              </a>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-1.5">
              {/* Like Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLikePin(pin.id);
                }}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  isLiked
                    ? 'bg-rose-600 text-white'
                    : 'bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 hover:bg-white'
                }`}
                title={isLiked ? 'Unlike' : 'Like'}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              </button>

              {/* Share Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openShareModal(pin);
                }}
                className="w-8 h-8 rounded-full bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-900 flex items-center justify-center transition-colors"
                title="Share"
              >
                <Share2 className="w-4 h-4" />
              </button>

              {/* More Menu */}
              <div ref={moreMenuRef} className="relative">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMoreMenuOpen(!isMoreMenuOpen);
                  }}
                  className="w-8 h-8 rounded-full bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-900 flex items-center justify-center transition-colors"
                  title="More actions"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>

                {isMoreMenuOpen && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute right-0 bottom-full mb-1.5 w-44 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 py-1.5 z-30"
                  >
                    <button
                      type="button"
                      onClick={handleQuickCopyLink}
                      className="w-full px-3 py-1.5 text-left text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 transition-colors"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied Link!' : 'Copy Link'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleDownload}
                      className="w-full px-3 py-1.5 text-left text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Image</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleReport}
                      className="w-full px-3 py-1.5 text-left text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2 transition-colors"
                    >
                      <Flag className="w-3.5 h-3.5" />
                      <span>Report Pin</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card Metadata Prose (No static pill enclosure) */}
      <div className="pt-2 px-1">
        <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 line-clamp-1 leading-snug">
          {pin.title}
        </h4>
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              const uid = pin.userId || pin.creator.id;
              setSearchUserId(uid);
              setSearchQuery(`@${pin.creator.username}`);
              setCurrentView('search');
            }}
            className="flex items-center gap-1.5 min-w-0 hover:opacity-80 transition-opacity text-left cursor-pointer group/creator"
            title={`View all posts by ${pin.creator.name} (ID: ${pin.userId || pin.creator.id})`}
          >
            <img
              src={pin.creator.avatar}
              alt={pin.creator.name}
              className="w-4 h-4 rounded-full object-cover shrink-0"
              referrerPolicy="no-referrer"
            />
            <span className="truncate group-hover/creator:text-rose-600 dark:group-hover/creator:text-rose-400 transition-colors">
              {pin.creator.name}
            </span>
          </button>
          <div className="flex items-center gap-1 text-[11px] shrink-0 tabular-nums">
            <span>{pin.savesCount} saves</span>
            <span aria-hidden="true">·</span>
            <span>{pin.likesCount} likes</span>
          </div>
        </div>
      </div>
    </div>
  );
};
