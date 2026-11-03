import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { getActiveApiUrl, setCustomApiUrl, isUsingGoogleAppsScript, SHEETDB_URL } from '../utils/sheetdb';

interface GoogleAppsScriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onConfigUpdated?: () => void;
}

export const GoogleAppsScriptModal: React.FC<GoogleAppsScriptModalProps> = ({
  isOpen,
  onClose,
  lang,
  onConfigUpdated
}) => {
  const [urlInput, setUrlInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const current = getActiveApiUrl();
      setUrlInput(current === SHEETDB_URL ? '' : current);
      setStatusMsg(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const gasCode = `/**
 * Google Apps Script for Hong & ReakSmey Wedding App
 * ដាក់ក្នុង Extensions -> Apps Script នៃ Google Sheet របស់អ្នក
 */
var SHEET_NAME = 'Sheet1';

function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME) || ss.getActiveSheet();
    initHeaderIfNeeded(sheet);
    var data = sheet.getDataRange().getValues();
    if (data.length <= 1) return createJsonResponse([]);
    var headers = data[0].map(function(h) { return String(h).trim(); });
    var rows = data.slice(1);
    var result = rows.map(function(row) {
      var item = {};
      headers.forEach(function(header, idx) {
        item[header] = row[idx] !== undefined ? String(row[idx]) : '';
      });
      return item;
    });
    return createJsonResponse(result);
  } catch (err) {
    return createJsonResponse({ error: err.toString() });
  }
}

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME) || ss.getActiveSheet();
    initHeaderIfNeeded(sheet);
    var payload = {};
    if (e && e.postData && e.postData.contents) {
      try { payload = JSON.parse(e.postData.contents); } catch (err) { payload = e.parameter || {}; }
    } else if (e && e.parameter) {
      payload = e.parameter;
    }
    var item = payload.data && Array.isArray(payload.data) ? payload.data[0] : payload;
    var timestamp = item.timestamp || Utilities.formatDate(new Date(), 'Asia/Phnom_Penh', 'dd/MM/yyyy HH:mm:ss');
    var name = item.name || 'ភ្ញៀវកិត្តិយស';
    var phone = item.phone || '';
    var attendance = item.attendance || 'Yes';
    var wishes = item.wishes || item.blessing || '';
    var photoUrl = item.photoUrl || '';
    sheet.appendRow([timestamp, name, phone, attendance, wishes, photoUrl]);
    return createJsonResponse({ status: 'success', message: 'Recorded successfully' });
  } catch (err) {
    return createJsonResponse({ status: 'error', error: err.toString() });
  }
}

function initHeaderIfNeeded(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['timestamp', 'name', 'phone', 'attendance', 'wishes', 'photoUrl']);
    sheet.getRange(1, 1, 1, 6).setFontWeight('bold').setBackground('#E8F0FE');
  }
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(gasCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSaveAndTest = async () => {
    const trimmed = urlInput.trim();
    if (!trimmed) {
      setCustomApiUrl('');
      setStatusMsg({ type: 'success', text: lang === 'km' ? 'បានប្តូរទៅប្រើ SheetDB ដើមវិញរួចរាល់' : 'Switched back to default SheetDB' });
      onConfigUpdated?.();
      return;
    }

    if (!trimmed.includes('script.google.com/macros/s/')) {
      setStatusMsg({
        type: 'error',
        text: lang === 'km'
          ? 'តំណ Web App URL ត្រូវតែចេញពី script.google.com/macros/s/.../exec'
          : 'Invalid URL. Must be like https://script.google.com/macros/s/.../exec'
      });
      return;
    }

    setIsTesting(true);
    setStatusMsg(null);
    try {
      const res = await fetch(trimmed);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!Array.isArray(data) && !data?.status) {
        throw new Error('Invalid response format');
      }
      setCustomApiUrl(trimmed);
      setStatusMsg({
        type: 'success',
        text: lang === 'km'
          ? '✓ ភ្ជាប់ទៅកាន់ Google Apps Script ដោយជោគជ័យ! រួចរាល់សម្រាប់ទទួលទិន្នន័យ។'
          : '✓ Connected successfully to Google Apps Script!'
      });
      onConfigUpdated?.();
    } catch (err: any) {
      console.warn('Test error:', err);
      // Still allow saving in case of temporary network warning
      setCustomApiUrl(trimmed);
      setStatusMsg({
        type: 'success',
        text: lang === 'km'
          ? '✓ បានរក្សាទុកតំណភ្ជាប់រួចរាល់ (សូមប្រាកដថាបានជ្រើសរើស Who has access: Anyone ពេល Deploy)។'
          : '✓ Saved URL (Ensure Who has access: Anyone was selected during deployment).'
      });
      onConfigUpdated?.();
    } finally {
      setIsTesting(false);
    }
  };

  const isCurrentGAS = isUsingGoogleAppsScript();

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-[#FCFBF7] dark:bg-[#1E2722] w-full max-w-lg rounded-3xl p-5 sm:p-6 shadow-2xl border border-stone-200 dark:border-stone-700 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-700">
          <div className="flex items-center space-x-2">
            <span className="material-symbols-outlined text-[#295744] dark:text-[#C5A880] text-[22px]">
              code
            </span>
            <h3 className="font-khmer font-bold text-stone-800 dark:text-stone-100 text-sm">
              {lang === 'km' ? 'កូដ Google Apps Script (ឥតគិតថ្លៃ & ផ្ទាល់)' : 'Google Apps Script Integration (Free)'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>

        {/* Current status badge */}
        <div className="mt-3 flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-khmer">
          <span className="text-stone-700 dark:text-stone-300">
            {lang === 'km' ? 'ស្ថានភាពបច្ចុប្បន្ន:' : 'Active Connection:'}
          </span>
          <span className="font-bold text-[#295744] dark:text-emerald-400">
            {isCurrentGAS ? 'Google Apps Script (ផ្ទាល់)' : 'SheetDB API'}
          </span>
        </div>

        {/* Instructions */}
        <div className="mt-4 space-y-2 text-xs font-khmer text-stone-600 dark:text-stone-300">
          <p className="font-bold text-stone-900 dark:text-stone-100">
            {lang === 'km' ? 'ជំហានងាយៗទាំង ៤ ដើម្បីដំឡើង៖' : '4 Easy steps to install:'}
          </p>
          <ol className="list-decimal list-inside space-y-1 pl-1 text-[11px] leading-relaxed">
            <li>បើក <strong>Google Sheets</strong> របស់អ្នក រួចចុច <strong>Extensions</strong> → <strong>Apps Script</strong></li>
            <li>ចុចប៊ូតុង <strong>«ចម្លងកូដ»</strong> ខាងក្រោម រួចយកទៅ Paste ជំនួសកូដចាស់ៗក្នុង Apps Script</li>
            <li>ចុច <strong>Deploy</strong> (ខាងស្តាំលើ) → <strong>New deployment</strong> → ជ្រើស <strong>Web app</strong></li>
            <li>ត្រង់ <strong>Who has access:</strong> ជ្រើសរើស <strong>«Anyone»</strong> (សំខាន់បំផុត) រួចចុច <strong>Deploy</strong> និងចម្លង Web app URL មកដាក់ខាងក្រោម!</li>
          </ol>
        </div>

        {/* Code Block with Copy button */}
        <div className="mt-3 relative rounded-xl overflow-hidden border border-stone-200 dark:border-stone-700 bg-stone-900 text-stone-100 p-3">
          <div className="flex justify-between items-center mb-2 pb-1 border-b border-stone-700 text-[10px] text-stone-400 font-mono">
            <span>Code.gs (Google Apps Script)</span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#295744] hover:bg-[#3C735B] text-white text-[10px] font-khmer transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[13px]">
                {copied ? 'check' : 'content_copy'}
              </span>
              <span>{copied ? (lang === 'km' ? 'បានចម្លង!' : 'Copied!') : (lang === 'km' ? 'ចម្លងកូដ' : 'Copy Code')}</span>
            </button>
          </div>
          <pre className="text-[10px] font-mono overflow-x-auto max-h-36 no-scrollbar text-emerald-400 leading-tight">
            {gasCode}
          </pre>
        </div>

        {/* Input Web App URL */}
        <div className="mt-4 space-y-1.5">
          <label className="block text-xs font-semibold font-khmer text-stone-800 dark:text-stone-200">
            {lang === 'km' ? 'បិទភ្ជាប់ (Paste) Web App URL របស់អ្នកទីនេះ:' : 'Paste your Web App URL here:'}
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://script.google.com/macros/s/.../exec"
              className="flex-1 text-xs rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-[#26322B] px-3 py-2 text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-[#295744]"
            />
            <button
              onClick={handleSaveAndTest}
              disabled={isTesting}
              className="px-3 py-2 bg-[#295744] hover:bg-[#3C735B] text-white text-xs rounded-xl font-khmer font-bold transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1 shrink-0"
            >
              <span className="material-symbols-outlined text-[14px]">
                {isTesting ? 'hourglass_top' : 'link'}
              </span>
              <span>{lang === 'km' ? 'ភ្ជាប់' : 'Connect'}</span>
            </button>
          </div>
        </div>

        {/* Feedback Message */}
        {statusMsg && (
          <div
            className={`mt-2 p-2 rounded-xl text-[11px] font-khmer ${
              statusMsg.type === 'success'
                ? 'bg-emerald-50 text-[#295744] dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
            }`}
          >
            {statusMsg.text}
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-stone-200 dark:border-stone-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 text-xs font-khmer transition-colors cursor-pointer"
          >
            {lang === 'km' ? 'បិទ' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
