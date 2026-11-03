import React, { useState, useEffect } from 'react';
import { Language, RSVPRecord } from '../types';
import { fetchSheetRSVPs } from '../utils/sheetdb';

interface GoogleSheetRsvpModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onViewPhoto?: (photoUrl: string, name: string) => void;
}

export const GoogleSheetRsvpModal: React.FC<GoogleSheetRsvpModalProps> = ({
  isOpen,
  onClose,
  lang,
  onViewPhoto
}) => {
  const [records, setRecords] = useState<RSVPRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'attending' | 'declined'>('all');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchSheetRSVPs();
      setRecords(data || []);
    } catch (err) {
      console.warn('Failed to load Google Sheet RSVPs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const totalAttendees = records
    .filter((r) => r.attending === 'yes')
    .reduce((sum, r) => sum + (r.guestCount || 1), 0);

  const filteredRecords = records.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.phone && r.phone.includes(searchQuery)) ||
      (r.blessing && r.blessing.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (filterType === 'attending') return r.attending === 'yes';
    if (filterType === 'declined') return r.attending === 'no';
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-[#FCFBF7] dark:bg-[#1E2722] w-full max-w-lg rounded-3xl p-5 sm:p-6 shadow-2xl border border-stone-200 dark:border-stone-700 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-700">
          <div className="flex items-center space-x-2">
            <span className="material-symbols-outlined text-[#295744] dark:text-[#C5A880] text-[22px]">
              how_to_reg
            </span>
            <div>
              <h3 className="font-khmer font-bold text-stone-900 dark:text-stone-100 text-sm">
                {lang === 'km' ? 'សារឆ្លើយតប RSVP ពី Google Sheet' : 'All Google Sheet RSVP Responses'}
              </h3>
              <span className="text-[10px] text-stone-400 font-mono block">
                Live Sync • Google Apps Script
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={loadData}
              disabled={isLoading}
              title={lang === 'km' ? 'ធ្វើបច្ចុប្បន្នភាពសារ' : 'Refresh'}
              className="w-7 h-7 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-[#295744] dark:text-emerald-400 hover:bg-emerald-100 transition-colors cursor-pointer"
            >
              <span className={`material-symbols-outlined text-[15px] ${isLoading ? 'animate-spin' : ''}`}>
                sync
              </span>
            </button>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Pill */}
        <div className="mt-3 grid grid-cols-2 gap-2 text-center">
          <div className="p-2.5 rounded-xl bg-white dark:bg-[#26322B] border border-stone-200 dark:border-stone-700">
            <span className="text-lg font-bold font-mono text-[#295744] dark:text-[#C5A880] block">
              {totalAttendees}
            </span>
            <span className="text-[10px] text-stone-500 font-khmer">
              {lang === 'km' ? 'ភ្ញៀវចូលរួមសរុប' : 'Total Confirmed Guests'}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-white dark:bg-[#26322B] border border-stone-200 dark:border-stone-700">
            <span className="text-lg font-bold font-mono text-[#86513d] dark:text-[#E8B2B5] block">
              {records.length}
            </span>
            <span className="text-[10px] text-stone-500 font-khmer">
              {lang === 'km' ? 'ការឆ្លើយតបសរុប' : 'Total Submissions'}
            </span>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="mt-3 flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'km' ? 'ស្វែងរកតាមឈ្មោះ ឬលេខទូរស័ព្ទ...' : 'Search by name or phone...'}
              className="w-full text-xs rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-[#26322B] pl-8 pr-3 py-1.5 text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-[#295744]"
            />
            <span className="material-symbols-outlined text-[16px] text-stone-400 absolute left-2.5 top-2">
              search
            </span>
          </div>

          <div className="flex bg-stone-100 dark:bg-stone-800 rounded-xl p-0.5 border border-stone-200 dark:border-stone-700 text-[10px] font-khmer">
            <button
              onClick={() => setFilterType('all')}
              className={`px-2 py-1 rounded-lg transition-colors ${
                filterType === 'all'
                  ? 'bg-white dark:bg-[#26322B] font-bold text-[#295744] dark:text-[#C5A880] shadow-2xs'
                  : 'text-stone-500'
              }`}
            >
              {lang === 'km' ? 'ទាំងអស់' : 'All'}
            </button>
            <button
              onClick={() => setFilterType('attending')}
              className={`px-2 py-1 rounded-lg transition-colors ${
                filterType === 'attending'
                  ? 'bg-white dark:bg-[#26322B] font-bold text-emerald-600 dark:text-emerald-400 shadow-2xs'
                  : 'text-stone-500'
              }`}
            >
              {lang === 'km' ? 'ចូលរួម' : 'Attending'}
            </button>
            <button
              onClick={() => setFilterType('declined')}
              className={`px-2 py-1 rounded-lg transition-colors ${
                filterType === 'declined'
                  ? 'bg-white dark:bg-[#26322B] font-bold text-rose-600 dark:text-rose-400 shadow-2xs'
                  : 'text-stone-500'
              }`}
            >
              {lang === 'km' ? 'មិនចូលរួម' : 'Declined'}
            </button>
          </div>
        </div>

        {/* Records List Container */}
        <div className="mt-3 flex-1 overflow-y-auto no-scrollbar space-y-2 pr-0.5 min-h-[160px] max-h-[360px]">
          {isLoading && records.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center gap-2">
              <span className="material-symbols-outlined text-[28px] text-[#295744] dark:text-[#C5A880] animate-spin">
                progress_activity
              </span>
              <span className="text-xs text-stone-500 font-khmer">
                {lang === 'km' ? 'កំពុងទាញយកសារពី Google Sheet...' : 'Loading RSVPs from Google Sheet...'}
              </span>
            </div>
          ) : filteredRecords.length > 0 ? (
            filteredRecords.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-white dark:bg-[#26322B] border border-stone-200/80 dark:border-stone-700/80 flex justify-between items-start gap-2 shadow-2xs"
              >
                <div className="flex items-start gap-2.5 flex-1 min-w-0">
                  {item.photoUrl ? (
                    <img
                      src={item.photoUrl}
                      alt={item.name}
                      onClick={() => onViewPhoto?.(item.photoUrl!, item.name)}
                      className="w-10 h-10 rounded-lg object-cover cursor-pointer hover:opacity-85 shadow-2xs border border-stone-200 dark:border-stone-600 shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-400 shrink-0">
                      <span className="material-symbols-outlined text-[20px]">person</span>
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-stone-900 dark:text-stone-100 text-xs font-khmer truncate max-w-[170px]">
                        {item.name}
                      </span>
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded-md font-khmer font-semibold ${
                          item.attending === 'yes'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}
                      >
                        {item.attending === 'yes' ? `✓ ចូលរួម (${item.guestCount || 1} នាក់)` : '✗ មិនអាចចូលរួម'}
                      </span>
                    </div>

                    {item.phone && (
                      <span className="text-[10px] text-stone-500 font-mono block mt-0.5">
                        📞 {item.phone}
                      </span>
                    )}

                    {item.blessing && (
                      <p className="text-[11px] text-stone-600 dark:text-stone-300 font-khmer mt-1 leading-relaxed bg-[#FCFBF7] dark:bg-[#1E2722] p-1.5 rounded-lg border border-stone-200/60 dark:border-stone-700/60">
                        {item.blessing}
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[9px] text-stone-400 font-khmer block whitespace-nowrap">
                    {item.submittedAt}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="py-10 text-center rounded-xl bg-white dark:bg-[#26322B] border border-dashed border-stone-200 dark:border-stone-700">
              <span className="material-symbols-outlined text-[28px] text-stone-400 mb-1 block">
                inbox
              </span>
              <p className="text-xs text-stone-600 dark:text-stone-300 font-khmer font-semibold">
                {lang === 'km' ? 'មិនទាន់មានសារឆ្លើយតបនៅឡើយទេ' : 'No RSVP messages found'}
              </p>
              <p className="text-[10px] text-stone-400 font-khmer mt-0.5">
                {lang === 'km'
                  ? 'រាល់ការឆ្លើយតបក្នុង Google Sheet នឹងបង្ហាញនៅទីនេះ'
                  : 'All responses recorded in Google Sheet will appear here'}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-3 pt-3 border-t border-stone-200 dark:border-stone-700 flex justify-between items-center text-xs">
          <span className="text-[10px] text-stone-400 font-khmer">
            {filteredRecords.length} {lang === 'km' ? 'សារឆ្លើយតប' : 'responses shown'}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 font-khmer transition-colors cursor-pointer"
          >
            {lang === 'km' ? 'បិទ' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
