import React from 'react';
import { Language } from '../types';

interface MonogramSealModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const MonogramSealModal: React.FC<MonogramSealModalProps> = ({ isOpen, onClose, lang }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl border border-[#C5A880]/40 bg-[#0d402e] text-[#C5A880] p-6 text-center animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 text-stone-200 hover:text-white flex items-center justify-center transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>

        {/* Ambient Golden Glitter Dust */}
        <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#C5A880_1px,transparent_1px)] [background-size:16px_16px]"></div>

        {/* Subtitle */}
        <div className="relative z-10 pt-2 mb-4">
          <p className="font-display tracking-[0.25em] text-xs uppercase text-[#C5A880]/80">
            {lang === 'km' ? 'ត្រាមង្គលអាពាហ៍ពិពាហ៍' : 'Official Wedding Monogram'}
          </p>
          <h3 className="font-khmer text-lg text-white font-semibold mt-1">
            Hong &amp; ReakSmey
          </h3>
        </div>

        {/* Central Monogram Artwork Matching H & R */}
        <div className="relative z-10 mx-auto my-6 w-56 h-56 rounded-2xl bg-gradient-to-br from-[#124d38] via-[#0d402e] to-[#07251a] border border-[#C5A880]/50 shadow-inner flex items-center justify-center p-4">
          <svg className="w-full h-full drop-shadow-[0_4px_12px_rgba(197,168,128,0.4)]" viewBox="0 0 200 200" fill="none">
            {/* Outer Subtle Sacred Circle */}
            <circle cx="100" cy="100" r="92" stroke="#C5A880" strokeWidth="0.75" strokeDasharray="3 3" opacity="0.6" />
            <circle cx="100" cy="100" r="88" stroke="#C5A880" strokeWidth="0.5" opacity="0.4" />

            {/* Letter H */}
            <path
              d="M45 52H57V92H88V52H100V148H88V104H57V148H45V52Z"
              fill="#D4AF37"
              stroke="#F5EEDB"
              strokeWidth="0.5"
            />

            {/* Ampersand & intertwined */}
            <path
              d="M95 102C92 97 89 91 89 85C89 77 95 71 103 71C109 71 114 74 116 79L110 84C108 81 106 80 103 80C100 80 98 82 98 85C98 88 100 92 104 97L114 109C118 114 120 119 120 125C120 135 112 143 100 143C89 143 82 135 82 125C82 117 87 110 95 102ZM91 125C91 131 95 135 101 135C107 135 111 131 111 125C111 121 108 117 105 113L97 103C93 108 91 115 91 125Z"
              fill="#F5EEDB"
              stroke="#C5A880"
              strokeWidth="0.5"
            />

            {/* Letter R intertwined */}
            <path
              d="M115 52H145C160 52 170 63 170 78C170 90 162 99 150 103L172 148H157L138 106H127V148H115V52ZM127 64V94H143C152 94 157 88 157 78C157 68 152 64 143 64H127Z"
              fill="#D4AF37"
              stroke="#F5EEDB"
              strokeWidth="0.5"
            />

            {/* Botanical Lotus Floral Sprig entwined in H */}
            <g transform="translate(38, 70)">
              <path d="M12 45C12 30 20 15 28 0" stroke="#F5EEDB" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M28 0C22 8 18 18 20 28C26 28 32 20 28 0Z" fill="#D4AF37" stroke="#F5EEDB" strokeWidth="0.5" />
              <path d="M28 0C34 8 38 18 36 28C30 28 24 20 28 0Z" fill="#D4AF37" stroke="#F5EEDB" strokeWidth="0.5" />
              <path d="M28 0C25 10 26 20 28 32C30 20 31 10 28 0Z" fill="#F5EEDB" />
            </g>
          </svg>
        </div>

        {/* Description & Action */}
        <p className="relative z-10 text-xs font-body-sm text-[#C5A880]/90 leading-relaxed px-2 font-khmer">
          {lang === 'km'
            ? 'ត្រាអក្សរកាត់តំណាងឱ្យចំណងស្នេហាអមតៈរវាង ហុង និង រស្មី ផ្កាឈូកមាសតំណាងឱ្យភាពបរិសុទ្ធ និងភាពរីកចម្រើន។'
            : 'The official golden monogram symbolizes the sacred eternal union of Hong & ReakSmey, entwined with Khmer royal lotus petals.'}
        </p>

        <div className="relative z-10 mt-5 pt-3 border-t border-[#C5A880]/30 flex items-center justify-center gap-3">
          <button
            onClick={() => {
              alert(
                lang === 'km'
                  ? 'ត្រាមង្គលត្រូវបានចម្លងទុកជាអនុស្សាវរីយ៍!'
                  : 'Monogram emblem saved as digital wedding keepsake!'
              );
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl bg-[#C5A880] text-[#0d402e] font-semibold text-xs flex items-center gap-2 hover:bg-[#d4af37] transition-colors shadow-md"
          >
            <span className="material-symbols-outlined text-[16px]">file_download</span>
            <span>{lang === 'km' ? 'រក្សាទុកត្រាមង្គល' : 'Save Keepsake'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
