import React from 'react';
import { Language } from '../types';
import { downloadPhoto } from '../utils/imageHelper';

interface GuestPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  photoUrl: string;
  guestName: string;
  blessing?: string;
  submittedAt?: string;
  lang: Language;
}

export const GuestPhotoModal: React.FC<GuestPhotoModalProps> = ({
  isOpen,
  onClose,
  photoUrl,
  guestName,
  blessing,
  submittedAt,
  lang
}) => {
  if (!isOpen || !photoUrl) return null;

  const handleDownload = () => {
    const cleanName = guestName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    downloadPhoto(photoUrl, `wedding-guest-${cleanName || 'memory'}-${Date.now()}.jpg`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="relative max-w-lg w-full bg-[#1E2722] text-stone-100 rounded-3xl overflow-hidden shadow-2xl border border-stone-700/80 flex flex-col max-h-[90vh]">
        {/* Header Bar */}
        <div className="px-4 py-3 border-b border-stone-700/80 flex items-center justify-between bg-[#16201B]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#C5A880] text-[20px]">
              photo_camera
            </span>
            <div>
              <h3 className="font-khmer font-bold text-xs sm:text-sm text-stone-100">
                {lang === 'km' ? `រូបភាពពីភ្ញៀវ៖ ${guestName}` : `Photo from ${guestName}`}
              </h3>
              {submittedAt && (
                <span className="text-[10px] text-stone-400 font-mono block">
                  {submittedAt}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full bg-stone-800 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Photo Canvas */}
        <div className="flex-1 overflow-hidden bg-black flex items-center justify-center p-2 relative min-h-[260px] max-h-[55vh]">
          <img
            src={photoUrl}
            alt={guestName}
            className="max-w-full max-h-full object-contain rounded-xl shadow-lg"
          />
        </div>

        {/* Blessing Text & Download Action */}
        <div className="p-4 bg-[#16201B] border-t border-stone-700/80 space-y-3">
          {blessing && (
            <div className="p-3 bg-stone-800/60 rounded-xl border border-stone-700/50">
              <span className="text-[10px] text-[#C5A880] font-khmer block font-semibold mb-0.5">
                {lang === 'km' ? 'ពាក្យជូនពររបស់ភ្ញៀវ៖' : 'Guest Blessing:'}
              </span>
              <p className="text-xs text-stone-200 font-khmer italic leading-relaxed">
                «{blessing}»
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={handleDownload}
              className="flex-1 py-2.5 px-4 bg-gradient-to-r from-[#295744] to-[#397259] hover:from-[#214737] hover:to-[#2f5e49] text-white rounded-xl text-xs font-khmer font-semibold shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              <span>{lang === 'km' ? 'ទាញយក និងរក្សាទុករូបភាព' : 'Download & Save Photo'}</span>
            </button>
            <button
              onClick={onClose}
              className="py-2.5 px-4 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl text-xs font-khmer font-medium transition-colors cursor-pointer"
            >
              {lang === 'km' ? 'បិទ' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
