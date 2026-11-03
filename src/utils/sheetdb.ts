import { GuestBlessing, RSVPRecord } from '../types';

export const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzvAepx-O_-vnRwLfA1KCImYhP6HUfkNqRsPFwjkvzr5PjNndvOB2Zf5Yo__DlSGs2doA/exec';
export const SHEETDB_URL = 'https://sheetdb.io/api/v1/u6b8umn8z2syx';
export const GAS_URL_STORAGE_KEY = 'wedding_gas_api_url';

/**
 * Get active API URL: User's direct Google Apps Script Web App URL
 */
export function getActiveApiUrl(): string {
  try {
    const custom = localStorage.getItem(GAS_URL_STORAGE_KEY);
    if (custom && custom.trim().startsWith('https://')) {
      return custom.trim();
    }
  } catch {}
  return GOOGLE_APPS_SCRIPT_URL;
}

export function isUsingGoogleAppsScript(): boolean {
  return getActiveApiUrl().includes('script.google.com');
}

export function setCustomApiUrl(url: string) {
  try {
    if (url && url.trim().startsWith('https://')) {
      localStorage.setItem(GAS_URL_STORAGE_KEY, url.trim());
    } else {
      localStorage.removeItem(GAS_URL_STORAGE_KEY);
    }
  } catch {}
}

export interface SheetBlessingRow {
  name?: string;
  attendance?: string;
  wishes?: string;
  phone?: string;
  timestamp?: string;
  photoUrl?: string;
  [key: string]: any;
}

export interface SheetRSVPPayload {
  name: string;
  phone?: string;
  attendance: string;
  guestCount?: number;
  diet?: string;
  blessing?: string;
  photoUrl?: string;
}

/**
 * Fetch blessings from Google Apps Script or SheetDB (Newest first)
 */
