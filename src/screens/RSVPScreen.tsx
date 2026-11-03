import React, { useState, useEffect, useMemo } from 'react';
import { Language, Screen, RSVPRecord } from '../types';
import { compressImage, downloadPhoto } from '../utils/imageHelper';
import { GuestPhotoModal } from '../components/GuestPhotoModal';
import { postSheetRSVP, fetchSheetRSVPs } from '../utils/sheetdb';
import { triggerWeddingConfetti } from '../utils/confetti';

interface RSVPScreenProps {
  lang: Language;
  onNavigate: (screen: Screen) => void;
  rsvpList: RSVPRecord[];
  onAddRSVP: (record: RSVPRecord) => void;
}

export const RSVPScreen: React.FC<RSVPScreenProps> = ({ lang, onNavigate, rsvpList, onAddRSVP }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [guestCount, setGuestCount] = useState(1);
  const [attending, setAttending] = useState<'yes' | 'no'>('yes');
  const [diet, setDiet] = useState<'none' | 'vegetarian' | 'halal'>('none');
  const [blessing, setBlessing] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [lastTicket, setLastTicket] = useState<RSVPRecord | null>(null);
  const [activeTab, setActiveTab] = useState<'photos' | 'all'>('photos');
  const [viewingPhotoRecord, setViewingPhotoRecord] = useState<RSVPRecord | null>(null);

  const [sheetRSVPs, setSheetRSVPs] = useState<RSVPRecord[]>([]);
  const [isLoadingSheet, setIsLoadingSheet] = useState(false);

  const loadSheetRSVPs = async () => {
    try {
      setIsLoadingSheet(true);
      const records = await fetchSheetRSVPs();
      setSheetRSVPs(records || []);
    } catch (err) {
      console.warn('Failed to load sheet RSVPs:', err);
    } finally {
      setIsLoadingSheet(false);
    }
  };

  useEffect(() => {
    loadSheetRSVPs();
  }, []);

  // Merge real RSVPs: Google Sheets data is primary source of truth
  const allRsvps = useMemo(() => {
    if (sheetRSVPs.length > 0) {
      const list = [...sheetRSVPs];
      // Add local submissions if not yet synced in Google Sheets
      for (const r of rsvpList.filter((x) => !['rsvp-seed-1', 'rsvp-seed-2'].includes(x.id))) {
        if (!list.some((s) => s.name.trim().toLowerCase() === r.name.trim().toLowerCase())) {
          list.unshift(r);
        }
      }
      return list;
    }
    return rsvpList.filter((x) => !['rsvp-seed-1', 'rsvp-seed-2'].includes(x.id));
  }, [sheetRSVPs, rsvpList]);

  // Count number of attendees who sent a message confirming they will attend (strictly following Google Sheets)
  const confirmedAttendees = useMemo(() => {
    if (sheetRSVPs.length > 0) {
      // Primary source: Count from Google Sheets
      return sheetRSVPs
        .filter((r) => r.attending === 'yes')
        .reduce((sum, r) => sum + (r.guestCount || 1), 0);
    }
    // Fallback if Google Sheets is empty
    return allRsvps
      .filter((r) => r.attending === 'yes')
      .reduce((sum, r) => sum + (r.guestCount || 1), 0);
  }, [sheetRSVPs, allRsvps]);

  const guestPhotosList = allRsvps.filter((r) => Boolean(r.photoUrl));

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploadingPhoto(true);
      const compressed = await compressImage(file, 900, 900, 0.78);
      setPhotoUrl(compressed);
    } catch (err) {
      console.error('Error compressing guest photo:', err);
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newRecord: RSVPRecord = {
      id: `rsvp-${Date.now()}`,
      name: name.trim(),
      phone: phone.trim() || '012 345 678',
      guestCount,
      attending,
      diet,
      blessing: blessing.trim(),
      photoUrl: photoUrl.trim() || undefined,
      submittedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    onAddRSVP(newRecord);
    setLastTicket(newRecord);
    triggerWeddingConfetti();
    setTimeout(loadSheetRSVPs, 1500);
    setName('');
    setPhone('');
    setBlessing('');
    setPhotoUrl('');
  };

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
            {lang === 'km' ? 'ឆ្លើយតបការចូលរួម (RSVP)' : 'RSVP Portal'}
          </h1>
        </div>

        <button
          onClick={() => onNavigate('gallery')}
          className="flex size-9 items-center justify-center rounded-full hover:bg-stone-200/60 dark:hover:bg-stone-700 text-[#0d402e] dark:text-[#C5A880]"
        >
          <span className="material-symbols-outlined text-[20px]">photo_library</span>
        </button>
      </header>

      <main className="px-4 sm:px-6 py-5">
        {/* Responsive Grid: Single column on mobile, 2 columns on desktop */}
        <div className="md:grid md:grid-cols-12 md:gap-8 items-start">
          
          {/* Left Column: Intro & Form */}
          <div className="md:col-span-7 space-y-4">
            <div>
              <span className="font-display italic text-xs tracking-widest text-[#C5A880] uppercase">
                {lang === 'km' ? 'សូមបញ្ជាក់វត្តមាន' : 'Attendance Confirmation'}
              </span>
              <h2 className="text-xl font-bold font-khmer text-[#0d402e] dark:text-[#67AA8E] mt-0.5">
                {lang === 'km' ? 'វត្តមានរបស់លោកអ្នកគឺជាកិត្តិយស' : 'Join Our Sacred Celebration'}
              </h2>
              <p className="text-xs text-stone-500 font-khmer mt-1">
                {lang === 'km'
                  ? 'សូមមេត្តាឆ្លើយតបមុនថ្ងៃទី ០១ ខែតុលា ឆ្នាំ២០៣០ ដើម្បីភាពងាយស្រួលក្នុងការរៀបចំកន្លែងទទួលបដិសណ្ឋារកិច្ច'
                  : 'Please RSVP by October 1, 2030 to help us arrange your banquet table'}
              </p>
            </div>

            {/* RSVP Form */}
            <form onSubmit={handleSubmit} className="p-4 sm:p-5 bg-white dark:bg-[#26322B] rounded-2xl border border-stone-200 dark:border-stone-700 shadow-2xs space-y-3">
              <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-800 dark:text-emerald-300 font-khmer">
                <div className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{lang === 'km' ? 'ទិន្នន័យឆ្លើយតបនឹងរក្សាទុកក្នុង Google Sheet ភ្លាមៗ' : 'RSVP responses auto-sync to Google Sheet'}</span>
                </div>
                <span className="font-mono text-[9px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-200/60 dark:bg-emerald-900/60 px-1.5 py-0.5 rounded">SheetDB</span>
              </div>
              <div>
                <label className="block text-xs font-khmer font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  {lang === 'km' ? 'ឈ្មោះភ្ញៀវកិត្តិយស (Full Name) *' : 'Guest Full Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={lang === 'km' ? 'ឧ. លោក វណ្ណៈ' : 'e.g. Mr. Sovann'}
                  className="w-full text-xs rounded-xl border-stone-300 dark:border-stone-600 bg-[#FCFBF7] dark:bg-[#1E2722] py-2.5 px-3 text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-[#295744]"
                />
              </div>

              <div>
                <label className="block text-xs font-khmer font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  {lang === 'km' ? 'លេខទូរស័ព្ទ / Telegram' : 'Phone or Telegram'}
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="012 345 678"
                  className="w-full text-xs rounded-xl border-stone-300 dark:border-stone-600 bg-[#FCFBF7] dark:bg-[#1E2722] py-2.5 px-3 text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-[#295744]"
                />
              </div>

              <div>
                <label className="block text-xs font-khmer font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  {lang === 'km' ? 'តើលោកអ្នកអាចចូលរួមបានទេ?' : 'Will you attend?'}
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <label
                    className={`flex items-center p-2.5 rounded-xl border cursor-pointer transition-colors ${
                      attending === 'yes'
                        ? 'border-[#295744] bg-[#295744]/10 dark:border-[#C5A880] dark:bg-[#C5A880]/10 text-stone-900 dark:text-stone-100 font-semibold'
                        : 'border-stone-200 dark:border-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="page-attendance"
                      checked={attending === 'yes'}
                      onChange={() => setAttending('yes')}
                      className="text-[#295744] focus:ring-[#295744]"
                    />
                    <span className="ml-2 font-khmer text-xs">
                      {lang === 'km' ? 'អាចចូលរួមបាន (Yes)' : 'Joyfully Accept'}
                    </span>
                  </label>

                  <label
                    className={`flex items-center p-2.5 rounded-xl border cursor-pointer transition-colors ${
                      attending === 'no'
                        ? 'border-[#295744] bg-[#295744]/10 dark:border-[#C5A880] dark:bg-[#C5A880]/10 text-stone-900 dark:text-stone-100 font-semibold'
                        : 'border-stone-200 dark:border-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="page-attendance"
                      checked={attending === 'no'}
                      onChange={() => setAttending('no')}
                      className="text-[#295744] focus:ring-[#295744]"
                    />
                    <span className="ml-2 font-khmer text-xs">
                      {lang === 'km' ? 'សូមអភ័យទោស (No)' : 'Regretfully Decline'}
                    </span>
                  </label>
                </div>
              </div>

              {attending === 'yes' && (
                <>
                  <div>
                    <label className="block text-xs font-khmer font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      {lang === 'km' ? 'ចំនួនអ្នកចូលរួម (Number of Attendees)' : 'Number of Attendees'}
                    </label>
                    <select
                      value={guestCount}
                      onChange={(e) => setGuestCount(Number(e.target.value))}
                      className="w-full text-xs rounded-xl border-stone-300 dark:border-stone-600 bg-[#FCFBF7] dark:bg-[#1E2722] py-2.5 px-3 text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-[#295744]"
                    >
                      <option value="1">១ នាក់ (1 Person)</option>
                      <option value="2">២ នាក់ (2 Persons)</option>
                      <option value="3">៣ នាក់ (3 Persons)</option>
                      <option value="4">៤ នាក់ ឬច្រើនជាង (4+ Persons)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-khmer font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      {lang === 'km' ? 'ចំណូលចិត្តម្ហូបអាហារ (Dietary)' : 'Dietary Options'}
                    </label>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => setDiet('none')}
                        className={`py-2 px-1 rounded-xl border text-center transition-colors font-khmer ${
                          diet === 'none'
                            ? 'border-[#295744] bg-[#295744] text-white font-semibold'
                            : 'border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800'
                        }`}
                      >
                        {lang === 'km' ? 'ទូទៅ' : 'Standard'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setDiet('vegetarian')}
                        className={`py-2 px-1 rounded-xl border text-center transition-colors font-khmer ${
                          diet === 'vegetarian'
                            ? 'border-[#295744] bg-[#295744] text-white font-semibold'
                            : 'border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800'
                        }`}
                      >
                        {lang === 'km' ? 'បួស' : 'Vegetarian'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setDiet('halal')}
                        className={`py-2 px-1 rounded-xl border text-center transition-colors font-khmer ${
                          diet === 'halal'
                            ? 'border-[#295744] bg-[#295744] text-white font-semibold'
                            : 'border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800'
                        }`}
                      >
                        Halal
                      </button>
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-khmer font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  {lang === 'km' ? 'ពាក្យជូនពរ (Blessing for the couple)' : 'Your Blessing Message'}
                </label>
                <textarea
                  rows={2}
                  value={blessing}
                  onChange={(e) => setBlessing(e.target.value)}
                  placeholder={lang === 'km' ? 'សូមជូនពរឱ្យមានសុភមង្គល...' : 'May your love grow stronger every day...'}
                  className="w-full text-xs rounded-xl border-stone-300 dark:border-stone-600 bg-[#FCFBF7] dark:bg-[#1E2722] py-2 px-3 text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-[#295744]"
                />
              </div>

              {/* Photo Attachment (បង្កើតឱ្យឃើញ និងរក្សាទុករូបភាពភ្ញៀវ) */}
              <div>
                <label className="block text-xs font-khmer font-semibold text-stone-700 dark:text-stone-300 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-[#295744] dark:text-[#C5A880]">add_a_photo</span>
                    <span>{lang === 'km' ? 'ភ្ជាប់រូបភាពអនុស្សាវរីយ៍ / ស៊ែលហ្វី' : 'Attach Photo or Memory'}</span>
                  </span>
                  <span className="text-[10px] text-stone-400 font-normal">
                    {lang === 'km' ? '(ជាជម្រើស)' : '(Optional)'}
                  </span>
                </label>

                {photoUrl ? (
                  <div className="relative rounded-2xl overflow-hidden border-2 border-[#295744]/40 bg-stone-100 dark:bg-stone-800 p-2 flex items-center gap-3">
                    <img
                      src={photoUrl}
                      alt="Preview"
                      className="w-16 h-16 rounded-xl object-cover shadow-xs border border-stone-200 dark:border-stone-700"
                    />
                    <div className="flex-1 text-xs">
                      <span className="font-khmer font-semibold text-stone-800 dark:text-stone-200 block">
                        {lang === 'km' ? '✓ បានភ្ជាប់រូបភាពរួចរាល់' : '✓ Photo Attached'}
                      </span>
                      <span className="text-[10px] text-stone-500 font-khmer block mt-0.5">
                        {lang === 'km' ? 'រូបភាពនឹងត្រូវបង្ហាញ និងរក្សាទុកជាមួយការឆ្លើយតប' : 'Will be displayed & saved with your response'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPhotoUrl('')}
                      className="w-7 h-7 rounded-full bg-rose-100 dark:bg-rose-950/70 text-rose-600 flex items-center justify-center hover:bg-rose-200 transition-colors"
                      title={lang === 'km' ? 'លុបរូបភាពចេញ' : 'Remove photo'}
                    >
                      <span className="material-symbols-outlined text-[15px]">close</span>
                    </button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-stone-300 dark:border-stone-600 hover:border-[#295744] dark:hover:border-[#C5A880] rounded-2xl p-3 flex flex-col items-center justify-center gap-1 cursor-pointer bg-[#FCFBF7] dark:bg-[#1E2722] transition-colors group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                      disabled={isUploadingPhoto}
                    />
                    <span className="material-symbols-outlined text-[24px] text-[#295744] dark:text-[#C5A880] group-hover:scale-110 transition-transform">
                      {isUploadingPhoto ? 'hourglass_top' : 'add_photo_alternate'}
                    </span>
                    <span className="font-khmer text-[11px] text-stone-600 dark:text-stone-300 font-medium text-center">
                      {isUploadingPhoto
                        ? (lang === 'km' ? 'កំពុងបញ្ចូលរូបភាព...' : 'Processing photo...')
                        : (lang === 'km' ? 'ចុចទីនេះដើម្បីជ្រើសរើស ឬថតរូបភាពរបស់អ្នក' : 'Tap to upload or take a photo')}
                    </span>
                    <span className="text-[9px] text-stone-400 font-khmer">
                      {lang === 'km' ? 'JPG, PNG • រក្សាទុកក្នុងវិចិត្រសាលដោយស្វ័យប្រវត្តិ' : 'JPG, PNG • Saved automatically to gallery'}
                    </span>
                  </label>
                )}
              </div>

              <button
                type="submit"
                disabled={isUploadingPhoto}
                className="w-full py-3 bg-[#295744] hover:bg-[#3C735B] text-white rounded-xl font-khmer font-bold text-xs tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
              >
                {lang === 'km' ? 'ផ្ញើការឆ្លើយតប (Submit Confirmation)' : 'Confirm RSVP'}
              </button>
            </form>
          </div>

          {/* Right Column: Stats, Pass & Feed */}
          <div className="md:col-span-5 space-y-4 mt-5 md:mt-0">
            {/* Stats Pill */}
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="p-3 bg-white dark:bg-[#26322B] rounded-2xl border border-stone-200 dark:border-stone-700 shadow-2xs relative">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-mono font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Google Sheets
                  </span>
                  <button
                    type="button"
                    onClick={loadSheetRSVPs}
                    disabled={isLoadingSheet}
                    title={lang === 'km' ? 'ធ្វើបច្ចុប្បន្នភាពទិន្នន័យពី Google Sheets' : 'Sync from Google Sheets'}
                    className="text-stone-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                  >
                    <span className={`material-symbols-outlined text-[13px] ${isLoadingSheet ? 'animate-spin' : ''}`}>
                      sync
                    </span>
                  </button>
                </div>
                <span className="text-xl sm:text-2xl font-bold font-mono text-[#295744] dark:text-[#C5A880] block">
                  {confirmedAttendees}
                </span>
                <span className="text-[10px] text-stone-500 font-khmer block">
                  {lang === 'km' ? 'ភ្ញៀវបានបញ្ជាក់វត្តមាន' : 'Confirmed Guests'}
                </span>
              </div>
              <div className="p-3 bg-white dark:bg-[#26322B] rounded-2xl border border-stone-200 dark:border-stone-700 shadow-2xs">
                <span className="text-xl font-bold font-mono text-[#86513d] dark:text-[#E8B2B5] block">
                  10 Oct 2030
                </span>
                <span className="text-[10px] text-stone-500 font-khmer">
                  {lang === 'km' ? 'កាលបរិច្ឆេទមង្គល' : 'Celebration Date'}
                </span>
              </div>
            </div>

            {/* Generated Digital Pass */}
            {lastTicket ? (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#FFF8ED] to-[#F5DFD0] dark:from-[#26322B] dark:to-[#1b2520] border border-[#C5A880]/50 text-left shadow-md relative overflow-hidden animate-in fade-in duration-300">
                <div className="flex justify-between items-start border-b border-[#C5A880]/30 pb-2 mb-2">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#295744] dark:text-[#C5A880] font-semibold block">
                      Official Guest Pass • ប័ណ្ណភ្ញៀវកិត្តិយស
                    </span>
                    <span className="font-display italic text-lg font-bold text-stone-900 dark:text-stone-100">
                      Hong &amp; ReakSmey Wedding
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-full border border-[#C5A880] bg-white dark:bg-stone-900 flex items-center justify-center text-xs font-display text-[#295744] dark:text-[#C5A880] font-bold">
                    H&amp;R
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-stone-500 font-khmer">ឈ្មោះ (Name):</span>
                    <span className="font-semibold text-stone-900 dark:text-stone-100">{lastTicket.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500 font-khmer">ការចូលរួម (Status):</span>
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                      {lastTicket.attending === 'yes' ? 'អាចចូលរួមបាន (Attending)' : 'សូមអភ័យទោស (Declined)'}
                    </span>
                  </div>
                  {lastTicket.attending === 'yes' && (
                    <div className="flex justify-between">
                      <span className="text-stone-500 font-khmer">ចំនួនកៅអី (Reserved Seats):</span>
                      <span className="font-semibold text-stone-900 dark:text-stone-100">
                        {lastTicket.guestCount} {lang === 'km' ? 'នាក់' : 'Seats'}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-2 border-t border-[#C5A880]/30 flex items-center justify-between text-[10px] text-stone-500">
                  <span className="font-mono">PASS #{lastTicket.id.slice(-6).toUpperCase()}</span>
                  <span className="font-khmer">គេហដ្ឋានខាងកូនក្រមុំ (ភូមិពាក់ស្នែងថ្មី)</span>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-white dark:bg-[#26322B] border border-stone-200 dark:border-stone-700 text-center space-y-2">
                <span className="material-symbols-outlined text-[32px] text-[#295744] dark:text-[#C5A880]">
                  badge
                </span>
                <h4 className="text-xs font-bold text-stone-800 dark:text-stone-200 font-khmer">
                  {lang === 'km' ? 'ប័ណ្ណភ្ញៀវកិត្តិយសឌីជីថល' : 'Digital Wedding Pass'}
                </h4>
                <p className="text-[11px] text-stone-500 font-khmer">
                  {lang === 'km'
                    ? 'បន្ទាប់ពីលោកអ្នកបំពេញទម្រង់រួចរាល់ ប្រព័ន្ធនឹងបង្កើតប័ណ្ណកិត្តិយសឌីជីថលជូនភ្លាមៗ។'
                    : 'Submit your RSVP confirmation on the left to generate your personalized digital guest pass.'}
                </p>
              </div>
            )}

            {/* Guest Responses & Photo Gallery Section */}
            {rsvpList.length > 0 && (
              <div className="p-4 bg-white dark:bg-[#26322B] rounded-2xl border border-stone-200 dark:border-stone-700 shadow-2xs space-y-3">
                {/* Tab Switcher */}
                <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-700 pb-2">
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => setActiveTab('photos')}
                      className={`py-1 px-2.5 rounded-lg text-xs font-khmer font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                        activeTab === 'photos'
                          ? 'bg-[#295744] text-white shadow-xs'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[15px]">photo_library</span>
                      <span>{lang === 'km' ? 'រូបថតភ្ញៀវ' : 'Guest Photos'}</span>
                      <span className="text-[10px] opacity-80 font-mono">({guestPhotosList.length})</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('all')}
                      className={`py-1 px-2.5 rounded-lg text-xs font-khmer font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                        activeTab === 'all'
                          ? 'bg-[#295744] text-white shadow-xs'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[15px]">list_alt</span>
                      <span>{lang === 'km' ? 'បញ្ជីទាំងអស់' : 'All RSVPs'}</span>
                      <span className="text-[10px] opacity-80 font-mono">({rsvpList.length})</span>
                    </button>
                  </div>

                  {guestPhotosList.length > 0 && activeTab === 'photos' && (
                    <button
                      type="button"
                      onClick={() => {
                        // Download all guest photos
                        guestPhotosList.forEach((r, idx) => {
                          if (r.photoUrl) {
                            setTimeout(() => {
                              downloadPhoto(r.photoUrl!, `wedding-guest-${r.name.replace(/\s+/g, '-')}.jpg`);
                            }, idx * 250);
                          }
                        });
                      }}
                      className="text-[10px] text-[#295744] dark:text-[#C5A880] font-khmer font-bold flex items-center gap-0.5 hover:underline cursor-pointer"
                      title={lang === 'km' ? 'ទាញយករូបភាពភ្ញៀវទាំងអស់' : 'Save all guest photos'}
                    >
                      <span className="material-symbols-outlined text-[14px]">download</span>
                      <span>{lang === 'km' ? 'រក្សាទុកទាំងអស់' : 'Save All'}</span>
                    </button>
                  )}
                </div>

                {/* Tab 1: Guest Photos Gallery */}
                {activeTab === 'photos' && (
                  <div>
                    {guestPhotosList.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2.5 max-h-72 overflow-y-auto no-scrollbar pr-0.5">
                        {guestPhotosList.map((record) => (
                          <div
                            key={record.id}
                            className="group relative rounded-xl overflow-hidden border border-stone-200/80 dark:border-stone-700 bg-stone-50 dark:bg-[#1E2722] shadow-2xs transition-all hover:shadow-md"
                          >
                            {/* Photo Aspect Container */}
                            <div
                              onClick={() => setViewingPhotoRecord(record)}
                              className="aspect-square w-full overflow-hidden bg-stone-200 dark:bg-stone-800 cursor-pointer relative"
                            >
                              <img
                                src={record.photoUrl}
                                alt={record.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                                <span className="text-[10px] text-white font-khmer flex items-center gap-1">
                                  <span className="material-symbols-outlined text-[13px]">visibility</span>
                                  {lang === 'km' ? 'ចុចមើលរូបភាព' : 'View full'}
                                </span>
                              </div>
                            </div>

                            {/* Card Details */}
                            <div className="p-2 space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="font-khmer font-bold text-xs text-stone-800 dark:text-stone-100 truncate block">
                                  {record.name}
                                </span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (record.photoUrl) {
                                      downloadPhoto(record.photoUrl, `guest-${record.name}.jpg`);
                                    }
                                  }}
                                  className="p-1 rounded-md bg-stone-100 dark:bg-stone-800 hover:bg-[#295744] hover:text-white dark:hover:bg-[#C5A880] text-stone-600 dark:text-stone-300 transition-colors"
                                  title={lang === 'km' ? 'រក្សាទុករូបភាព (Save Photo)' : 'Download photo'}
                                >
                                  <span className="material-symbols-outlined text-[14px]">download</span>
                                </button>
                              </div>
                              {record.blessing && (
                                <p className="text-[10px] text-stone-500 font-khmer italic line-clamp-1">
                                  «{record.blessing}»
                                </p>
                              )}
                              <span className="text-[9px] text-stone-400 font-mono block">
                                {record.submittedAt}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-6 px-3 text-center rounded-xl bg-[#FCFBF7] dark:bg-[#1E2722] border border-dashed border-stone-200 dark:border-stone-700">
                        <span className="material-symbols-outlined text-[28px] text-stone-400 mb-1 block">
                          photo_camera
                        </span>
                        <p className="text-xs text-stone-600 dark:text-stone-300 font-khmer font-semibold">
                          {lang === 'km' ? 'មិនទាន់មានរូបថតពីភ្ញៀវនៅឡើយទេ' : 'No guest photos yet'}
                        </p>
                        <p className="text-[10px] text-stone-400 font-khmer mt-0.5">
                          {lang === 'km'
                            ? 'លោកអ្នកអាចភ្ជាប់រូបភាពរបស់អ្នកនៅពេលឆ្លើយតប RSVP ខាងឆ្វេង'
                            : 'You can be the first to upload a photo when replying on the left'}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Tab 2: All RSVPs Feed */}
                {activeTab === 'all' && (
                  <div className="space-y-2 max-h-72 overflow-y-auto no-scrollbar">
                    {allRsvps.length > 0 ? (
                      allRsvps.map((record) => (
                        <div
                          key={record.id}
                          className="p-2.5 bg-[#FCFBF7] dark:bg-[#1E2722] rounded-xl border border-stone-200/60 dark:border-stone-700 flex justify-between items-center text-xs"
                        >
                          <div className="flex items-center gap-2.5">
                            {record.photoUrl ? (
                              <img
                                src={record.photoUrl}
                                alt={record.name}
                                onClick={() => setViewingPhotoRecord(record)}
                                className="w-10 h-10 rounded-lg object-cover cursor-pointer hover:opacity-85 shadow-2xs border border-stone-200 dark:border-stone-600"
                                title={lang === 'km' ? 'ចុចដើម្បីមើល & រក្សាទុករូបភាព' : 'Click to view & save photo'}
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-400">
                                <span className="material-symbols-outlined text-[18px]">person</span>
                              </div>
                            )}
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-semibold text-stone-900 dark:text-stone-100 block font-khmer">
                                  {record.name}
                                </span>
                                {record.photoUrl && (
                                  <span className="material-symbols-outlined text-[13px] text-[#295744] dark:text-[#C5A880]" title="Has Photo">
                                    photo_camera
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-1.5 flex-wrap text-[10px] text-stone-400 font-khmer">
                                <span>{record.attending === 'yes' ? `✓ ${record.guestCount} នាក់ (Attending)` : '✗ Declined'}</span>
                                {record.phone && (
                                  <span className="font-mono text-stone-500 dark:text-stone-400">
                                    • 📞 {record.phone}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="text-right space-y-1">
                            <span className="text-[10px] text-stone-400 font-mono block">{record.submittedAt}</span>
                            {record.photoUrl && (
                              <button
                                type="button"
                                onClick={() => setViewingPhotoRecord(record)}
                                className="text-[10px] text-[#295744] dark:text-[#C5A880] font-khmer font-semibold hover:underline block"
                              >
                                {lang === 'km' ? 'មើលរូបថត' : 'View Photo'}
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-6 px-3 text-center rounded-xl bg-[#FCFBF7] dark:bg-[#1E2722] border border-dashed border-stone-200 dark:border-stone-700">
                        <span className="material-symbols-outlined text-[28px] text-stone-400 mb-1 block">
                          how_to_reg
                        </span>
                        <p className="text-xs text-stone-600 dark:text-stone-300 font-khmer font-semibold">
                          {lang === 'km' ? 'មិនទាន់មានការឆ្លើយតបនៅឡើយទេ' : 'No RSVP responses yet'}
                        </p>
                        <p className="text-[10px] text-stone-400 font-khmer mt-0.5">
                          {lang === 'km'
                            ? 'សូមបំពេញទម្រង់នៅខាងឆ្វេងដើម្បីបញ្ជាក់វត្តមាន'
                            : 'Fill out the form on the left to confirm your attendance'}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </main>

      {/* Guest Photo Lightbox & Download Modal */}
      {viewingPhotoRecord && viewingPhotoRecord.photoUrl && (
        <GuestPhotoModal
          isOpen={Boolean(viewingPhotoRecord)}
          onClose={() => setViewingPhotoRecord(null)}
          photoUrl={viewingPhotoRecord.photoUrl}
          guestName={viewingPhotoRecord.name}
          blessing={viewingPhotoRecord.blessing}
          submittedAt={viewingPhotoRecord.submittedAt}
          lang={lang}
        />
      )}
    </div>
  );
};
