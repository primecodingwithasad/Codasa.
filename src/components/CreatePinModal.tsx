import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  Link,
  Plus,
  Image as ImageIcon,
  Check,
  AlertCircle,
  FolderPlus,
} from 'lucide-react';
import { useCodext } from '../context/CodextContext';
import { CATEGORIES } from '../data/seedData';

export const CreatePinModal: React.FC = () => {
  const {
    isCreatePinOpen,
    closeCreatePin,
    createPinDefaultBoardId,
    boards,
    createPin,
    createBoard,
    openPinDetail,
  } = useCodext();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [destinationUrl, setDestinationUrl] = useState('');
  const [category, setCategory] = useState('Architecture');
  const [tagsInput, setTagsInput] = useState('');
  const [selectedBoardId, setSelectedBoardId] = useState(
    createPinDefaultBoardId || boards[0]?.id || ''
  );
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<number>(0.75);
  const [urlInput, setUrlInput] = useState('');
  const [isUrlMode, setIsUrlMode] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isCreatingBoard, setIsCreatingBoard] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [newBoardSecret, setNewBoardSecret] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isCreatePinOpen) return null;

  const handleFileChange = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }
    setErrorMessage(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImagePreview(result);

      // Compute aspect ratio
      const img = new Image();
      img.onload = () => {
        const ratio = img.width / img.height;
        setAspectRatio(Number(ratio.toFixed(2)));
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleFetchFromUrl = () => {
    if (!urlInput.trim()) return;
    setErrorMessage(null);
    setImagePreview(urlInput.trim());
    const img = new Image();
    img.onload = () => {
      const ratio = img.width / img.height;
      setAspectRatio(Number(ratio.toFixed(2)));
    };
    img.onerror = () => {
      setErrorMessage('Could not load image from this URL. Please verify the link or try another.');
    };
    img.src = urlInput.trim();
  };

  const handleCreateBoardInline = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBoardTitle.trim()) return;
    const newBoard = createBoard(newBoardTitle, '', newBoardSecret);
    setSelectedBoardId(newBoard.id);
    setIsCreatingBoard(false);
    setNewBoardTitle('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!imagePreview) {
      setErrorMessage('Please upload or provide an image URL for your Pin.');
      return;
    }

    if (!title.trim()) {
      setErrorMessage('Please add a title for your Pin.');
      return;
    }

    // Basic spam / content safety heuristic
    const forbiddenWords = ['casino', 'viagra', 'cryptopump', 'free-gift-card', 'xxx'];
    const content = `${title} ${description} ${tagsInput}`.toLowerCase();
    const hasForbidden = forbiddenWords.some((word) => content.includes(word));
    if (hasForbidden) {
      setErrorMessage('This content triggers our community safety guidelines. Please revise.');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().toLowerCase().replace(/^#/, ''))
      .filter(Boolean);

    const created = createPin({
      title: title.trim(),
      description: description.trim(),
      imageUrl: imagePreview,
      destinationUrl: destinationUrl.trim() || undefined,
      category,
      tags: tags.length > 0 ? tags : ['curated'],
      boardId: selectedBoardId || undefined,
      aspectRatio,
    });

    closeCreatePin();
    openPinDetail(created);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Create Pin</h2>
          <button
            onClick={closeCreatePin}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMessage && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-center gap-2.5 text-xs text-rose-600 dark:text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Left: Image Upload & Preview Pane */}
            <div className="md:col-span-5 flex flex-col">
              {!imagePreview ? (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => !isUrlMode && fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center flex flex-col items-center justify-center min-h-[340px] cursor-pointer transition-all ${
                    isDragging
                      ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/20'
                      : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100/50'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                  />

                  <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 mb-3">
                    <Upload className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Choose a file or drag and drop here
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1 max-w-[200px]">
                    We recommend high-quality JPG, PNG, or WebP under 20MB.
                  </p>

                  <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 w-full">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsUrlMode(!isUrlMode);
                      }}
                      className="text-xs text-rose-600 dark:text-rose-400 font-semibold hover:underline inline-flex items-center gap-1"
                    >
                      <Link className="w-3.5 h-3.5" />
                      <span>{isUrlMode ? 'Upload from computer' : 'Save from Web URL'}</span>
                    </button>

                    {isUrlMode && (
                      <div className="mt-3 flex gap-2" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="url"
                          placeholder="Paste image URL..."
                          value={urlInput}
                          onChange={(e) => setUrlInput(e.target.value)}
                          className="flex-1 px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={handleFetchFromUrl}
                          className="px-3 py-1.5 text-xs font-semibold bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-lg hover:opacity-90"
                        >
                          Load
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="relative group rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <img
                    src={imagePreview}
                    alt="Pin preview"
                    className="w-full h-auto max-h-[380px] object-contain rounded-2xl"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setUrlInput('');
                      }}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow-md"
                    >
                      Change Image
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Pin Metadata & Board Selector */}
            <div className="md:col-span-7 space-y-4">
              
              {/* Board Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Save to Board
                </label>
                <div className="flex items-center gap-2">
                  <select
                    value={selectedBoardId}
                    onChange={(e) => setSelectedBoardId(e.target.value)}
                    className="flex-1 px-3.5 py-2 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none font-medium"
                  >
                    {boards.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.title} {b.isPrivate ? '(Secret)' : ''}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setIsCreatingBoard(true)}
                    className="px-3 py-2 text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl flex items-center gap-1 text-slate-700 dark:text-slate-300 shrink-0"
                    title="Create new board"
                  >
                    <FolderPlus className="w-3.5 h-3.5" />
                    <span>New Board</span>
                  </button>
                </div>
              </div>

              {/* Inline Board Creation Drawer */}
              {isCreatingBoard && (
                <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Create New Board
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsCreatingBoard(false)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. Modern Ceramics, Tokyo Alleyways"
                    value={newBoardTitle}
                    onChange={(e) => setNewBoardTitle(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none"
                  />
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                      <input
                        type="checkbox"
                        checked={newBoardSecret}
                        onChange={(e) => setNewBoardSecret(e.target.checked)}
                        className="rounded text-rose-600 focus:ring-rose-500"
                      />
                      <span>Keep this board secret</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleCreateBoardInline}
                      className="px-3 py-1 bg-rose-600 text-white text-xs font-semibold rounded-lg hover:bg-rose-700"
                    >
                      Create
                    </button>
                  </div>
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  placeholder="Add a clear, catchy title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-slate-400 font-medium"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  placeholder="What is this Pin about? Tell your audience the story or details."
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-slate-400"
                />
              </div>

              {/* Category & Tags Split */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none"
                  >
                    {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="brutalism, concrete, minimal"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Destination URL */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Destination Link
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Link className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="url"
                    placeholder="https://example.com/project"
                    value={destinationUrl}
                    onChange={(e) => setDestinationUrl(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

            </div>
          </div>

          {/* Footer Action Buttons */}
          <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={closeCreatePin}
              className="px-5 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-full shadow-md shadow-rose-600/20 transition-all cursor-pointer"
            >
              Publish Pin
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
