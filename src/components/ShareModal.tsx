import React, { useState } from 'react';
import { X, Copy, Check, Share2 } from 'lucide-react';
import { useCodext } from '../context/CodextContext';

export const ShareModal: React.FC = () => {
  const { isShareModalOpen, closeShareModal, shareTarget } = useCodext();
  const [copied, setCopied] = useState(false);

  if (!isShareModalOpen || !shareTarget) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareTarget.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTarget.title,
          text: `Check out "${shareTarget.title}" on Codasa!`,
          url: shareTarget.url,
        });
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      handleCopy();
    }
  };

  const encodedUrl = encodeURIComponent(shareTarget.url);
  const encodedTitle = encodeURIComponent(shareTarget.title);

  return (
    <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Share Idea</h3>
          <button
            onClick={closeShareModal}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Preview snippet */}
        <div className="flex items-center gap-3 my-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
          {shareTarget.imageUrl && (
            <img
              src={shareTarget.imageUrl}
              alt={shareTarget.title}
              className="w-12 h-16 object-cover rounded-xl shrink-0"
              referrerPolicy="no-referrer"
            />
          )}
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
              {shareTarget.title}
            </h4>
            <p className="text-[11px] text-slate-400 truncate mt-0.5">{shareTarget.url}</p>
          </div>
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-4 gap-2 mb-5">
          <a
            href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
            target="_blank"
            rel="noreferrer"
            className="flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-center"
          >
            <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
              𝕏
            </div>
            <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400">X</span>
          </a>

          <a
            href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
            target="_blank"
            rel="noreferrer"
            className="flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-center"
          >
            <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">
              WA
            </div>
            <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
              WhatsApp
            </span>
          </a>

          <a
            href={`https://pinterest.com/pin/create/button/?url=${encodedUrl}&media=${encodeURIComponent(
              shareTarget.imageUrl || ''
            )}&description=${encodedTitle}`}
            target="_blank"
            rel="noreferrer"
            className="flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-center"
          >
            <div className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs font-bold">
              P
            </div>
            <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
              Pin
            </span>
          </a>

          <button
            onClick={handleNativeShare}
            className="flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-center cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
              More
            </span>
          </button>
        </div>

        {/* Copy Link Input Bar */}
        <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
          <input
            type="text"
            readOnly
            value={shareTarget.url}
            className="flex-1 bg-transparent px-3 text-xs text-slate-700 dark:text-slate-300 focus:outline-none truncate"
          />
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold rounded-xl flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
