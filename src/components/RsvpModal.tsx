import React, { useState } from 'react';
import { Language, RSVPRecord } from '../types';
import { compressImage } from '../utils/imageHelper';
import { postSheetRSVP } from '../utils/sheetdb';
import { triggerWeddingConfetti } from '../utils/confetti';

interface RsvpModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onRsvpSuccess: (record: RSVPRecord) => void;
}

export const RsvpModal: React.FC<RsvpModalProps> = ({ isOpen, onClose, lang, onRsvpSuccess }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [guestCount, setGuestCount] = useState(1);
  const [attending, setAttending] = useState<'yes' | 'no'>('yes');
  const [diet, setDiet] = useState<'none' | 'vegetarian' | 'halal'>('none');
  const [blessing, setBlessing] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<RSVPRecord | null>(null);

  if (!isOpen) return null;

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploadingPhoto(true);
      const compressed = await compressImage(file, 900, 900, 0.78);
      setPhotoUrl(compressed);
    } catch (err) {
      console.error('Error compressing photo:', err);
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

    onRsvpSuccess(newRecord);
    setSubmittedTicket(newRecord);
    triggerWeddingConfetti();
  };

  const resetForm = () => {
    setName('');
    setPhone('');
    setGuestCount(1);
    setAttending('yes');
    setDiet('none');
    setBlessing('');
    setPhotoUrl('');
    setSubmittedTicket(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-[#FCFBF7] dark:bg-[#1E2722] w-full max-w-sm rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-stone-200 dark:border-stone-700 animate-in fade-in slide-in-from-bottom duration-300 max-h-[92vh] overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-700">
          <div className="flex items-center space-x-2">
            <span className="material-symbols-outlined text-[#295744] dark:text-[#C5A880] text-[20px]">
              event_available
            </span>
            <h3 className="font-khmer font-bold text-stone-800 dark:text-stone-100 text-sm">
              {lang === 'km' ? 'ឆ្លើយតបការចូលរួម (RSVP)' : 'RSVP & Guest Confirmation'}
            </h3>
          </div>
          <button
            onClick={resetForm}
            aria-label="Close"
            className="w-7 h-7 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>

        {/* Google Sheet Sync Indicator */}
        <div className="mt-2.5 flex items-center justify-between px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200/80 dark:border-emerald-800 text-[10px] text-emerald-800 dark:text-emerald-300 font-khmer">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>{lang === 'km' ? 'កត់ត្រាចូលក្នុង Google Sheet ដោយស្វ័យប្រវត្តិ' : 'Auto-syncs to Google Sheet'}</span>
          </div>
          <span className="font-mono text-[9px] text-emerald-600 dark:text-emerald-400 font-bold">SheetDB</span>
        </div>

        {submittedTicket ? (
          <div className="mt-4 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shadow-inner">
              <span className="material-symbols-outlined text-[28px]">check_circle</span>
            </div>

            <div>
              <h4 className="font-khmer font-bold text-stone-900 dark:text-stone-100 text-base">
                {lang === 'km' ? 'សូមអរគុណយ៉ាងជ្រាលជ្រៅ!' : 'Thank You So Much!'}
              </h4>
              <p className="text-xs text-stone-600 dark:text-stone-400 font-khmer mt-1">
                {lang === 'km'
                  ? 'ការឆ្លើយតបរបស់លោកអ្នក ត្រូវបានកត់ត្រាទុកដោយជោគជ័យ។'
                  : 'Your RSVP attendance has been safely confirmed in our guestbook.'}
              </p>
            </div>

            {/* Digital Guest Pass Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#FFF8ED] to-[#F5DFD0] dark:from-[#26322B] dark:to-[#1b2520] border border-[#C5A880]/40 text-left shadow-md relative overflow-hidden">
              <div className="flex justify-between items-start border-b border-[#C5A880]/30 pb-2 mb-2">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#295744] dark:text-[#C5A880] font-semibold block">
                    Digital Guest Pass • សំបុត្រកិត្តិយស
                  </span>
                  <span className="font-display italic text-lg font-bold text-stone-900 dark:text-stone-100">
                    Hong &amp; ReakSmey
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full border border-[#C5A880] bg-white dark:bg-stone-900 flex items-center justify-center text-xs font-display text-[#295744] dark:text-[#C5A880] font-bold">
                  H&amp;R
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-stone-500 dark:text-stone-400 font-khmer">ភ្ញៀវ (Guest):</span>
                  <span className="font-semibold text-stone-900 dark:text-stone-100">{submittedTicket.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500 dark:text-stone-400 font-khmer">ការចូលរួម (Status):</span>
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                    {submittedTicket.attending === 'yes'
                      ? (lang === 'km' ? 'អាចចូលរួមបាន (Attending)' : 'Attending')
                      : (lang === 'km' ? 'សូមអភ័យទោស (Declined)' : 'Declined')}
                  </span>
                </div>
                {submittedTicket.attending === 'yes' && (
                  <div className="flex justify-between">
                    <span className="text-stone-500 dark:text-stone-400 font-khmer">ចំនួន (Attendees):</span>
                    <span className="font-semibold text-stone-900 dark:text-stone-100">
                      {submittedTicket.guestCount} {lang === 'km' ? 'នាក់' : 'Guest(s)'}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-[11px] pt-1 text-stone-500">
                  <span>កាលបរិច្ឆេទ (Date):</span>
                  <span>10 Oct 2030 • 5:30 PM</span>
                </div>
              </div>

              {/* Barcode/QR simulation */}
              <div className="mt-3 pt-2 border-t border-[#C5A880]/30 flex items-center justify-between text-[10px] text-stone-500">
                <span className="font-mono">#HR-{submittedTicket.id.slice(-6).toUpperCase()}</span>
                <span className="font-khmer">គេហដ្ឋានខាងកូនក្រមុំ (ភូមិពាក់ស្នែងថ្មី)</span>
              </div>
            </div>

            <button
              onClick={resetForm}
              className="w-full py-2.5 bg-[#295744] text-white rounded-xl font-khmer text-xs font-semibold shadow hover:opacity-95 transition-opacity"
            >
              {lang === 'km' ? 'រួចរាល់' : 'Done'}
            </button>
          </div>
        ) : (
          <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-khmer text-stone-700 dark:text-stone-300 mb-1">
                {lang === 'km' ? 'ឈ្មោះភ្ញៀវកិត្តិយស (Full Name) *' : 'Guest Full Name *'}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={lang === 'km' ? 'ឧ. លោក ឈុន វណ្ណៈ / Dr. Vannak Chhun' : 'e.g. Dr. Vannak Chhun'}
                className="w-full text-xs rounded-lg border-stone-300 dark:border-stone-600 bg-white dark:bg-[#26322B] py-2 px-3 text-stone-800 dark:text-stone-100 focus:ring-1 focus:ring-[#295744] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-khmer text-stone-700 dark:text-stone-300 mb-1">
                {lang === 'km' ? 'លេខទូរស័ព្ទ ឬ Telegram (Phone / Telegram)' : 'Phone or Telegram'}
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="012 345 678"
                className="w-full text-xs rounded-lg border-stone-300 dark:border-stone-600 bg-white dark:bg-[#26322B] py-2 px-3 text-stone-800 dark:text-stone-100 focus:ring-1 focus:ring-[#295744] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-khmer text-stone-700 dark:text-stone-300 mb-1">
                {lang === 'km' ? 'តើលោកអ្នកអាចចូលរួមបានទេ? (Attendance)' : 'Will you attend?'}
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <label
                  className={`flex items-center p-2 rounded-lg border cursor-pointer transition-colors ${
                    attending === 'yes'
                      ? 'border-[#295744] bg-[#295744]/10 dark:border-[#C5A880] dark:bg-[#C5A880]/10 text-stone-900 dark:text-stone-100 font-medium'
                      : 'border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800'
                  }`}
                >
                  <input
                    type="radio"
                    name="modal-attendance"
                    checked={attending === 'yes'}
                    onChange={() => setAttending('yes')}
                    className="text-[#295744] focus:ring-[#295744]"
                  />
                  <span className="ml-2 font-khmer text-[11px]">
                    {lang === 'km' ? 'អាចចូលរួមបាន (Yes)' : 'Joyfully Accept'}
                  </span>
                </label>
                <label
                  className={`flex items-center p-2 rounded-lg border cursor-pointer transition-colors ${
                    attending === 'no'
                      ? 'border-[#295744] bg-[#295744]/10 dark:border-[#C5A880] dark:bg-[#C5A880]/10 text-stone-900 dark:text-stone-100 font-medium'
                      : 'border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800'
                  }`}
                >
                  <input
                    type="radio"
                    name="modal-attendance"
                    checked={attending === 'no'}
                    onChange={() => setAttending('no')}
                    className="text-[#295744] focus:ring-[#295744]"
                  />
                  <span className="ml-2 font-khmer text-[11px]">
                    {lang === 'km' ? 'សូមអភ័យទោស (No)' : 'Regretfully Decline'}
                  </span>
                </label>
              </div>
            </div>

            {attending === 'yes' && (
              <>
                <div>
                  <label className="block text-xs font-khmer text-stone-700 dark:text-stone-300 mb-1">
                    {lang === 'km' ? 'ចំនួនអ្នកចូលរួម (Number of Guests)' : 'Number of Guests'}
                  </label>
                  <select
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="w-full text-xs rounded-lg border-stone-300 dark:border-stone-600 bg-white dark:bg-[#26322B] py-2 px-3 text-stone-800 dark:text-stone-100 focus:ring-1 focus:ring-[#295744] focus:outline-none"
                  >
                    <option value="1">១ នាក់ (1 Person)</option>
                    <option value="2">២ នាក់ (2 Persons)</option>
                    <option value="3">៣ នាក់ (3 Persons)</option>
                    <option value="4">៤ នាក់ ឬច្រើនជាង (4+ Persons)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-khmer text-stone-700 dark:text-stone-300 mb-1">
                    {lang === 'km' ? 'ចំណូលចិត្តម្ហូបអាហារ (Dietary)' : 'Dietary Requirements'}
                  </label>
                  <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setDiet('none')}
                      className={`p-1.5 rounded-lg border text-center transition-colors font-khmer ${
                        diet === 'none'
                          ? 'border-[#295744] bg-[#295744] text-white'
                          : 'border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800'
                      }`}
                    >
                      {lang === 'km' ? 'ទូទៅ' : 'Standard'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setDiet('vegetarian')}
                      className={`p-1.5 rounded-lg border text-center transition-colors font-khmer ${
                        diet === 'vegetarian'
                          ? 'border-[#295744] bg-[#295744] text-white'
                          : 'border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800'
                      }`}
                    >
                      {lang === 'km' ? 'បួស' : 'Vegetarian'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setDiet('halal')}
                      className={`p-1.5 rounded-lg border text-center transition-colors font-khmer ${
                        diet === 'halal'
                          ? 'border-[#295744] bg-[#295744] text-white'
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
              <label className="block text-xs font-khmer text-stone-700 dark:text-stone-300 mb-1">
                {lang === 'km' ? 'ពាក្យជូនពរដល់គូស្វាមីភរិយា (Blessing / Note)' : 'Blessing for the Couple'}
              </label>
              <textarea
                rows={2}
                value={blessing}
                onChange={(e) => setBlessing(e.target.value)}
                placeholder={lang === 'km' ? 'សូមជូនពរឱ្យមានសុភមង្គល...' : 'Wishing you endless joy...'}
                className="w-full text-xs rounded-lg border-stone-300 dark:border-stone-600 bg-white dark:bg-[#26322B] py-2 px-3 text-stone-800 dark:text-stone-100 focus:ring-1 focus:ring-[#295744] focus:outline-none"
              />
            </div>

            {/* Photo Attachment (ភ្ជាប់រូបភាពភ្ញៀវឆ្លើយតប) */}
            <div>
              <label className="block text-xs font-khmer text-stone-700 dark:text-stone-300 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px] text-[#295744] dark:text-[#C5A880]">add_a_photo</span>
                  <span>{lang === 'km' ? 'ភ្ជាប់រូបថត / ស៊ែលហ្វី' : 'Attach Photo or Selfie'}</span>
                </span>
                <span className="text-[10px] text-stone-400 font-normal">
                  {lang === 'km' ? '(ជាជម្រើស)' : '(Optional)'}
                </span>
              </label>

              {photoUrl ? (
                <div className="relative rounded-xl overflow-hidden border border-[#295744]/40 bg-stone-100 dark:bg-stone-800 p-2 flex items-center gap-2.5">
                  <img
                    src={photoUrl}
                    alt="Preview"
                    className="w-12 h-12 rounded-lg object-cover shadow-2xs border border-stone-200 dark:border-stone-700"
                  />
                  <div className="flex-1 text-[11px]">
                    <span className="font-khmer font-semibold text-stone-800 dark:text-stone-200 block">
                      {lang === 'km' ? '✓ បានភ្ជាប់រូបថត' : '✓ Photo Attached'}
                    </span>
                    <span className="text-[10px] text-stone-500 font-khmer block">
                      {lang === 'km' ? 'រក្សាទុកជាមួយការឆ្លើយតប' : 'Saved with your RSVP'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPhotoUrl('')}
                    className="w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-950/70 text-rose-600 flex items-center justify-center hover:bg-rose-200 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[14px]">close</span>
                  </button>
                </div>
              ) : (
                <label className="border border-dashed border-stone-300 dark:border-stone-600 hover:border-[#295744] dark:hover:border-[#C5A880] rounded-xl p-2.5 flex items-center justify-center gap-2 cursor-pointer bg-[#FCFBF7] dark:bg-[#1E2722] transition-colors group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                    disabled={isUploadingPhoto}
                  />
                  <span className="material-symbols-outlined text-[20px] text-[#295744] dark:text-[#C5A880] group-hover:scale-110 transition-transform">
                    {isUploadingPhoto ? 'hourglass_top' : 'add_photo_alternate'}
                  </span>
                  <span className="font-khmer text-xs text-stone-600 dark:text-stone-300">
                    {isUploadingPhoto
                      ? (lang === 'km' ? 'កំពុងបញ្ចូលរូបថត...' : 'Processing...')
                      : (lang === 'km' ? 'ជ្រើសរើស ឬថតរូបភាពរបស់អ្នក' : 'Tap to upload a photo')}
                  </span>
                </label>
              )}
            </div>

            <button
              type="submit"
              disabled={isUploadingPhoto}
              className="w-full mt-2 bg-[#295744] hover:bg-[#3C735B] text-white py-2.5 rounded-xl font-khmer font-semibold text-xs tracking-wider shadow hover:opacity-95 transition-opacity disabled:opacity-50 cursor-pointer"
            >
              {lang === 'km' ? 'ផ្ញើការឆ្លើយតប (Submit Confirmation)' : 'Submit Confirmation'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
