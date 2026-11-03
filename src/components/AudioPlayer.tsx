import React, { useEffect, useRef, useState } from 'react';

interface AudioPlayerProps {
  isPlaying: boolean;
  onToggle: () => void;
  lang: 'km' | 'en';
}

const DEFAULT_SONG_URL = '/assets/aistudio/Stay_with_Me_V2_Phiti_x_All3gy_77e4a7a0.mp3';
const DEFAULT_SONG_NAME = 'Stay with Me V2 - Phiti x All3gy.mp3';

const DB_NAME = 'WeddingMainSongDB';
const STORE_NAME = 'mainSongStore';
const SONG_KEY = 'stay_with_me_v2_custom_audio';

// IndexedDB Helper to persist user's custom replacement MP3 if uploaded
const saveAudioToDB = (file: File): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = () => {
        req.result.createObjectStore(STORE_NAME);
      };
      req.onsuccess = () => {
        const db = req.result;
        const tx = db.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).put(file, SONG_KEY);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      };
      req.onerror = () => reject(req.error);
    } catch (e) {
      reject(e);
    }
  });
};

const getAudioFromDB = (): Promise<{ file: Blob; name: string } | null> => {
  return new Promise((resolve) => {
    try {
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = () => {
        req.result.createObjectStore(STORE_NAME);
      };
      req.onsuccess = () => {
        const db = req.result;
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const getReq = store.get(SONG_KEY);
        getReq.onsuccess = () => {
          if (getReq.result) {
            const blob = getReq.result as Blob;
            const name = (getReq.result as File).name || DEFAULT_SONG_NAME;
            resolve({ file: blob, name });
          } else {
            resolve(null);
          }
        };
        getReq.onerror = () => resolve(null);
      };
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
};

const deleteAudioFromDB = (): Promise<void> => {
  return new Promise((resolve) => {
    try {
      const req = indexedDB.open(DB_NAME, 1);
      req.onsuccess = () => {
        const db = req.result;
        const tx = db.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).delete(SONG_KEY);
        tx.oncomplete = () => resolve();
      };
      req.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
};

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ isPlaying, onToggle, lang }) => {
  const [customAudioUrl, setCustomAudioUrl] = useState<string | null>(null);
  const [customFileName, setCustomFileName] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.85);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(238); // ~03:58 full track

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const activeAudioUrl = customAudioUrl || DEFAULT_SONG_URL;
  const activeFileName = customFileName || DEFAULT_SONG_NAME;

  // Load any user-replaced audio from IndexedDB on initial mount
  useEffect(() => {
    getAudioFromDB().then((data) => {
      if (data) {
        const url = URL.createObjectURL(data.file);
        setCustomAudioUrl(url);
        setCustomFileName(data.name);
      }
    });
  }, []);

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Main playback engine for full MP3 song
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.volume = volume;
      audio.play().catch((err) => {
        console.warn('Audio playback notice:', err);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, activeAudioUrl]);

  // Upload custom vocal audio file if user wants to swap
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await saveAudioToDB(file);
      const url = URL.createObjectURL(file);

      if (audioRef.current) {
        audioRef.current.pause();
      }

      setCustomAudioUrl(url);
      setCustomFileName(file.name);

      if (!isPlaying) {
        onToggle();
      } else {
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.volume = volume;
            audioRef.current.play().catch(() => {});
          }
        }, 150);
      }
    } catch (err) {
      console.error('Error saving song to IndexedDB', err);
    }
  };

  // Reset back to built-in default song (Stay with Me V2 - Phiti x All3gy)
  const handleResetToDefaultAudio = async () => {
    await deleteAudioFromDB();
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setCustomAudioUrl(null);
    setCustomFileName(null);
    if (isPlaying) {
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.volume = volume;
          audioRef.current.play().catch(() => {});
        }
      }, 100);
    }
  };

  // Time formatting helper (e.g. 03:58)
  const formatTime = (secs: number) => {
    if (!secs || isNaN(secs) || !isFinite(secs)) return '00:00';
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      {/* HTML5 Audio Element for the entire built-in song */}
      <audio
        id="wedding-main-audio"
        ref={audioRef}
        src={activeAudioUrl}
        preload="auto"
        loop
        onTimeUpdate={() => {
          if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
            if (audioRef.current.duration && isFinite(audioRef.current.duration)) {
              setDuration(audioRef.current.duration);
            }
          }
        }}
        onLoadedMetadata={() => {
          if (audioRef.current && audioRef.current.duration && isFinite(audioRef.current.duration)) {
            setDuration(audioRef.current.duration);
          }
        }}
      />

      {/* Single Sleek Top Header Button */}
      <div className="flex items-center">
        <button
          onClick={onToggle}
          onDoubleClick={() => setIsModalOpen(true)}
          onContextMenu={(e) => {
            e.preventDefault();
            setIsModalOpen(true);
          }}
          aria-label={lang === 'km' ? 'ចាក់បទចម្រៀងមង្គលការ' : 'Toggle Wedding Song'}
          title={
            lang === 'km'
              ? 'បទចម្រៀង៖ Stay with Me V2 - Phiti x All3gy (ចុចដើម្បីចាក់/ផ្អាក ឬចុចពីរដងដើម្បីបើកឧបករណ៍ចាក់ចម្រៀង)'
              : 'Song: Stay with Me V2 - Phiti x All3gy (Click to play/pause, double-click for player)'
          }
          className={`w-7 h-7 rounded-full bg-white/90 dark:bg-[#1E2722]/90 backdrop-blur-md border border-stone-200/80 dark:border-stone-700/80 flex items-center justify-center text-[#295744] dark:text-[#C5A880] shadow-2xs hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer ${
            isPlaying ? 'ring-1.5 ring-[#295744] dark:ring-[#C5A880] shadow-xs' : ''
          }`}
        >
          {isPlaying ? (
            <div className="flex items-end gap-[1.5px] h-2.5 px-0.5">
              <span className="w-[2px] bg-[#295744] dark:bg-[#C5A880] rounded-full inline-block animate-soundwave-1"></span>
              <span className="w-[2px] bg-[#295744] dark:bg-[#C5A880] rounded-full inline-block animate-soundwave-2"></span>
              <span className="w-[2px] bg-[#295744] dark:bg-[#C5A880] rounded-full inline-block animate-soundwave-3"></span>
            </div>
          ) : (
            <span className="material-symbols-outlined text-[15px]">music_note</span>
          )}
        </button>
      </div>

      {/* Hidden file input for uploading an alternative MP3 if desired */}
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*,.mp3,.m4a,.wav,.ogg"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* Full Wedding Song Player Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="w-full max-w-sm sm:max-w-md bg-[#FCFBF7] dark:bg-[#1E2722] rounded-[32px] p-5 shadow-2xl border border-stone-200/80 dark:border-stone-700 max-h-[92vh] flex flex-col relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 w-7 h-7 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 pb-3 border-b border-stone-200/70 dark:border-stone-700">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#295744] to-[#3C735B] text-white flex items-center justify-center shadow-md shrink-0">
                <span className="material-symbols-outlined text-[20px]">music_note</span>
              </div>
              <div className="flex-1 pr-6">
                <span className="text-[10px] font-display uppercase tracking-widest text-[#C5A880] font-bold block">
                  Official Wedding Song
                </span>
                <h3 className="font-khmer font-bold text-sm sm:text-base text-stone-900 dark:text-stone-100 leading-tight">
                  {lang === 'km' ? 'បទចម្រៀងមង្គលការ' : 'Wedding Soundtrack'}
                </h3>
                <span className="text-[10px] text-stone-500 font-khmer">
                  Hong &amp; ReakSmey • 10 October 2030
                </span>
              </div>
            </div>

            {/* Song Card with Rotating Vinyl Artwork */}
            <div className="my-4 p-4 bg-white dark:bg-[#26322B] rounded-3xl border border-stone-200/70 dark:border-stone-700 shadow-xs flex flex-col items-center text-center relative overflow-hidden">
              {/* Rotating Vinyl Record */}
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 my-1 flex items-center justify-center">
                <div
                  className={`w-full h-full rounded-full bg-gradient-to-tr from-stone-900 via-stone-800 to-stone-950 p-2 shadow-lg border-2 border-stone-700 flex items-center justify-center ${
                    isPlaying ? 'animate-spin' : ''
                  }`}
                  style={{ animationDuration: '8s' }}
                >
                  {/* Vinyl grooves */}
                  <div className="w-full h-full rounded-full border border-stone-600/40 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#295744] to-[#C5A880] flex items-center justify-center p-1 text-white shadow-xs">
                      <span className="font-display font-bold text-[10px] text-center leading-none">
                        H&amp;R
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Title & Artist */}
              <div className="mt-2 space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-[#C5A880] tracking-wider block">
                  {lang === 'km' ? 'បទចម្រៀងចម្បង' : 'Main Wedding Track'}
                </span>
                <h4 className="font-khmer font-bold text-base sm:text-lg text-stone-900 dark:text-stone-100">
                  Stay with Me V2
                </h4>
                <p className="text-xs text-stone-500 font-khmer">
                  Phiti x All3gy • ជូនចំពោះ ហុង &amp; រស្មី
                </p>
              </div>

              {/* Audio Source Status Badge */}
              <div className="mt-2.5">
                <span className="inline-flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-khmer font-medium px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  <span className="material-symbols-outlined text-[13px]">check_circle</span>
                  <span className="truncate max-w-[230px]">{activeFileName}</span>
                </span>
              </div>

              {/* Interactive Scrubber Progress Bar */}
              <div className="w-full mt-4 space-y-1">
                <input
                  type="range"
                  min={0}
                  max={duration > 0 ? duration : 238}
                  step={0.5}
                  value={currentTime}
                  onChange={(e) => {
                    const newTime = parseFloat(e.target.value);
                    setCurrentTime(newTime);
                    if (audioRef.current) {
                      audioRef.current.currentTime = newTime;
                    }
                  }}
                  className="w-full h-1.5 bg-stone-200 dark:bg-stone-700 rounded-full appearance-none cursor-pointer accent-[#295744] dark:accent-[#C5A880]"
                />
                <div className="flex justify-between text-[10px] font-mono text-stone-400">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Main Player Control Buttons */}
              <div className="flex items-center justify-center gap-5 mt-2">
                <button
                  onClick={() => {
                    if (audioRef.current) {
                      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
                    }
                  }}
                  title="Rewind 10s"
                  className="w-8 h-8 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">replay_10</span>
                </button>

                <button
                  onClick={onToggle}
                  className="w-12 h-12 rounded-full bg-[#295744] hover:bg-[#3C735B] text-white flex items-center justify-center shadow-lg active:scale-95 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[28px]">
                    {isPlaying ? 'pause' : 'play_arrow'}
                  </span>
                </button>

                <button
                  onClick={() => {
                    if (audioRef.current) {
                      audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 10);
                    }
                  }}
                  title="Forward 10s"
                  className="w-8 h-8 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">forward_10</span>
                </button>
              </div>

              {/* Volume Slider */}
              <div className="w-full flex items-center gap-2 mt-3 pt-3 border-t border-stone-100 dark:border-stone-800">
                <span className="material-symbols-outlined text-[14px] text-stone-400">
                  {volume === 0 ? 'volume_off' : volume > 0.5 ? 'volume_up' : 'volume_down'}
                </span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-full h-1 bg-stone-200 dark:bg-stone-700 rounded-lg appearance-none cursor-pointer accent-[#295744]"
                />
                <span className="text-[9px] font-mono text-stone-400 w-7 text-right">
                  {Math.round(volume * 100)}%
                </span>
              </div>
            </div>

            {/* Bottom Actions: Select/Replace Audio File */}
            <div className="pt-3 mt-2 border-t border-stone-200/70 dark:border-stone-700 flex items-center gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 py-2.5 px-3 rounded-2xl bg-gradient-to-r from-[#295744] to-[#3C735B] hover:from-[#3C735B] hover:to-[#295744] text-white text-xs font-khmer font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.99] transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[17px]">swap_horiz</span>
                <span>
                  {lang === 'km' ? 'ប្តូរឯកសារចម្រៀង MP3 ផ្សេង' : 'Replace MP3 File'}
                </span>
              </button>

              {customAudioUrl && (
                <button
                  onClick={handleResetToDefaultAudio}
                  title={lang === 'km' ? 'ត្រឡប់ទៅបទដើមវិញ' : 'Reset to Default Song'}
                  className="w-10 h-10 rounded-2xl border border-stone-200 dark:border-stone-700 text-stone-400 hover:text-rose-600 hover:border-rose-300 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">restart_alt</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

