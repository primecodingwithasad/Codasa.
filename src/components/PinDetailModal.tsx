import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Heart,
  Share2,
  ExternalLink,
  Download,
  Flag,
  BookmarkCheck,
  ChevronDown,
  CornerDownRight,
  Send,
  Trash2,
  Copy,
  Check,
} from 'lucide-react';
import { Pin } from '../types';
import { useCodext } from '../context/CodextContext';
import { PinCard } from './PinCard';

export const PinDetailModal: React.FC = () => {
  const {
    selectedPin,
    openPinDetail,
    boards,
    savedPinIds,
    likedPinIds,
    followingUserIds,
    savePinToBoard,
    toggleLikePin,
    toggleFollowUser,
    comments,
    addComment,
    addCommentReply,
    deleteComment,
    openShareModal,
    fileReport,
    pins,
    setSearchUserId,
    setSearchQuery,
    setCurrentView,
  } = useCodext();

  const [commentText, setCommentText] = useState('');
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [selectedBoardId, setSelectedBoardId] = useState<string>(boards[0]?.id || '');
  const [isBoardDropdownOpen, setIsBoardDropdownOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState<'spam' | 'inappropriate' | 'copyright' | 'harassment'>('inappropriate');
  const [reportDetails, setReportDetails] = useState('');

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        openPinDetail(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openPinDetail]);

  if (!selectedPin) return null;

  const isSaved = savedPinIds.includes(selectedPin.id);
  const isLiked = likedPinIds.includes(selectedPin.id);
  const isFollowing = followingUserIds.includes(selectedPin.creator.id);

  const pinComments = comments.filter((c) => c.pinId === selectedPin.id);

  // Related pins for "More like this"
  const relatedPins = pins
    .filter(
      (p) =>
        p.id !== selectedPin.id &&
        (p.category === selectedPin.category ||
          p.tags.some((t) => selectedPin.tags.includes(t)))
    )
    .slice(0, 10);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      addComment(selectedPin.id, commentText);
      setCommentText('');
    }
  };

  const handleReplySubmit = (commentId: string) => {
    if (replyText.trim()) {
      addCommentReply(selectedPin.id, commentId, replyText);
      setReplyText('');
      setReplyingToId(null);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}?pin=${selectedPin.id}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = selectedPin.imageUrl;
    link.download = `${selectedPin.title.replace(/\s+/g, '-').toLowerCase()}.jpg`;
    link.target = '_blank';
    link.click();
  };

  const handleSendReport = (e: React.FormEvent) => {
    e.preventDefault();
    fileReport(selectedPin.id, reportReason, reportDetails);
    setIsReportOpen(false);
    setReportDetails('');
    alert('Report submitted. Our moderation team will review this Pin shortly.');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-start justify-center p-2 sm:p-4 md:p-6 lg:p-10">
      
      {/* Click outside backdrop close button */}
      <button
        onClick={() => openPinDetail(null)}
        className="fixed top-4 right-4 z-50 p-2.5 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur-md shadow-lg transition-transform hover:scale-110 cursor-pointer"
        aria-label="Close modal"
      >
        <X className="w-5 h-5" />
      </button>

      <div
        ref={modalRef}
        className="bg-white dark:bg-slate-900 w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Main 2-Column Split: Image on Left, Details/Comments on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Column: Full-Height Visual Showcase */}
          <div className="lg:col-span-7 bg-slate-100 dark:bg-slate-950 flex items-center justify-center p-4 sm:p-6 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800">
            <div className="relative max-h-[80vh] w-full flex items-center justify-center overflow-hidden rounded-2xl shadow-inner">
              <img
                src={selectedPin.imageUrl}
                alt={selectedPin.title}
                className="max-h-[76vh] w-auto max-w-full object-contain rounded-2xl shadow-md"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Right Column: Interactive Details Pane */}
          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between max-h-[80vh] overflow-y-auto">
            
            {/* Header Action Bar */}
            <div>
              <div className="flex items-center justify-between gap-3 pb-6 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openShareModal(selectedPin)}
                    className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                    title="Share"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleCopyLink}
                    className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                    title="Copy Link"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={handleDownload}
                    className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsReportOpen(true)}
                    className="p-2 text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                    title="Report"
                  >
                    <Flag className="w-4 h-4" />
                  </button>
                </div>

                {/* Board Picker + Save Button */}
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsBoardDropdownOpen(!isBoardDropdownOpen)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold max-w-[130px] truncate transition-colors"
                    >
                      <span className="truncate">
                        {boards.find((b) => b.id === selectedBoardId)?.title || 'Board'}
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 shrink-0" />
                    </button>

                    {isBoardDropdownOpen && (
                      <div className="absolute right-0 top-full mt-1.5 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 py-1.5 z-30 max-h-48 overflow-y-auto">
                        {boards.map((b) => (
                          <button
                            key={b.id}
                            type="button"
                            onClick={() => {
                              setSelectedBoardId(b.id);
                              savePinToBoard(selectedPin.id, b.id);
                              setIsBoardDropdownOpen(false);
                            }}
                            className="w-full px-3 py-2 text-left text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between"
                          >
                            <span className="truncate">{b.title}</span>
                            {b.pinIds.includes(selectedPin.id) && (
                              <BookmarkCheck className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => savePinToBoard(selectedPin.id, selectedBoardId)}
                    className={`px-5 py-2 text-xs font-bold rounded-full transition-all shadow-sm ${
                      isSaved
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950'
                        : 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20'
                    }`}
                  >
                    {isSaved ? 'Saved' : 'Save'}
                  </button>
                </div>
              </div>

              {/* Destination URL */}
              {selectedPin.destinationUrl && (
                <div className="pt-4">
                  <a
                    href={selectedPin.destinationUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span className="truncate">{selectedPin.destinationUrl}</span>
                  </a>
                </div>
              )}

              {/* Title & Description */}
              <div className="pt-3">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-tight">
                  {selectedPin.title}
                </h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {selectedPin.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 mt-3">
                  <span>Tags:</span>
                  {selectedPin.tags.map((tag, i) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        setSearchUserId(null);
                        setSearchQuery(tag);
                        setCurrentView('search');
                        openPinDetail(null);
                      }}
                      className="hover:text-rose-500 transition-colors cursor-pointer"
                    >
                      #{tag}
                      {i < selectedPin.tags.length - 1 ? ' · ' : ''}
                    </button>
                  ))}
                </div>
              </div>

              {/* Creator Profile Row + Follow Action + User ID */}
              <div className="flex items-center justify-between py-4 my-4 border-y border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    const uid = selectedPin.userId || selectedPin.creator.id;
                    setSearchUserId(uid);
                    setSearchQuery(`@${selectedPin.creator.username}`);
                    setCurrentView('search');
                    openPinDetail(null);
                  }}
                  className="flex items-center gap-3 text-left hover:opacity-85 transition-opacity cursor-pointer group/author"
                  title="Click to view all posts by this creator"
                >
                  <img
                    src={selectedPin.creator.avatar}
                    alt={selectedPin.creator.name}
                    className="w-10 h-10 rounded-full object-cover bg-slate-200 ring-1 ring-slate-200 dark:ring-slate-700"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover/author:text-rose-600 transition-colors">
                      {selectedPin.creator.name}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span>@{selectedPin.creator.username}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-500 dark:text-slate-400">
                        {selectedPin.userId || selectedPin.creator.id}
                      </span>
                    </div>
                  </div>
                </button>

                {selectedPin.creator.id !== 'usr_me' && (
                  <button
                    onClick={() => toggleFollowUser(selectedPin.creator.id)}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                      isFollowing
                        ? 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
                        : 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:bg-slate-800'
                    }`}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                )}
              </div>

              {/* Like Button */}
              <div className="flex items-center gap-2 pb-4">
                <button
                  onClick={() => toggleLikePin(selectedPin.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                    isLiked
                      ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 border border-rose-200 dark:border-rose-900'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-current text-rose-600' : ''}`} />
                  <span className="tabular-nums">{selectedPin.likesCount} Likes</span>
                </button>
                <span className="text-xs text-slate-400 tabular-nums">
                  {selectedPin.savesCount} people saved this
                </span>
              </div>

              {/* Comments Section */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Comments ({pinComments.length})
                  </h3>
                </div>

                {/* Comment list */}
                <div className="space-y-3.5 mb-4 max-h-56 overflow-y-auto pr-1">
                  {pinComments.length === 0 ? (
                    <p className="text-xs text-slate-400 py-2">
                      No comments yet. Start the conversation!
                    </p>
                  ) : (
                    pinComments.map((c) => (
                      <div key={c.id} className="text-xs">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2">
                            <img
                              src={c.user.avatar}
                              alt={c.user.name}
                              className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <span className="font-bold text-slate-900 dark:text-white">
                                {c.user.name}
                              </span>{' '}
                              <span className="text-slate-700 dark:text-slate-300">{c.text}</span>
                              <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                                <span>{c.createdAt}</span>
                                <button
                                  onClick={() => setReplyingToId(replyingToId === c.id ? null : c.id)}
                                  className="hover:text-rose-500 font-medium cursor-pointer"
                                >
                                  Reply
                                </button>
                                {c.userId === 'usr_me' && (
                                  <button
                                    onClick={() => deleteComment(c.id)}
                                    className="hover:text-rose-500 transition-colors"
                                    title="Delete comment"
                                  >
                                    <Trash2 className="w-3 h-3 text-slate-400 hover:text-rose-500" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Nested Replies */}
                        {c.replies && c.replies.length > 0 && (
                          <div className="pl-8 pt-2 space-y-2 border-l border-slate-100 dark:border-slate-800 mt-2 ml-3">
                            {c.replies.map((r) => (
                              <div key={r.id} className="flex items-start gap-2">
                                <img
                                  src={r.user.avatar}
                                  alt={r.user.name}
                                  className="w-5 h-5 rounded-full object-cover shrink-0"
                                  referrerPolicy="no-referrer"
                                />
                                <div>
                                  <span className="font-bold text-slate-900 dark:text-white">
                                    {r.user.name}
                                  </span>{' '}
                                  <span className="text-slate-700 dark:text-slate-300">{r.text}</span>
                                  <div className="text-[10px] text-slate-400 mt-0.5">{r.createdAt}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Inline reply composer */}
                        {replyingToId === c.id && (
                          <div className="pl-8 pt-2 flex items-center gap-2">
                            <CornerDownRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <input
                              type="text"
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder={`Reply to ${c.user.name}...`}
                              className="flex-1 px-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 rounded-full focus:outline-none border border-slate-200 dark:border-slate-700"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleReplySubmit(c.id);
                              }}
                            />
                            <button
                              onClick={() => handleReplySubmit(c.id)}
                              className="p-1.5 bg-rose-600 text-white rounded-full hover:bg-rose-700"
                            >
                              <Send className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Comment Form Input */}
            <form onSubmit={handleCommentSubmit} className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 px-4 py-2 text-xs bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-full border border-transparent focus:border-slate-300 dark:focus:border-slate-700 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="p-2 bg-rose-600 disabled:opacity-50 text-white rounded-full hover:bg-rose-700 transition-opacity cursor-pointer shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

          </div>
        </div>

        {/* Report Modal Subdialog */}
        {isReportOpen && (
          <div className="fixed inset-0 z-60 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Report Pin</h3>
                <button
                  onClick={() => setIsReportOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <form onSubmit={handleSendReport} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Reason for report
                  </label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none"
                  >
                    <option value="inappropriate">Inappropriate or adult content</option>
                    <option value="spam">Spam or misleading information</option>
                    <option value="copyright">Copyright violation</option>
                    <option value="harassment">Harassment or hate speech</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Additional details
                  </label>
                  <textarea
                    value={reportDetails}
                    onChange={(e) => setReportDetails(e.target.value)}
                    rows={3}
                    placeholder="Describe why this Pin should be reviewed..."
                    className="w-full px-3 py-2 text-xs bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none"
                  />
                </div>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsReportOpen(false)}
                    className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* "More like this" Related Pins Section */}
        {relatedPins.length > 0 && (
          <div className="p-6 sm:p-8 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-200 dark:border-slate-800">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-6">
              More like this
            </h3>
            <div className="masonry-grid">
              {relatedPins.map((pin) => (
                <PinCard key={pin.id} pin={pin} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