export async function fetchSheetBlessings(): Promise<GuestBlessing[]> {
  try {
    const apiUrl = getActiveApiUrl();
    const cacheBuster = `_t=${Date.now()}`;
    const url = apiUrl.includes('?') ? `${apiUrl}&${cacheBuster}` : `${apiUrl}?${cacheBuster}`;

    const res = await fetch(url, {
      cache: 'no-store',
      headers: {
        'Accept': 'application/json'
      }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    
    // Handle either direct array (Google Apps Script) or SheetDB format
    const rows: SheetBlessingRow[] = Array.isArray(data)
      ? data
      : data?.data && Array.isArray(data.data)
      ? data.data
      : [];

    if (!Array.isArray(rows)) return [];

    // Filter valid rows and reverse so NEWEST appears at top
    const validRows = rows.filter((row) => {
      const name = getRowValue(row, 'name', 'Name', 'ឈ្មោះ', 'guest');
      const wishes = getRowValue(row, 'wishes', 'Wishes', 'blessing', 'Blessing', 'ពាក្យជូនពរ', 'message');
      return Boolean(name || wishes);
    });
    validRows.reverse();

    return validRows.map((row, idx) => {
      const rawTime = getRowValue(row, 'timestamp', 'Timestamp', 'កាលបរិច្ឆេទ') || '';
      let formattedTime = 'ថ្មីៗនេះ';

      if (!rawTime || rawTime === 'Google Sheet' || rawTime === 'SheetDB') {
        if (idx === 0) formattedTime = 'មុននេះបន្តិច';
        else if (idx === 1) formattedTime = '៥ នាទីមុន';
        else if (idx === 2) formattedTime = '១៥ នាទីមុន';
        else if (idx <= 5) formattedTime = '១ ម៉ោងមុន';
        else formattedTime = 'ថ្មីៗនេះ';
      } else if (rawTime.length <= 12 && !rawTime.includes('GMT') && !rawTime.includes('T')) {
        formattedTime = rawTime;
      } else {
        // Extract concise HH:MM from long timestamps (like "Wed Jun 10 2026 22:18:35 GMT+0700")
        const timeMatch = rawTime.match(/(\d{1,2}:\d{2})(?::\d{2})?/);
        if (timeMatch && timeMatch[1]) {
          formattedTime = timeMatch[1];
        } else {
          formattedTime = idx === 0 ? 'មុននេះបន្តិច' : 'ថ្មីៗនេះ';
        }
      }

      const rawName = getRowValue(row, 'name', 'Name', 'ឈ្មោះ', 'guest') || 'ភ្ញៀវកិត្តិយស';
      const wishes = getRowValue(row, 'wishes', 'Wishes', 'blessing', 'Blessing', 'ពាក្យជូនពរ', 'message') || 'សូមជូនពរឱ្យមានសុភមង្គល និងស្រឡាញ់គ្នាជារៀងរហូត!';
      const photoUrl = getRowValue(row, 'photoUrl', 'photourl', 'photo_url', 'photo');

      // Clean redundant "(Honored Guest)" or "(Guest)" from name
      let cleanName = rawName.replace(/\s*\((?:Honored\s+Guest|Guest)\)/i, '').trim();

      return {
        id: `sheet-${idx}-${cleanName || 'guest'}`,
        name: cleanName || 'ភ្ញៀវកិត្តិយស',
        message: wishes,
        timestamp: formattedTime,
        likes: Math.max(1, 12 - idx),
        isLiked: false,
        photoUrl: photoUrl || undefined
      };
    });
  } catch (err) {
    console.warn('Failed to fetch blessings from Google Sheet API:', err);
    return [];
  }
}

/**
 * Append new blessing row to Google Apps Script or SheetDB
 */
export async function postSheetBlessing(
  name: string,
  wishes: string,
  attendance = 'Yes',
  photoUrl?: string,
  phone?: string
): Promise<boolean> {
  try {
    const apiUrl = getActiveApiUrl();
    const isGAS = apiUrl.includes('script.google.com');
    const formattedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const item = {
      name: name.trim() || 'ភ្ញៀវកិត្តិយស',
      attendance: attendance || 'Yes',
      wishes: wishes.trim(),
      phone: phone ? phone.trim() : '',
      timestamp: formattedTime,
      photoUrl: photoUrl || ''
    };

    if (isGAS) {
      // Direct Google Apps Script POST without CORS preflight
      await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify(item)
      });
      return true;
    }

    // SheetDB payload format
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data: [item] })
    });

    return res.ok;
  } catch (err) {
    console.error('Failed to post blessing to Google Sheet API:', err);
    return false;
  }
}

/**
 * Save RSVP response directly to Google Apps Script or SheetDB
 */
export async function postSheetRSVP(data: SheetRSVPPayload): Promise<boolean> {
  try {
    const apiUrl = getActiveApiUrl();
    const isGAS = apiUrl.includes('script.google.com');
    const formattedTime = new Date().toLocaleDateString('km-KH') + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const isAttending = data.attendance === 'yes' || data.attendance.toLowerCase().includes('yes') || data.attendance.includes('ចូលរួម');
    const attendanceText = isAttending
      ? `ចូលរួម (${data.guestCount || 1} នាក់)`
      : 'មិនអាចចូលរួម';

    const extraInfo = [
      data.blessing || '',
      data.diet && data.diet !== 'none' ? `[Diet: ${data.diet}]` : ''
    ].filter(Boolean).join(' ');

    const item = {
      name: data.name.trim() || 'ភ្ញៀវកិត្តិយស',
      phone: data.phone ? data.phone.trim() : '',
      attendance: attendanceText,
      wishes: extraInfo || 'សូមជូនពរឱ្យមានសុភមង្គល និងស្រឡាញ់គ្នាជារៀងរហូត!',
      timestamp: formattedTime,
      photoUrl: data.photoUrl || ''
    };

    if (isGAS) {
      // Direct Google Apps Script POST without CORS preflight
      await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify(item)
      });
      return true;
    }

    // SheetDB format
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data: [item] })
    });

    return res.ok;
  } catch (err) {
    console.error('Failed to post RSVP to Google Sheet API:', err);
    return false;
  }
}

/**
 * Extract attendance status and guest count flexibly from Google Sheet attendance column
 */
