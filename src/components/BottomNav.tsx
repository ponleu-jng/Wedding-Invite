import React from 'react';
import { Screen, Language } from '../types';

interface BottomNavProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  lang: Language;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate, lang }) => {
  const tabs = [
    {
      id: 'home' as Screen,
      labelKm: 'ទំព័រដើម',
      labelEn: 'Home',
      icon: (isActive: boolean) => (
        <svg
          fill="currentColor"
          height="22px"
          viewBox="0 0 256 256"
          width="22px"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M218.83,103.77l-80-75.48a1.14,1.14,0,0,1-.11-.11,16,16,0,0,0-21.53,0l-.11.11L37.17,103.77A16,16,0,0,0,32,115.55V208a16,16,0,0,0,16,16H96a16,16,0,0,0,16-16V160h32v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V115.55A16,16,0,0,0,218.83,103.77ZM208,208H160V160a16,16,0,0,0-16-16H112a16,16,0,0,0-16,16v48H48V115.55l.11-.1L128,40l79.9,75.43.11.1Z" />
        </svg>
      )
    },
    {
      id: 'story' as Screen,
      labelKm: 'រឿងរ៉ាវ',
      labelEn: 'Story',
      icon: (isActive: boolean) => (
        <svg
          fill="currentColor"
          height="22px"
          viewBox="0 0 256 256"
          width="22px"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M184,20a12,12,0,1,1,12,12A12,12,0,0,1,184,20ZM164.12,73.23c7.26,44.25,4.35,75.76-8.66,93.66A39.94,39.94,0,0,1,128,183.42V232h16a8,8,0,0,1,0,16H96a8,8,0,0,1,0-16h16V183.42a40,40,0,0,1-27.46-16.53c-13-17.9-15.91-49.41-8.65-93.66A451,451,0,0,1,90.1,13.53,8,8,0,0,1,97.71,8H142.3a8,8,0,0,1,7.61,5.53A451,451,0,0,1,164.12,73.23ZM93.8,64h52.4c-3-15.58-6.72-29.81-9.78-40H103.59C100.53,34.19,96.83,48.42,93.8,64ZM149,80H91c-4.49,30-5.14,61.54,6.45,77.49C102.63,164.56,110,168,120,168s17.38-3.44,22.52-10.51C154.1,141.54,153.46,110,149,80Zm71-40a12,12,0,1,0,12,12A12,12,0,0,0,220,40ZM196,88a12,12,0,1,0,12,12A12,12,0,0,0,196,88Z" />
        </svg>
      )
    },
    {
      id: 'gallery' as Screen,
      labelKm: 'រូបថត',
      labelEn: 'Gallery',
      icon: (isActive: boolean) => (
        <svg
          fill="currentColor"
          height="22px"
          viewBox="0 0 256 256"
          width="22px"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M216,40H72A16,16,0,0,0,56,56V72H40A16,16,0,0,0,24,88V200a16,16,0,0,0,16,16H184a16,16,0,0,0,16-16V184h16a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM172,72a12,12,0,1,1-12,12A12,12,0,0,1,172,72Zm12,128H40V88H56v80a16,16,0,0,0,16,16H184Zm32-32H72V132l36-36,49.66,49.66a8,8,0,0,0,11.31,0L194.63,120,216,141.38V168Z" />
        </svg>
      )
    },
    {
      id: 'rsvp' as Screen,
      labelKm: 'ចូលរួម',
      labelEn: 'RSVP',
      icon: (isActive: boolean) => (
        <svg
          fill="currentColor"
          height="22px"
          viewBox="0 0 256 256"
          width="22px"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M213.66,66.34l-40-40A8,8,0,0,0,168,24H88A16,16,0,0,0,72,40V56H56A16,16,0,0,0,40,72V216a16,16,0,0,0,16,16H168a16,16,0,0,0,16-16V200h16a16,16,0,0,0,16-16V72A8,8,0,0,0,213.66,66.34ZM168,216H56V72h76.69L168,107.31v84.53c0,.06,0,.11,0,.16s0,.1,0,.16V216Zm32-32H184V104a8,8,0,0,0-2.34-5.66l-40-40A8,8,0,0,0,136,56H88V40h76.69L200,75.31Zm-56-32a8,8,0,0,1-8,8H88a8,8,0,0,1,0-16h48A8,8,0,0,1,144,152Zm0,32a8,8,0,0,1-8,8H88a8,8,0,0,1,0-16h48A8,8,0,0,1,144,184Z" />
        </svg>
      )
    }
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 w-full max-w-[440px] mx-auto flex gap-1 border-t border-[#eaf0ee]/90 dark:border-stone-800/90 bg-[#f9fbfa]/95 dark:bg-[#161D19]/95 backdrop-blur-xl px-2 pt-2 pb-3 shadow-[0_-4px_25px_rgba(0,0,0,0.08)] dark:shadow-[0_-4px_25px_rgba(0,0,0,0.5)] transition-all">
      {tabs.map((tab) => {
        const isActive = currentScreen === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onNavigate(tab.id)}
            className={`flex flex-1 flex-col items-center justify-center py-1 rounded-xl transition-all duration-200 ${
              isActive
                ? 'text-[#0d402e] dark:text-[#C5A880] font-bold bg-[#295744]/10 dark:bg-[#C5A880]/15'
                : 'text-[#628476] dark:text-stone-400 hover:text-[#0d402e] dark:hover:text-stone-200'
            }`}
          >
            <div className="flex h-7 items-center justify-center transition-transform group-hover:scale-110">
              {tab.icon(isActive)}
            </div>
            <p className="text-[11px] font-medium leading-none tracking-tight mt-1 font-khmer">
              {lang === 'km' ? `${tab.labelEn} / ${tab.labelKm}` : tab.labelEn}
            </p>
          </button>
        );
      })}
    </nav>
  );
};
