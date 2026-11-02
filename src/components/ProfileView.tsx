import React, { useState, useRef } from 'react';
import {
  Edit3,
  Camera,
  Image as ImageIcon,
  Settings,
  Plus,
  Lock,
  Globe,
  ExternalLink,
  Download,
  RotateCcw,
  X,
  Layers,
  Bookmark,
  Sparkles,
  MapPin,
  Check,
  Upload,
  Link as LinkIcon,
} from 'lucide-react';
import { useCodext } from '../context/CodextContext';
import { AVATAR_PRESETS, COVER_PRESETS } from '../data/seedData';
import { PinCard } from './PinCard';

export const ProfileView: React.FC = () => {
  const {
    currentUser,
    updateProfile,
    boards,
    pins,
    savedPinIds,
    openBoardDetail,
    openCreatePin,
    createBoard,
    setIsExportZipOpen,
    resetToDefaults,
  } = useCodext();

  const [activeTab, setActiveTab] = useState<'boards' | 'saved' | 'created'>('boards');
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [profileModalTab, setProfileModalTab] = useState<'photos' | 'info'>('photos');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCreateBoardOpen, setIsCreateBoardOpen] = useState(false);

  // Edit profile form state
  const [editName, setEditName] = useState(currentUser.name);
  const [editUsername, setEditUsername] = useState(currentUser.username);
  const [editBio, setEditBio] = useState(currentUser.bio);
  const [editWebsite, setEditWebsite] = useState(currentUser.website || '');
  const [editLocation, setEditLocation] = useState(currentUser.location || '');
  const [editPronouns, setEditPronouns] = useState(currentUser.pronouns || '');
  const [editAvatar, setEditAvatar] = useState(currentUser.avatar);
  const [editCover, setEditCover] = useState(currentUser.coverImage || COVER_PRESETS[0]);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const userBoards = boards.filter((b) => b.userId === currentUser.id);
  const savedPins = pins.filter((p) => savedPinIds.includes(p.id));
  const createdPins = pins.filter((p) => p.userId === currentUser.id);

  const handleAvatarFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        const result = e.target.result as string;
        setEditAvatar(result);
        updateProfile({ avatar: result });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCoverFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        const result = e.target.result as string;
        setEditCover(result);
        updateProfile({ coverImage: result });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: editName.trim(),
      username: editUsername.trim().toLowerCase().replace(/^@/, ''),
      bio: editBio.trim(),
      website: editWebsite.trim() || undefined,
      location: editLocation.trim() || undefined,
      pronouns: editPronouns.trim() || undefined,
      avatar: editAvatar,
      coverImage: editCover,
    });
    setIsEditProfileOpen(false);
  };

  const handleCreateBoard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBoardTitle.trim()) return;
    const board = createBoard(newBoardTitle.trim(), newBoardDesc.trim(), newBoardSecret);
    setNewBoardTitle('');
    setNewBoardDesc('');
    setNewBoardSecret(false);
    setIsCreateBoardOpen(false);
    openBoardDetail(board.id);
  };

  // Create board form state
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [newBoardDesc, setNewBoardDesc] = useState('');
  const [newBoardSecret, setNewBoardSecret] = useState(false);

  return (
    <div className="max-w-[1720px] mx-auto px-4 sm:px-6 py-4 animate-in fade-in duration-200">
      
      {/* Profile Cover Banner */}
      <div className="relative rounded-3xl overflow-hidden h-52 sm:h-72 w-full bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md group">
        <img
          src={currentUser.coverImage || COVER_PRESETS[0]}
          alt="Profile cover banner"
          className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
        {/* Change Cover Button */}
        <button
          onClick={() => {
            setProfileModalTab('photos');
            setIsEditProfileOpen(true);
          }}
          className="absolute top-4 right-4 px-3.5 py-1.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-white/20 shadow-sm"
        >
          <Camera className="w-3.5 h-3.5" />
          <span>Change Cover</span>
        </button>
      </div>

      {/* Profile Header & Bio */}
      <div className="relative text-center max-w-2xl mx-auto -mt-16 sm:-mt-20 mb-10 z-10 px-4">
        
        {/* Interactive Avatar with Quick Change Photo Overlay */}
        <div className="relative inline-block mb-3 group cursor-pointer">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-white dark:border-slate-950 shadow-2xl object-cover mx-auto bg-slate-100"
            referrerPolicy="no-referrer"
          />
          <button
            onClick={() => {
              setProfileModalTab('photos');
              setIsEditProfileOpen(true);
            }}
            className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[11px] font-bold gap-1 cursor-pointer"
            title="Change Profile Picture"
          >
            <Camera className="w-6 h-6" />
            <span>Change Photo</span>
          </button>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center justify-center gap-2">
          <span>{currentUser.name}</span>
          {currentUser.pronouns && (
            <span className="text-xs font-normal text-slate-400">({currentUser.pronouns})</span>
          )}
        </h1>
        <p className="text-xs font-medium text-slate-400 mt-0.5">@{currentUser.username}</p>

        {currentUser.location && (
          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1 mt-1">
            <MapPin className="w-3 h-3 text-rose-500" />
            <span>{currentUser.location}</span>
          </p>
        )}

        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-lg mx-auto">
          {currentUser.bio}
        </p>

        {currentUser.website && (
          <a
            href={currentUser.website}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline mt-2"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>{currentUser.website.replace(/^https?:\/\//, '')}</span>
          </a>
        )}

        <div className="flex items-center justify-center gap-6 mt-4 text-xs font-semibold text-slate-700 dark:text-slate-300 tabular-nums">
          <span>{currentUser.followersCount} followers</span>
          <span aria-hidden="true">·</span>
          <span>{currentUser.followingCount} following</span>
          <span aria-hidden="true">·</span>
          <span>{userBoards.length} boards</span>
        </div>

        {/* Profile Action Buttons */}
        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            onClick={() => {
              setEditName(currentUser.name);
              setEditUsername(currentUser.username);
              setEditBio(currentUser.bio);
              setEditWebsite(currentUser.website || '');
              setEditLocation(currentUser.location || '');
              setEditPronouns(currentUser.pronouns || '');
              setEditAvatar(currentUser.avatar);
              setEditCover(currentUser.coverImage || COVER_PRESETS[0]);
              setProfileModalTab('photos');
              setIsEditProfileOpen(true);
            }}
            className="px-5 py-2 text-xs font-bold bg-slate-900 text-white dark:bg-white dark:text-slate-950 hover:opacity-90 rounded-full transition-all flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Change Profile & Photo</span>
          </button>

          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-full transition-colors cursor-pointer"
            title="Settings & Data"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center justify-center gap-8 border-b border-slate-200 dark:border-slate-800 mb-8">
        <button
          onClick={() => setActiveTab('boards')}
          className={`pb-3 text-sm font-semibold transition-colors relative cursor-pointer ${
            activeTab === 'boards'
              ? 'text-slate-900 dark:text-white border-b-2 border-slate-900 dark:border-white'
              : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <span>Boards ({userBoards.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('saved')}
          className={`pb-3 text-sm font-semibold transition-colors relative cursor-pointer ${
            activeTab === 'saved'
              ? 'text-slate-900 dark:text-white border-b-2 border-slate-900 dark:border-white'
              : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <span>Saved Pins ({savedPins.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('created')}
          className={`pb-3 text-sm font-semibold transition-colors relative cursor-pointer ${
            activeTab === 'created'
              ? 'text-slate-900 dark:text-white border-b-2 border-slate-900 dark:border-white'
              : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <span>Created ({createdPins.length})</span>
        </button>
      </div>

      {/* Tab 1: Boards Grid */}
      {activeTab === 'boards' && (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            
            {/* Create New Board Card */}
            <div
              onClick={() => setIsCreateBoardOpen(true)}
              className="group border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-rose-500 dark:hover:border-rose-500 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[260px] text-center cursor-pointer transition-all bg-slate-50/50 dark:bg-slate-950/50 hover:bg-rose-50/20"
            >
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-900 group-hover:bg-rose-600 group-hover:text-white flex items-center justify-center text-slate-400 transition-colors mb-3">
                <Plus className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Create Board
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-[180px]">
                Organize your ideas by room, topic, or palette.
              </p>
            </div>

            {/* Board Cards */}
            {userBoards.map((b) => {
              const pinsInBoard = pins.filter((p) => b.pinIds.includes(p.id));
              const cover = b.coverImage || pinsInBoard[0]?.imageUrl || pins[0]?.imageUrl;
              const thumb1 = pinsInBoard[1]?.imageUrl;
              const thumb2 = pinsInBoard[2]?.imageUrl;

              return (
                <div
                  key={b.id}
                  onClick={() => openBoardDetail(b.id)}
                  className="group cursor-pointer"
                >
                  <div className="rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 group-hover:shadow-lg transition-all h-52 grid grid-cols-3 gap-1 p-1">
                    <div className="col-span-2 h-full rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800">
                      <img
                        src={cover}
                        alt={b.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="col-span-1 h-full flex flex-col gap-1">
                      <div className="flex-1 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800">
                        {thumb1 ? (
                          <img
                            src={thumb1}
                            alt="Preview 1"
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-full h-full bg-slate-100 dark:bg-slate-800/50" />
                        )}
                      </div>
                      <div className="flex-1 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800">
                        {thumb2 ? (
                          <img
                            src={thumb2}
                            alt="Preview 2"
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-full h-full bg-slate-100 dark:bg-slate-800/50" />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 px-1 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-rose-600 transition-colors truncate max-w-[200px]">
                        {b.title}
                      </h3>
                      <p className="text-xs text-slate-400 tabular-nums">
                        {pinsInBoard.length} Pins {b.sections.length > 0 ? `· ${b.sections.length} Sections` : ''}
                      </p>
                    </div>
                    {b.isPrivate && (
                      <span title="Secret Board">
                        <Lock className="w-3.5 h-3.5 text-slate-400" />
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

          </div>
        </div>
      )}

      {/* Tab 2: Saved Pins */}
      {activeTab === 'saved' && (
        <div>
          {savedPins.length === 0 ? (
            <div className="py-20 text-center">
              <Bookmark className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                You haven't saved any Pins yet.
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Explore the feed and click "Save" on inspiration you love.
              </p>
            </div>
          ) : (
            <div className="masonry-grid">
              {savedPins.map((pin) => (
                <PinCard key={pin.id} pin={pin} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Created Pins */}
      {activeTab === 'created' && (
        <div>
          <div className="flex justify-end mb-6">
            <button
              onClick={() => openCreatePin()}
              className="px-4 py-2 text-xs font-bold rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Pin</span>
            </button>
          </div>
          {createdPins.length === 0 ? (
            <div className="py-20 text-center">
              <Sparkles className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                You haven't uploaded any Pins yet.
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Share your designs, photography, or discoveries with the community.
              </p>
            </div>
          ) : (
            <div className="masonry-grid">
              {createdPins.map((pin) => (
                <PinCard key={pin.id} pin={pin} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Profile & Photo Change Modal */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 shrink-0">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Customize Profile
              </h3>
              <button
                onClick={() => setIsEditProfileOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Sub-Tabs: Photos vs Profile Info */}
            <div className="flex items-center gap-2 pt-4 pb-2 shrink-0">
              <button
                type="button"
                onClick={() => setProfileModalTab('photos')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
                  profileModalTab === 'photos'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                Avatar & Cover Photos
              </button>
              <button
                type="button"
                onClick={() => setProfileModalTab('info')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
                  profileModalTab === 'info'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                Bio & Account Details
              </button>
            </div>

            {/* Scrollable Form Content */}
            <div className="flex-1 overflow-y-auto py-2 pr-1 space-y-5">
              {profileModalTab === 'photos' ? (
                <div className="space-y-6">
                  
                  {/* Current Avatar Preview & Upload Action */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img
                          src={editAvatar}
                          alt="Avatar preview"
                          className="w-20 h-20 rounded-full object-cover border-2 border-rose-500 shadow-md bg-slate-200"
                        />
                        <button
                          type="button"
                          onClick={() => avatarInputRef.current?.click()}
                          className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-rose-600 text-white hover:bg-rose-700 shadow-md"
                          title="Upload image"
                        >
                          <Camera className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                          Profile Photo
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Upload your custom picture or choose a preset below.
                        </p>
                        <input
                          ref={avatarInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => e.target.files?.[0] && handleAvatarFile(e.target.files[0])}
                        />
                        <button
                          type="button"
                          onClick={() => avatarInputRef.current?.click()}
                          className="mt-2 px-3 py-1.5 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 cursor-pointer"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload From Computer</span>
                        </button>
                      </div>
                    </div>

                    {/* Preset Avatars Gallery */}
                    <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                        Or Pick An Avatar Preset
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {AVATAR_PRESETS.map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setEditAvatar(preset)}
                            className={`relative rounded-full p-0.5 border-2 transition-transform hover:scale-110 cursor-pointer ${
                              editAvatar === preset ? 'border-rose-600 scale-105' : 'border-transparent'
                            }`}
                          >
                            <img
                              src={preset}
                              alt={`Preset ${idx + 1}`}
                              className="w-10 h-10 rounded-full object-cover bg-slate-100"
                            />
                            {editAvatar === preset && (
                              <div className="absolute inset-0 rounded-full bg-rose-600/30 flex items-center justify-center">
                                <Check className="w-4 h-4 text-white" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Custom Image URL option */}
                    <div className="mt-4 flex gap-2">
                      <input
                        type="url"
                        placeholder="Or paste any avatar image URL..."
                        value={customAvatarUrl}
                        onChange={(e) => setCustomAvatarUrl(e.target.value)}
                        className="flex-1 px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (customAvatarUrl.trim()) {
                            setEditAvatar(customAvatarUrl.trim());
                            setCustomAvatarUrl('');
                          }
                        }}
                        className="px-3 py-1.5 text-xs font-semibold bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-lg hover:opacity-90"
                      >
                        Apply URL
                      </button>
                    </div>
                  </div>

                  {/* Cover Photo Customization */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        Header Cover Banner
                      </h4>
                      <input
                        ref={coverInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && handleCoverFile(e.target.files[0])}
                      />
                      <button
                        type="button"
                        onClick={() => coverInputRef.current?.click()}
                        className="text-xs text-rose-600 dark:text-rose-400 font-semibold hover:underline flex items-center gap-1"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Custom Banner</span>
                      </button>
                    </div>

                    <div className="h-24 rounded-xl overflow-hidden mb-3 border border-slate-200 dark:border-slate-800">
                      <img
                        src={editCover}
                        alt="Current cover preview"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                      Scenic Cover Presets
                    </span>
                    <div className="grid grid-cols-5 gap-2">
                      {COVER_PRESETS.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setEditCover(preset)}
                          className={`relative h-14 rounded-lg overflow-hidden border-2 transition-transform hover:scale-105 cursor-pointer ${
                            editCover === preset ? 'border-rose-600 scale-102' : 'border-transparent'
                          }`}
                        >
                          <img
                            src={preset}
                            alt={`Cover preset ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          {editCover === preset && (
                            <div className="absolute inset-0 bg-rose-600/30 flex items-center justify-center">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              ) : (
                /* Information Tab */
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Display Name
                      </label>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Username
                      </label>
                      <input
                        type="text"
                        value={editUsername}
                        onChange={(e) => setEditUsername(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Kyoto, Japan"
                        value={editLocation}
                        onChange={(e) => setEditLocation(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Pronouns
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. she/her, they/them"
                        value={editPronouns}
                        onChange={(e) => setEditPronouns(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Bio
                    </label>
                    <textarea
                      rows={3}
                      value={editBio}
                      onChange={(e) => setEditBio(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Website URL
                    </label>
                    <input
                      type="url"
                      value={editWebsite}
                      onChange={(e) => setEditWebsite(e.target.value)}
                      placeholder="https://yourportfolio.com"
                      className="w-full px-3.5 py-2 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 shrink-0">
              <button
                type="button"
                onClick={() => setIsEditProfileOpen(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveProfile}
                className="px-5 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-sm"
              >
                Save Changes
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Create Board Modal */}
      {isCreateBoardOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Create Board</h3>
              <button onClick={() => setIsCreateBoardOpen(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleCreateBoard} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Places to Visit, Living Room Renovation"
                  value={newBoardTitle}
                  onChange={(e) => setNewBoardTitle(e.target.value)}
                  autoFocus
                  className="w-full px-3.5 py-2 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="What is this board about?"
                  value={newBoardDesc}
                  onChange={(e) => setNewBoardDesc(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none"
                />
              </div>
              <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 pt-1">
                <input
                  type="checkbox"
                  checked={newBoardSecret}
                  onChange={(e) => setNewBoardSecret(e.target.checked)}
                  className="rounded text-rose-600 focus:ring-rose-500"
                />
                <span>Keep this board secret (only you can see it)</span>
              </label>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateBoardOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newBoardTitle.trim()}
                  className="px-5 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-sm disabled:opacity-50"
                >
                  Create Board
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Settings & Project Source Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Account & Data</h3>
              <button onClick={() => setIsSettingsOpen(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            
            <div className="py-4 space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1 flex items-center gap-2">
                  <Download className="w-4 h-4 text-rose-500" />
                  <span>Download Complete Website ZIP</span>
                </h4>
                <p className="text-xs text-slate-500 mb-3">
                  Export the full Next.js, Prisma, PostgreSQL schema, Dockerfile, and seed scripts for Codasa.
                </p>
                <button
                  onClick={() => {
                    setIsSettingsOpen(false);
                    setIsExportZipOpen(true);
                  }}
                  className="w-full py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold rounded-xl hover:opacity-90 transition-opacity"
                >
                  Open Export Tool
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1 flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-amber-500" />
                  <span>Reset Demo Content</span>
                </h4>
                <p className="text-xs text-slate-500 mb-3">
                  Re-initialize local storage back to the original pins, new photos, and curated boards.
                </p>
                <button
                  onClick={() => {
                    if (confirm('Reset all demo state to fresh default seed data?')) {
                      resetToDefaults();
                      setIsSettingsOpen(false);
                    }
                  }}
                  className="w-full py-2 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                >
                  Reset to Initial State
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