export function parseSheetAttendance(rawAttendance: any): { attending: 'yes' | 'no'; guestCount: number } {
  if (!rawAttendance) {
    return { attending: 'yes', guestCount: 1 };
  }
  const str = String(rawAttendance).trim();
  const lower = str.toLowerCase();

  // If declined
  if (lower.includes('មិន') || lower === 'no' || lower.startsWith('decline')) {
    return { attending: 'no', guestCount: 0 };
  }

  // Extract count: e.g. "ចូលរួម (2 នាក់)", "2 នាក់", "(2)", "2"
  let count = 1;
  const matchKhmer = str.match(/(\d+)\s*នាក់/);
  if (matchKhmer && matchKhmer[1]) {
    count = parseInt(matchKhmer[1], 10) || 1;
  } else {
    const matchParen = str.match(/\((\d+)\)/);
    if (matchParen && matchParen[1]) {
      count = parseInt(matchParen[1], 10) || 1;
    } else {
      const matchNum = str.match(/\b(\d+)\b/);
      if (matchNum && matchNum[1]) {
        const parsed = parseInt(matchNum[1], 10);
        if (parsed > 0 && parsed <= 50) count = parsed;
      }
    }
  }

  return { attending: 'yes', guestCount: Math.max(1, count) };
}

function getRowValue(row: any, ...keys: string[]): string {
  for (const k of keys) {
    if (row[k] !== undefined && row[k] !== null && String(row[k]).trim() !== '') {
      return String(row[k]).trim();
    }
    const lower = k.toLowerCase();
    for (const prop of Object.keys(row)) {
      if (prop.toLowerCase().trim() === lower && row[prop] !== undefined && row[prop] !== null) {
        return String(row[prop]).trim();
      }
    }
  }
  return '';
}

/**
 * Fetch RSVP records with phone numbers from Google Apps Script or SheetDB (Newest first)
 */
export async function fetchSheetRSVPs(): Promise<RSVPRecord[]> {
  try {
    const apiUrl = getActiveApiUrl();
    const cacheBuster = `_t=${Date.now()}`;
    const url = apiUrl.includes('?') ? `${apiUrl}&${cacheBuster}` : `${apiUrl}?${cacheBuster}`;

    const res = await fetch(url, {
      cache: 'no-store',
      headers: {
        'Accept': 'application/json'
      }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    
    const rows: SheetBlessingRow[] = Array.isArray(data)
      ? data
      : data?.data && Array.isArray(data.data)
      ? data.data
      : [];

    if (!Array.isArray(rows)) return [];

    const validRows = rows.filter((row) => {
      const name = getRowValue(row, 'name', 'Name', 'ឈ្មោះ', 'guest');
      return Boolean(name);
    });
    validRows.reverse();

    return validRows.map((row, idx) => {
      const name = getRowValue(row, 'name', 'Name', 'ឈ្មោះ', 'guest') || 'ភ្ញៀវកិត្តិយស';
      const phone = getRowValue(row, 'phone', 'Phone', 'tel', 'លេខទូរស័ព្ទ');
      const attendanceRaw = getRowValue(row, 'attendance', 'Attendance', 'វត្តមាន', 'ការចូលរួម');
      const wishes = getRowValue(row, 'wishes', 'Wishes', 'blessing', 'Blessing', 'ពាក្យជូនពរ');
      const photoUrl = getRowValue(row, 'photoUrl', 'photourl', 'photo_url', 'photo');
      const timestamp = getRowValue(row, 'timestamp', 'Timestamp', 'កាលបរិច្ឆេទ') || 'Google Sheet';

      const { attending, guestCount } = parseSheetAttendance(attendanceRaw);

      return {
        id: `sheet-rsvp-${idx}-${name}`,
        name,
        phone,
        guestCount,
        attending,
        diet: 'none',
        blessing: wishes,
        photoUrl: photoUrl || undefined,
        submittedAt: timestamp
      };
    });
  } catch (err) {
    console.warn('Failed to fetch RSVPs from Google Sheet API:', err);
    return [];
  }
}
