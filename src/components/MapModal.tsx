import React from 'react';
import { Language } from '../types';

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const MapModal: React.FC<MapModalProps> = ({ isOpen, onClose, lang }) => {
  if (!isOpen) return null;

  const handleOpenGoogleMaps = () => {
    window.open('https://maps.google.com/?q=13.5792595,103.8804069', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-[#FCFBF7] dark:bg-[#1E2722] w-full max-w-md rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl border border-stone-200 dark:border-stone-700 animate-in fade-in slide-in-from-bottom duration-300">
        <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-700">
          <div className="flex items-center space-x-2">
            <span className="material-symbols-outlined text-[#295744] dark:text-[#C5A880] text-[22px]">
              location_on
            </span>
            <div>
              <h3 className="font-khmer font-bold text-stone-900 dark:text-stone-100 text-sm">
                {lang === 'km' ? 'ទីតាំងរៀបចំពិធីមង្គលការ' : 'Wedding Celebration Venue'}
              </h3>
              <p className="text-[11px] font-khmer font-bold text-[#295744] dark:text-[#C5A880]">
                {lang === 'km' ? 'ទីតាំងផ្ទះការ (សិរីមង្គលអាពាហ៍ពិពាហ៍)' : 'Wedding House Venue'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-500 hover:text-stone-800 dark:hover:text-stone-200"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Map Preview Graphic with user's Google Maps Embed and Custom Stylized Pin */}
        <div className="mt-4 rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-700 relative aspect-video bg-[#E8ECE9] dark:bg-[#16221B] shadow-inner">
          {/* Badge: ទីតាំងផ្ទះការ as requested in screenshot */}
          <div className="absolute top-2.5 left-2.5 z-10 bg-white/95 dark:bg-[#1E2722]/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-stone-200/90 dark:border-stone-600 shadow-md flex items-center gap-1.5 pointer-events-none">
            <span className="material-symbols-outlined text-[#295744] dark:text-[#C5A880] text-[16px]">
              home_pin
            </span>
            <span className="font-khmer font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100 tracking-wide">
              {lang === 'km' ? 'ទីតាំងផ្ទះការ' : 'Wedding House'}
            </span>
          </div>

          {/* Coordinates Chip at bottom right */}
          <button
            onClick={handleOpenGoogleMaps}
            title={lang === 'km' ? 'ចុចដើម្បីបើកក្នុង Google Maps' : 'Click to open in Google Maps'}
            className="absolute bottom-2.5 right-2.5 z-10 bg-white/90 dark:bg-[#1E2722]/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-stone-200/80 dark:border-stone-700 text-[10px] text-[#295744] dark:text-[#C5A880] font-mono font-medium shadow-xs hover:scale-105 active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[13px]">near_me</span>
            <span>13.579197, 103.880530</span>
          </button>

          {/* Heart Marker Overlay (Coordinates: 13.579197, 103.880530) */}
          <div
            onClick={handleOpenGoogleMaps}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-auto cursor-pointer group flex items-center justify-center select-none"
            title={lang === 'km' ? 'ទីតាំងផ្ទះការ ហុង & រស្មី (13.579197, 103.880530)' : 'Wedding Venue (13.579197, 103.880530)'}
          >
            {/* Soft pulsing glow behind the heart */}
            <div className="absolute w-10 h-10 rounded-full bg-rose-500/30 dark:bg-rose-400/25 animate-ping pointer-events-none" />
            
            {/* Beautiful Filled Red Pulsing Heart Icon */}
            <span
              className="material-symbols-outlined text-red-600 dark:text-red-500 text-[36px] sm:text-[42px] drop-shadow-[0_4px_14px_rgba(220,38,38,0.65)] transform transition-transform group-hover:scale-125 active:scale-95 animate-pulse"
              style={{
                fontVariationSettings: "'FILL' 1, 'wght' 700, 'GRAD' 0, 'opsz' 48",
                color: '#dc2626',
              }}
            >
              favorite
            </span>
          </div>

          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d958.9462296301441!2d103.88040686021367!3d13.579259528620131!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2skh!4v1791192681140!5m2!1sen!2skh"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            className="w-full h-full min-h-[220px]"
            title={lang === 'km' ? 'ផែនទីទីតាំងផ្ទះការ ហុង & រស្មី' : 'Wedding Location Map - Hong & ReakSmey'}
          />
        </div>

        {/* Venue Address & Details */}
        <div className="mt-4 space-y-2 text-xs">
          {/* Main House / Venue Address Card */}
          <div className="p-3.5 bg-gradient-to-br from-amber-50/80 to-[#F0EEE8] dark:from-[#26322B] dark:to-[#1b2520] rounded-2xl border border-[#C5A880]/40 flex items-start gap-3 shadow-2xs">
            <div className="w-9 h-9 rounded-xl bg-[#295744] text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
              <span className="material-symbols-outlined text-[20px]">
                home
              </span>
            </div>
            <div className="flex-1">
              <p className="font-khmer font-bold text-stone-900 dark:text-stone-100 text-sm leading-snug">
                {lang === 'km' ? 'ទីតាំងផ្ទះការ គេហដ្ឋានខាងស្រី' : "Wedding Venue • Bride's Residence"}
              </p>
              <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 font-khmer leading-relaxed">
                {lang === 'km' ? 'ភូមិពាក់ស្នែងថ្មី ស្រុកអង្គធំ ខេត្តសៀមរាប' : 'Peak Snaeng Thmei Village, Angkor Thom District, Siem Reap'}
              </p>
            </div>
          </div>

          {/* Contact Phone Numbers */}
          <div className="p-2.5 bg-[#F0EEE8]/90 dark:bg-[#26322B]/80 rounded-2xl border border-stone-200/80 dark:border-stone-700/80 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-khmer px-1">
              <div className="flex items-center gap-1.5 text-stone-700 dark:text-stone-300 font-semibold">
                <span className="material-symbols-outlined text-[#295744] dark:text-[#C5A880] text-[16px]">
                  call
                </span>
                <span>{lang === 'km' ? 'លេខទូរស័ព្ទទាក់ទងសួរផ្លូវ៖' : 'Contact Phone Numbers (Directions):'}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <a
                href="tel:012345678"
                className="py-1.5 px-2 bg-white dark:bg-[#1E2722] hover:bg-stone-50 dark:hover:bg-[#19221c] rounded-xl border border-stone-200/70 dark:border-stone-700 flex items-center justify-between transition-colors shadow-2xs group cursor-pointer"
              >
                <div className="flex items-center gap-1.5">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-[#295744] dark:text-[#C5A880] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[13px]">phone_in_talk</span>
                  </span>
                  <div className="text-left leading-tight">
                    <span className="text-[9px] text-stone-500 font-khmer block">
                      {lang === 'km' ? 'ខាងស្រី' : 'Bride'}
                    </span>
                    <span className="font-mono font-bold text-[11px] text-stone-800 dark:text-stone-100 tracking-tight">
                      012 345 678
                    </span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[14px] text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                  call
                </span>
              </a>

              <a
                href="tel:098765432"
                className="py-1.5 px-2 bg-white dark:bg-[#1E2722] hover:bg-stone-50 dark:hover:bg-[#19221c] rounded-xl border border-stone-200/70 dark:border-stone-700 flex items-center justify-between transition-colors shadow-2xs group cursor-pointer"
              >
                <div className="flex items-center gap-1.5">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-[#295744] dark:text-[#C5A880] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[13px]">phone_in_talk</span>
                  </span>
                  <div className="text-left leading-tight">
                    <span className="text-[9px] text-stone-500 font-khmer block">
                      {lang === 'km' ? 'ខាងប្រុស' : 'Groom'}
                    </span>
                    <span className="font-mono font-bold text-[11px] text-stone-800 dark:text-stone-100 tracking-tight">
                      098 765 432
                    </span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[14px] text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                  call
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 pt-3 border-t border-stone-200 dark:border-stone-700 flex gap-2">
          <button
            onClick={handleOpenGoogleMaps}
            className="flex-1 py-2.5 px-3 bg-[#295744] text-white rounded-xl font-khmer text-xs font-semibold shadow hover:opacity-95 transition-opacity flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">open_in_new</span>
            <span>{lang === 'km' ? 'បើក Google Maps' : 'Open in Google Maps'}</span>
          </button>
          <button
            onClick={onClose}
            className="py-2.5 px-4 bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-200 rounded-xl font-khmer text-xs font-medium hover:bg-stone-300 dark:hover:bg-stone-600 transition-colors"
          >
            {lang === 'km' ? 'បិទ' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
