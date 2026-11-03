import { GalleryPhoto, GuestBlessing } from '../types';

export const INITIAL_GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    id: 'photo-1',
    titleKm: 'កិច្ចសន្យាស្នេហ៍នៅអង្គរ',
    titleEn: 'Sacred Vows at Angkor',
    subtitleKm: 'ឈុតសូត្រមាសបុរាណ និងពន្លឺព្រះអាទិត្យពេលព្រឹកព្រលឹម',
    subtitleEn: 'Angkor Wat traditional gold silk attire & serene morning blessing',
    category: 'traditional',
    locationKm: 'ខេត្តសៀមរាប, កម្ពុជា',
    locationEn: 'Siem Reap, Cambodia',
    imageUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
    likes: 428,
    isLiked: false,
    aspect: 'portrait',
    badge: 'Royal Silk'
  },
  {
    id: 'photo-2',
    titleKm: 'ផ្កាព្រៃរីកស្គុះស្គាយ',
    titleEn: 'Botanical Romance',
    subtitleKm: 'ស្នាមញញឹមដ៏កក់ក្តៅក្នុងសួនផ្កាម្លិះធម្មជាតិ',
    subtitleEn: 'Intimate moments among blooming jasmine and orchids',
    category: 'botanical',
    locationKm: 'រាជធានីភ្នំពេញ',
    locationEn: 'Phnom Penh Botanical Oasis',
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    likes: 314,
    isLiked: false,
    aspect: 'portrait',
    badge: 'Botanical'
  },
  {
    id: 'photo-3',
    titleKm: 'ចិញ្ចៀនភ្ជាប់ពាក្យ និងក្តីសន្យា',
    titleEn: 'Eternal Promise & Rings',
    subtitleKm: 'ចិញ្ចៀនពេជ្រ និងដៃកាន់ដៃពោរពេញដោយសេចក្តីស្រឡាញ់',
    subtitleEn: 'Close-up of golden wedding bands and intertwined hands',
    category: 'rings',
    locationKm: 'ថ្ងៃភ្ជាប់ពាក្យ',
    locationEn: 'Engagement Ceremony',
    imageUrl: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1200&q=80',
    likes: 512,
    isLiked: true,
    aspect: 'portrait',
    badge: 'Gold Rings'
  },
  {
    id: 'photo-4',
    titleKm: 'ពិធីសំពះផ្ទឹម និងកេរដំណែលដូនតា',
    titleEn: 'Royal Khmer Heritage',
    subtitleKm: 'ថែរក្សាទំនៀមទម្លាប់ប្រពៃណីខ្មែរដ៏ថ្លៃថ្លា',
    subtitleEn: 'Honoring ancestral Cambodian wedding traditions with silk and gold ornaments',
    category: 'traditional',
    locationKm: 'គេហដ្ឋានមង្គល',
    locationEn: 'Ancestral Hall',
    imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
    likes: 673,
    isLiked: false,
    aspect: 'landscape',
    badge: 'Khmer Heritage'
  },
  {
    id: 'photo-5',
    titleKm: 'ពន្លឺព្រះអាទិត្យអស្តង្គតនៅកែប',
    titleEn: 'Golden Sunset at Kep',
    subtitleKm: 'ពេលវេលាដែលយើងបាននិយាយពាក្យថា យល់ព្រម',
    subtitleEn: 'The golden seaside where the proposal happened',
    category: 'botanical',
    locationKm: 'ឆ្នេរសមុទ្រកែប',
    locationEn: 'Kep Seaside Promenade',
    imageUrl: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1200&q=80',
    likes: 289,
    isLiked: false,
    aspect: 'portrait',
    badge: 'Seaside Sunset'
  },
  {
    id: 'photo-6',
    titleKm: 'សំណើច និងក្តីសុខក្នុងក្រសែភ្នែក',
    titleEn: 'Candid Joy & Laughter',
    subtitleKm: 'សុភមង្គលដែលចេញពីបេះដូងពិត',
    subtitleEn: 'Unscripted smiles celebrating true companionship',
    category: 'rings',
    locationKm: 'សួនព្រះបរមរាជវាំង',
    locationEn: 'Royal Palace Gardens',
    imageUrl: 'https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&w=1200&q=80',
    likes: 382,
    isLiked: false,
    aspect: 'portrait',
    badge: 'Candid Moments'
  }
];

export const INITIAL_BLESSINGS: GuestBlessing[] = [];

