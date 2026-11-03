import React, { useState, useEffect } from 'react';
import { Language, Screen, GalleryPhoto } from '../types';
import { downloadPhoto } from '../utils/imageHelper';

interface GalleryScreenProps {
  lang: Language;
  onNavigate: (screen: Screen) => void;
  photos: GalleryPhoto[];
  onTogglePhotoLike: (photoId: string) => void;
  onUploadPhoto: (newPhoto: Partial<GalleryPhoto>) => void;
}

export const GalleryScreen: React.FC<GalleryScreenProps> = ({
  lang,
  onNavigate,
  photos,
  onTogglePhotoLike,
  onUploadPhoto
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [activeCategory, setActiveCategory] = useState<'all' | 'traditional' | 'botanical' | 'rings' | 'guest'>('all');
  const [selectedLightboxPhoto, setSelectedLightboxPhoto] = useState<GalleryPhoto | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [copiedHashtag, setCopiedHashtag] = useState(false);

  // Upload Form State
  const [guestUploaderName, setGuestUploaderName] = useState('');
  const [guestPhotoTitle, setGuestPhotoTitle] = useState('');
  const [guestImageUrl, setGuestImageUrl] = useState('');
  const [guestImageFilePreview, setGuestImageFilePreview] = useState<string | null>(null);

  // Auto Slideshow Interval
  useEffect(() => {
    if (!isAutoPlay || photos.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % photos.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isAutoPlay, photos.length]);

  const activeSlide = photos[currentSlideIndex] || photos[0];

  const handlePrevSlide = () => {
    setCurrentSlideIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % photos.length);
  };

  const filteredPhotos = photos.filter((p) => {
    if (activeCategory === 'all') return true;
    return p.category === activeCategory;
  });

  const handleCopyHashtag = () => {
    navigator.clipboard?.writeText('#HongReakSmey2030');
    setCopiedHashtag(true);
    setTimeout(() => setCopiedHashtag(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setGuestImageFilePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalUrl = guestImageFilePreview || guestImageUrl.trim();
    if (!finalUrl) return;

    onUploadPhoto({
      titleKm: guestPhotoTitle.trim() || 'រូបថតពីភ្ញៀវកិត្តិយស',
      titleEn: guestPhotoTitle.trim() || 'Guest Celebration Memory',
      subtitleKm: `ផ្ទុកឡើងដោយ ${guestUploaderName.trim() || 'មិត្តភក្តិ'}`,
      subtitleEn: `Shared by ${guestUploaderName.trim() || 'A Dear Friend'}`,
      category: 'guest',
      locationKm: 'សាលមង្គល Grand Lotus',
      locationEn: 'Grand Lotus Palace',
      imageUrl: finalUrl,
      likes: 1,
      isLiked: false,
      badge: 'Guest'
    });

    setGuestUploaderName('');
    setGuestPhotoTitle('');
    setGuestImageUrl('');
    setGuestImageFilePreview(null);
    setIsUploadModalOpen(false);
    setActiveCategory('guest');
  };

  const handleSharePhoto = (photo: GalleryPhoto) => {
    if (navigator.share) {
      navigator.share({
        title: `${photo.titleEn} | Hong & ReakSmey Wedding`,
        text: `${photo.subtitleEn} #HongReakSmey2030`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      alert(lang === 'km' ? 'តំណភ្ជាប់ត្រូវបានចម្លង!' : 'Photo link copied to clipboard!');
    }
  };

  return (
    <div className="w-full bg-[#FCFBF7] dark:bg-[#1E2722] rounded-3xl shadow-xl border border-stone-200/80 dark:border-stone-700/80 overflow-hidden transition-colors pb-10">
      
      {/* Top Navigation Header matching HTML 1 */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-[#FCFBF7]/90 dark:bg-[#1E2722]/90 backdrop-blur-md border-b border-[#ebe8e2] dark:border-stone-700">
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
            {lang === 'km' ? 'កម្រងរូបភាពស្នេហា • Gallery' : 'Wedding Gallery • Photo Story'}
          </h1>
        </div>

        <button
          onClick={() => setSelectedLightboxPhoto(activeSlide)}
          aria-label="Fullscreen view"
          className="flex size-9 items-center justify-center rounded-full hover:bg-stone-200/60 dark:hover:bg-stone-700 text-[#0d402e] dark:text-[#C5A880] transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">fullscreen</span>
        </button>
      </header>

      <main>
        {/* Hero Header Introduction & Botanical Motif */}
        <section className="relative pt-5 pb-2 px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-1.5 text-[#86513d] dark:text-[#C5A880]">
            <span className="material-symbols-outlined text-sm">spa</span>
            <span className="text-[11px] uppercase tracking-[0.2em] font-medium">
              Our Pre-Wedding Journey
            </span>
            <span className="material-symbols-outlined text-sm">spa</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0d402e] dark:text-[#67AA8E] leading-tight font-noto-khmer mb-1">
            រឿងរ៉ាវនៃសេចក្តីស្រឡាញ់
          </h2>
          <p className="text-xs text-stone-600 dark:text-stone-400 font-garamond italic">
            Every moment captured in eternity • Siem Reap &amp; Beyond
          </p>
        </section>

        {/* Interactive Arched Slideshow Hero Section */}
        <section className="px-4 py-2">
          <div className="relative bg-[#f6f3ed] dark:bg-[#16221B] rounded-3xl p-3 border border-stone-200/80 dark:border-stone-700 shadow-xs max-w-2xl mx-auto">
            {/* Arched Frame Slideshow Container */}
            <div className="relative w-full aspect-[4/5] sm:aspect-[16/11] md:aspect-[16/10] arch-frame overflow-hidden shadow-inner group bg-stone-300 dark:bg-stone-800">
              <img
                src={activeSlide?.imageUrl}
                alt={activeSlide?.titleEn}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Gradient Overlay for Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d402e]/95 via-[#0d402e]/25 to-transparent"></div>

              {/* Previous / Next Slide Arrows */}
              <button
                onClick={handlePrevSlide}
                aria-label="Previous Slide"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/85 dark:bg-stone-900/85 backdrop-blur-md border border-white/40 flex items-center justify-center text-[#0d402e] dark:text-[#C5A880] shadow-sm hover:scale-105 transition-all"
              >
                <span className="material-symbols-outlined text-[20px]">chevron_left</span>
              </button>
              <button
                onClick={handleNextSlide}
                aria-label="Next Slide"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/85 dark:bg-stone-900/85 backdrop-blur-md border border-white/40 flex items-center justify-center text-[#0d402e] dark:text-[#C5A880] shadow-sm hover:scale-105 transition-all"
              >
                <span className="material-symbols-outlined text-[20px]">chevron_right</span>
              </button>

              {/* Top Floating Badges: Slide counter & Auto Slideshow Indicator */}
              <div className="absolute top-4 inset-x-4 flex justify-between items-center">
                <button
                  onClick={() => setIsAutoPlay(!isAutoPlay)}
                  className="bg-white/90 dark:bg-stone-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-[11px] font-semibold text-[#0d402e] dark:text-[#C5A880] shadow-sm border border-stone-200/50 flex items-center gap-1.5 cursor-pointer"
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isAutoPlay ? 'bg-emerald-500 animate-pulse' : 'bg-stone-400'
                    }`}
                  ></span>
                  <span>
                    {currentSlideIndex + 1 < 10 ? `0${currentSlideIndex + 1}` : currentSlideIndex + 1} /{' '}
                    {photos.length < 10 ? `0${photos.length}` : photos.length} • {isAutoPlay ? 'Auto' : 'Paused'}
                  </span>
                </button>

                <button
                  onClick={() => onTogglePhotoLike(activeSlide.id)}
                  aria-label="Save Favorite"
                  className={`bg-white/90 dark:bg-stone-900/90 backdrop-blur-sm p-1.5 rounded-full shadow-sm border border-stone-200/50 transition-colors ${
                    activeSlide.isLiked ? 'text-rose-500' : 'text-stone-500 hover:text-rose-500'
                  }`}
                >
                  <span
                    className="material-symbols-outlined text-[18px]"
                    style={{ fontVariationSettings: activeSlide.isLiked ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    favorite
                  </span>
                </button>
              </div>

              {/* Bottom Slide Caption Details */}
              <div className="absolute bottom-4 inset-x-4 text-white">
                <p className="text-[11px] uppercase tracking-widest text-[#baeed3] dark:text-[#C5A880] flex items-center gap-1 mb-1 font-khmer">
                  <span className="material-symbols-outlined text-[13px]">location_on</span>
                  <span>{lang === 'km' ? activeSlide.locationKm : activeSlide.locationEn}</span>
                </p>
                <h3 className="text-base sm:text-lg font-bold text-white font-khmer leading-snug drop-shadow-sm">
                  {lang === 'km' ? activeSlide.titleKm : activeSlide.titleEn}
                </h3>
                <p className="text-xs text-stone-200 font-khmer mt-0.5 line-clamp-1 opacity-90">
                  {lang === 'km' ? activeSlide.subtitleKm : activeSlide.subtitleEn}
                </p>
              </div>
            </div>

            {/* Slide Controls Bar */}
            <div className="mt-3 px-2 flex items-center justify-between gap-2">
              {/* Slide Indicators */}
              <div className="flex items-center gap-1.5">
                {photos.slice(0, 6).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlideIndex(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === currentSlideIndex
                        ? 'w-6 bg-[#285844] dark:bg-[#C5A880]'
                        : 'w-2 bg-stone-300 dark:bg-stone-700'
                    }`}
                  />
                ))}
              </div>

              {/* Micro Controls (Love Count & Fullscreen trigger) */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onTogglePhotoLike(activeSlide.id)}
                  className="flex items-center gap-1 bg-[#FCFBF7] dark:bg-[#26322B] px-2.5 py-1 rounded-full border border-stone-200 dark:border-stone-700 text-[#86513d] dark:text-[#C5A880] text-xs font-semibold shadow-2xs hover:scale-105 transition-transform"
                >
                  <span
                    className="material-symbols-outlined text-[14px]"
                    style={{ fontVariationSettings: activeSlide.isLiked ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    favorite
                  </span>
                  <span>{activeSlide.likes}</span>
                </button>
                <button
                  onClick={() => setSelectedLightboxPhoto(activeSlide)}
                  className="flex items-center gap-1 bg-[#285844] hover:bg-[#0d402e] text-white px-3 py-1 rounded-lg text-xs font-medium transition-colors"
                >
                  <span className="material-symbols-outlined text-[14px]">fullscreen</span>
                  <span>{lang === 'km' ? 'ពង្រីក' : 'View'}</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Category Filter Pills matching HTML 1 */}
        <section className="mt-3 px-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
            <button
              onClick={() => setActiveCategory('all')}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-2xs font-khmer transition-all ${
                activeCategory === 'all'
                  ? 'bg-[#285844] text-white'
                  : 'bg-[#f0eee8] dark:bg-[#26322B] text-stone-700 dark:text-stone-300 hover:bg-stone-200'
              }`}
            >
              {lang === 'km' ? 'ទាំងអស់ (All)' : 'All'}
            </button>
            <button
              onClick={() => setActiveCategory('traditional')}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-2xs font-khmer transition-all ${
                activeCategory === 'traditional'
                  ? 'bg-[#285844] text-white'
                  : 'bg-[#f0eee8] dark:bg-[#26322B] text-stone-700 dark:text-stone-300 hover:bg-stone-200'
              }`}
            >
              {lang === 'km' ? 'ឈុតបុរាណ (Khmer Silk)' : 'Traditional Khmer'}
            </button>
            <button
              onClick={() => setActiveCategory('botanical')}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-2xs font-khmer transition-all ${
                activeCategory === 'botanical'
                  ? 'bg-[#285844] text-white'
                  : 'bg-[#f0eee8] dark:bg-[#26322B] text-stone-700 dark:text-stone-300 hover:bg-stone-200'
              }`}
            >
              {lang === 'km' ? 'សួនផ្កា (Botanical)' : 'Botanical Garden'}
            </button>
            <button
              onClick={() => setActiveCategory('rings')}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-2xs font-khmer transition-all ${
                activeCategory === 'rings'
                  ? 'bg-[#285844] text-white'
                  : 'bg-[#f0eee8] dark:bg-[#26322B] text-stone-700 dark:text-stone-300 hover:bg-stone-200'
              }`}
            >
              {lang === 'km' ? 'ចិញ្ចៀន (Rings & Candid)' : 'Candid & Rings'}
            </button>
            <button
              onClick={() => setActiveCategory('guest')}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-2xs font-khmer transition-all ${
                activeCategory === 'guest'
                  ? 'bg-[#285844] text-white'
                  : 'bg-[#f0eee8] dark:bg-[#26322B] text-stone-700 dark:text-stone-300 hover:bg-stone-200'
              }`}
            >
              {lang === 'km' ? 'រូបថតភ្ញៀវ (Guest Moments)' : 'Guest Photos'}
            </button>
          </div>
        </section>

        {/* Editorial Photo Grid matching HTML 1 */}
        <section className="px-4 mt-4">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <h3 className="text-base font-bold text-[#0d402e] dark:text-[#67AA8E] font-khmer">
                {lang === 'km' ? 'រូបថតអនុស្សាវរីយ៍' : 'Love Story Moments'}
              </h3>
              <p className="text-[11px] text-stone-500 font-khmer">
                {filteredPhotos.length} {lang === 'km' ? 'ផ្ទាំងរូបភាពដ៏មានអត្ថន័យ' : 'Curated Photographs'}
              </p>
            </div>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="text-xs text-[#86513d] dark:text-[#C5A880] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]">add_a_photo</span>
              <span>{lang === 'km' ? 'បន្ថែមរូប' : 'Add Photo'}</span>
            </button>
          </div>

          {/* Masonry Editorial Layout */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
            {filteredPhotos.map((photo, index) => {
              const isWide = photo.aspect === 'landscape' || index === 2;

              if (isWide) {
                return (
                  <div
                    key={photo.id}
                    className="col-span-2 group relative flex bg-white dark:bg-[#26322B] rounded-2xl overflow-hidden border border-stone-200/80 dark:border-stone-700 shadow-xs hover:shadow-md transition-all cursor-pointer"
                    onClick={() => setSelectedLightboxPhoto(photo)}
                  >
                    <div className="relative w-2/5 aspect-[4/3] shrink-0 overflow-hidden bg-stone-200 dark:bg-stone-800">
                      <img
                        src={photo.imageUrl}
                        alt={photo.titleEn}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-[#0d402e]/10"></div>
                    </div>
                    <div className="p-3 flex flex-col justify-between flex-1">
                      <div>
                        <div className="flex items-center gap-1.5 text-[#86513d] dark:text-[#C5A880] text-[10px] font-semibold uppercase tracking-wider mb-1 font-khmer">
                          <span className="material-symbols-outlined text-[13px]">crown</span>
                          <span>{photo.badge || 'Khmer Silk'}</span>
                        </div>
                        <h4 className="text-sm font-bold text-[#0d402e] dark:text-stone-100 font-khmer leading-snug">
                          {lang === 'km' ? photo.titleKm : photo.titleEn}
                        </h4>
                        <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 line-clamp-2 font-khmer">
                          {lang === 'km' ? photo.subtitleKm : photo.subtitleEn}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-100 dark:border-stone-700 text-[11px] text-[#86513d] dark:text-[#C5A880] font-semibold">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onTogglePhotoLike(photo.id);
                          }}
                          className="flex items-center gap-1 hover:scale-105 transition-transform"
                        >
                          <span
                            className="material-symbols-outlined text-[14px]"
                            style={{ fontVariationSettings: photo.isLiked ? "'FILL' 1" : "'FILL' 0" }}
                          >
                            favorite
                          </span>
                          <span>{photo.likes} Loves</span>
                        </button>
                        <span className="material-symbols-outlined text-[18px] text-[#0d402e] dark:text-[#C5A880]">
                          arrow_forward
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={photo.id}
                  className="group relative flex flex-col bg-white dark:bg-[#26322B] rounded-2xl overflow-hidden border border-stone-200/80 dark:border-stone-700 shadow-xs hover:shadow-md transition-all cursor-pointer"
                  onClick={() => setSelectedLightboxPhoto(photo)}
                >
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone-200 dark:bg-stone-800">
                    <img
                      src={photo.imageUrl}
                      alt={photo.titleEn}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onTogglePhotoLike(photo.id);
                      }}
                      className="absolute top-2 right-2 bg-white/80 dark:bg-stone-900/80 backdrop-blur-sm px-2 py-0.5 rounded-full text-[10px] text-[#86513d] dark:text-[#C5A880] font-medium flex items-center gap-0.5"
                    >
                      <span
                        className="material-symbols-outlined text-[12px]"
                        style={{ fontVariationSettings: photo.isLiked ? "'FILL' 1" : "'FILL' 0" }}
                      >
                        favorite
                      </span>
                      <span>{photo.likes}</span>
                    </button>
                  </div>
                  <div className="p-2.5 flex flex-col justify-between flex-1">
                    <div>
                      <p className="text-[11px] font-semibold text-[#0d402e] dark:text-stone-100 font-khmer line-clamp-1">
                        {lang === 'km' ? photo.titleKm : photo.titleEn}
                      </p>
                      <p className="text-[10px] text-stone-500 dark:text-stone-400 font-khmer line-clamp-1">
                        {lang === 'km' ? photo.subtitleKm : photo.subtitleEn}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-100 dark:border-stone-700 text-stone-400 text-[10px]">
                      <span className="font-khmer truncate max-w-[85px]">
                        {lang === 'km' ? photo.locationKm : photo.locationEn}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSharePhoto(photo);
                        }}
                        aria-label="Share photo"
                        className="material-symbols-outlined text-[16px] hover:text-[#0d402e] dark:hover:text-[#C5A880]"
                      >
                        share
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Guest Photo Contribution Section matching HTML 1 */}
        <section className="px-4 mt-6">
          <div className="relative overflow-hidden rounded-3xl bg-[#f0eee8] dark:bg-[#16221B] p-5 border border-[#285844]/20 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#baeed3] dark:bg-[#285844] flex items-center justify-center text-[#0d402e] dark:text-[#baeed3] mb-3 shadow-inner">
              <span className="material-symbols-outlined text-[24px]">add_a_photo</span>
            </div>
            <h3 className="text-base font-bold text-[#0d402e] dark:text-stone-100 font-khmer mb-1">
              {lang === 'km' ? 'ចែករំលែករូបភាពអនុស្សាវរីយ៍' : 'Share Your Wedding Memories'}
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 font-khmer max-w-xs mx-auto mb-3">
              {lang === 'km'
                ? 'សូមចែករំលែករូបថតដ៏ស្រស់ស្អាតដែលលោកអ្នកបានថតនៅក្នុងពិធីមង្គលការជាមួយពួកយើង!'
                : 'Share your favorite photos taken at our celebration with us and our families!'}
            </p>

            {/* Hashtag badge with copy functionality */}
            <button
              onClick={handleCopyHashtag}
              className="inline-flex items-center gap-2 bg-[#FCFBF7] dark:bg-[#26322B] px-3.5 py-1.5 rounded-full border border-stone-300 dark:border-stone-600 text-xs font-semibold text-[#86513d] dark:text-[#C5A880] mb-4 shadow-xs hover:scale-105 transition-transform"
            >
              <span className="material-symbols-outlined text-[14px]">tag</span>
              <span>#HongReakSmey2030</span>
              <span className="text-[10px] text-stone-400">
                {copiedHashtag ? (lang === 'km' ? 'បានចម្លង!' : 'Copied!') : (lang === 'km' ? 'ចម្លង' : 'Copy')}
              </span>
            </button>

            <div>
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="w-full py-2.5 px-4 bg-[#0d402e] hover:bg-[#285844] text-white rounded-xl font-khmer text-xs font-bold shadow hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">cloud_upload</span>
                <span>
                  {lang === 'km' ? 'ផ្ទុករូបថតរបស់អ្នកឡើង • Upload Photos' : 'Upload Your Celebration Photos'}
                </span>
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Lightbox Modal */}
      {selectedLightboxPhoto && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-between p-4">
          <div className="flex items-center justify-between text-white pt-2">
            <div className="font-khmer text-xs">
              <span className="font-bold">{lang === 'km' ? selectedLightboxPhoto.titleKm : selectedLightboxPhoto.titleEn}</span>
              <span className="opacity-75 block text-[10px]">{lang === 'km' ? selectedLightboxPhoto.locationKm : selectedLightboxPhoto.locationEn}</span>
            </div>
            <button
              onClick={() => setSelectedLightboxPhoto(null)}
              className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center my-4 overflow-hidden">
            <img
              src={selectedLightboxPhoto.imageUrl}
              alt={selectedLightboxPhoto.titleEn}
              referrerPolicy="no-referrer"
              className="max-h-[75vh] max-w-full object-contain rounded-xl shadow-2xl"
            />
          </div>

          <div className="flex items-center justify-between px-4 pb-2 text-white">
            <button
              onClick={() => onTogglePhotoLike(selectedLightboxPhoto.id)}
              className="flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-full text-xs font-medium hover:bg-white/30"
            >
              <span
                className="material-symbols-outlined text-[16px]"
                style={{ fontVariationSettings: selectedLightboxPhoto.isLiked ? "'FILL' 1" : "'FILL' 0" }}
              >
                favorite
              </span>
              <span>{selectedLightboxPhoto.likes} Loves</span>
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => downloadPhoto(selectedLightboxPhoto.imageUrl, `wedding-photo-${selectedLightboxPhoto.id}.jpg`)}
                className="flex items-center gap-1.5 bg-[#295744] hover:bg-[#346b53] px-3.5 py-1.5 rounded-full text-xs font-medium text-white transition-colors cursor-pointer"
                title={lang === 'km' ? 'ទាញយក និងរក្សាទុករូបភាព' : 'Save Photo'}
              >
                <span className="material-symbols-outlined text-[16px]">download</span>
                <span>{lang === 'km' ? 'រក្សាទុករូប' : 'Save'}</span>
              </button>
              <button
                onClick={() => handleSharePhoto(selectedLightboxPhoto)}
                className="flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-full text-xs font-medium hover:bg-white/30 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">share</span>
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Guest Photo Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-[#FCFBF7] dark:bg-[#1E2722] w-full max-w-md rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl border border-stone-200 dark:border-stone-700 animate-in fade-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-700">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0d402e] dark:text-[#C5A880] text-[22px]">
                  cloud_upload
                </span>
                <h3 className="font-khmer font-bold text-stone-900 dark:text-stone-100 text-sm">
                  {lang === 'km' ? 'ផ្ទុករូបថតអនុស្សាវរីយ៍' : 'Upload Wedding Photo'}
                </h3>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="w-7 h-7 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-500 hover:text-stone-800 dark:hover:text-stone-200"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-khmer text-stone-700 dark:text-stone-300 mb-1">
                  {lang === 'km' ? 'ឈ្មោះលោកអ្នក (Your Name) *' : 'Your Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={guestUploaderName}
                  onChange={(e) => setGuestUploaderName(e.target.value)}
                  placeholder={lang === 'km' ? 'ឧ. បុប្ផា និងមិត្តភក្តិ' : 'e.g. Bopha & Friends'}
                  className="w-full text-xs rounded-lg border-stone-300 dark:border-stone-600 bg-white dark:bg-[#26322B] py-2 px-3 text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-[#0d402e]"
                />
              </div>

              <div>
                <label className="block text-xs font-khmer text-stone-700 dark:text-stone-300 mb-1">
                  {lang === 'km' ? 'ចំណងជើងរូបថត (Photo Caption)' : 'Photo Caption'}
                </label>
                <input
                  type="text"
                  value={guestPhotoTitle}
                  onChange={(e) => setGuestPhotoTitle(e.target.value)}
                  placeholder={lang === 'km' ? 'ឧ. រូបថតកាត់នំដ៏ស្រស់ស្អាត' : 'e.g. Cutting the cake'}
                  className="w-full text-xs rounded-lg border-stone-300 dark:border-stone-600 bg-white dark:bg-[#26322B] py-2 px-3 text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-[#0d402e]"
                />
              </div>

              {/* Photo Input (Device upload or URL) */}
              <div>
                <label className="block text-xs font-khmer text-stone-700 dark:text-stone-300 mb-1">
                  {lang === 'km' ? 'ជ្រើសរើសរូបថត (Select Photo File)' : 'Select Photo from Device'}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full text-xs text-stone-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#baeed3] file:text-[#0d402e] hover:file:bg-[#9fd2b8] cursor-pointer"
                />
              </div>

              <div className="text-center text-xs text-stone-400 font-khmer">
                {lang === 'km' ? '— ឬ ដាក់តំណភ្ជាប់ URL រូបថត —' : '— or paste image web link —'}
              </div>

              <div>
                <input
                  type="url"
                  value={guestImageUrl}
                  onChange={(e) => setGuestImageUrl(e.target.value)}
                  placeholder="https://example.com/my-photo.jpg"
                  className="w-full text-xs rounded-lg border-stone-300 dark:border-stone-600 bg-white dark:bg-[#26322B] py-2 px-3 text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-[#0d402e]"
                />
              </div>

              {/* Preview */}
              {(guestImageFilePreview || guestImageUrl) && (
                <div className="relative aspect-video rounded-xl overflow-hidden bg-stone-200 border border-stone-300">
                  <img
                    src={guestImageFilePreview || guestImageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!guestImageFilePreview && !guestImageUrl.trim()}
                  className="w-full py-2.5 bg-[#0d402e] disabled:opacity-50 text-white rounded-xl font-khmer text-xs font-bold shadow hover:bg-[#285844] transition-colors"
                >
                  {lang === 'km' ? 'យល់ព្រមផ្ទុកឡើង • Confirm Upload' : 'Upload to Gallery'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
