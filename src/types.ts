export type Language = 'km' | 'en';
export type Screen = 'home' | 'story' | 'gallery' | 'rsvp';

export interface GuestBlessing {
  id: string;
  name: string;
  message: string;
  timestamp: string;
  likes: number;
  isLiked?: boolean;
  photoUrl?: string;
}

export interface GalleryPhoto {
  id: string;
  titleKm: string;
  titleEn: string;
  subtitleKm: string;
  subtitleEn: string;
  category: 'all' | 'traditional' | 'botanical' | 'rings' | 'guest';
  locationKm: string;
  locationEn: string;
  imageUrl: string;
  likes: number;
  isLiked?: boolean;
  aspect?: 'portrait' | 'landscape' | 'square';
  uploadedBy?: string;
  badge?: string;
}

export interface RSVPRecord {
  id: string;
  name: string;
  phone: string;
  guestCount: number;
  attending: 'yes' | 'no';
  diet: 'none' | 'vegetarian' | 'halal';
  blessing: string;
  submittedAt: string;
  photoUrl?: string;
}