export const WEDDING_SCHEDULE = [
  {
    timeKm: '០៧:០០ ព្រឹក',
    timeEn: '07:00 AM',
    titleKm: 'ពិធីហែកំណត់ (Fruit & Gift Procession)',
    titleEn: 'Groom Procession & Fruit Offerings',
    descKm: 'ក្បួនកូនកំលោះហែជំនូនផ្លែឈើ និងគ្រឿងអលង្ការមកកាន់គេហដ្ឋានកូនក្រមុំ',
    descEn: 'The festive procession carrying decorated fruit trays, traditional pastries, and gifts to the bride’s home.',
    icon: 'local_florist'
  },
  {
    timeKm: '០៨:៣០ ព្រឹក',
    timeEn: '08:30 AM',
    titleKm: 'ពិធីសែនដូនតា & សូត្រមន្តចម្រើនព្រះបរិត្ត',
    titleEn: 'Ancestral Honor & Monk Blessings',
    descKm: 'គោរពដូនតា និងព្រះសង្ឃចម្រើនព្រះបរិត្តប្រសិទ្ធិពរជ័យសិរីសួស្តី',
    descEn: 'Honoring ancestors and receiving sacred Pali chants from respected Buddhist monks for lifelong peace.',
    icon: 'self_improvement'
  },
  {
    timeKm: '១០:០០ ព្រឹក',
    timeEn: '10:00 AM',
    titleKm: 'ពិធីកាត់សក់បង្កក់សិរី (Gaat Sahk Cleansing)',
    titleEn: 'Ceremonial Hair Cutting & Cleansing',
    descKm: 'ពិធីកាត់សក់កាត់កម្ចាត់ឧបទ្រព្យចង្រៃ និងប្រសិទ្ធិពរជ័យពីមាតាបិតា',
    descEn: 'Symbolic cleansing ritual where parents and elders symbolically cut hair to welcome prosperity.',
    icon: 'content_cut'
  },
  {
    timeKm: '១១:៣០ ព្រឹក',
    timeEn: '11:30 AM',
    titleKm: 'ពិធីសំពះផ្ទឹម និងចងដៃ (Sompeas Ptem)',
    titleEn: 'Sacred Knot Tying & Sword Blessing',
    descKm: 'ពិធីបង្វិលពពិល ចងខ្សែអំបោះក្រហម និងកាន់ដាវជ័យផ្សំផ្គុំជាគូជីវិត',
    descEn: 'The core vow ceremony with candlelight rotation, holding the ancient gold sword, and sacred cotton wrist ties.',
    icon: 'favorite'
  },
  {
    timeKm: '០៥:៣០ ល្ងាច',
    timeEn: '05:30 PM',
    titleKm: 'ទទួលភ្ញៀវកិត្តិយស & ថតរូបអនុស្សាវរីយ៍',
    titleEn: 'Welcome Cocktail & Photo Booth',
    descKm: 'ស្វាគមន៍ភ្ញៀវកិត្តិយស និងកត់ត្រាពាក្យជូនពរនៅមុខសាលមហោស្រព',
    descEn: 'Greeting esteemed guests at the Grand Lotus Palace foyer with welcome beverages and memory wall.',
    icon: 'photo_camera'
  },
  {
    timeKm: '០៦:៣០ ល្ងាច',
    timeEn: '06:30 PM',
    titleKm: 'ពិធីពិសាភោជនាហារពេលល្ងាច & កាត់នំមង្គល',
    titleEn: 'Grand Banquet Dinner & Celebration',
    descKm: 'ពិសារអាហារ ៧មុខ កាត់នំខួបស្នេហា លើកកែវជូនពរ និងរាំកម្សាន្ត',
    descEn: 'A lavish 7-course Khmer gourmet dinner, cake cutting, toasts, acoustic melodies, and joyous celebration.',
    icon: 'dinner_dining'
  }
];

export const LOVE_STORY_CHAPTERS = [
  {
    year: '2024',
    titleKm: 'និស្ស័យនៅសាកលវិទ្យាល័យ',
    titleEn: 'Destiny at the Royal University',
    descKm: 'យើងបានជួបគ្នានៅបណ្ណាល័យសាកលវិទ្យាល័យភូមិន្ទភ្នំពេញ។ សៀវភៅមួយក្បាលដែលយើងទាំងពីរចង់ខ្ចីក្នុងពេលតែមួយ បានក្លាយជាការចាប់ផ្តើមនៃការសន្ទនាមិនចេះចប់។',
    descEn: 'We met in the quiet hall of the Royal University library. Reaching for the same architecture monograph started a conversation that has never stopped.',
    image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80'
  },
  {
    year: '2027',
    titleKm: 'ការសន្យានៅប្រាសាទបុរាណ',
    titleEn: 'Angkor Sunrise Promise',
    descKm: 'នៅក្រោមពន្លឺព្រះអាទិត្យរះពណ៌មាសលើកំពូលប្រាសាទអង្គរវត្ត យើងបានសន្យាថានឹងដើរទន្ទឹមគ្នា គាំទ្រក្តីសុបិន និងក្តីស្រឡាញ់របស់គ្នាជារៀងរហូត។',
    descEn: 'Watching the dawn illuminate the lotus towers of Angkor Wat, we made our quiet pact to support each other’s aspirations and walk life hand in hand.',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80'
  },
  {
    year: '2029',
    titleKm: 'ការសុំរៀបការនៅឆ្នេរសមុទ្រកែប',
    titleEn: 'Seaside Proposal at Kep',
    descKm: 'ក្រោមរលកសមុទ្រខ្សឹបខ្សៀវ និងខ្យល់រាត្រីដ៏ត្រជាក់ ហុង បានលុតជង្គង់សុំ រស្មី រៀបការ ជាមួយចិញ្ចៀនដែលបង្កប់នូវក្តីស្រឡាញ់ស្មោះសរ។',
    descEn: 'With the Andaman waves lapping the stone pier and a sky painted in twilight lavender, Hong knelt with a ring designed with Khmer lotus leaves.',
    image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80'
  },
  {
    year: '2030',
    titleKm: 'ថ្ងៃសិរីមង្គល អាពាហ៍ពិពាហ៍',
    titleEn: 'A Sacred New Chapter Begins',
    descKm: 'ថ្ងៃទី ១០ ខែតុលា ឆ្នាំ២០៣០ គឺជាថ្ងៃដែលយើងខ្ញុំទាំងពីរ ទទួលបានពរជ័យពីមាតាបិតា ញាតិមិត្ត និងចាស់ទុំ ដើម្បីចាប់ផ្តើមគ្រួសារថ្មីដ៏កក់ក្តៅ។',
    descEn: 'October 10, 2030. Together with our cherished families and dearest friends, we officially unite our hearts under ancestral blessings.',
    image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80'
  }
];
