import React from 'react';
import { Language, Screen } from '../types';
import { AudioPlayer } from './AudioPlayer';

interface TopHeaderProps {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  isPlayingMusic: boolean;
  onToggleMusic: () => void;
  onOpenMonogram: () => void;
  petalsEnabled: boolean;
  onTogglePetals: () => void;
  currentScreen?: Screen;
  onNavigate?: (screen: Screen) => void;
  isMobilePreview?: boolean;
  onToggleMobilePreview?: () => void;
  onOpenGiftModal?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  lang,
  onLanguageChange,
  isDark,
  onToggleTheme,
  isPlayingMusic,
  onToggleMusic,
  onOpenMonogram,
  petalsEnabled,
  onTogglePetals,
  currentScreen = 'home',
  onNavigate,
  isMobilePreview = false,
  onToggleMobilePreview,
  onOpenGiftModal,
}) => {
  const navItems = [
    { id: 'home' as Screen, labelKm: 'ទំព័រដើម', labelEn: 'Home' },
    { id: 'story' as Screen, labelKm: 'រឿងរ៉ាវ & កម្មវិធី', labelEn: 'Story & Program' },
    { id: 'gallery' as Screen, labelKm: 'រូបថត', labelEn: 'Gallery' },
    { id: 'rsvp' as Screen, labelKm: 'ឆ្លើយតប (RSVP)', labelEn: 'RSVP' },
  ];

  return (
    <header className="w-full flex items-center justify-between px-2.5 sm:px-5 py-2 mb-1 text-xs tracking-wider z-30 transition-all">
      {/* Left Zone: Brand Mark & Bilingual Toggle */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Desktop Brand Wordmark */}
        <div className="hidden lg:flex items-center gap-2 cursor-pointer" onClick={() => onNavigate?.('home')}>
          <div className="w-7 h-7 rounded-full border border-[#C5A880] bg-[#FFF8ED] dark:bg-[#1E2722] text-[#295744] dark:text-[#C5A880] flex items-center justify-center font-display font-bold text-[10px] shadow-2xs">
            H&R
          </div>
          <div>
            <span className="font-display font-bold text-xs tracking-wide text-[#295744] dark:text-[#C5A880] block leading-none">
              Hong &amp; ReakSmey
            </span>
            <span className="text-[9px] text-stone-500 font-khmer block mt-0.5">
              10 Oct 2030 • ពិធីអាពាហ៍ពិពាហ៍
            </span>
          </div>
        </div>

        {/* Bilingual Switcher */}
        <div className="inline-flex items-center p-0.5 bg-white/80 dark:bg-[#1E2722]/80 backdrop-blur-md rounded-full shadow-2xs border border-stone-200/80 dark:border-stone-700">
          <button
            onClick={() => onLanguageChange('km')}
            className={`px-2 py-0.5 rounded-full text-[10px] font-khmer font-semibold transition-all duration-200 ${
              lang === 'km'
                ? 'bg-[#295744] text-white shadow-2xs'
                : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            ខ្មែរ
          </button>
          <button
            onClick={() => onLanguageChange('en')}
            className={`px-2 py-0.5 rounded-full text-[10px] font-modern font-medium transition-all duration-200 ${
              lang === 'en'
                ? 'bg-[#295744] text-white shadow-2xs font-semibold'
                : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            EN
          </button>
        </div>
      </div>

      {/* Middle Zone: Desktop Navigation Links (hidden on mobile) */}
      {!isMobilePreview && onNavigate && (
        <nav className="hidden md:flex items-center gap-1 p-0.5 bg-white/70 dark:bg-[#1E2722]/70 backdrop-blur-md rounded-full border border-stone-200/70 dark:border-stone-700 shadow-2xs">
          {navItems.map((item) => {
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all font-khmer ${
                  isActive
                    ? 'bg-[#295744] text-white shadow-2xs'
                    : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                {lang === 'km' ? item.labelKm : item.labelEn}
              </button>
            );
          })}
        </nav>
      )}

      {/* Right Zone: Control Buttons Cluster */}
      <div className="flex items-center space-x-1 sm:space-x-1.5">
        {/* Gift Button with QR Code & Bank Accounts (Icon Only) */}
        <button
          onClick={onOpenGiftModal}
          aria-label={lang === 'km' ? 'អំណោយ & QR Code' : 'Wedding Gift & KHQR'}
          title={lang === 'km' ? 'អំណោយ (QR Code & លេខកុងធនាគារ)' : 'Wedding Gift & KHQR'}
          className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-50 to-rose-50 dark:from-[#26322B] dark:to-[#1E2722] border border-[#C5A880]/70 flex items-center justify-center text-[#c1121f] dark:text-[#E8B2B5] shadow-2xs hover:scale-105 active:scale-95 transition-transform cursor-pointer"
        >
          <span className="material-symbols-outlined text-[15px]">redeem</span>
        </button>

        {/* Audio Melodies */}
        <AudioPlayer isPlaying={isPlayingMusic} onToggle={onToggleMusic} lang={lang} />

        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          aria-label={lang === 'km' ? 'ប្តូរពន្លឺ / ងងឹត' : 'Toggle theme'}
          title={isDark ? (lang === 'km' ? 'ទម្រង់ពន្លឺ (Light)' : 'Light Mode') : (lang === 'km' ? 'ទម្រង់រាត្រី (Dark)' : 'Dark Mode')}
          className="w-7 h-7 rounded-full bg-white/80 dark:bg-[#1E2722]/80 backdrop-blur-md border border-stone-200/80 dark:border-stone-700 flex items-center justify-center text-stone-600 dark:text-[#C5A880] shadow-2xs hover:scale-105 active:scale-95 transition-transform"
        >
          {isDark ? (
            <span className="material-symbols-outlined text-[14px]">light_mode</span>
          ) : (
            <span className="material-symbols-outlined text-[14px]">dark_mode</span>
          )}
        </button>
      </div>
    </header>
  );
};
