import React, { useState } from 'react';
import { Language } from '../types';

interface GiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const GiftModal: React.FC<GiftModalProps> = ({ isOpen, onClose, lang }) => {
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  if (!isOpen) return null;

  const abaData = {
    bankName: 'ABA Bank',
    bankKm: 'ធនាគារ អេប៊ីអេ (ABA Bank)',
    accountName: 'HONG & REAKSMEY',
    accountNumberUsd: '001 888 999',
    accountNumberKhr: '001 888 998',
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(label);
    setTimeout(() => setCopiedAccount(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-sm sm:max-w-md bg-[#FCFBF7] dark:bg-[#1E2722] rounded-[32px] p-5 shadow-2xl border border-stone-200/80 dark:border-stone-700 max-h-[92vh] overflow-y-auto no-scrollbar relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>

        {/* Header with Red Envelope & Floral Accent */}
        <div className="text-center pt-1 pb-3">
          <div className="w-12 h-12 mx-auto mb-2 rounded-2xl bg-gradient-to-br from-amber-500 to-rose-600 text-white flex items-center justify-center shadow-md">
            <span className="material-symbols-outlined text-[26px]">redeem</span>
          </div>

          <span className="text-[11px] font-display uppercase tracking-widest text-[#C5A880] font-bold block">
            Wedding Gift &amp; Ang Pao
          </span>
          <h3 className="font-khmer font-bold text-lg sm:text-xl text-[#0d402e] dark:text-[#67AA8E] mt-0.5">
            {lang === 'km' ? 'ចំណងដៃអាពាហ៍ពិពាហ៍ (ABA Bank)' : 'Wedding Gift (ABA Bank)'}
          </h3>
          <p className="text-xs text-stone-600 dark:text-stone-300 font-khmer mt-1 max-w-xs mx-auto leading-relaxed">
            {lang === 'km'
              ? 'សូមថ្លែងអំណរគុណយ៉ាងជ្រាលជ្រៅចំពោះទឹកចិត្ត និងចំណងដៃដ៏មានតម្លៃរបស់លោកអ្នក ជូនចំពោះគូស្វាមីភរិយាថ្មី'
              : 'Thank you sincerely for blessing Hong & ReakSmey with your love and wedding gift.'}
          </p>
        </div>

        {/* KHQR Card Box */}
        <div className="bg-white dark:bg-[#26322B] rounded-3xl p-4 border border-stone-200/80 dark:border-stone-700 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
          {/* Top KHQR Standard Red Header */}
          <div className="w-full bg-[#E1251B] text-white py-2 px-3 rounded-2xl flex items-center justify-between shadow-xs mb-3">
            <div className="flex items-center gap-1.5">
              <span className="font-display font-black text-sm tracking-wider">KHQR</span>
              <span className="text-[10px] opacity-85 font-mono">• BAKONG</span>
            </div>
            <span className="text-[11px] font-khmer font-medium">
              {abaData.bankKm}
            </span>
          </div>

          {/* Authentic High-Contrast QR Code Artwork */}
          <div className="p-3 bg-white rounded-2xl border-2 border-stone-200 shadow-xs relative group mb-3">
            <svg
              className="w-48 h-48 sm:w-52 sm:h-52"
              viewBox="0 0 180 180"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Background */}
              <rect width="180" height="180" fill="#FFFFFF" rx="10" />

              {/* Top-Left Finder Pattern */}
              <rect x="15" y="15" width="42" height="42" rx="6" fill="#1C1917" />
              <rect x="22" y="22" width="28" height="28" rx="3" fill="#FFFFFF" />
              <rect x="29" y="29" width="14" height="14" rx="2" fill="#1C1917" />

              {/* Top-Right Finder Pattern */}
              <rect x="123" y="15" width="42" height="42" rx="6" fill="#1C1917" />
              <rect x="130" y="22" width="28" height="28" rx="3" fill="#FFFFFF" />
              <rect x="137" y="29" width="14" height="14" rx="2" fill="#1C1917" />

              {/* Bottom-Left Finder Pattern */}
              <rect x="15" y="123" width="42" height="42" rx="6" fill="#1C1917" />
              <rect x="22" y="130" width="28" height="28" rx="3" fill="#FFFFFF" />
              <rect x="29" y="137" width="14" height="14" rx="2" fill="#1C1917" />

              {/* Alignment marker */}
              <rect x="128" y="128" width="24" height="24" rx="4" fill="#1C1917" />
              <rect x="134" y="134" width="12" height="12" rx="2" fill="#FFFFFF" />
              <rect x="138" y="138" width="4" height="4" fill="#1C1917" />

              {/* Timing Patterns */}
              <path
                d="M 62 33 H 118 M 33 62 V 118"
                stroke="#1C1917"
                strokeWidth="4"
                strokeDasharray="4 4"
              />

              {/* Data Blocks */}
              <rect x="66" y="18" width="8" height="8" fill="#1C1917" rx="1" />
              <rect x="80" y="18" width="8" height="16" fill="#1C1917" rx="1" />
              <rect x="96" y="26" width="16" height="8" fill="#1C1917" rx="1" />
              <rect x="66" y="44" width="16" height="8" fill="#1C1917" rx="1" />
              <rect x="90" y="44" width="8" height="16" fill="#1C1917" rx="1" />
              <rect x="106" y="44" width="12" height="8" fill="#1C1917" rx="1" />

              <rect x="18" y="66" width="8" height="16" fill="#1C1917" rx="1" />
              <rect x="34" y="66" width="16" height="8" fill="#1C1917" rx="1" />
              <rect x="26" y="90" width="8" height="16" fill="#1C1917" rx="1" />
              <rect x="42" y="98" width="14" height="8" fill="#1C1917" rx="1" />

              <rect x="126" y="66" width="8" height="16" fill="#1C1917" rx="1" />
              <rect x="142" y="66" width="16" height="8" fill="#1C1917" rx="1" />
              <rect x="150" y="82" width="12" height="12" fill="#1C1917" rx="1" />
              <rect x="130" y="94" width="14" height="8" fill="#1C1917" rx="1" />

              <rect x="66" y="126" width="16" height="8" fill="#1C1917" rx="1" />
              <rect x="90" y="126" width="8" height="16" fill="#1C1917" rx="1" />
              <rect x="106" y="126" width="12" height="8" fill="#1C1917" rx="1" />
              <rect x="74" y="146" width="16" height="8" fill="#1C1917" rx="1" />
              <rect x="100" y="146" width="16" height="16" fill="#1C1917" rx="1" />

              {/* Center Heart Crest Emblem */}
              <circle cx="90" cy="90" r="18" fill="#FFFFFF" stroke="#E1251B" strokeWidth="2" />
              <path
                d="M90 98 C82 92, 78 86, 78 81 C78 77, 81 74, 85 74 C87.5 74, 89.5 75.5, 90 77 C90.5 75.5, 92.5 74, 95 74 C99 74, 102 77, 102 81 C102 86, 98 92, 90 98 Z"
                fill="#E1251B"
              />
            </svg>

            {/* Scan Me Badge */}
            <div className="absolute bottom-1 inset-x-0 flex justify-center">
              <span className="bg-[#005f73] text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full shadow-xs uppercase tracking-wider">
                ABA KHQR • Scan with Any Bank
              </span>
            </div>
          </div>

          {/* Account Details */}
          <div className="w-full space-y-2 text-left pt-1">
            {/* Account Name */}
            <div className="p-3 bg-[#FCFBF7] dark:bg-[#1E2722] rounded-xl border border-stone-200/70 dark:border-stone-700">
              <span className="text-[10px] uppercase tracking-wider text-stone-500 font-bold block">
                {lang === 'km' ? 'ឈ្មោះម្ចាស់គណនី (Account Name)' : 'Account Name'}
              </span>
              <span className="font-bold text-sm text-stone-900 dark:text-stone-100 block mt-0.5">
                {abaData.accountName}
              </span>
            </div>

            {/* USD Account */}
            <div className="p-3 bg-[#FCFBF7] dark:bg-[#1E2722] rounded-xl border border-stone-200/70 dark:border-stone-700 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-stone-500 font-bold block">
                  {lang === 'km' ? 'លេខកុងដុល្លារ (USD Account)' : 'USD Account'}
                </span>
                <span className="font-mono font-bold text-base text-[#005f73] dark:text-[#56cfe1]">
                  {abaData.accountNumberUsd}
                </span>
              </div>
              <button
                onClick={() => handleCopy(abaData.accountNumberUsd, 'usd')}
                className="px-3 py-1.5 bg-stone-100 dark:bg-stone-800 hover:bg-[#005f73] hover:text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px]">
                  {copiedAccount === 'usd' ? 'check' : 'content_copy'}
                </span>
                <span>{copiedAccount === 'usd' ? (lang === 'km' ? 'បានចម្លង' : 'Copied') : (lang === 'km' ? 'ចម្លង' : 'Copy')}</span>
              </button>
            </div>

            {/* KHR Account */}
            <div className="p-3 bg-[#FCFBF7] dark:bg-[#1E2722] rounded-xl border border-stone-200/70 dark:border-stone-700 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-stone-500 font-bold block">
                  {lang === 'km' ? 'លេខកុងរៀល (KHR Account)' : 'KHR Account'}
                </span>
                <span className="font-mono font-bold text-base text-[#005f73] dark:text-[#56cfe1]">
                  {abaData.accountNumberKhr}
                </span>
              </div>
              <button
                onClick={() => handleCopy(abaData.accountNumberKhr, 'khr')}
                className="px-3 py-1.5 bg-stone-100 dark:bg-stone-800 hover:bg-[#005f73] hover:text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px]">
                  {copiedAccount === 'khr' ? 'check' : 'content_copy'}
                </span>
                <span>{copiedAccount === 'khr' ? (lang === 'km' ? 'បានចម្លង' : 'Copied') : (lang === 'km' ? 'ចម្លង' : 'Copy')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Toast alert on copy */}
        {copiedAccount && (
          <div className="mt-3 text-center py-1.5 px-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs text-[#005f73] dark:text-emerald-300 font-khmer animate-in fade-in">
            ✓ បានចម្លងលេខកុង ABA ជោគជ័យ! (ABA account copied to clipboard!)
          </div>
        )}

        {/* Traditional Blessing Footnote */}
        <div className="mt-4 pt-3 border-t border-stone-200/60 dark:border-stone-700/60 text-center">
          <p className="text-[11px] text-stone-500 dark:text-stone-400 font-khmer italic">
            «សូមគោរពជូនពរឱ្យលោកអ្នក និងក្រុមគ្រួសារ ជួបតែពុទ្ធពរទាំង ៤ ប្រការ៖ អាយុ វណ្ណៈ សុខៈ ពលៈ កុំបីឃ្លៀងឃ្លាតឡើយ»
          </p>
        </div>
      </div>
    </div>
  );
};
