// Paste into Extensions > Apps Script in the Google Sheet that will store signups.
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    var data = JSON.parse(e.postData.contents);
    var email = String(data.email || '').trim().toLowerCase();
    var signupType = String(data.signupType || '');
    var organizationName = String(data.organizationName || '').trim();
    var problemStatement = String(data.problemStatement || '').trim();
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || data.consent !== true || data.source !== 'footer' || ['individual', 'organization'].indexOf(signupType) === -1 || (signupType === 'organization' && (!organizationName || organizationName.length > 160)) || problemStatement.length > 2000) throw new Error('Invalid submission');
    lock.waitLock(10000);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Waitlist');
    if (!sheet) {
      sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('Waitlist');
      sheet.appendRow(['Email', 'Signup type', 'Organization name', 'Problem statement', 'Source', 'Joined at', 'Consent']);
    } else if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Email', 'Signup type', 'Organization name', 'Problem statement', 'Source', 'Joined at', 'Consent']);
    }
    var count = sheet.getLastRow();
    var exists = count > 1 && sheet.getRange(2, 1, count - 1, 1).getValues().some(function(row) { return String(row[0]).toLowerCase() === email; });
    if (!exists) {
      // Prefix text with an apostrophe to prevent spreadsheet formula injection.
      // Prefix user-supplied text with an apostrophe to prevent spreadsheet formula injection.
      sheet.appendRow(["'" + email, signupType, organizationName ? "'" + organizationName : '', problemStatement ? "'" + problemStatement : '', data.source, new Date(), 'Yes']);
    }
    return ContentService.createTextOutput(JSON.stringify({success: true})).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({success: false})).setMimeType(ContentService.MimeType.JSON);
  } finally { if (lock.hasLock()) lock.releaseLock(); }
}
