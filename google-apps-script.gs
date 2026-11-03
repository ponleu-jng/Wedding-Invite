/**
 * ====================================================================
 * Google Apps Script for Hong & ReakSmey Wedding App
 * កូដសម្រាប់ដាក់ក្នុង Google Apps Script ផ្ទាល់ ដោយមិនបាច់ប្រើ SheetDB
 * ====================================================================
 * 
 * របៀបដំឡើង (Step-by-Step Instructions in Khmer):
 * ------------------------------------------------
 * ១. បើក Google Sheets របស់អ្នក (New Google Sheet ឬ Sheet ចាស់)
 * ២. នៅម៉ឺនុយខាងលើ ចុចលើ "Extensions" (ផ្នែកបន្ថែម) -> រួចជ្រើសរើស "Apps Script"
 * ៣. លុបកូដទាំងអស់ដែលមាននៅក្នុងផ្ទាំងកូដចេញ
 * ៤. ចម្លង (Copy) កូដខាងក្រោមនេះទាំងស្រុង យកទៅបិទភ្ជាប់ (Paste) ក្នុង Apps Script
 * ៥. ចុច Save (រូបតំណាងថាស រឺ Ctrl + S)
 * ៦. ចុចប៊ូតុងពណ៌ខៀវ "Deploy" (ដាក់ឱ្យប្រើ) នៅខាងស្តាំដៃខាងលើ -> ជ្រើសរើស "New deployment"
 * ៧. នៅត្រង់ Select type (រូបស្ពឺខាងឆ្វេង): ជ្រើសរើសយក "Web app"
 * ៨. បំពេញការកំណត់ដូចខាងក្រោម៖
 *    - Description: Wedding App API
 *    - Execute as: Me (your_email@gmail.com)
 *    - Who has access: Anyone  <-- (ចំណុចនេះសំខាន់បំផុត! ត្រូវជ្រើសរើស Anyone ដើម្បីឱ្យ Website អាចផ្ញើសារបាន)
 * ៩. ចុចប៊ូតុង "Deploy"
 * ១០. ប្រសិនបើមានផ្ទាំងសុំសិទ្ធិលោតឡើង៖
 *     - ចុច "Authorize access"
 *     - ជ្រើសរើសគណនី Gmail របស់អ្នក
 *     - ចុច "Advanced" (កម្រិតខ្ពស់) នៅជ្រុងខាងឆ្វេង
 *     - ចុចលើ "Go to Untitled project (unsafe)"
 *     - ចុច "Allow" (អនុញ្ញាត)
 * ១១. ចម្លង (Copy) តំណ "Web app URL" (តំណភ្ជាប់ដែលបញ្ចប់ដោយ /exec)
 *     ឧទាហរណ៍៖ https://script.google.com/macros/s/AKfycbx.../exec
 * ១២. យក Web App URL នោះមកដាក់ក្នុង Website ជាការស្រេច! (Website នឹងដំណើរការជាមួយ Google Sheet ផ្ទាល់ដោយឥតគិតថ្លៃ និងគ្មានដែនកំណត់)
 */

// ឈ្មោះសន្លឹកកិច្ចការ (អាចប្តូរតាមឈ្មោះ Tab របស់អ្នក ឧ. Sheet1)
var SHEET_NAME = 'Sheet1';

/**
 * Handle GET Requests: អានទិន្នន័យពាក្យជូនពរ និង RSVP ទាំងអស់ពី Google Sheet
 */
function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME) || ss.getActiveSheet();
    
    // បង្កើត Headers ស្វ័យប្រវត្តិ ប្រសិនបើសន្លឹកនៅទំនេរ
    initHeaderIfNeeded(sheet);

    var data = sheet.getDataRange().getValues();
    if (data.length <= 1) {
      return createJsonResponse([]);
    }

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
  } catch (error) {
    return createJsonResponse({ status: 'error', message: error.toString() });
  }
}

/**
 * Handle POST Requests: បញ្ចូលពាក្យជូនពរ និងការឆ្លើយតប RSVP ថ្មីចូល Google Sheet
 */
function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME) || ss.getActiveSheet();
    
    initHeaderIfNeeded(sheet);

    var payload = {};
    if (e && e.postData && e.postData.contents) {
      try {
        payload = JSON.parse(e.postData.contents);
      } catch (err) {
        payload = e.parameter || {};
      }
    } else if (e && e.parameter) {
      payload = e.parameter;
    }

    // គាំទ្រទាំងទម្រង់ SheetDB { data: [{...}] } និងទម្រង់ផ្ទាល់ {...}
    var item = payload;
    if (payload.data && Array.isArray(payload.data) && payload.data.length > 0) {
      item = payload.data[0];
    }

    var timestamp = item.timestamp || Utilities.formatDate(new Date(), 'Asia/Phnom_Penh', 'dd/MM/yyyy HH:mm:ss');
    var name = item.name || 'ភ្ញៀវកិត្តិយស';
    var phone = item.phone || '';
    var attendance = item.attendance || 'Yes';
    var wishes = item.wishes || item.blessing || '';
    var photoUrl = item.photoUrl || '';

    // បន្ថែមជួរថ្មីចូលទៅក្នុង Google Sheet
    sheet.appendRow([timestamp, name, phone, attendance, wishes, photoUrl]);

    return createJsonResponse({
      status: 'success',
      message: 'Recorded successfully',
      data: {
        timestamp: timestamp,
        name: name,
        phone: phone,
        attendance: attendance,
        wishes: wishes,
        photoUrl: photoUrl
      }
    });
  } catch (error) {
    return createJsonResponse({ status: 'error', message: error.toString() });
  }
}

/**
 * Helper: បង្កើត Headers ស្វ័យប្រវត្តិ ប្រសិនបើសន្លឹក Google Sheet នៅទំនេរ
 */
function initHeaderIfNeeded(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['timestamp', 'name', 'phone', 'attendance', 'wishes', 'photoUrl']);
    sheet.getRange(1, 1, 1, 6).setFontWeight('bold').setBackground('#E8F0FE');
  }
}

/**
 * Helper: បម្លែងទិន្នន័យជា JSON Output ជាមួយ CORS សម្រាប់ Web Browser
 */
function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * មុខងារសម្រាប់ Test ដំណើរការក្នុង Apps Script Editor ដោយផ្ទាល់
 */
function testScript() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.getActiveSheet();
  initHeaderIfNeeded(sheet);
  Logger.log('Google Apps Script Ready! Row count: ' + sheet.getLastRow());
}
