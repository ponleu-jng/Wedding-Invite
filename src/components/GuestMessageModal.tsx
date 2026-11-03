import React, { useState, useEffect, useRef } from 'react';
import { Language } from '../types';
import {
  auth,
  signInWithGoogle,
  logoutUser,
  subscribeToAuth,
  sendWeddingMessage,
  subscribeToMessages,
  WeddingMessage
} from '../lib/firebase';
import { User as FirebaseUser } from 'firebase/auth';
import { compressImage } from '../utils/imageHelper';
import { GuestPhotoModal } from './GuestPhotoModal';

interface GuestMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const GuestMessageModal: React.FC<GuestMessageModalProps> = ({
  isOpen,
  onClose,
  lang
}) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [messages, setMessages] = useState<WeddingMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [senderName, setSenderName] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<{ url: string; name: string; message?: string } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Subscribe to auth state
  useEffect(() => {
    const unsubscribe = subscribeToAuth((user) => {
      setCurrentUser(user);
      if (user?.displayName && !senderName) {
        setSenderName(user.displayName);
      }
    });
    return () => unsubscribe();
  }, []);

  // Subscribe to real-time messages from Firestore
  useEffect(() => {
    if (!isOpen) return;
    const unsubscribe = subscribeToMessages((msgs) => {
      setMessages(msgs);
    });
    return () => unsubscribe();
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploadingPhoto(true);
      const compressed = await compressImage(file, 900, 900, 0.75);
      setPhotoUrl(compressed);
    } catch (err) {
      console.error('Failed to compress message photo:', err);
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    try {
      setIsSending(true);
      const name = senderName.trim() || currentUser?.displayName || (lang === 'km' ? 'ភ្ញៀវកិត្តិយស' : 'Honored Guest');
      await sendWeddingMessage({
        senderName: name,
        senderPhoto: currentUser?.photoURL || undefined,
        message: inputText.trim(),
        photoUrl: photoUrl.trim() || undefined,
        userId: currentUser?.uid || 'guest-anon'
      });

      setInputText('');
      setPhotoUrl('');
      // Scroll to top/bottom
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
      <div className="w-full max-w-lg bg-[#FCFBF7] dark:bg-[#1E2722] rounded-t-3xl sm:rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-700 flex flex-col h-[88vh] sm:h-[82vh] overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 bg-[#16201B] text-stone-100 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#295744] to-[#C5A880] flex items-center justify-center text-white shadow-xs">
              <span className="material-symbols-outlined text-[20px]">chat</span>
            </div>
            <div>
              <h3 className="font-khmer font-bold text-xs sm:text-sm text-stone-100 flex items-center gap-1.5">
                <span>{lang === 'km' ? 'ផ្ញើសារជូនពរដល់គូស្វាមីភរិយា' : 'Live Guestbook & Messages'}</span>
                <span className="size-2 rounded-full bg-emerald-400 animate-pulse" title="Live sync" />
              </h3>
              <p className="text-[10px] text-stone-400 font-khmer">
                {lang === 'km' ? 'សាររបស់លោកអ្នកនឹងផ្ញើជូន ហុង & រស្មី ផ្ទាល់' : 'Real-time messages sent to Hong & ReakSmey'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-800 text-stone-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Auth Banner: Google Sign-in */}
        <div className="px-4 py-2 bg-stone-100 dark:bg-[#26322B] border-b border-stone-200 dark:border-stone-700 flex items-center justify-between text-xs">
          {currentUser ? (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || ''}
                    className="w-7 h-7 rounded-full border border-stone-300 dark:border-stone-600 object-cover"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-[#295744] text-white flex items-center justify-center text-[11px] font-bold">
                    {(currentUser.displayName || 'G')[0]}
                  </div>
                )}
                <div>
                  <span className="font-khmer font-semibold text-stone-800 dark:text-stone-200 block text-xs">
                    {currentUser.displayName || currentUser.email}
                  </span>
                  <span className="text-[9px] text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[11px]">verified</span>
                    {lang === 'km' ? 'បានភ្ជាប់គណនី Google' : 'Google Verified'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => logoutUser()}
                className="text-[10px] text-stone-500 hover:text-rose-500 font-khmer cursor-pointer hover:underline"
              >
                {lang === 'km' ? 'ចាកចេញ' : 'Sign out'}
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full">
              <span className="text-[11px] font-khmer text-stone-600 dark:text-stone-300">
                {lang === 'km' ? 'ចូលគណនីដើម្បីបង្ហាញឈ្មោះ និងរូបតំណាង៖' : 'Sign in to show your name & avatar:'}
              </span>
              <button
                type="button"
                onClick={() => signInWithGoogle()}
                className="py-1 px-3 bg-white dark:bg-stone-800 hover:bg-stone-50 border border-stone-300 dark:border-stone-600 rounded-full font-khmer text-[11px] font-semibold text-stone-700 dark:text-stone-200 flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.665-5.17 3.665-9.12z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.13C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.13z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.13c.95-2.83 3.6-4.96 6.72-4.96z"
                  />
                </svg>
                <span>Google Sign-in</span>
              </button>
            </div>
          )}
        </div>

        {/* Real-time Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
          {messages.length > 0 ? (
            messages.map((msg) => (
              <div
                key={msg.id}
                className="p-3 bg-white dark:bg-[#26322B] rounded-2xl border border-stone-200/80 dark:border-stone-700 shadow-2xs space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    {msg.senderPhoto ? (
                      <img
                        src={msg.senderPhoto}
                        alt={msg.senderName}
                        className="w-7 h-7 rounded-full object-cover border border-stone-200 dark:border-stone-600"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-[#295744]/15 dark:bg-[#C5A880]/20 text-[#295744] dark:text-[#C5A880] flex items-center justify-center font-bold text-xs">
                        {msg.senderName[0] || 'G'}
                      </div>
                    )}
                    <div>
                      <span className="font-khmer font-bold text-stone-900 dark:text-stone-100 block">
                        {msg.senderName}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] text-stone-400 font-mono">
                    {msg.createdAt}
                  </span>
                </div>

                <p className="text-xs text-stone-700 dark:text-stone-300 font-khmer leading-relaxed pl-9">
                  {msg.message}
                </p>

                {/* Attached Photo */}
                {msg.photoUrl && (
                  <div className="pl-9 pt-1">
                    <img
                      src={msg.photoUrl}
                      alt="Guest attachment"
                      onClick={() =>
                        setSelectedPhoto({
                          url: msg.photoUrl!,
                          name: msg.senderName,
                          message: msg.message
                        })
                      }
                      className="max-h-48 max-w-[240px] rounded-xl object-cover cursor-pointer hover:opacity-90 shadow-2xs border border-stone-200 dark:border-stone-700 transition-opacity"
                    />
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-400 space-y-2">
              <span className="material-symbols-outlined text-[36px] text-stone-300 dark:text-stone-600">
                mark_chat_unread
              </span>
              <p className="font-khmer font-semibold text-xs text-stone-600 dark:text-stone-300">
                {lang === 'km' ? 'មិនទាន់មានសារនៅឡើយទេ' : 'No messages yet'}
              </p>
              <p className="text-[11px] font-khmer max-w-[260px]">
                {lang === 'km'
                  ? 'សូមក្លាយជាអ្នកដំបូងដែលផ្ញើសារជូនពរដល់កូនកំលោះ និងកូនក្រមុំ!'
                  : 'Be the first to send your blessings to Hong & ReakSmey!'}
              </p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form at Bottom */}
        <div className="p-3 bg-white dark:bg-[#16201B] border-t border-stone-200 dark:border-stone-700 space-y-2">
          {/* Sender Name if not authenticated */}
          {!currentUser && (
            <input
              type="text"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder={lang === 'km' ? 'ឈ្មោះលោកអ្នក (Your Name)' : 'Your Name'}
              className="w-full text-xs rounded-xl border border-stone-300 dark:border-stone-600 bg-[#FCFBF7] dark:bg-[#1E2722] py-2 px-3 text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-[#295744]"
            />
          )}

          {/* Photo Preview if attached */}
          {photoUrl && (
            <div className="flex items-center gap-2 p-1.5 bg-stone-100 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700">
              <img
                src={photoUrl}
                alt="Preview"
                className="w-10 h-10 rounded-lg object-cover border border-stone-300 dark:border-stone-600"
              />
              <span className="text-[10px] font-khmer text-stone-600 dark:text-stone-300 flex-1">
                {lang === 'km' ? '✓ បានភ្ជាប់រូបភាពរួចរាល់' : '✓ Photo attached'}
              </span>
              <button
                type="button"
                onClick={() => setPhotoUrl('')}
                className="w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-950/70 text-rose-600 flex items-center justify-center hover:bg-rose-200"
              >
                <span className="material-symbols-outlined text-[13px]">close</span>
              </button>
            </div>
          )}

          <form onSubmit={handleSendMessage} className="flex items-center gap-1.5">
            {/* Attach Photo Button */}
            <label
              title={lang === 'km' ? 'ភ្ជាប់រូបភាព / ស៊ែលហ្វី' : 'Attach photo'}
              className="p-2 text-stone-500 hover:text-[#295744] dark:hover:text-[#C5A880] rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer shrink-0"
            >
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
                disabled={isUploadingPhoto || isSending}
              />
              <span className="material-symbols-outlined text-[20px]">
                {isUploadingPhoto ? 'hourglass_top' : 'add_photo_alternate'}
              </span>
            </label>

            {/* Text Input */}
            <input
              type="text"
              required
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={lang === 'km' ? 'សរសេរសារជូនពររបស់អ្នកនៅទីនេះ...' : 'Write your blessing message here...'}
              disabled={isSending}
              className="flex-1 text-xs rounded-xl border border-stone-300 dark:border-stone-600 bg-[#FCFBF7] dark:bg-[#1E2722] py-2.5 px-3 text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-[#295744]"
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={isSending || !inputText.trim()}
              className="p-2.5 bg-[#295744] hover:bg-[#397259] text-white rounded-xl flex items-center justify-center transition-all disabled:opacity-50 cursor-pointer shadow-xs"
              title={lang === 'km' ? 'ផ្ញើសារ' : 'Send'}
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
            </button>
          </form>
        </div>
      </div>

      {/* Lightbox for message photos */}
      {selectedPhoto && (
        <GuestPhotoModal
          isOpen={Boolean(selectedPhoto)}
          onClose={() => setSelectedPhoto(null)}
          photoUrl={selectedPhoto.url}
          guestName={selectedPhoto.name}
          blessing={selectedPhoto.message}
          lang={lang}
        />
      )}
    </div>
  );
};
