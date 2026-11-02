import React, { useState } from 'react';
import {
  ArrowLeft,
  Lock,
  Globe,
  Users,
  Plus,
  Edit2,
  Trash2,
  FolderPlus,
  X,
  UserPlus,
  Share2,
} from 'lucide-react';
import { useCodext } from '../context/CodextContext';
import { PinCard } from './PinCard';

export const BoardDetailView: React.FC = () => {
  const {
    selectedBoardId,
    boards,
    pins,
    setCurrentView,
    updateBoard,
    deleteBoard,
    addBoardSection,
    addBoardCollaborator,
    movePinToSection,
    removePinFromBoard,
    openCreatePin,
    openShareModal,
  } = useCodext();

  const board = boards.find((b) => b.id === selectedBoardId);

  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editTitle, setEditTitle] = useState(board?.title || '');
  const [editDesc, setEditDesc] = useState(board?.description || '');
  const [editSecret, setEditSecret] = useState(board?.isPrivate || false);

  const [isAddSectionOpen, setIsAddSectionOpen] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState('');

  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteUsername, setInviteUsername] = useState('');

  if (!board) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center">
        <p className="text-sm text-slate-500 mb-4">Board not found or has been removed.</p>
        <button
          onClick={() => setCurrentView('profile')}
          className="px-4 py-2 text-xs font-semibold bg-slate-900 text-white rounded-full"
        >
          Back to Profile
        </button>
      </div>
    );
  }

  // Get Pins belonging to this board
  const boardPins = pins.filter((p) => board.pinIds.includes(p.id));

  // If a section is selected, filter pins by that section
  const currentSection = board.sections.find((s) => s.id === activeSectionId);
  const displayedPins = activeSectionId
    ? boardPins.filter((p) => currentSection?.pinIds.includes(p.id))
    : boardPins;

  const handleSaveBoardEdit = (e: React.FormEvent) => {
    e.preventDefault();
    updateBoard(board.id, editTitle, editDesc, editSecret);
    setIsEditModalOpen(false);
  };

  const handleCreateSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSectionTitle.trim()) return;
    addBoardSection(board.id, newSectionTitle.trim());
    setNewSectionTitle('');
    setIsAddSectionOpen(false);
  };

  const handleInviteCollaborator = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteUsername.trim()) return;
    addBoardCollaborator(board.id, {
      name: inviteName.trim(),
      username: inviteUsername.trim().replace(/^@/, ''),
    });
    setInviteName('');
    setInviteUsername('');
    setIsInviteOpen(false);
  };

  return (
    <div className="max-w-[1720px] mx-auto px-4 sm:px-6 py-6 animate-in fade-in duration-200">
      
      {/* Top Back Breadcrumb */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => setCurrentView('profile')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Profile & Boards</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsInviteOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-800 transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Invite</span>
          </button>

          <button
            onClick={() => {
              setEditTitle(board.title);
              setEditDesc(board.description);
              setEditSecret(board.isPrivate);
              setIsEditModalOpen(true);
            }}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-full transition-colors"
            title="Edit board settings"
          >
            <Edit2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              if (confirm(`Are you sure you want to delete "${board.title}"?`)) {
                deleteBoard(board.id);
              }
            }}
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-full transition-colors"
            title="Delete board"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Board Hero Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="flex items-center justify-center gap-2 mb-2">
          {board.isPrivate ? (
            <div className="flex items-center gap-1 text-xs font-medium text-slate-400">
              <Lock className="w-3.5 h-3.5" />
              <span>Secret Board</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-xs font-medium text-slate-400">
              <Globe className="w-3.5 h-3.5" />
              <span>Public Board</span>
            </div>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {board.title}
        </h1>

        {board.description && (
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {board.description}
          </p>
        )}

        {/* Collaborators row */}
        {board.collaborators.length > 0 && (
          <div className="flex items-center justify-center gap-2 mt-4">
            <span className="text-xs text-slate-400">Collaborators:</span>
            <div className="flex items-center -space-x-2">
              {board.collaborators.map((c) => (
                <img
                  key={c.id}
                  src={c.avatar}
                  alt={c.name}
                  title={`${c.name} (@${c.username})`}
                  className="w-7 h-7 rounded-full border-2 border-white dark:border-slate-900 object-cover"
                />
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 flex items-center justify-center gap-2 text-xs font-medium text-slate-400 tabular-nums">
          <span>{boardPins.length} Pins</span>
          <span aria-hidden="true">·</span>
          <span>{board.sections.length} Sections</span>
        </div>

        {/* Add Pin Shortcut Button */}
        <div className="mt-6">
          <button
            onClick={() => openCreatePin(board.id)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Pin to this Board</span>
          </button>
        </div>
      </div>

      {/* Sections Filter & Navigation Bar */}
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200 dark:border-slate-800 overflow-x-auto gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSectionId(null)}
            className={`px-4 py-2 text-xs font-semibold rounded-full transition-colors whitespace-nowrap ${
              activeSectionId === null
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950'
                : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            All Pins ({boardPins.length})
          </button>

          {board.sections.map((section) => {
            const count = boardPins.filter((p) => section.pinIds.includes(p.id)).length;
            const isActive = activeSectionId === section.id;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSectionId(section.id)}
                className={`px-4 py-2 text-xs font-semibold rounded-full transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {section.title} ({count})
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setIsAddSectionOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 rounded-full shrink-0"
        >
          <FolderPlus className="w-3.5 h-3.5" />
          <span>Add Section</span>
        </button>
      </div>

      {/* Pins Masonry Feed */}
      {displayedPins.length === 0 ? (
        <div className="py-20 text-center max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center mx-auto mb-4 text-slate-400">
            <Plus className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            There aren't any Pins here yet
          </h3>
          <p className="text-xs text-slate-400 mt-1 mb-5">
            Discover and save ideas from your home feed or upload your own.
          </p>
          <button
            onClick={() => openCreatePin(board.id)}
            className="px-5 py-2 text-xs font-bold bg-rose-600 text-white rounded-full hover:bg-rose-700 shadow-sm"
          >
            Create First Pin
          </button>
        </div>
      ) : (
        <div className="masonry-grid">
          {displayedPins.map((pin) => (
            <div key={pin.id} className="relative group">
              <PinCard pin={pin} />
              
              {/* Quick Board Section Management Overlay Button */}
              {board.sections.length > 0 && (
                <div className="absolute top-2 left-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                  <select
                    value={
                      board.sections.find((s) => s.pinIds.includes(pin.id))?.id || ''
                    }
                    onChange={(e) => movePinToSection(board.id, pin.id, e.target.value || undefined)}
                    className="px-2 py-1 text-[11px] font-semibold bg-black/75 backdrop-blur-md text-white rounded-lg border-none focus:outline-none"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <option value="">Move to Section...</option>
                    {board.sections.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Remove from board button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removePinFromBoard(board.id, pin.id);
                }}
                className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 p-1.5 bg-black/75 hover:bg-rose-600 text-white rounded-full transition-all"
                title="Remove pin from this board"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Edit Board Settings Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Edit Board</h3>
              <button onClick={() => setIsEditModalOpen(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleSaveBoardEdit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none"
                />
              </div>
              <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 pt-1">
                <input
                  type="checkbox"
                  checked={editSecret}
                  onChange={(e) => setEditSecret(e.target.checked)}
                  className="rounded text-rose-600 focus:ring-rose-500"
                />
                <span>Keep this board secret (only you & collaborators can view)</span>
              </label>

              <div className="flex items-center justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Section Modal */}
      {isAddSectionOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Name this section
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Sections help you group related ideas within this board.
            </p>
            <form onSubmit={handleCreateSection} className="space-y-4">
              <input
                type="text"
                placeholder="e.g. Living Room, Material Swatches"
                value={newSectionTitle}
                onChange={(e) => setNewSectionTitle(e.target.value)}
                autoFocus
                className="w-full px-3.5 py-2 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none"
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddSectionOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-lg"
                >
                  Add Section
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invite Collaborator Modal */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Collaborate on "{board.title}"
              </h3>
              <button onClick={() => setIsInviteOpen(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleInviteCollaborator} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Collaborator Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Maya Lin"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Username or Handle
                </label>
                <input
                  type="text"
                  placeholder="e.g. mayalinchen"
                  value={inviteUsername}
                  onChange={(e) => setInviteUsername(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-lg"
                >
                  Add Collaborator
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
