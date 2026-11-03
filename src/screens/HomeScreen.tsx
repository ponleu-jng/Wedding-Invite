import React, { useState, useEffect, useMemo } from 'react';
import { Language, Screen, GuestBlessing } from '../types';
import { TopLeftFloral, TopRightFloral, BottomLeftFloral, BottomRightFloral } from '../components/FloralMotifs';
import { INITIAL_GALLERY_PHOTOS } from '../data/mockData';
import { compressImage } from '../utils/imageHelper';
import { GuestPhotoModal } from '../components/GuestPhotoModal';
import { GoogleSheetRsvpModal } from '../components/GoogleSheetRsvpModal';
import { fetchSheetBlessings, postSheetBlessing } from '../utils/sheetdb';

interface HomeScreenProps {
  lang: Language;
  onNavigate: (screen: Screen) => void;
  onOpenRsvpModal: () => void;
  onOpenMapModal: () => void;
  onOpenMonogramModal: () => void;
  onOpenCeremonyModal: () => void;
  blessings: GuestBlessing[];
  onAddBlessing: (text: string, name?: string, photoUrl?: string) => void;
  onToggleBlessingLike: (id: string) => void;
  onSaveToCalendar: () => void;
  onOpenGiftModal?: () => void;
  onOpenMessageModal?: () => void;
  onPlayMusic?: () => void;
  isMobilePreview?: boolean;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  lang,
  onNavigate,
  onOpenRsvpModal,
  onOpenMapModal,
  onOpenMonogramModal,
  onOpenCeremonyModal,
  onOpenGiftModal,
  onOpenMessageModal,
  onPlayMusic,
  blessings,
  onAddBlessing,
  onToggleBlessingLike,
  onSaveToCalendar,
  isMobilePreview = false,
}) => {
  // Global Invitation Likes
  const [totalLikes, setTotalLikes] = useState(128);
  const [isInvitationLiked, setIsInvitationLiked] = useState(false);
  const [wishInput, setWishInput] = useState('');
  const [wishNameInput, setWishNameInput] = useState('');
  const [wishPhotoUrl, setWishPhotoUrl] = useState('');
  const [isUploadingWishPhoto, setIsUploadingWishPhoto] = useState(false);
  const [viewingWishPhoto, setViewingWishPhoto] = useState<GuestBlessing | null>(null);
  const [showWishSuccess, setShowWishSuccess] = useState(false);
  const [copiedCardBank, setCopiedCardBank] = useState<string | null>(null);

  // SheetDB (Google Sheet) Integration State
  const [sheetBlessings, setSheetBlessings] = useState<GuestBlessing[]>([]);
  const [isSyncingSheet, setIsSyncingSheet] = useState<boolean>(false);
  const [isSheetRsvpModalOpen, setIsSheetRsvpModalOpen] = useState(false);

  const loadSheetBlessings = async () => {
    try {
      setIsSyncingSheet(true);
      const items = await fetchSheetBlessings();
      if (items && items.length > 0) {
        setSheetBlessings(items);
      }
    } catch (err) {
      console.warn('SheetDB sync notice:', err);
    } finally {
      setIsSyncingSheet(false);
    }
  };

  useEffect(() => {
    loadSheetBlessings();
  }, []);

  // Merge and deduplicate blessings so no message ever appears twice
  const combinedBlessings = useMemo(() => {
    const list: GuestBlessing[] = [];
    const seen = new Set<string>();

    // 1. Google Sheet blessings (primary live source)
    for (const item of sheetBlessings) {
      const key = `${(item.name || '').trim().toLowerCase()}|||${(item.message || '').trim().toLowerCase()}`;
      if (!seen.has(key)) {
        seen.add(key);
        list.push(item);
      }
    }

    // 2. Locally submitted blessings (only if not already synced from Google Sheet)
    for (const item of blessings) {
      const key = `${(item.name || '').trim().toLowerCase()}|||${(item.message || '').trim().toLowerCase()}`;
      if (!seen.has(key)) {
        seen.add(key);
        list.push(item);
      }
    }

    return list;
  }, [sheetBlessings, blessings]);

  // Live Countdown to October 10, 2030, 14:00:00 (Cambodia Time / UTC+7)
  const targetDate = new Date('2030-10-10T14:00:00').getTime();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const diff = targetDate - now;
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
        });
      }
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleInvitationLike = () => {
    if (!isInvitationLiked) {
      setTotalLikes((prev) => prev + 1);
      setIsInvitationLiked(true);
    } else {
      setTotalLikes((prev) => Math.max(0, prev - 1));
      setIsInvitationLiked(false);
    }
  };

  const handleWishPhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploadingWishPhoto(true);
      const compressed = await compressImage(file, 900, 900, 0.78);
      setWishPhotoUrl(compressed);
    } catch (err) {
      console.error('Error compressing wish photo:', err);
    } finally {
      setIsUploadingWishPhoto(false);
    }
  };

  const handleSendWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishInput.trim()) return;
    const finalName = wishNameInput.trim() || (lang === 'km' ? 'ភ្ញៀវកិត្តិយស' : 'Honored Guest');
    const finalWish = wishInput.trim();
    const finalPhoto = wishPhotoUrl.trim() || undefined;

    // Send to SheetDB (Google Sheet)
    postSheetBlessing(finalName, finalWish, 'Yes', finalPhoto).then((ok) => {
      if (ok) {
        setTimeout(loadSheetBlessings, 1200);
      }
    });

    onAddBlessing(finalWish, finalName, finalPhoto);
    setWishInput('');
    setWishNameInput('');
    setWishPhotoUrl('');
    setShowWishSuccess(true);
    setTimeout(() => setShowWishSuccess(false), 3500);
  };

  return (
    <div className="w-full transition-all">
      {/* Responsive Grid: Single column on mobile, 2 columns on tablet/desktop */}
      <div className={`items-start ${isMobilePreview ? 'flex justify-center w-full' : 'md:grid md:grid-cols-12 md:gap-8 lg:gap-10'}`}>
        
        {/* LEFT COLUMN: Signature Botanical Invitation Card */}
        <div
          onClick={() => onPlayMusic?.()}
          className={`flex justify-center cursor-pointer ${isMobilePreview ? 'w-full' : 'md:col-span-6 lg:col-span-5'}`}
        >
          <main
            id="wedding-invitation-card"
            className="w-full max-w-[380px] sm:max-w-[410px] relative bg-[#FCFBF7] dark:bg-[#1E2722] rounded-3xl shadow-2xl overflow-hidden border border-stone-200/50 dark:border-stone-700/50 floral-bg-svg transition-all duration-300"
          >
            {/* Botanical Floral Corner Illustrations matching Image 1.png */}
            <TopLeftFloral className="absolute -top-1 -left-1 w-44 h-44 sm:w-52 sm:h-52 opacity-95" />
            <TopRightFloral className="absolute -top-1 -right-1 w-44 h-44 sm:w-52 sm:h-52 opacity-95" />
            <BottomLeftFloral className="absolute -bottom-1 -left-1 w-44 h-48 sm:w-52 sm:h-56 opacity-95" />
            <BottomRightFloral className="absolute -bottom-1 -right-1 w-44 h-48 sm:w-52 sm:h-56 opacity-95" />

            {/* Main Content Card Container */}
            <div className="p-2 sm:p-4 relative z-10">
              <div className="relative rounded-[28px] p-2 sm:p-3 pt-5 pb-5 flex flex-col items-center">
                
                {/* Arched Inner Invitation Card matching Image 1.png */}
                <div className="w-full max-w-[290px] bg-[#FFF8ED] dark:bg-[#26322B]/90 rounded-[140px_140px_20px_20px] pt-8 pb-7 px-4 flex flex-col items-center text-center shadow-xs border border-[#C5A880]/25 relative sheen-sweep">
                  

                  {/* Header Titles */}
                  <div className="mb-1">
                    <span className="font-khmer text-stone-700 dark:text-stone-300 font-semibold text-sm sm:text-base tracking-wide">
                      ពិធីអាពាហ៍ពិពាហ៍
                    </span>
                  </div>
                  <div className="mb-2">
                    <p className="font-display italic text-stone-600 dark:text-stone-300 text-xs sm:text-[13px] tracking-wide leading-tight">
                      You are cordially invited to the wedding of
                    </p>
                  </div>

                  {/* Couple Names Section */}
                  <div className="my-2 flex flex-col items-center justify-center">
                    <div className="text-[11px] font-khmer text-stone-500 dark:text-stone-400 mb-0.5 tracking-wider">
                      {lang === 'km' ? 'កូនកំលោះ & កូនក្រមុំ' : 'Groom & Bride'}
                    </div>
                    <h1 className="font-display italic text-4xl sm:text-[44px] leading-tight text-[#295744] dark:text-[#67AA8E] font-medium tracking-tight">
                      Hong
                    </h1>
                    <div className="font-script text-2xl text-[#C5A880] dark:text-[#C5A880] my-0.5 leading-none">
                      &amp;
                    </div>
                    <h1 className="font-display italic text-4xl sm:text-[44px] leading-tight text-[#295744] dark:text-[#67AA8E] font-medium tracking-tight">
                      ReakSmey
                    </h1>
                  </div>

                  {/* Subtle Gold Divider */}
                  <div className="w-3/4 h-px bg-gradient-to-r from-transparent via-[#C5A880]/50 to-transparent my-3"></div>

                  {/* Date Badge: Sunday 10 Oct 2030 */}
                  <div className="w-full flex items-center justify-center space-x-2 my-1">
                    <div className="text-right flex-1">
                      <span className="block text-xs font-khmer font-semibold text-stone-700 dark:text-stone-300">
                        ថ្ងៃអាទិត្យ
                      </span>
                      <span className="block text-[11px] font-display uppercase tracking-wider text-stone-500 dark:text-stone-400">
                        Sunday
                      </span>
                    </div>

                    {/* Day Circle */}
                    <div className="w-12 h-12 rounded-full bg-[#F5DFD0] dark:bg-[#473428] flex items-center justify-center shadow-inner border border-[#C5A880]/50">
                      <span className="text-[#295744] dark:text-[#E8B2B5] font-display text-2xl font-bold leading-none">
                        10
                      </span>
                    </div>

                    <div className="text-left flex-1">
                      <span className="block text-xs font-khmer font-semibold text-stone-700 dark:text-stone-300">
                        តុលា 2030
                      </span>
                      <span className="block text-[11px] font-display uppercase tracking-wider text-stone-500 dark:text-stone-400">
                        Oct 2030
                      </span>
                    </div>
                  </div>

                  {/* Time */}
                  <div className="mt-3 flex items-center justify-center space-x-1.5 text-stone-700 dark:text-stone-300">
                    <span className="material-symbols-outlined text-[15px] text-[#295744] dark:text-[#C5A880]">
                      schedule
                    </span>
                    <span className="text-xs font-khmer font-medium">វេលាម៉ោង ៥:៣០ ល្ងាច</span>
                    <span className="text-xs text-stone-400 dark:text-stone-500">|</span>
                    <span className="text-xs font-display font-semibold">5:30 PM</span>
                  </div>

                  {/* Location */}
                  <button
                    onClick={onOpenMapModal}
                    className="mt-2.5 flex items-start justify-center space-x-1.5 max-w-[240px] text-center hover:opacity-85 transition-opacity group"
                  >
                    <span className="material-symbols-outlined text-[17px] text-[#295744] dark:text-[#C5A880] shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                      location_on
                    </span>
                    <div className="text-center text-xs leading-snug text-stone-700 dark:text-stone-300">
                      <span className="font-khmer font-semibold block group-hover:text-[#295744] dark:group-hover:text-[#C5A880] transition-colors">
                        គេហដ្ឋានខាងកូនក្រមុំ (ភូមិពាក់ស្នែងថ្មី)
                      </span>
                      <span className="font-modern text-[11px] text-stone-500 dark:text-stone-400 block mt-0.5">
                        Peaksneng Tmey Village Angkor Thom Distict Siemreap Province
                      </span>
                    </div>
                  </button>
                </div>

                {/* Invitation Message & Gratitude */}
                <div className="mt-5 text-center max-w-[300px] px-2 space-y-2">
                  <p className="font-khmer text-xs sm:text-[13px] leading-relaxed text-stone-700 dark:text-stone-300 font-normal">
                    «វត្តមានដ៏ថ្លៃថ្លារបស់លោកអ្នក គឺជាកិត្តិយសដ៏ខ្ពង់ខ្ពស់សម្រាប់គ្រួសារយើងខ្ញុំ»
                  </p>
                  <p className="font-display italic text-[12px] text-stone-500 dark:text-stone-400 leading-tight">
                    We are truly grateful for your presence on this joyous occasion.
                  </p>
                  <div className="pt-1">
                    <span className="inline-block text-xs font-khmer font-bold tracking-wider text-[#295744] dark:text-[#C5A880]">
                      ~ សូមអរគុណ ~
                    </span>
                  </div>
                </div>

                {/* Ornamental Divider */}
                <div className="flex items-center space-x-2 my-4 opacity-75">
                  <div className="w-8 h-px bg-[#C5A880]"></div>
                  <span className="text-[#C5A880] text-xs">❦</span>
                  <div className="w-8 h-px bg-[#C5A880]"></div>
                </div>

                {/* Live Countdown Section */}
                <section className="w-full my-1">
                  <div className="text-center mb-2.5">
                    <span className="text-[11px] font-modern uppercase tracking-widest text-stone-500 dark:text-stone-400 font-medium">
                      Countdown to Celebration
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center max-w-[290px] mx-auto">
                    <div className="bg-[#FFF8ED] dark:bg-[#26322B]/70 p-2.5 rounded-xl border border-[#C5A880]/30 shadow-xs">
                      <span className="font-display text-xl font-bold text-[#295744] dark:text-[#C5A880] block leading-tight">
                        {timeLeft.days}
                      </span>
                      <span className="text-[9px] uppercase tracking-wider text-stone-500 dark:text-stone-400 font-medium">
                        Days
                      </span>
                    </div>
                    <div className="bg-[#FFF8ED] dark:bg-[#26322B]/70 p-2.5 rounded-xl border border-[#C5A880]/30 shadow-xs">
                      <span className="font-display text-xl font-bold text-[#295744] dark:text-[#C5A880] block leading-tight">
                        {timeLeft.hours < 10 ? `0${timeLeft.hours}` : timeLeft.hours}
                      </span>
                      <span className="text-[9px] uppercase tracking-wider text-stone-500 dark:text-stone-400 font-medium">
                        Hours
                      </span>
                    </div>
                    <div className="bg-[#FFF8ED] dark:bg-[#26322B]/70 p-2.5 rounded-xl border border-[#C5A880]/30 shadow-xs">
                      <span className="font-display text-xl font-bold text-[#295744] dark:text-[#C5A880] block leading-tight">
                        {timeLeft.minutes < 10 ? `0${timeLeft.minutes}` : timeLeft.minutes}
                      </span>
                      <span className="text-[9px] uppercase tracking-wider text-stone-500 dark:text-stone-400 font-medium">
                        Mins
                      </span>
                    </div>
                    <div className="bg-[#FFF8ED] dark:bg-[#26322B]/70 p-2.5 rounded-xl border border-[#C5A880]/30 shadow-xs">
                      <span className="font-display text-xl font-bold text-[#295744] dark:text-[#C5A880] block leading-tight">
                        {timeLeft.seconds < 10 ? `0${timeLeft.seconds}` : timeLeft.seconds}
                      </span>
                      <span className="text-[9px] uppercase tracking-wider text-stone-500 dark:text-stone-400 font-medium">
                        Secs
                      </span>
                    </div>
                  </div>
                </section>

                {/* Action CTAs */}
                <div className="w-full mt-4 space-y-2">
                  {/* Primary RSVP Action */}
                  <button
                    onClick={onOpenRsvpModal}
                    className="w-full bg-[#295744] hover:bg-[#3C735B] text-white py-3 px-4 rounded-xl font-khmer text-xs tracking-wider flex items-center justify-between shadow-md hover:shadow-lg active:scale-[0.99] transition-all cursor-pointer group"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="material-symbols-outlined text-[18px]">mark_email_read</span>
                      <span className="font-bold">ឆ្លើយតបការចូលរួម (RSVP)</span>
                    </div>
                    <span className="text-[10px] text-emerald-200 bg-emerald-900/60 px-2 py-0.5 rounded-md border border-emerald-500/30 flex items-center gap-1 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Google Sheet</span>
                    </span>
                  </button>

                  {/* Wedding Gift & KHQR Action Button (អំណោយ & QR Code & លេខកុងធនាគារ) */}
                  <button
                    onClick={onOpenGiftModal}
                    className="w-full bg-gradient-to-r from-amber-600 via-rose-600 to-amber-600 hover:from-amber-700 hover:to-rose-700 text-white py-3 px-4 rounded-xl font-khmer text-xs tracking-wider flex items-center justify-center space-x-2 shadow-md hover:shadow-lg active:scale-[0.99] transition-all cursor-pointer group"
                  >
                    <span className="material-symbols-outlined text-[19px] group-hover:scale-110 transition-transform">
                      redeem
                    </span>
                    <span className="font-bold">
                      {lang === 'km' ? 'អំណោយ (QR Code & លេខកុងធនាគារ)' : 'Wedding Gift (QR Code & Bank Accounts)'}
                    </span>
                  </button>

                  {/* Ceremony Details Primary Action */}
                  <button
                    onClick={onOpenCeremonyModal}
                    className="w-full bg-[#FFF8ED] dark:bg-[#26322B] hover:bg-[#F5DFD0]/60 dark:hover:bg-[#1b2520] border border-[#C5A880]/60 text-[#295744] dark:text-[#C5A880] py-2.5 px-4 rounded-xl font-khmer text-xs tracking-wider flex items-center justify-center space-x-2 shadow-xs hover:shadow transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">temple_buddhist</span>
                    <span className="font-bold">
                      {lang === 'km' ? 'ព័ត៌មានលម្អិតពិធីមង្គលការ' : 'Wedding Ceremony Details'}
                    </span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>

                  {/* Secondary Action Grid */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={onSaveToCalendar}
                      className="py-2.5 px-2 rounded-xl border border-[#295744]/30 dark:border-[#C5A880]/40 bg-white/80 dark:bg-[#1E2722] text-stone-700 dark:text-stone-200 text-[11px] font-modern flex items-center justify-center space-x-1.5 hover:bg-stone-50 dark:hover:bg-[#26322B] transition-all cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[15px] text-[#295744] dark:text-[#C5A880]">
                        calendar_today
                      </span>
                      <span className="font-khmer truncate">ដាក់ប្រតិទិន (Save Date)</span>
                    </button>

                    <button
                      onClick={onOpenMapModal}
                      className="py-2.5 px-2 rounded-xl border border-[#295744]/30 dark:border-[#C5A880]/40 bg-white/80 dark:bg-[#1E2722] text-stone-700 dark:text-stone-200 text-[11px] font-modern flex items-center justify-center space-x-1.5 hover:bg-stone-50 dark:hover:bg-[#26322B] transition-all cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[15px] text-[#295744] dark:text-[#C5A880]">
                        directions
                      </span>
                      <span className="font-khmer truncate">មើលទីតាំង (Map)</span>
                    </button>
                  </div>
                </div>

                {/* Mobile-only guest blessings inline */}
                <div className="w-full mt-5 pt-4 border-t border-stone-200/80 dark:border-stone-700/80 md:hidden">
                  <div className="flex items-center justify-between mb-2.5 gap-1.5 flex-wrap">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="material-symbols-outlined text-[#86513d] dark:text-[#C5A880] text-[16px]">
                        rate_review
                      </span>
                      <span className="text-xs font-khmer font-bold text-stone-800 dark:text-stone-200 truncate">
                        {lang === 'km' ? 'ពាក្យជូនពរ (Guest Blessings)' : 'Guest Blessings'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* Button to view all Google Sheet RSVPs */}
                      <button
                        type="button"
                        onClick={() => setIsSheetRsvpModalOpen(true)}
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FFF8ED] dark:bg-[#26322B] border border-[#C5A880]/60 text-[#295744] dark:text-[#C5A880] text-[10px] font-khmer font-semibold hover:bg-[#F5DFD0]/60 dark:hover:bg-[#1E2722] transition-all cursor-pointer shadow-2xs active:scale-95"
                        title={lang === 'km' ? 'មើលសារ RSVP ទាំងអស់ក្នុង Google Sheet' : 'All Google Sheet RSVPs'}
                      >
                        <span className="material-symbols-outlined text-[12px] text-emerald-600 dark:text-emerald-400">
                          how_to_reg
                        </span>
                        <span>{lang === 'km' ? 'សារ RSVP' : 'RSVPs'}</span>
                      </button>

                      {/* Sync Button */}
                      <button
                        type="button"
                        onClick={loadSheetBlessings}
                        disabled={isSyncingSheet}
                        className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-[10px] text-emerald-800 dark:text-emerald-300 font-khmer hover:bg-emerald-100 transition-colors cursor-pointer active:scale-95 shadow-2xs"
                        title={lang === 'km' ? 'ធ្វើបច្ចុប្បន្នភាពសារ (Sync)' : 'Refresh / Sync'}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className={`material-symbols-outlined text-[12px] ${isSyncingSheet ? 'animate-spin' : ''}`}>
                          sync
                        </span>
                      </button>

                      {/* Total messages badge */}
                      <div className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-700 font-khmer shadow-2xs">
                        <span className="material-symbols-outlined text-[11px] text-[#295744] dark:text-[#C5A880]">
                          forum
                        </span>
                        <span className="font-mono font-bold text-[#295744] dark:text-[#C5A880]">
                          {combinedBlessings.length}
                        </span>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleSendWish} className="space-y-1.5">
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        value={wishNameInput}
                        onChange={(e) => setWishNameInput(e.target.value)}
                        placeholder={lang === 'km' ? 'ឈ្មោះ (Name)' : 'Name'}
                        className="w-1/3 bg-white dark:bg-[#26322B] border border-stone-300 dark:border-stone-600 rounded-xl py-2 px-2.5 text-xs text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-[#295744]"
                      />
                      <div className="relative flex-1">
                        <input
                          type="text"
                          required
                          value={wishInput}
                          onChange={(e) => setWishInput(e.target.value)}
                          placeholder={lang === 'km' ? 'សូមសរសេរពាក្យជូនពរ...' : 'Send your blessing...'}
                          className="w-full bg-white dark:bg-[#26322B] border border-stone-300 dark:border-stone-600 rounded-xl py-2 pl-3 pr-9 text-xs text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-[#295744]"
                        />
                        <button
                          type="submit"
                          aria-label="Send wish"
                          className="absolute right-1 top-1 text-[#295744] dark:text-[#C5A880] p-1.5 flex items-center justify-center hover:opacity-80 transition-opacity"
                        >
                          <span className="material-symbols-outlined text-[17px]">send</span>
                        </button>
                      </div>
                    </div>
                  </form>

                  {showWishSuccess && (
                    <div className="text-center mt-2 py-1 px-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-[11px] text-[#295744] dark:text-emerald-300 font-khmer animate-in fade-in">
                      ✓ សូមអរគុណសម្រាប់ពាក្យជូនពរដ៏មានអត្ថន័យ!
                    </div>
                  )}

                  {combinedBlessings.length > 0 ? (
                    <div className="mt-3 space-y-2 max-h-72 overflow-y-auto no-scrollbar pr-0.5">
                      {combinedBlessings.map((item) => (
                        <div
                          key={item.id}
                          className="p-2.5 rounded-xl bg-white/70 dark:bg-[#26322B]/70 border border-stone-200/60 dark:border-stone-700/60 text-xs flex justify-between items-center gap-2 shadow-2xs"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1.5 text-[10px]">
                              <div className="flex items-center gap-1.5 min-w-0 flex-1">
                                <span className="font-semibold text-stone-900 dark:text-stone-100 font-khmer shrink-0 text-[10.5px]">
                                  {item.name}
                                </span>
                                {item.photoUrl && (
                                  <span className="material-symbols-outlined text-[12px] text-[#295744] dark:text-[#C5A880] shrink-0">
                                    photo_camera
                                  </span>
                                )}
                                <span className="text-stone-400 dark:text-stone-500 shrink-0">:</span>
                                <p className="text-[9.5px] text-stone-600 dark:text-stone-300 font-khmer leading-snug truncate" title={item.message}>
                                  {item.message}
                                </p>
                              </div>
                              <span className="text-[8px] text-stone-500 dark:text-stone-400 font-khmer px-1.5 py-0.5 rounded-md bg-stone-100/70 dark:bg-stone-800/60 shrink-0 whitespace-nowrap leading-none">
                                {item.timestamp}
                              </span>
                            </div>
                            {item.photoUrl && (
                              <div
                                onClick={() => setViewingWishPhoto(item)}
                                className="mt-1.5 rounded-lg overflow-hidden border border-stone-200/80 dark:border-stone-700 max-w-[90px] cursor-pointer"
                              >
                                <img
                                  src={item.photoUrl}
                                  alt={item.name}
                                  className="w-full h-14 object-cover"
                                />
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => onToggleBlessingLike(item.id)}
                            className="flex flex-col items-center pt-0.5 text-stone-400 hover:text-rose-500 transition-colors shrink-0"
                          >
                            <span
                              className={`material-symbols-outlined text-[15px] ${
                                item.isLiked ? 'text-rose-500 fill-1' : ''
                              }`}
                            >
                              favorite
                            </span>
                            <span className="text-[9px] font-mono">{item.likes}</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-3 p-3 rounded-xl bg-white/40 dark:bg-[#26322B]/40 border border-dashed border-stone-200 dark:border-stone-700/60 text-center">
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 font-khmer">
                        {lang === 'km' ? 'សូមសរសេរពាក្យជូនពរដំបូងគេជូនគូស្វាមីភរិយាថ្មី!' : 'Be the first to share a blessing for the newlyweds!'}
                      </p>
                    </div>
                  )}
                </div>

              </div>
            </div>
          </main>
        </div>

        {/* RIGHT COLUMN: Desktop Web Expansion (Visible on Tablet & Desktop) */}
        <div className={`${isMobilePreview ? 'hidden' : 'hidden md:block'} md:col-span-6 lg:col-span-7 space-y-5`}>
          
          {/* 1. Family Lineage & Parents Honor Card */}
          <div className="p-5 rounded-3xl bg-[#FCFBF7] dark:bg-[#1E2722] border border-stone-200/80 dark:border-stone-700 shadow-md">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-700 pb-3 mb-3">
              <div className="flex items-center gap-2 text-[#86513d] dark:text-[#C5A880]">
                <span className="material-symbols-outlined text-[22px]">diversity_1</span>
                <div>
                  <h3 className="font-khmer font-bold text-stone-900 dark:text-stone-100 text-sm">
                    {lang === 'km' ? 'មាតាបិតា និងគ្រួសារទាំងសងខាង' : 'With Blessings from Both Families'}
                  </h3>
                  <span className="text-[11px] text-stone-500 font-modern">
                    Ancestral Cambodian Wedding Union
                  </span>
                </div>
              </div>
              <button
                onClick={onOpenCeremonyModal}
                className="px-3 py-1 bg-[#295744] hover:bg-[#3C735B] text-white rounded-full text-xs font-semibold font-khmer transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
              >
                <span>{lang === 'km' ? 'មើលពិធីទាំង ៧' : 'Explore 7 Rituals'}</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-khmer">
              <div className="p-3 bg-white dark:bg-[#26322B] rounded-2xl border border-stone-200/60 dark:border-stone-700">
                <span className="text-[10px] uppercase tracking-wider text-[#86513d] dark:text-[#C5A880] font-bold block mb-1">
                  {lang === 'km' ? 'មាតាបិតាខាងកូនកំលោះ' : "Groom's Parents"}
                </span>
                <p className="font-bold text-stone-900 dark:text-stone-100 text-sm">លោក ហុង វឌ្ឍនា</p>
                <p className="font-bold text-stone-900 dark:text-stone-100 text-sm">លោកស្រី កែវ ចរិយា</p>
                <span className="text-[11px] text-stone-500 mt-2 block">
                  កូនប្រុស: <strong className="text-[#295744] dark:text-[#C5A880]">ហុង (Hong)</strong>
                </span>
              </div>

              <div className="p-3 bg-white dark:bg-[#26322B] rounded-2xl border border-stone-200/60 dark:border-stone-700">
                <span className="text-[10px] uppercase tracking-wider text-[#86513d] dark:text-[#C5A880] font-bold block mb-1">
                  {lang === 'km' ? 'មាតាបិតាខាងកូនក្រមុំ' : "Bride's Parents"}
                </span>
                <p className="font-bold text-stone-900 dark:text-stone-100 text-sm">លោក សម្បត្តិ</p>
                <p className="font-bold text-stone-900 dark:text-stone-100 text-sm">លោកស្រី ទេព ម៉ាលី</p>
                <span className="text-[11px] text-stone-500 mt-2 block">
                  កូនស្រី: <strong className="text-[#295744] dark:text-[#C5A880]">រស្មី (ReakSmey)</strong>
                </span>
              </div>
            </div>
          </div>

          {/* 2. Venue & Celebration Details Card */}
          <div className="p-5 rounded-3xl bg-[#FCFBF7] dark:bg-[#1E2722] border border-stone-200/80 dark:border-stone-700 shadow-md">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#295744] dark:text-[#C5A880] text-[22px]">
                  domain
                </span>
                <div>
                  <h3 className="font-khmer font-bold text-stone-900 dark:text-stone-100 text-sm">
                    {lang === 'km' ? 'គេហដ្ឋានខាងកូនក្រមុំ (ភូមិពាក់ស្នែងថ្មី)' : "Bride's Residence (Peaksneng Tmey)"}
                  </h3>
                  <p className="text-[11px] text-stone-500 font-modern">
                    Peaksneng Tmey Village Angkor Thom Distict Siemreap Province
                  </p>
                </div>
              </div>
              <button
                onClick={onOpenMapModal}
                className="text-xs text-[#295744] dark:text-[#C5A880] font-bold hover:underline flex items-center gap-1 cursor-pointer font-khmer"
              >
                <span>{lang === 'km' ? 'មើលផែនទីលម្អិត' : 'View Full Map'}</span>
                <span className="material-symbols-outlined text-[15px]">open_in_new</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white dark:bg-[#26322B] rounded-2xl border border-stone-200/60 dark:border-stone-700">
                <span className="font-bold text-stone-800 dark:text-stone-200 block font-khmer">
                  ☀️ {lang === 'km' ? 'ពិធីសិរីមង្គលពេលព្រឹក' : 'Morning Sacred Rituals'}
                </span>
                <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-1 font-khmer">
                  07:00 AM – 12:30 PM • គេហដ្ឋានខាងកូនក្រមុំ (ភូមិពាក់ស្នែងថ្មី)
                </p>
              </div>

              <div className="p-3 bg-white dark:bg-[#26322B] rounded-2xl border border-stone-200/60 dark:border-stone-700">
                <span className="font-bold text-stone-800 dark:text-stone-200 block font-khmer">
                  🌙 {lang === 'km' ? 'ពិធីពិសាភោជនាហារពេលល្ងាច' : 'Grand Evening Banquet'}
                </span>
                <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-1 font-khmer">
                  05:30 PM – 10:00 PM • គេហដ្ឋានខាងកូនក្រមុំ (ភូមិពាក់ស្នែងថ្មី)
                </p>
              </div>
            </div>
          </div>

          {/* 3. Wedding Gift & KHQR Bank Details Card (ABA Bank Only) */}
          <div className="p-5 rounded-3xl bg-[#FCFBF7] dark:bg-[#1E2722] border border-stone-200/80 dark:border-stone-700 shadow-md">
            <div className="flex items-center justify-between mb-3 border-b border-stone-200/70 dark:border-stone-700 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#005f73] to-[#0a9396] text-white flex items-center justify-center shadow-xs">
                  <span className="material-symbols-outlined text-[18px]">redeem</span>
                </div>
                <div>
                  <h3 className="font-khmer font-bold text-stone-900 dark:text-stone-100 text-sm">
                    {lang === 'km' ? 'ចំណងដៃ & អំណោយអាពាហ៍ពិពាហ៍ (ABA Bank)' : 'Wedding Gift (ABA Bank)'}
                  </h3>
                  <p className="text-[11px] text-stone-500 font-khmer">
                    {lang === 'km' ? 'ស្កេន KHQR ឬផ្ទេរតាមលេខកុង ABA Bank' : 'Scan KHQR or transfer via ABA Bank accounts'}
                  </p>
                </div>
              </div>
              <button
                onClick={onOpenGiftModal}
                className="px-3.5 py-1.5 bg-[#005f73] hover:bg-[#084c61] text-white rounded-full text-xs font-semibold font-khmer transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <span>{lang === 'km' ? 'បើកមើល QR Code' : 'View Full QR'}</span>
                <span className="material-symbols-outlined text-[15px]">qr_code</span>
              </button>
            </div>

            {/* ABA Bank Details Single Full Card */}
            <div className="p-4 bg-white dark:bg-[#26322B] rounded-2xl border border-stone-200/60 dark:border-stone-700 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                  <span className="font-bold text-[#005f73] dark:text-[#56cfe1] text-xs font-mono tracking-wide">
                    ABA BANK • KHQR
                  </span>
                  <span className="text-[10px] bg-[#E1251B] text-white font-bold px-1.5 py-0.5 rounded">
                    BAKONG
                  </span>
                </div>
                <div className="text-xs font-khmer text-stone-500">
                  {lang === 'km' ? 'ឈ្មោះគណនី: ' : 'Account Name: '}
                  <strong className="text-stone-900 dark:text-stone-100">HONG &amp; REAKSMEY</strong>
                </div>
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <span className="font-mono text-xs sm:text-sm text-[#005f73] dark:text-[#56cfe1] font-bold">
                    USD: 001 888 999
                  </span>
                  <span className="text-stone-300 dark:text-stone-600">|</span>
                  <span className="font-mono text-xs sm:text-sm text-[#005f73] dark:text-[#56cfe1] font-bold">
                    KHR: 001 888 998
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText('001 888 999');
                    setCopiedCardBank('usd');
                    setTimeout(() => setCopiedCardBank(null), 2000);
                  }}
                  className="py-1.5 px-3 bg-stone-100 dark:bg-stone-800 hover:bg-[#005f73] hover:text-white rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px]">
                    {copiedCardBank === 'usd' ? 'check' : 'content_copy'}
                  </span>
                  <span>
                    {copiedCardBank === 'usd'
                      ? (lang === 'km' ? 'បានចម្លង ✓' : 'Copied ✓')
                      : (lang === 'km' ? 'ចម្លងកុង USD' : 'Copy USD')}
                  </span>
                </button>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText('001 888 998');
                    setCopiedCardBank('khr');
                    setTimeout(() => setCopiedCardBank(null), 2000);
                  }}
                  className="py-1.5 px-3 bg-stone-100 dark:bg-stone-800 hover:bg-[#005f73] hover:text-white rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px]">
                    {copiedCardBank === 'khr' ? 'check' : 'content_copy'}
                  </span>
                  <span>
                    {copiedCardBank === 'khr'
                      ? (lang === 'km' ? 'បានចម្លង ✓' : 'Copied ✓')
                      : (lang === 'km' ? 'ចម្លងកុង KHR' : 'Copy KHR')}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* 4. Guest Blessings Live Guestbook Wall (Desktop & Responsive) */}
          <div className="p-4 sm:p-5 rounded-3xl bg-[#FCFBF7] dark:bg-[#1E2722] border border-stone-200/80 dark:border-stone-700 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3.5 pb-2.5 border-b border-stone-200/70 dark:border-stone-700/70">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-full bg-[#FFF8ED] dark:bg-[#26322B] border border-[#C5A880]/40 flex items-center justify-center shrink-0 shadow-2xs">
                  <span className="material-symbols-outlined text-[#86513d] dark:text-[#C5A880] text-[18px]">
                    rate_review
                  </span>
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-bold font-khmer text-stone-900 dark:text-stone-100 leading-tight">
                    {lang === 'km' ? 'ពាក្យជូនពរពីភ្ញៀវកិត្តិយស (Guest Blessings Wall)' : 'Guest Blessings Wall'}
                  </h3>
                  <span className="text-[10px] text-stone-500 dark:text-stone-400 font-modern">
                    {lang === 'km' ? 'សារជូនពរ & ការបញ្ជាក់វត្តមាន' : 'Wishes & Live Google Sheet Sync'}
                  </span>
                </div>
              </div>

              {/* Action Controls: All RSVPs Button, Live Sync, and Messages Count */}
              <div className="flex items-center gap-1.5 flex-wrap self-end sm:self-auto">
                {/* Button to view all Google Sheet RSVPs */}
                <button
                  type="button"
                  onClick={() => setIsSheetRsvpModalOpen(true)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFF8ED] dark:bg-[#26322B] border border-[#C5A880]/60 text-[#295744] dark:text-[#C5A880] text-[11px] font-khmer font-semibold hover:bg-[#F5DFD0]/60 dark:hover:bg-[#1E2722] transition-all cursor-pointer shadow-2xs active:scale-95"
                  title={lang === 'km' ? 'មើលសារ RSVP ទាំងអស់ក្នុង Google Sheet' : 'All Google Sheet RSVPs'}
                >
                  <span className="material-symbols-outlined text-[13px] text-emerald-600 dark:text-emerald-400">
                    how_to_reg
                  </span>
                  <span>{lang === 'km' ? 'សារ RSVP' : 'RSVPs'}</span>
                </button>

                {/* Live Sync Button */}
                <button
                  type="button"
                  onClick={loadSheetBlessings}
                  disabled={isSyncingSheet}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-[11px] text-emerald-800 dark:text-emerald-300 font-khmer hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors cursor-pointer active:scale-95 shadow-2xs"
                  title={lang === 'km' ? 'ធ្វើបច្ចុប្បន្នភាពសារ (Sync)' : 'Refresh / Sync'}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className={`material-symbols-outlined text-[13px] ${isSyncingSheet ? 'animate-spin' : ''}`}>
                    sync
                  </span>
                  <span className="text-[10px] hidden xs:inline">{lang === 'km' ? 'Sync' : 'Sync'}</span>
                </button>

                {/* Total messages counter badge */}
                <div className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 font-khmer shadow-2xs">
                  <span className="material-symbols-outlined text-[13px] text-[#295744] dark:text-[#C5A880]">
                    forum
                  </span>
                  <span className="text-[10px] text-stone-500 font-medium hidden sm:inline">{lang === 'km' ? 'សរុប:' : 'Total:'}</span>
                  <span className="font-mono font-bold text-[#295744] dark:text-[#C5A880]">
                    {combinedBlessings.length}
                  </span>
                  <span>{lang === 'km' ? 'សារ' : ''}</span>
                </div>
              </div>
            </div>

            {/* Input Form with Photo Attachment (Responsive on Mobile & Desktop) */}
            <form onSubmit={handleSendWish} className="mb-4 space-y-2">
              <div className="flex flex-col sm:grid sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  value={wishNameInput}
                  onChange={(e) => setWishNameInput(e.target.value)}
                  placeholder={lang === 'km' ? 'ឈ្មោះលោកអ្នក (Your Name)' : 'Your Name'}
                  className="sm:col-span-1 bg-white dark:bg-[#26322B] border border-stone-300 dark:border-stone-600 rounded-xl py-2 px-3 text-xs text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-[#295744]"
                />
                <div className="sm:col-span-2 relative flex items-center gap-1.5">
                  <input
                    type="text"
                    required
                    value={wishInput}
                    onChange={(e) => setWishInput(e.target.value)}
                    placeholder={lang === 'km' ? 'សូមសរសេរពាក្យជូនពរដល់គូស្វាមីភរិយា...' : 'Write your warm blessings for Hong & ReakSmey...'}
                    className="w-full bg-white dark:bg-[#26322B] border border-stone-300 dark:border-stone-600 rounded-xl py-2 pl-3 pr-10 text-xs text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-[#295744]"
                  />
                  <div className="absolute right-1.5 flex items-center">
                    <button
                      type="submit"
                      aria-label="Send blessing"
                      className="text-[#295744] dark:text-[#C5A880] p-1 flex items-center justify-center hover:opacity-80 transition-opacity cursor-pointer active:scale-95"
                    >
                      <span className="material-symbols-outlined text-[18px]">send</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Wish Attached Photo Preview */}
              {wishPhotoUrl && (
                <div className="flex items-center gap-2 p-1.5 bg-stone-100 dark:bg-stone-800/80 rounded-xl border border-stone-200 dark:border-stone-700">
                  <img
                    src={wishPhotoUrl}
                    alt="Wish Preview"
                    className="w-10 h-10 rounded-lg object-cover border border-stone-300 dark:border-stone-600"
                  />
                  <span className="text-[11px] font-khmer text-stone-700 dark:text-stone-300 flex-1">
                    {lang === 'km' ? '✓ បានភ្ជាប់រូបភាពជាមួយពាក្យជូនពរ' : '✓ Photo attached to blessing'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setWishPhotoUrl('')}
                    className="w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-950/70 text-rose-600 flex items-center justify-center hover:bg-rose-200"
                  >
                    <span className="material-symbols-outlined text-[13px]">close</span>
                  </button>
                </div>
              )}

              {showWishSuccess && (
                <div className="text-center py-1.5 px-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs text-[#295744] dark:text-emerald-300 font-khmer animate-in fade-in">
                  ✓ សូមអរគុណសម្រាប់ពាក្យជូនពរដ៏មានអត្ថន័យ! (Thank you for your heartfelt blessing!)
                </div>
              )}
            </form>

            {/* Blessings Grid (Merged with SheetDB Google Sheet) */}
            {combinedBlessings.length > 0 ? (
              <div className="grid grid-cols-1 gap-1.5 max-h-72 overflow-y-auto no-scrollbar pr-1">
                {combinedBlessings.map((item) => (
                  <div
                    key={item.id}
                    className="p-2.5 rounded-xl bg-white dark:bg-[#26322B] border border-stone-200/70 dark:border-stone-700 text-xs flex justify-between items-center gap-2 shadow-2xs group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 text-[10px]">
                        <div className="flex items-center gap-1.5 min-w-0 flex-1">
                          <span className="font-bold text-stone-900 dark:text-stone-100 font-khmer shrink-0 text-[10.5px]">
                            {item.name}
                          </span>
                          {item.id.startsWith('sheet-') && (
                            <span className="text-[8.5px] px-1 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-mono shrink-0">
                              Sheet
                            </span>
                          )}
                          {item.photoUrl && (
                            <span className="material-symbols-outlined text-[12px] text-[#295744] dark:text-[#C5A880] shrink-0" title="Has Guest Photo">
                              photo_camera
                            </span>
                          )}
                          <span className="text-stone-400 dark:text-stone-500 shrink-0">:</span>
                          <p className="text-[9.5px] text-stone-600 dark:text-stone-300 font-khmer leading-snug truncate" title={item.message}>
                            {item.message}
                          </p>
                        </div>
                        <span className="text-[8px] text-stone-500 dark:text-stone-400 font-khmer px-1.5 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800/70 shrink-0 whitespace-nowrap leading-none">
                          {item.timestamp}
                        </span>
                      </div>

                      {/* Photo thumbnail attached by guest */}
                      {item.photoUrl && (
                        <div
                          onClick={() => setViewingWishPhoto(item)}
                          className="mt-1.5 rounded-lg overflow-hidden border border-stone-200/80 dark:border-stone-700 max-w-[100px] cursor-pointer relative group/thumb shadow-2xs"
                          title={lang === 'km' ? 'ចុចដើម្បីមើល & រក្សាទុករូបភាព' : 'Click to view & save photo'}
                        >
                          <img
                            src={item.photoUrl}
                            alt={item.name}
                            className="w-full h-14 object-cover group-hover/thumb:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center text-white gap-1 text-[9px] font-khmer">
                            <span className="material-symbols-outlined text-[12px]">visibility</span>
                            <span>{lang === 'km' ? 'មើល' : 'View'}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => onToggleBlessingLike(item.id)}
                      className="flex flex-col items-center pt-0.5 text-stone-400 hover:text-rose-500 transition-colors"
                    >
                      <span
                        className={`material-symbols-outlined text-[16px] ${
                          item.isLiked ? 'text-rose-500 fill-1' : ''
                        }`}
                      >
                        favorite
                      </span>
                      <span className="text-[9px] font-mono">{item.likes}</span>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 px-4 text-center rounded-2xl bg-[#FCFBF7]/80 dark:bg-[#1E2722]/80 border border-dashed border-stone-200 dark:border-stone-700/80">
                <span className="material-symbols-outlined text-[32px] text-[#295744]/60 dark:text-[#C5A880]/60 mb-2 block">
                  rate_review
                </span>
                <p className="text-xs font-semibold text-stone-700 dark:text-stone-300 font-khmer">
                  {lang === 'km' ? 'មិនទាន់មានពាក្យជូនពរនៅឡើយទេ' : 'No blessings yet'}
                </p>
                <p className="text-[11px] text-stone-400 font-khmer mt-1">
                  {lang === 'km'
                    ? 'សូមអញ្ជើញសរសេរពាក្យជូនពរដំបូងគេបង្អស់ជូនកូនកំលោះ និងកូនក្រមុំ!'
                    : 'Be the first to share your warm wishes for the bride & groom!'}
                </p>
              </div>
            )}
          </div>

          {/* 4. Pre-Wedding Photo Highlights Teaser */}
          <div className="p-4 rounded-3xl bg-[#FCFBF7] dark:bg-[#1E2722] border border-stone-200/80 dark:border-stone-700 shadow-md">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-stone-800 dark:text-stone-200 font-khmer flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-[#295744] dark:text-[#C5A880]">
                  photo_library
                </span>
                <span>{lang === 'km' ? 'កម្រងរូបភាពស្នេហា (Pre-Wedding Journey)' : 'Pre-Wedding Highlights'}</span>
              </span>
              <button
                onClick={() => onNavigate('gallery')}
                className="text-xs font-semibold text-[#86513d] dark:text-[#C5A880] hover:underline flex items-center gap-0.5 font-khmer cursor-pointer"
              >
                <span>{lang === 'km' ? 'មើលទាំងអស់' : 'Explore All'}</span>
                <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {INITIAL_GALLERY_PHOTOS.slice(0, 3).map((photo) => (
                <div
                  key={photo.id}
                  onClick={() => onNavigate('gallery')}
                  className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-stone-200 dark:bg-stone-800 cursor-pointer shadow-2xs border border-stone-200/50"
                >
                  <img
                    src={photo.imageUrl}
                    alt={photo.titleEn}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-2">
                    <span className="text-[10px] text-white font-khmer font-medium truncate">
                      {lang === 'km' ? photo.titleKm : photo.titleEn}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Guest Photo Modal */}
      {viewingWishPhoto && viewingWishPhoto.photoUrl && (
        <GuestPhotoModal
          isOpen={Boolean(viewingWishPhoto)}
          onClose={() => setViewingWishPhoto(null)}
          photoUrl={viewingWishPhoto.photoUrl}
          guestName={viewingWishPhoto.name}
          blessing={viewingWishPhoto.message}
          submittedAt={viewingWishPhoto.timestamp}
          lang={lang}
        />
      )}

      {/* Google Sheet RSVPs Modal */}
      <GoogleSheetRsvpModal
        isOpen={isSheetRsvpModalOpen}
        onClose={() => setIsSheetRsvpModalOpen(false)}
        lang={lang}
        onViewPhoto={(url, name) =>
          setViewingWishPhoto({
            id: 'guest-photo',
            name,
            message: '',
            timestamp: '',
            likes: 0,
            isLiked: false,
            photoUrl: url
          })
        }
      />
    </div>
  );
};
