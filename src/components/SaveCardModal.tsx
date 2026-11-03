import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { captureAndDownloadCard } from '../utils/cardSaver';

interface SaveCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const SaveCardModal: React.FC<SaveCardModalProps> = ({ isOpen, onClose, lang }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [cardImageUrl, setCardImageUrl] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      handleGenerate();
    } else {
      setDownloadSuccess(false);
    }
  }, [isOpen]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setDownloadSuccess(false);
    try {
      const dataUrl = await captureAndDownloadCard('wedding-invitation-card', 'Hong_ReakSmey_Wedding_Card.png');
      if (dataUrl) {
        setCardImageUrl(dataUrl);
        setDownloadSuccess(true);
      }
    } catch (e) {
      console.warn('Card generation error:', e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadAgain = () => {
    if (!cardImageUrl) {
      handleGenerate();
      return;
    }
    const link = document.createElement('a');
    link.download = 'Hong_ReakSmey_Wedding_Card.png';
    link.href = cardImageUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloadSuccess(true);
  };

  const handleNativeShare = async () => {
    if (!cardImageUrl) return;
    try {
      // Convert dataUrl to blob
      const res = await fetch(cardImageUrl);
      const blob = await res.blob();
      const file = new File([blob], 'Hong_ReakSmey_Wedding_Card.png', { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Hong & ReakSmey Wedding Invitation Card',
          text: 'ពិធីអាពាហ៍ពិពាហ៍ ហុង & រស្មី • 10 October 2030'
        });
      } else if (navigator.share) {
        await navigator.share({
          title: 'Hong & ReakSmey Wedding Invitation Card',
          text: 'ពិធីអាពាហ៍ពិពាហ៍ ហុង & រស្មី • 10 October 2030',
          url: window.location.href
        });
      } else {
        handleDownloadAgain();
      }
    } catch (err) {
      console.warn('Share error:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-[#FCFBF7] dark:bg-[#1E2722] w-full max-w-md rounded-3xl p-5 sm:p-6 shadow-2xl border border-stone-200 dark:border-stone-700 animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-700">
          <div className="flex items-center space-x-2">
            <span className="material-symbols-outlined text-[#295744] dark:text-[#C5A880] text-[22px]">
              save_alt
            </span>
            <h3 className="font-khmer font-bold text-stone-900 dark:text-stone-100 text-sm">
              {lang === 'km' ? 'រក្សាទុកកាតអញ្ជើញ (Save Card)' : 'Save Wedding Invitation Card'}
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-7 h-7 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>

        {/* Status notification */}
        {downloadSuccess && (
          <div className="mt-3 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2 text-xs font-khmer text-[#295744] dark:text-emerald-300 animate-in fade-in">
            <span className="material-symbols-outlined text-[18px] text-emerald-600 dark:text-emerald-400">
              check_circle
            </span>
            <span className="font-semibold">
              {lang === 'km'
                ? '✓ បានទាញយករូបភាពកាតចូលក្នុងឧបករណ៍របស់អ្នករួចរាល់!'
                : '✓ Wedding card downloaded to your device successfully!'}
            </span>
          </div>
        )}

        {/* Card Preview Container */}
        <div className="mt-3 relative rounded-2xl overflow-hidden border border-[#C5A880]/40 bg-[#F7F5F0] dark:bg-[#161D19] p-2 flex flex-col items-center justify-center min-h-[220px]">
          {isGenerating ? (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
              <span className="material-symbols-outlined text-[32px] text-[#295744] dark:text-[#C5A880] animate-spin">
                progress_activity
              </span>
              <span className="font-khmer text-xs text-stone-600 dark:text-stone-300 font-medium">
                {lang === 'km' ? 'កំពុងបង្កើតរូបភាពកាតកម្រិតខ្ពស់ HD...' : 'Generating high-definition card image...'}
              </span>
            </div>
          ) : cardImageUrl ? (
            <div className="w-full space-y-2">
              <img
                src={cardImageUrl}
                alt="Hong & ReakSmey Wedding Card"
                className="w-full max-h-[380px] object-contain rounded-xl shadow-md border border-stone-200/80 dark:border-stone-700"
              />
              <p className="text-[10px] text-center text-stone-500 dark:text-stone-400 font-khmer">
                {lang === 'km'
                  ? '💡 លើទូរស័ព្ទ៖ អ្នកអាចចុចសង្កត់លើរូបភាពខាងលើ (Long-press) ដើម្បីជ្រើស "Save to Photos"'
                  : '💡 On mobile: You can also tap and hold (long-press) the image above to save directly to photos'}
              </p>
            </div>
          ) : (
            <div className="text-center py-6 text-stone-500 text-xs font-khmer">
              {lang === 'km' ? 'មិនអាចបង្កើតរូបភាពបានទេ សូមព្យាយាមម្តងទៀត' : 'Could not generate card preview'}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            onClick={handleDownloadAgain}
            disabled={isGenerating}
            className="w-full py-2.5 px-3 rounded-xl bg-[#295744] hover:bg-[#3C735B] text-white text-xs font-khmer font-bold flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[17px]">download</span>
            <span>{lang === 'km' ? 'ទាញយកម្តងទៀត' : 'Download PNG'}</span>
          </button>

          <button
            onClick={handleNativeShare}
            disabled={isGenerating || !cardImageUrl}
            className="w-full py-2.5 px-3 rounded-xl bg-white dark:bg-[#26322B] hover:bg-stone-50 dark:hover:bg-[#1E2722] border border-[#295744]/40 dark:border-[#C5A880]/50 text-[#295744] dark:text-[#C5A880] text-xs font-khmer font-bold flex items-center justify-center gap-1.5 shadow-2xs active:scale-95 transition-all cursor-pointer disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[17px]">share</span>
            <span>{lang === 'km' ? 'ចែករំលែក (Share)' : 'Share Card'}</span>
          </button>
        </div>

        <div className="mt-3 pt-3 border-t border-stone-200 dark:border-stone-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 text-xs font-khmer transition-colors cursor-pointer"
          >
            {lang === 'km' ? 'រួចរាល់' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
};
