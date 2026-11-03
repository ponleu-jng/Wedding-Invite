/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Language, Screen, GalleryPhoto, GuestBlessing, RSVPRecord } from './types';
import { INITIAL_GALLERY_PHOTOS, INITIAL_BLESSINGS } from './data/mockData';
import { TopHeader } from './components/TopHeader';
import { BottomNav } from './components/BottomNav';
import { FallingPetals } from './components/FallingPetals';
import { MonogramSealModal } from './components/MonogramSealModal';
import { MapModal } from './components/MapModal';
import { RsvpModal } from './components/RsvpModal';
import { CeremonyDetailsModal } from './components/CeremonyDetailsModal';
import { GiftModal } from './components/GiftModal';
import { GuestMessageModal } from './components/GuestMessageModal';
import { HomeScreen } from './screens/HomeScreen';
import { GalleryScreen } from './screens/GalleryScreen';
import { StoryScreen } from './screens/StoryScreen';
import { RSVPScreen } from './screens/RSVPScreen';
import { saveRSVPToFirestore, sendWeddingMessage } from './lib/firebase';
import { postSheetRSVP, postSheetBlessing } from './utils/sheetdb';

export default function App() {
  // Language State: 'km' (Khmer) or 'en' (English)
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem('wedding_lang') as Language) || 'km';
  });

  // Current Screen: 'home' | 'story' | 'gallery' | 'rsvp'
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');

  // Dark Theme State
  const [isDark, setIsDark] = useState<boolean>(() => {
    return localStorage.getItem('wedding_theme') === 'dark';
  });

  // Audio Melody Playing State
  const [isPlayingMusic, setIsPlayingMusic] = useState<boolean>(false);

  // Ambient Flower Petals Shower State
  const [petalsEnabled, setPetalsEnabled] = useState<boolean>(true);

  // Modals
  const [isMonogramModalOpen, setIsMonogramModalOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [isRsvpModalOpen, setIsRsvpModalOpen] = useState(false);
  const [isCeremonyModalOpen, setIsCeremonyModalOpen] = useState(false);
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isMobilePreview, setIsMobilePreview] = useState(false);

  // Photos State
  const [photos, setPhotos] = useState<GalleryPhoto[]>(() => {
    const saved = localStorage.getItem('wedding_photos');
    return saved ? JSON.parse(saved) : INITIAL_GALLERY_PHOTOS;
  });

  // Blessings State (cleared old sample messages)
  const [blessings, setBlessings] = useState<GuestBlessing[]>(() => {
    try {
      localStorage.removeItem('wedding_blessings');
      const saved = localStorage.getItem('wedding_blessings_v2');
      if (saved) {
        const parsed: GuestBlessing[] = JSON.parse(saved);
        return parsed.filter((b) => !['b-1', 'b-2', 'b-3'].includes(b.id));
      }
    } catch {}
    return [];
  });

  // RSVP Submissions (cleared mock data, starts fresh)
  const [rsvpList, setRsvpList] = useState<RSVPRecord[]>(() => {
    try {
      localStorage.removeItem('wedding_rsvp_list');
      const saved = localStorage.getItem('wedding_rsvp_list_v2');
      if (saved) {
        const parsed: RSVPRecord[] = JSON.parse(saved);
        return parsed.filter((r) => !['rsvp-seed-1', 'rsvp-seed-2'].includes(r.id));
      }
    } catch {}
    return [];
  });

  // Sync Theme with HTML Document Class
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('wedding_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('wedding_theme', 'light');
    }
  }, [isDark]);

  // Sync Language
  useEffect(() => {
    localStorage.setItem('wedding_lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  // Sync Photos
  useEffect(() => {
    localStorage.setItem('wedding_photos', JSON.stringify(photos));
  }, [photos]);

  // Sync Blessings
  useEffect(() => {
    localStorage.setItem('wedding_blessings_v2', JSON.stringify(blessings));
  }, [blessings]);

  // Sync RSVP
  useEffect(() => {
    localStorage.setItem('wedding_rsvp_list_v2', JSON.stringify(rsvpList));
  }, [rsvpList]);

  const handleToggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const handleToggleMusic = () => {
    setIsPlayingMusic((prev) => {
      const next = !prev;
      const audioEl = document.getElementById('wedding-main-audio') as HTMLAudioElement | null;
      if (audioEl) {
        if (next) {
          audioEl.play().catch(() => {});
        } else {
          audioEl.pause();
        }
      }
      return next;
    });
  };

  const handlePlayMusic = () => {
    setIsPlayingMusic(true);
    const audioEl = document.getElementById('wedding-main-audio') as HTMLAudioElement | null;
    if (audioEl && audioEl.paused) {
      audioEl.play().catch(() => {});
    }
  };

  const handleTogglePetals = () => {
    setPetalsEnabled((prev) => !prev);
  };

  // Add new blessing
  const handleAddBlessing = (message: string, name?: string, photoUrl?: string) => {
    const newBlessing: GuestBlessing = {
      id: `blessing-${Date.now()}`,
      name: name?.trim() || (lang === 'km' ? 'ភ្ញៀវកិត្តិយស (Honored Guest)' : 'Honored Guest'),
      message,
      timestamp: lang === 'km' ? 'ទើបតែផ្ញើ' : 'Just now',
      likes: 1,
      isLiked: true,
      photoUrl
    };
    setBlessings((prev) => [newBlessing, ...prev]);

    // Live persistence to Firestore
    sendWeddingMessage({
      senderName: newBlessing.name,
      message: newBlessing.message,
      photoUrl: newBlessing.photoUrl
    }).catch((err) => console.warn('Firestore message sync note:', err));
  };

  // Like a blessing
  const handleToggleBlessingLike = (id: string) => {
    setBlessings((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const isLiked = !item.isLiked;
          return {
            ...item,
            isLiked,
            likes: isLiked ? item.likes + 1 : Math.max(0, item.likes - 1)
          };
        }
        return item;
      })
    );
  };

  // Like a gallery photo
  const handleTogglePhotoLike = (photoId: string) => {
    setPhotos((prev) =>
      prev.map((photo) => {
        if (photo.id === photoId) {
          const isLiked = !photo.isLiked;
          return {
            ...photo,
            isLiked,
            likes: isLiked ? photo.likes + 1 : Math.max(0, photo.likes - 1)
          };
        }
        return photo;
      })
    );
  };

  // Upload a photo
  const handleUploadPhoto = (newPhotoData: Partial<GalleryPhoto>) => {
    const newPhoto: GalleryPhoto = {
      id: `photo-${Date.now()}`,
      titleKm: newPhotoData.titleKm || 'រូបថតពីភ្ញៀវ',
      titleEn: newPhotoData.titleEn || 'Guest Photo',
      subtitleKm: newPhotoData.subtitleKm || 'ចែករំលែកដោយសេចក្តីរីករាយ',
      subtitleEn: newPhotoData.subtitleEn || 'Shared with love',
      category: 'guest',
      locationKm: newPhotoData.locationKm || 'គេហដ្ឋានខាងកូនក្រមុំ (ភូមិពាក់ស្នែងថ្មី)',
      locationEn: newPhotoData.locationEn || 'Bride Residence (Peaksneng Tmey)',
      imageUrl: newPhotoData.imageUrl || '',
      likes: 1,
      isLiked: true,
      badge: newPhotoData.badge || 'Guest Upload',
      uploadedBy: newPhotoData.uploadedBy
    };
    setPhotos((prev) => [newPhoto, ...prev]);
  };

  // Add RSVP submission
  const handleAddRSVP = (record: RSVPRecord) => {
    setRsvpList((prev) => [record, ...prev]);
    // Save to Firestore for permanent persistence
    saveRSVPToFirestore(record);

    // Save to SheetDB (Google Sheet) with dedicated phone column
    postSheetRSVP({
      name: record.name,
      phone: record.phone,
      attendance: record.attending,
      guestCount: record.guestCount,
      diet: record.diet,
      blessing: record.blessing,
      photoUrl: record.photoUrl
    }).catch((err) => console.warn('SheetDB RSVP sync notice:', err));

    // Also add to guest blessings so it appears on home wall
    if (record.blessing || record.photoUrl) {
      handleAddBlessing(
        record.blessing || (lang === 'km' ? 'សូមជូនពរឱ្យមានសុភមង្គល និងស្រឡាញ់គ្នាជារៀងរហូត!' : 'Wishing you eternal happiness and unconditional love!'),
        record.name,
        record.photoUrl
      );
    }
    // Also add to Gallery under 'guest' category so it is viewable across the whole app!
    if (record.photoUrl) {
      handleUploadPhoto({
        titleKm: `រូបថតពីភ្ញៀវ៖ ${record.name}`,
        titleEn: `Guest Photo: ${record.name}`,
        subtitleKm: record.blessing || 'ឆ្លើយតបការចូលរួម (RSVP Confirmation)',
        subtitleEn: record.blessing || 'Wedding RSVP Confirmation',
        category: 'guest',
        locationKm: 'គេហដ្ឋានខាងកូនក្រមុំ (ភូមិពាក់ស្នែងថ្មី)',
        locationEn: 'Bride Residence (Peaksneng Tmey)',
        imageUrl: record.photoUrl,
        uploadedBy: record.name,
        badge: 'Guest Reply'
      });
    }
  };

  // Add to Calendar Shortcut (.ics export + Google Calendar)
  const handleSaveToCalendar = () => {
    const title = 'Wedding of Hong & ReakSmey | ពិធីអាពាហ៍ពិពាហ៍';
    const description = 'We cordially invite you to celebrate our sacred wedding union at គេហដ្ឋានខាងកូនក្រមុំ (ភូមិពាក់ស្នែងថ្មី) Peaksneng Tmey Village Angkor Thom Distict Siemreap Province.';
    const location = 'គេហដ្ឋានខាងកូនក្រមុំ (ភូមិពាក់ស្នែងថ្មី), Peaksneng Tmey Village Angkor Thom Distict Siemreap Province';
    const startDate = '20301010T103000Z'; // 5:30 PM Phnom Penh (UTC+7)
    const endDate = '20301010T160000Z';

    // Google Calendar URL
    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      title
    )}&dates=${startDate}/${endDate}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(
      location
    )}`;

    // Generate iCal (.ics) file
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Hong & ReakSmey Wedding//KH',
      'BEGIN:VEVENT',
      `UID:wedding-hong-reaksmey-${Date.now()}@hongreaksmey2030.com`,
      `DTSTAMP:${startDate}`,
      `DTSTART:${startDate}`,
      `DTEND:${endDate}`,
      `SUMMARY:${title}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${location}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'Hong_ReakSmey_Wedding_2030.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Also open Google Calendar in new tab
    window.open(googleUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] dark:bg-[#161D19] py-2 px-2 sm:px-4 flex flex-col items-center justify-between transition-colors duration-300">
      {/* Falling Flower Petals Shower Effect */}
      <FallingPetals enabled={petalsEnabled} />

      {/* Main Responsive Frame: Fluid on desktop web, simulated frame in mobile preview */}
      <div
        className={`w-full flex flex-col items-center flex-1 relative transition-all duration-300 ${
          isMobilePreview
            ? 'max-w-[420px] shadow-2xl rounded-[44px] border-8 border-stone-800 dark:border-stone-700 p-2 sm:p-3 my-4 bg-[#FCFBF7] dark:bg-[#1E2722]'
            : 'max-w-[440px] md:max-w-5xl lg:max-w-6xl'
        }`}
      >
        {isMobilePreview && (
          <div className="w-28 h-4 bg-stone-800 rounded-full mb-2 flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-stone-900 border border-stone-700"></div>
          </div>
        )}

        {/* Top Control & Navigation Bar */}
        <TopHeader
          lang={lang}
          onLanguageChange={setLang}
          isDark={isDark}
          onToggleTheme={handleToggleTheme}
          isPlayingMusic={isPlayingMusic}
          onToggleMusic={handleToggleMusic}
          onOpenMonogram={() => setIsMonogramModalOpen(true)}
          onOpenGiftModal={() => setIsGiftModalOpen(true)}
          petalsEnabled={petalsEnabled}
          onTogglePetals={handleTogglePetals}
          currentScreen={currentScreen}
          onNavigate={setCurrentScreen}
          isMobilePreview={isMobilePreview}
          onToggleMobilePreview={() => setIsMobilePreview(!isMobilePreview)}
        />

        {/* Dynamic Screen View */}
        <div className="w-full flex-1 mb-2 pb-20 md:pb-4">
          {currentScreen === 'home' && (
            <HomeScreen
              lang={lang}
              onNavigate={setCurrentScreen}
              onOpenRsvpModal={() => setIsRsvpModalOpen(true)}
              onOpenMapModal={() => setIsMapModalOpen(true)}
              onOpenMonogramModal={() => setIsMonogramModalOpen(true)}
              onOpenCeremonyModal={() => setIsCeremonyModalOpen(true)}
              blessings={blessings}
              onAddBlessing={handleAddBlessing}
              onToggleBlessingLike={handleToggleBlessingLike}
              onSaveToCalendar={handleSaveToCalendar}
              onOpenGiftModal={() => setIsGiftModalOpen(true)}
              onOpenMessageModal={() => setIsMessageModalOpen(true)}
              onPlayMusic={handlePlayMusic}
              isMobilePreview={isMobilePreview}
            />
          )}

          {currentScreen === 'gallery' && (
            <GalleryScreen
              lang={lang}
              onNavigate={setCurrentScreen}
              photos={photos}
              onTogglePhotoLike={handleTogglePhotoLike}
              onUploadPhoto={handleUploadPhoto}
            />
          )}

          {currentScreen === 'story' && (
            <StoryScreen
              lang={lang}
              onNavigate={setCurrentScreen}
              onOpenRsvpModal={() => setIsRsvpModalOpen(true)}
              onOpenCeremonyModal={() => setIsCeremonyModalOpen(true)}
            />
          )}

          {currentScreen === 'rsvp' && (
            <RSVPScreen
              lang={lang}
              onNavigate={setCurrentScreen}
              rsvpList={rsvpList}
              onAddRSVP={handleAddRSVP}
            />
          )}
        </div>

        {/* Footer info matching designs */}
        <footer className="text-center py-3 pb-24 md:pb-3 text-[11px] text-stone-500 dark:text-stone-400 space-y-0.5">
          <p className="font-khmer font-medium">#HongReakSmeyWedding2030</p>
          <p className="text-[10px]">Siem Reap, Kingdom of Cambodia</p>
        </footer>

        {/* Bottom Navigation Bar: permanently fixed at bottom on mobile */}
        <div className={`w-full ${isMobilePreview ? 'block' : 'md:hidden'}`}>
          <BottomNav currentScreen={currentScreen} onNavigate={setCurrentScreen} lang={lang} />
        </div>
      </div>

      {/* Modals */}
      <MonogramSealModal
        isOpen={isMonogramModalOpen}
        onClose={() => setIsMonogramModalOpen(false)}
        lang={lang}
      />

      <MapModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        lang={lang}
      />

      <RsvpModal
        isOpen={isRsvpModalOpen}
        onClose={() => setIsRsvpModalOpen(false)}
        lang={lang}
        onRsvpSuccess={handleAddRSVP}
      />

      <CeremonyDetailsModal
        isOpen={isCeremonyModalOpen}
        onClose={() => setIsCeremonyModalOpen(false)}
        lang={lang}
        onOpenMap={() => setIsMapModalOpen(true)}
      />

      <GiftModal
        isOpen={isGiftModalOpen}
        onClose={() => setIsGiftModalOpen(false)}
        lang={lang}
      />

      <GuestMessageModal
        isOpen={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
        lang={lang}
      />
    </div>
  );
}
