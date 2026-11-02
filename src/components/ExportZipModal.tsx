import React, { useState } from 'react';
import {
  X,
  Download,
  FileArchive,
  Check,
  FileCode,
  Database,
  Container,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { useCodext } from '../context/CodextContext';
import { generateProjectZip } from '../utils/zipExport';

export const ExportZipModal: React.FC = () => {
  const { isExportZipOpen, setIsExportZipOpen } = useCodext();
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isExportZipOpen) return null;

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      const blob = await generateProjectZip();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'codasa-production-website.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to generate zip:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center">
              <FileArchive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Download Website ZIP
              </h3>
              <p className="text-xs text-slate-400">
                Complete production source code package for Codasa
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsExportZipOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Package Highlights Grid */}
        <div className="my-6 space-y-3">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
            <Database className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                Prisma ORM & PostgreSQL Schema
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Complete relational models for Users, Pins, Boards, Sections, Collaborators, Comments, Likes, Follows, Tags, and Reports.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
            <FileCode className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                Next.js App Router Architecture & Seed Scripts
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Full-stack NextAuth authentication, REST API routes, Zod schemas, and database seed script with 50+ sample pins.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
            <Container className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                Docker & Deployment Ready
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Multi-stage production Dockerfile, docker-compose.yml, environment variables guide, and setup README.
              </p>
            </div>
          </div>
        </div>

        {/* Download Action Button */}
        <div className="space-y-3">
          <button
            onClick={handleDownload}
            disabled={isGenerating}
            className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-bold rounded-2xl shadow-lg shadow-rose-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isGenerating ? (
              <span>Packaging ZIP archive...</span>
            ) : downloadSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Downloaded codasa-production-website.zip!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download codasa-production-website.zip</span>
              </>
            )}
          </button>

          <p className="text-center text-[11px] text-slate-400">
            Unzip and run <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono">npm install && npm run dev</code> to run locally.
          </p>
        </div>

      </div>
    </div>
  );
};
