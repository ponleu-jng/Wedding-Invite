import React, { useState } from 'react';
import { Language } from '../types';

interface CeremonyDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onOpenMap: () => void;
}

export const CeremonyDetailsModal: React.FC<CeremonyDetailsModalProps> = ({
  isOpen,
  onClose,
  lang,
  onOpenMap,
}) => {
  const [activeTab, setActiveTab] = useState<'family' | 'rituals' | 'venues' | 'etiquette'>('family');

  if (!isOpen) return null;

  const rituals = [
    {
      step: '01',
      time: '07:00 AM',
      nameKm: 'ពិធីហែកំណត់ (Hai Goan Gomlaw)',
      nameEn: 'Groom Procession & Fruit Offerings',
      descKm: 'ក្បួនកូនកំលោះ និងញាតិមិត្តហែផ្លែឈើ នំចំណីបុរាណ ជំនូនមាសប្រាក់មកកាន់គេហដ្ឋានកូនក្រមុំ។ ផ្លែឈើជាគូៗតំណាងឱ្យភាពសម្បូរសប្បាយ និងការគោរពដល់គ្រួសារខាងស្រី។',
      descEn: 'The groom, families, and friends parade holding pairs of decorated fruits, traditional cakes, and offerings symbolizing abundance and deep respect.',
      icon: 'local_florist',
      badge: 'Morning Tradition'
    },
    {
      step: '02',
      time: '08:30 AM',
      nameKm: 'ពិធីសែនដូនតា & សូត្រមន្ត',
      nameEn: 'Ancestral Homage & Monk Chants',
      descKm: 'អុជធូបសែនដូនតាដើម្បីសុំការអនុញ្ញាត និងប្រសិទ្ធិពរ។ បន្ទាប់មក ព្រះសង្ឃចម្រើនព្រះបរិត្ត ប្រោះព្រំទឹកមន្តសិរីសួស្តីដល់គូស្វាមីភរិយាថ្មី។',
      descEn: 'Lighting incense to honor departed ancestors, followed by venerable Buddhist monks chanting Pali stanzas and sprinkling blessed lustral water.',
      icon: 'self_improvement',
      badge: 'Spiritual Blessing'
    },
    {
      step: '03',
      time: '10:00 AM',
      nameKm: 'ពិធីកាត់សក់បង្កក់សិរី (Gaat Sahk)',
      nameEn: 'Ceremonial Hair Cutting & Cleansing',
      descKm: 'ពិធីកាត់សក់ជានិមិត្តរូបដើម្បីកម្ចាត់ភាពសៅហ្មងពីអតីតកាល។ មាតាបិតា និងចាស់ទុំប្រោះទឹកអប់ កាត់សក់ជានិមិត្តរូប និងជូនពរឱ្យមានសុខភាពល្អ និងសុភមង្គល។',
      descEn: 'A symbolic cleansing ritual where parents and honored elders lightly snip locks of hair and spray fragrant perfume to purify the couple for a harmonious future.',
      icon: 'content_cut',
      badge: 'Purification'
    },
    {
      step: '04',
      time: '11:00 AM',
      nameKm: 'ពិធីបង្វិលពពិល (Bangvel Popil)',
      nameEn: 'Passing of the Sacred Candles',
      descKm: 'គូស្វាមីភរិយាអង្គុយទន្ទឹមគ្នា។ គូស្វាមីភរិយាចាស់ទុំដែលរៀបការហើយបង្វិលទៀនពពិលចំនួន ៣ ជុំវិញគូថ្មីចំនួន ៧ ឬ ៩ ជុំ បង្កើតជាបរិយាកាសពិសិដ្ឋ។',
      descEn: 'Happily married elder couples circulate 3 sacred beeswax candles 7 to 9 times clockwise around the couple, imparting harmony and long-lasting devotion.',
      icon: 'flare',
      badge: 'Sacred Ritual'
    },
    {
      step: '05',
      time: '11:30 AM',
      nameKm: 'ពិធីចងដៃសំពះផ្ទឹម (Sompeas Ptem)',
      nameEn: 'Sacred Knot Tying & Sword Blessing',
      descKm: 'ពិធីដ៏ពិសិដ្ឋបំផុត! កូនកំលោះ និងកូនក្រមុំកាន់ដាវជ័យមាស។ មាតាបិតា និងភ្ញៀវកិត្តិយសទាំងអស់ឡើងចងខ្សែអំបោះក្រហមលើកដៃ និងប្រសិទ្ធិពរជ័យ។',
      descEn: 'The defining ceremony: the couple holds the sacred ancient gold sword while loved ones tie blessing red and white cotton threads onto their wrists.',
      icon: 'favorite',
      badge: 'Core Vows'
    },
    {
      step: '06',
      time: '12:00 PM',
      nameKm: 'ពិធីព្រួសផ្កាស្លា (Prouh Pka Sla)',
      nameEn: 'Shower of Fragrant Areca Blossoms',
      descKm: 'ភ្ញៀវកិត្តិយសព្រួសផ្កាស្លាពណ៌សក្រអូបលើគូស្វាមីភរិយា តំណាងឱ្យភាពបរិសុទ្ធ ភាពមានកូនពូនជាចៅ និងសេចក្តីសុខក្សេមក្សាន្ត។',
      descEn: 'Guests shower the smiling couple with fragrant white areca palm blossoms, representing fertile new beginnings, peace, and eternal joy.',
      icon: 'spa',
      badge: 'Celebration'
    },
    {
      step: '07',
      time: '06:30 PM',
      nameKm: 'ពិធីពិសាភោជនាហារពេលល្ងាច (Grand Banquet)',
      nameEn: 'Grand Banquet Dinner & Celebration',
      descKm: 'ពិធីជប់លៀងដ៏ធំអធិកអធមនៅគេហដ្ឋានខាងកូនក្រមុំ (ភូមិពាក់ស្នែងថ្មី) ជាមួយម្ហូបខ្មែរឆ្ងាញ់ពិសា ៧មុខ ការកាត់នំខួបស្នេហា លើកកែវស្រាជូនពរ និងតន្ត្រីរាំកម្សាន្ត។',
      descEn: 'An opulent evening reception featuring a gourmet 7-course feast, champagne toast, cake cutting ceremony, live acoustic performance, and dancing.',
      icon: 'dinner_dining',
      badge: 'Evening Feast'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-[#FCFBF7] dark:bg-[#1E2722] w-full max-w-md rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl border border-stone-200 dark:border-stone-700 animate-in fade-in slide-in-from-bottom duration-300 max-h-[92vh] overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-700">
          <div className="flex items-center space-x-2">
            <span className="material-symbols-outlined text-[#295744] dark:text-[#C5A880] text-[22px]">
              temple_buddhist
            </span>
            <div>
              <h3 className="font-khmer font-bold text-stone-900 dark:text-stone-100 text-sm">
                {lang === 'km' ? 'ព័ត៌មានលម្អិតនៃពិធីមង្គលការ' : 'Ceremony Details & Sacred Rituals'}
              </h3>
              <p className="text-[10px] text-stone-500 dark:text-stone-400">
                Hong &amp; ReakSmey • 10 October 2030
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Tab Pills */}
        <div className="flex p-1 bg-stone-200/70 dark:bg-stone-800 rounded-xl my-3 text-[11px] font-semibold font-khmer">
          <button
            onClick={() => setActiveTab('family')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              activeTab === 'family'
                ? 'bg-white dark:bg-[#26322B] text-[#295744] dark:text-[#C5A880] shadow-2xs font-bold'
                : 'text-stone-600 dark:text-stone-400'
            }`}
          >
            {lang === 'km' ? 'មាតាបិតា' : 'Families'}
          </button>
          <button
            onClick={() => setActiveTab('rituals')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              activeTab === 'rituals'
                ? 'bg-white dark:bg-[#26322B] text-[#295744] dark:text-[#C5A880] shadow-2xs font-bold'
                : 'text-stone-600 dark:text-stone-400'
            }`}
          >
            {lang === 'km' ? 'ពិធីសាសនា' : '7 Rituals'}
          </button>
          <button
            onClick={() => setActiveTab('venues')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              activeTab === 'venues'
                ? 'bg-white dark:bg-[#26322B] text-[#295744] dark:text-[#C5A880] shadow-2xs font-bold'
                : 'text-stone-600 dark:text-stone-400'
            }`}
          >
            {lang === 'km' ? 'ទីតាំង' : 'Venues'}
          </button>
          <button
            onClick={() => setActiveTab('etiquette')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              activeTab === 'etiquette'
                ? 'bg-white dark:bg-[#26322B] text-[#295744] dark:text-[#C5A880] shadow-2xs font-bold'
                : 'text-stone-600 dark:text-stone-400'
            }`}
          >
            {lang === 'km' ? 'សុជីវធម៌' : 'Etiquette'}
          </button>
        </div>

        {/* TAB 1: FAMILY & PARENTS (មាតាបិតា និងខ្សែស្រឡាយ) */}
        {activeTab === 'family' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="text-center">
              <span className="text-[10px] font-mono tracking-widest text-[#C5A880] uppercase">
                {lang === 'km' ? 'មាតាបិតា និងគ្រួសារទាំងសងខាង' : 'The Respected Families'}
              </span>
              <h4 className="text-sm font-bold font-khmer text-[#295744] dark:text-[#67AA8E] mt-0.5">
                {lang === 'km' ? 'សិរីមង្គលអាពាហ៍ពិពាហ៍ប្រពៃណីខ្មែរ' : 'Sacred Union of Two Families'}
              </h4>
              <p className="text-xs text-stone-500 font-khmer mt-1">
                {lang === 'km'
                  ? 'យើងខ្ញុំជាមាតាបិតា សូមគោរពអញ្ជើញសម្តេច ទ្រង់ ឯកឧត្តម លោកជំទាវ លោក លោកស្រី អ្នកនាងកញ្ញា ចូលរួមជាអធិបតី និងជាសាក្សី'
                  : 'The parents cordially invite all esteemed relatives and friends to bless and witness our children’s union.'}
              </p>
            </div>

            {/* Groom's Family Card */}
            <div className="p-3.5 rounded-2xl bg-white dark:bg-[#26322B] border border-stone-200/80 dark:border-stone-700 shadow-2xs">
              <div className="flex items-center gap-2 mb-2 text-[#86513d] dark:text-[#C5A880]">
                <span className="material-symbols-outlined text-[18px]">family_restroom</span>
                <span className="text-xs font-bold uppercase tracking-wider font-khmer">
                  {lang === 'km' ? 'មាតាបិតាខាងកូនកំលោះ' : "Groom's Parents"}
                </span>
              </div>
              <div className="space-y-1 text-xs">
                <p className="font-bold text-stone-900 dark:text-stone-100 font-khmer text-sm">
                  {lang === 'km' ? 'លោក ឈុន វឌ្ឍនា' : 'Mr. Vathana Chhun'}
                </p>
                <p className="font-bold text-stone-900 dark:text-stone-100 font-khmer text-sm">
                  {lang === 'km' ? 'លោកស្រី កែវ ចរិយា' : 'Mrs. Choriya Keo'}
                </p>
                <div className="pt-2 mt-2 border-t border-stone-100 dark:border-stone-700 flex justify-between items-center text-[11px] text-stone-500">
                  <span className="font-khmer">{lang === 'km' ? 'កូនប្រុសនាម' : 'Son:'}</span>
                  <span className="font-bold text-[#295744] dark:text-[#C5A880] text-xs">
                    ហុង (Hong)
                  </span>
                </div>
              </div>
            </div>

            {/* Bride's Family Card */}
            <div className="p-3.5 rounded-2xl bg-white dark:bg-[#26322B] border border-stone-200/80 dark:border-stone-700 shadow-2xs">
              <div className="flex items-center gap-2 mb-2 text-[#86513d] dark:text-[#C5A880]">
                <span className="material-symbols-outlined text-[18px]">family_restroom</span>
                <span className="text-xs font-bold uppercase tracking-wider font-khmer">
                  {lang === 'km' ? 'មាតាបិតាខាងកូនក្រមុំ' : "Bride's Parents"}
                </span>
              </div>
              <div className="space-y-1 text-xs">
                <p className="font-bold text-stone-900 dark:text-stone-100 font-khmer text-sm">
                  {lang === 'km' ? 'លោក ហេង សម្បត្តិ' : 'Mr. Sambath Heng'}
                </p>
                <p className="font-bold text-stone-900 dark:text-stone-100 font-khmer text-sm">
                  {lang === 'km' ? 'លោកស្រី ទេព រស្មី' : 'Mrs. Reaksmey Tep'}
                </p>
                <div className="pt-2 mt-2 border-t border-stone-100 dark:border-stone-700 flex justify-between items-center text-[11px] text-stone-500">
                  <span className="font-khmer">{lang === 'km' ? 'កូនស្រីនាម' : 'Daughter:'}</span>
                  <span className="font-bold text-[#295744] dark:text-[#C5A880] text-xs">
                    រស្មី (ReakSmey)
                  </span>
                </div>
              </div>
            </div>

            {/* Ancestral Blessing Quote */}
            <div className="p-3 rounded-xl bg-[#FFF8ED] dark:bg-[#26322B] border border-[#C5A880]/30 text-center">
              <p className="font-khmer text-xs text-stone-700 dark:text-stone-300 italic leading-relaxed">
                «សិរីសួស្តី ជ័យមង្គល វិបុលសុខ មហាប្រសើរ ចូរមានដល់គូស្វាមីភរិយាថ្មី ជារៀងរហូតតទៅ»
              </p>
            </div>
          </div>
        )}

        {/* TAB 2: SACRED RITUALS (ពិធីសាសនាទាំង ៧) */}
        {activeTab === 'rituals' && (
          <div className="space-y-3 animate-in fade-in duration-200">
            <div className="text-center mb-2">
              <span className="text-[10px] font-mono tracking-widest text-[#C5A880] uppercase">
                {lang === 'km' ? 'ទំនៀមទម្លាប់បុរាណខ្មែរ' : 'Sacred Cambodian Rituals'}
              </span>
              <h4 className="text-sm font-bold font-khmer text-[#295744] dark:text-[#67AA8E]">
                {lang === 'km' ? 'ពិធីមង្គលទាំង ៧ ជំហាន' : 'The 7 Sacred Ceremonies'}
              </h4>
            </div>

            <div className="space-y-2.5">
              {rituals.map((r, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-white dark:bg-[#26322B] border border-stone-200/80 dark:border-stone-700 shadow-2xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-[#295744] text-white text-[10px] font-mono font-bold flex items-center justify-center">
                        {r.step}
                      </span>
                      <span className="text-xs font-bold text-stone-900 dark:text-stone-100 font-khmer">
                        {lang === 'km' ? r.nameKm : r.nameEn}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-[#86513d] dark:text-[#C5A880] font-semibold">
                      {r.time}
                    </span>
                  </div>

                  <p className="text-[11px] text-stone-600 dark:text-stone-400 font-khmer leading-relaxed mt-1">
                    {lang === 'km' ? r.descKm : r.descEn}
                  </p>

                  <div className="mt-2 pt-1.5 border-t border-stone-100 dark:border-stone-700 flex justify-between items-center text-[10px] text-stone-400">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px] text-[#295744] dark:text-[#C5A880]">
                        {r.icon}
                      </span>
                      <span>{r.badge}</span>
                    </span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-medium font-khmer">
                      {lang === 'km' ? 'ប្រពៃណីខ្មែរ' : 'Cambodian Tradition'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: VENUES (ទីកន្លែងប្រារព្ធពិធី) */}
        {activeTab === 'venues' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="text-center">
              <span className="text-[10px] font-mono tracking-widest text-[#C5A880] uppercase">
                {lang === 'km' ? 'ទីតាំងរៀបចំពិធី' : 'Ceremony Locations'}
              </span>
              <h4 className="text-sm font-bold font-khmer text-[#295744] dark:text-[#67AA8E]">
                {lang === 'km' ? 'ពិធីពេលព្រឹក & ពេលល្ងាច' : 'Morning Home & Evening Palace'}
              </h4>
            </div>

            {/* Morning Venue */}
            <div className="p-3.5 rounded-2xl bg-white dark:bg-[#26322B] border border-stone-200 dark:border-stone-700 shadow-2xs">
              <div className="flex items-center gap-1.5 text-[#295744] dark:text-[#C5A880] mb-1">
                <span className="material-symbols-outlined text-[18px]">home</span>
                <span className="text-xs font-bold font-khmer">
                  {lang === 'km' ? 'ពិធីសិរីមង្គលពេលព្រឹក (Morning Rituals)' : 'Morning Ceremony Residence'}
                </span>
              </div>
              <h5 className="text-xs font-semibold text-stone-900 dark:text-stone-100 font-khmer">
                គេហដ្ឋានខាងកូនក្រមុំ (ភូមិពាក់ស្នែងថ្មី)
              </h5>
              <p className="text-[11px] text-stone-500 font-modern mt-0.5">
                Peaksneng Tmey Village Angkor Thom Distict Siemreap Province
              </p>
              <div className="mt-2 text-[11px] text-stone-600 dark:text-stone-400 font-khmer">
                <span className="font-semibold">{lang === 'km' ? 'ពេលវេលា:' : 'Time:'}</span> 07:00 AM – 12:30 PM
              </div>
            </div>

            {/* Evening Venue */}
            <div className="p-3.5 rounded-2xl bg-white dark:bg-[#26322B] border border-stone-200 dark:border-stone-700 shadow-2xs">
              <div className="flex items-center gap-1.5 text-[#86513d] dark:text-[#C5A880] mb-1">
                <span className="material-symbols-outlined text-[18px]">domain</span>
                <span className="text-xs font-bold font-khmer">
                  {lang === 'km' ? 'ពិធីពិសាភោជនាហារពេលល្ងាច (Evening Banquet)' : 'Grand Banquet Palace'}
                </span>
              </div>
              <h5 className="text-xs font-semibold text-stone-900 dark:text-stone-100 font-khmer">
                គេហដ្ឋានខាងកូនក្រមុំ (ភូមិពាក់ស្នែងថ្មី)
              </h5>
              <p className="text-[11px] text-stone-500 font-modern mt-0.5">
                Peaksneng Tmey Village Angkor Thom Distict Siemreap Province
              </p>
              <div className="mt-2 text-[11px] text-stone-600 dark:text-stone-400 font-khmer">
                <span className="font-semibold">{lang === 'km' ? 'ពេលវេលា:' : 'Time:'}</span> 05:30 PM – 10:00 PM
              </div>

              <button
                onClick={() => {
                  onClose();
                  onOpenMap();
                }}
                className="mt-3 w-full py-2 bg-[#295744] text-white rounded-xl text-xs font-semibold font-khmer flex items-center justify-center gap-1 hover:opacity-95"
              >
                <span className="material-symbols-outlined text-[15px]">directions</span>
                <span>{lang === 'km' ? 'មើលផែនទី & ការធ្វើដំណើរ' : 'View Map & Directions'}</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: ETIQUETTE & COURTESY (សុជីវធម៌ក្នុងការចូលរួម) */}
        {activeTab === 'etiquette' && (
          <div className="space-y-3 animate-in fade-in duration-200">
            <div className="text-center mb-1">
              <span className="text-[10px] font-mono tracking-widest text-[#C5A880] uppercase">
                {lang === 'km' ? 'ការណែនាំសម្រាប់ភ្ញៀវកិត្តិយស' : 'Guest Guide & Etiquette'}
              </span>
              <h4 className="text-sm font-bold font-khmer text-[#295744] dark:text-[#67AA8E]">
                {lang === 'km' ? 'សុជីវធម៌ និងប្រពៃណីចូលរួម' : 'Traditions & Meaningful Gestures'}
              </h4>
            </div>

            <div className="space-y-2 text-xs text-stone-600 dark:text-stone-300 font-khmer">
              <div className="p-3 bg-white dark:bg-[#26322B] rounded-xl border border-stone-200 dark:border-stone-700">
                <span className="font-bold text-stone-900 dark:text-stone-100 block mb-0.5">
                  🙏 {lang === 'km' ? 'ការសំពះគោរព (Sampeah Greeting)' : 'The Sampeah Greeting'}
                </span>
                <p className="text-[11px] leading-relaxed">
                  {lang === 'km'
                    ? 'ការសំពះដោយលើកដៃប្រណម្យត្រឹមទ្រូង ឬច្រមុះ គឺជាការបង្ហាញការគោរពដ៏កក់ក្តៅបំផុតចំពោះមាតាបិតា ញាតិមិត្ត និងគូស្វាមីភរិយា។'
                    : 'Placing palms together at chest level in a traditional Sampeah gesture is a heartfelt Cambodian sign of reverence for parents, elders, and the couple.'}
                </p>
              </div>

              <div className="p-3 bg-white dark:bg-[#26322B] rounded-xl border border-stone-200 dark:border-stone-700">
                <span className="font-bold text-stone-900 dark:text-stone-100 block mb-0.5">
                  🧵 {lang === 'km' ? 'ការចងដៃ និងជូនពរ (Wrist Thread Blessing)' : 'Wrist Thread Knot Tying'}
                </span>
                <p className="text-[11px] leading-relaxed">
                  {lang === 'km'
                    ? 'ភ្ញៀវកិត្តិយសអាចឡើងចងខ្សែអំបោះក្រហម ឬស លើកដៃកូនកំលោះកូនក្រមុំ និងបាចផ្កាម្លិះស្រស់ ព្រមទាំងផ្តល់ពាក្យជូនពរដ៏ពិសិដ្ឋ។'
                    : 'Guests are warmly invited to tie sacred red cotton threads onto the wrists of Hong & ReakSmey while whispering blessing wishes of good health and prosperity.'}
                </p>
              </div>

              <div className="p-3 bg-white dark:bg-[#26322B] rounded-xl border border-stone-200 dark:border-stone-700">
                <span className="font-bold text-stone-900 dark:text-stone-100 block mb-0.5">
                  📸 {lang === 'km' ? 'ការថតរូប និងចែករំលែក' : 'Photography & Social Hashtag'}
                </span>
                <p className="text-[11px] leading-relaxed">
                  {lang === 'km'
                    ? 'សូមរីករាយថតរូបអនុស្សាវរីយ៍ និងប្រើប្រាស់កូដ #HongReakSmey2030 ឬផ្ទុកចូលក្នុងកម្មវិធីនេះដើម្បីចែករំលែកជាមួយគ្រួសារយើងខ្ញុំ។'
                    : 'Feel free to capture joyous moments and tag them with #HongReakSmey2030 or upload directly to this app’s Gallery!'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-stone-200 dark:border-stone-700 flex justify-end">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-100 rounded-xl font-khmer text-xs font-semibold hover:bg-stone-300 dark:hover:bg-stone-600 transition-colors"
          >
            {lang === 'km' ? 'យល់ព្រម / បិទ' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
