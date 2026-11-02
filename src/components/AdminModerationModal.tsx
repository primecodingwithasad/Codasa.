import React from 'react';
import { X, ShieldAlert, CheckCircle, Trash2, Eye } from 'lucide-react';
import { useCodext } from '../context/CodextContext';

export const AdminModerationModal: React.FC = () => {
  const {
    isAdminModalOpen,
    setIsAdminModalOpen,
    reports,
    resolveReport,
    pins,
    openPinDetail,
  } = useCodext();

  if (!isAdminModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl max-h-[85vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-50 dark:bg-amber-950/40 text-amber-600 rounded-xl">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Platform Moderation Queue
              </h3>
              <p className="text-xs text-slate-400">
                Review flagged pins, reports, and community standard violations.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAdminModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {reports.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <p className="text-sm font-semibold">Moderation queue is empty!</p>
              <p className="text-xs">No pending flags or reports require attention.</p>
            </div>
          ) : (
            reports.map((report) => {
              const targetPin = pins.find((p) => p.id === report.pinId);
              return (
                <div
                  key={report.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={report.pinImage}
                      alt={report.pinTitle}
                      className="w-14 h-18 rounded-xl object-cover bg-slate-200 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300">
                          {report.reason}
                        </span>
                        <span className="text-xs text-slate-400">{report.createdAt}</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-1 truncate">
                        {report.pinTitle}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                        Reported by {report.reporterName}: "{report.details}"
                      </p>
                      <span className="text-[10px] font-medium text-slate-400 mt-1 block capitalize">
                        Status: <strong className={report.status === 'pending' ? 'text-amber-500' : 'text-slate-400'}>{report.status}</strong>
                      </span>
                    </div>
                  </div>

                  {report.status === 'pending' && (
                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      {targetPin && (
                        <button
                          onClick={() => {
                            setIsAdminModalOpen(false);
                            openPinDetail(targetPin);
                          }}
                          className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-xs flex items-center gap-1"
                          title="View Pin"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => resolveReport(report.id, 'dismiss')}
                        className="px-3 py-1.5 text-xs font-medium bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg"
                      >
                        Dismiss
                      </button>
                      <button
                        onClick={() => resolveReport(report.id, 'remove')}
                        className="px-3 py-1.5 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-lg flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Remove Pin</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};
