import React, { useState } from 'react';
import { Language, Screen } from '../types';
import { WEDDING_SCHEDULE, LOVE_STORY_CHAPTERS } from '../data/mockData';

interface StoryScreenProps {
  lang: Language;
  onNavigate: (screen: Screen) => void;
  onOpenRsvpModal: () => void;
  onOpenCeremonyModal?: () => void;
}

export const StoryScreen: React.FC<StoryScreenProps> = ({
  lang,
  onNavigate,
  onOpenRsvpModal,
  onOpenCeremonyModal
}) => {
  const [activeTab, setActiveTab] = useState<'story' | 'itinerary' | 'dresscode'>('story');

  const dressCodeColors = [
    { nameKm: 'បៃតងព្រៃធម្មជាតិ', nameEn: 'Botanical Forest Green', hex: '#295744' },
    { nameKm: 'ពណ៌មាសឆើតឆាយ', nameEn: 'Champagne Gold', hex: '#C5A880' },
    { nameKm: 'ផ្កាឈូកស្រាល', nameEn: 'Blush Peony Pink', hex: '#E8B2B5' },
    { nameKm: 'ផ្ទៃមេឃស្រទន់', nameEn: 'Cornflower Blue Silk', hex: '#9BB4C7' }
  ];

  return (
    <div className="w-full bg-[#FCFBF7] dark:bg-[#1E2722] rounded-3xl shadow-xl border border-stone-200/80 dark:border-stone-700/80 overflow-hidden transition-colors pb-12">
      {/* Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-[#FCFBF7]/90 dark:bg-[#1E2722]/90 backdrop-blur-md border-b border-stone-200/70 dark:border-stone-700">
        <button
          onClick={() => onNavigate('home')}
          aria-label="Back to Home"
          className="flex size-9 shrink-0 items-center justify-center rounded-full hover:bg-stone-200/60 dark:hover:bg-stone-700 text-[#0d402e] dark:text-[#C5A880] transition-colors"
        >
          <span className="material-symbols-outlined text-[22px]">arrow_back</span>
        </button>

        <div className="flex flex-col items-center text-center">
          <span className="font-display text-xs tracking-widest uppercase text-[#86513d] dark:text-[#C5A880] font-semibold">
            Hong &amp; ReakSmey
          </span>
          <h1 className="text-sm font-bold text-[#0d402e] dark:text-stone-100 tracking-tight font-khmer">
            {lang === 'km' ? 'រឿងរ៉ាវ & កាលវិភាគ' : 'Our Story & Program'}
          </h1>
        </div>

        <button
          onClick={onOpenRsvpModal}
          className="px-3 py-1 bg-[#295744] text-white rounded-full text-[11px] font-semibold font-khmer hover:opacity-90"
        >
          RSVP
        </button>
      </header>

      {/* Segmented Subnavigation */}
      <div className="px-4 pt-3 pb-1">
        <div className="flex p-1 bg-stone-200/70 dark:bg-stone-800 rounded-2xl">
          <button
            onClick={() => setActiveTab('story')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-semibold font-khmer transition-all ${
              activeTab === 'story'
                ? 'bg-white dark:bg-[#26322B] text-[#295744] dark:text-[#C5A880] shadow-xs'
                : 'text-stone-600 dark:text-stone-400'
            }`}
          >
            {lang === 'km' ? 'រឿងរ៉ាវស្នេហា' : 'Love Story'}
          </button>
          <button
            onClick={() => setActiveTab('itinerary')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-semibold font-khmer transition-all ${
              activeTab === 'itinerary'
                ? 'bg-white dark:bg-[#26322B] text-[#295744] dark:text-[#C5A880] shadow-xs'
                : 'text-stone-600 dark:text-stone-400'
            }`}
          >
            {lang === 'km' ? 'កម្មវិធីមង្គល' : 'Itinerary'}
          </button>
          <button
            onClick={() => setActiveTab('dresscode')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-semibold font-khmer transition-all ${
              activeTab === 'dresscode'
                ? 'bg-white dark:bg-[#26322B] text-[#295744] dark:text-[#C5A880] shadow-xs'
                : 'text-stone-600 dark:text-stone-400'
            }`}
          >
            {lang === 'km' ? 'ការស្លៀកពាក់' : 'Dress Code'}
          </button>
        </div>
      </div>

      <main className="px-4 py-4 space-y-6">
        {/* STORY TAB */}
        {activeTab === 'story' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="text-center">
              <span className="font-display italic text-xs tracking-widest text-[#C5A880] uppercase">
                {lang === 'km' ? 'ដំណើរនៃក្តីស្រឡាញ់' : 'The Journey of Love'}
              </span>
              <h2 className="text-xl font-bold font-khmer text-[#0d402e] dark:text-[#67AA8E] mt-0.5">
                Hong &amp; ReakSmey
              </h2>
              <p className="text-xs text-stone-500 font-khmer mt-1 max-w-xs mx-auto">
                {lang === 'km'
                  ? 'រាល់ការចងចាំទាំងអស់ គឺជាគ្រាប់ពេជ្រដ៏មានតម្លៃដែលបានត្បាញក្លាយជាចំណងអាពាហ៍ពិពាហ៍'
                  : 'Every cherished memory paved the path to our lifelong sacred vow'}
              </p>
            </div>

            {/* Timeline chapters */}
            <div className="relative border-l-2 border-[#C5A880]/40 ml-4 space-y-6 pl-5">
              {LOVE_STORY_CHAPTERS.map((ch, idx) => (
                <div key={idx} className="relative group">
                  {/* Timeline dot */}
                  <div className="absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full bg-[#295744] dark:bg-[#C5A880] border-2 border-white dark:border-[#1E2722] shadow-xs"></div>

                  <span className="text-[11px] font-mono font-bold text-[#86513d] dark:text-[#C5A880] tracking-wider">
                    {ch.year}
                  </span>
                  <h3 className="text-sm font-bold text-[#0d402e] dark:text-stone-100 font-khmer leading-snug mt-0.5">
                    {lang === 'km' ? ch.titleKm : ch.titleEn}
                  </h3>

                  <div className="mt-2 rounded-xl overflow-hidden aspect-video bg-stone-200 dark:bg-stone-800 shadow-2xs border border-stone-200/60 dark:border-stone-700/60">
                    <img
                      src={ch.image}
                      alt={ch.titleEn}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <p className="text-xs text-stone-600 dark:text-stone-300 font-khmer mt-2 leading-relaxed">
                    {lang === 'km' ? ch.descKm : ch.descEn}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ITINERARY TAB */}
        {activeTab === 'itinerary' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="text-center mb-2">
              <span className="font-display italic text-xs tracking-widest text-[#C5A880] uppercase">
                {lang === 'km' ? 'កាលវិភាគពិធីមង្គលការ' : 'Wedding Itinerary & Sacred Program'}
              </span>
              <h2 className="text-lg font-bold font-khmer text-[#0d402e] dark:text-[#67AA8E] mt-0.5">
                ថ្ងៃអាទិត្យ ទី១០ ខែតុលា ឆ្នាំ២០៣០
              </h2>
              <p className="text-xs text-stone-500 font-khmer">
                Sunday, October 10, 2030 • Phnom Penh
              </p>
            </div>

            {/* Parents Honor & Family Blessing Card */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#FFF8ED] to-[#F5DFD0]/60 dark:from-[#26322B] dark:to-[#1b2520] border border-[#C5A880]/40 shadow-xs space-y-2">
              <div className="flex items-center justify-between border-b border-[#C5A880]/30 pb-1.5">
                <span className="text-[11px] font-bold text-[#86513d] dark:text-[#C5A880] font-khmer flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px]">diversity_1</span>
                  <span>{lang === 'km' ? 'មាតាបិតាទាំងសងខាង' : 'With Blessings from Both Families'}</span>
                </span>
                {onOpenCeremonyModal && (
                  <button
                    onClick={onOpenCeremonyModal}
                    className="text-[10px] font-bold text-[#295744] dark:text-[#C5A880] underline font-khmer"
                  >
                    {lang === 'km' ? 'ពិធីលម្អិតទាំង ៧' : 'View 7 Rituals'}
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-khmer">
                <div className="p-2 bg-white/70 dark:bg-stone-900/60 rounded-xl">
                  <span className="text-[10px] text-stone-400 block">{lang === 'km' ? 'ខាងកូនកំលោះ' : "Groom's Parents"}</span>
                  <span className="font-bold text-stone-800 dark:text-stone-200 block">លោក ឈុន វឌ្ឍនា</span>
                  <span className="font-bold text-stone-800 dark:text-stone-200 block">លោកស្រី កែវ ចរិយា</span>
                </div>
                <div className="p-2 bg-white/70 dark:bg-stone-900/60 rounded-xl">
                  <span className="text-[10px] text-stone-400 block">{lang === 'km' ? 'ខាងកូនក្រមុំ' : "Bride's Parents"}</span>
                  <span className="font-bold text-stone-800 dark:text-stone-200 block">លោក ហេង សម្បត្តិ</span>
                  <span className="font-bold text-stone-800 dark:text-stone-200 block">លោកស្រី ទេព រស្មី</span>
                </div>
              </div>
            </div>

            {/* Sacred Ceremony Modal Trigger Button */}
            {onOpenCeremonyModal && (
              <button
                onClick={onOpenCeremonyModal}
                className="w-full py-2.5 px-3 bg-[#295744] hover:bg-[#3C735B] text-white rounded-xl font-khmer text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[17px]">temple_buddhist</span>
                <span>
                  {lang === 'km' ? 'ស្វែងយល់ពីអត្ថន័យពិធីមង្គលទាំង ៧ (Ceremony Guide)' : 'Explore Sacred Cambodian Wedding Rituals'}
                </span>
              </button>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {WEDDING_SCHEDULE.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-white dark:bg-[#26322B] border border-stone-200/80 dark:border-stone-700 shadow-2xs flex items-start gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#FFF8ED] dark:bg-[#1b2520] border border-[#C5A880]/30 flex items-center justify-center text-[#295744] dark:text-[#C5A880] shrink-0">
                    <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono font-bold text-[#86513d] dark:text-[#C5A880]">
                        {lang === 'km' ? item.timeKm : item.timeEn}
                      </span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-[#0d402e] dark:text-stone-100 font-khmer mt-0.5">
                      {lang === 'km' ? item.titleKm : item.titleEn}
                    </h4>
                    <p className="text-[11px] text-stone-600 dark:text-stone-400 font-khmer mt-1 leading-relaxed">
                      {lang === 'km' ? item.descKm : item.descEn}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DRESS CODE TAB */}
        {activeTab === 'dresscode' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="text-center">
              <span className="font-display italic text-xs tracking-widest text-[#C5A880] uppercase">
                {lang === 'km' ? 'ការណែនាំអំពីការស្លៀកពាក់' : 'Guest Attire & Palette'}
              </span>
              <h2 className="text-lg font-bold font-khmer text-[#0d402e] dark:text-[#67AA8E] mt-0.5">
                {lang === 'km' ? 'សម្លៀកបំពាក់សមរម្យសម្រាប់ពិធី' : 'Recommended Dress Code'}
              </h2>
              <p className="text-xs text-stone-500 font-khmer mt-1">
                Traditional Khmer Silk or Elegant Western Formal
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-[#26322B] border border-stone-200 dark:border-stone-700 space-y-3">
              <p className="text-xs text-stone-700 dark:text-stone-300 font-khmer leading-relaxed">
                {lang === 'km'
                  ? 'សម្រាប់ពិធីពេលព្រឹក សូមគោរពអញ្ជើញលោកអ្នកស្លៀកឈុតប្រពៃណីខ្មែរ (សំពត់ចងក្បិន ហូល ផាមួង)។ សម្រាប់ពិធីជប់លៀងពេលល្ងាច សូមស្លៀកឈុតរាត្រីស្រមោលស ឬអាវធំផ្លូវការ។'
                  : 'For the morning ceremonies, guests are welcome to wear traditional Khmer silk attire. For the evening grand banquet, elegant formal cocktail dresses and suits are warmly encouraged.'}
              </p>

              <div>
                <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block mb-2 font-khmer">
                  {lang === 'km' ? 'កូដពណ៌ដែលសក្តិសម (Wedding Palette)' : 'Celebration Color Palette'}
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {dressCodeColors.map((color, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 flex items-center gap-2.5"
                    >
                      <div
                        className="w-7 h-7 rounded-lg shadow-inner shrink-0"
                        style={{ backgroundColor: color.hex }}
                      />
                      <div className="truncate">
                        <span className="text-xs font-semibold text-stone-800 dark:text-stone-200 block truncate font-khmer">
                          {lang === 'km' ? color.nameKm : color.nameEn}
                        </span>
                        <span className="text-[10px] text-stone-400 font-mono">{color.hex}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
