/**
 * Planet G - Contact Form Handler & Lead Management
 * Google Apps Script for NewPlanetG Contact Form Integration
 *
 * Spreadsheet Requirements:
 * - Active Google Sheet must have a tab named "Leads"
 * - Tab must have 16 columns in the following exact order:
 *   1. Lead ID
 *   2. Submission Date
 *   3. Submission Time
 *   4. Name
 *   5. Email
 *   6. Phone Number
 *   7. Service of Interest
 *   8. Message / Requirement
 *   9. Lead Source
 *   10. Lead Status
 *   11. Assigned To
 *   12. Follow-up Date
 *   13. Follow-up Notes
 *   14. Last Contacted On
 *   15. Conversion Status
 *   16. Remarks
 */

// Configuration
const CONFIG = {
  SHEET_NAME: "Leads",
  NOTIFICATION_EMAIL: "office@planetg.co.in", // Recipient email for internal alerts
  TIMEZONE: "Asia/Kolkata",
  LEAD_SOURCE_DEFAULT: "Website",
  LEAD_STATUS_DEFAULT: "New",
  CONVERSION_STATUS_DEFAULT: "Pending"
};

/**
 * Handle HTTP GET Requests (Health Check & Documentation)
 */
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "online",
    service: "Planet G Contact Form Webhook",
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Handle HTTP POST Requests (Form Submissions)
 */
function doPost(e) {
  try {
    // 1. Parse incoming payload
    let data;
    if (!e || !e.postData || !e.postData.contents) {
      return createJsonResponse(false, "No form data received in request payload.");
    }

    try {
      data = JSON.parse(e.postData.contents);
    } catch (parseErr) {
      // Fallback in case multipart/x-www-form-urlencoded was received
      data = e.parameter || {};
    }

    // 2. Validate required inputs
    const name = (data.name || "").toString().trim();
    const email = (data.email || "").toString().trim();
    const phone = (data.phone || "").toString().trim();
    const service = (data.service || "").toString().trim() || "General Consultation / Other";
    const message = (data.message || "").toString().trim();

    if (!name || !phone || !service || !message) {
      return createJsonResponse(false, "Name, phone number, service of interest, and message are required fields.");
    }

    // Optional email format check (validate only if provided)
    if (email && email !== "Not provided") {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        return createJsonResponse(false, "Please provide a valid email address.");
      }
    }

    // 3. Generate Timestamps and Unique Lead ID
    const now = new Date();
    const submissionDate = Utilities.formatDate(now, CONFIG.TIMEZONE, "yyyy-MM-dd");
    const submissionTime = Utilities.formatDate(now, CONFIG.TIMEZONE, "HH:mm:ss");
    const idDatePrefix = Utilities.formatDate(now, CONFIG.TIMEZONE, "yyyyMMdd-HHmmss");
    const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    const leadId = "PG-" + idDatePrefix + "-" + randomSuffix;

    // 4. Access Google Sheet
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = spreadsheet.getSheetByName(CONFIG.SHEET_NAME);

    // If 'Leads' sheet doesn't exist, create it and set up 16 headers
    if (!sheet) {
      sheet = spreadsheet.insertSheet(CONFIG.SHEET_NAME);
      const headers = [
        "Lead ID",
        "Submission Date",
        "Submission Time",
        "Name",
        "Email",
        "Phone Number",
        "Service of Interest",
        "Message / Requirement",
        "Lead Source",
        "Lead Status",
        "Assigned To",
        "Follow-up Date",
        "Follow-up Notes",
        "Last Contacted On",
        "Conversion Status",
        "Remarks"
      ];
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#e2eedb");
      sheet.setFrozenRows(1);
    }

    // 5. Build 16-column lead record
    const rowData = [
      leadId,                         // 1. Lead ID
      submissionDate,                 // 2. Submission Date
      submissionTime,                 // 3. Submission Time
      name,                           // 4. Name
      email,                          // 5. Email
      phone || "Not provided",        // 6. Phone Number
      service,                        // 7. Service of Interest
      message,                        // 8. Message / Requirement
      CONFIG.LEAD_SOURCE_DEFAULT,     // 9. Lead Source (Website)
      CONFIG.LEAD_STATUS_DEFAULT,     // 10. Lead Status (New)
      "",                             // 11. Assigned To (blank)
      "",                             // 12. Follow-up Date (blank)
      "",                             // 13. Follow-up Notes (blank)
      "",                             // 14. Last Contacted On (blank)
      CONFIG.CONVERSION_STATUS_DEFAULT, // 15. Conversion Status (Pending)
      ""                              // 16. Remarks (blank)
    ];

    // Append to sheet with a lock to prevent concurrent write collisions
    const lock = LockService.getScriptLock();
    try {
      lock.waitLock(10000); // Wait up to 10 seconds for concurrent write
      sheet.appendRow(rowData);
    } finally {
      lock.releaseLock();
    }

    // 6. Send Email Notification
    sendLeadNotification({
      leadId: leadId,
      name: name,
      email: email,
      phone: phone || "Not provided",
      service: service,
      message: message,
      date: submissionDate,
      time: submissionTime
    });

    // 7. Return Success Response
    return createJsonResponse(true, "Lead saved and notification email sent.", leadId);

  } catch (error) {
    Logger.log("Error processing lead submission: " + error.toString());
    return createJsonResponse(false, "Server error: " + error.message);
  }
}

/**
 * Format Standard JSON Response with CORS headers
 */
function createJsonResponse(success, message, leadId) {
  const result = {
    success: success,
    message: message
  };
  if (leadId) {
    result.leadId = leadId;
  }
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Dispatch Branded Email Notification
 */
function sendLeadNotification(lead) {
  try {
    const subject = "🌿 New Planet G Website Lead: " + lead.name + " (" + lead.leadId + ")";
    
    const plainBody = 
      "New Website Lead Inquiry - Planet G\n\n" +
      "Lead ID: " + lead.leadId + "\n" +
      "Date & Time: " + lead.date + " " + lead.time + " (IST)\n" +
      "Name: " + lead.name + "\n" +
      "Email: " + lead.email + "\n" +
      "Phone: " + lead.phone + "\n" +
      "Service of Interest: " + lead.service + "\n\n" +
      "Message / Requirement:\n" + lead.message + "\n\n" +
      "--\nSubmitted via Planet G Contact Form (Google Apps Script Integration)";

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 620px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
        <div style="background-color: #1f3a1f; color: #ffffff; padding: 22px 28px;">
          <h2 style="margin: 0; font-size: 20px; font-weight: 600; letter-spacing: 0.5px;">Planet G &mdash; New Consultation Lead</h2>
          <p style="margin: 6px 0 0; font-size: 13px; color: #bde3b3;">Received from Website Contact Form</p>
        </div>
        <div style="padding: 24px 28px;">
          <div style="background: #edf7e7; border-left: 4px solid #2e7d32; padding: 12px 16px; margin-bottom: 22px; border-radius: 4px;">
            <strong style="color: #1e5927; font-size: 14px;">Lead Reference ID:</strong>
            <span style="font-family: monospace; font-size: 15px; color: #1e5927; margin-left: 6px;">${lead.leadId}</span>
          </div>

          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr style="border-bottom: 1px solid #f0f0f0;">
              <td style="padding: 10px 0; color: #555555; width: 140px; font-weight: 600;">Client Name:</td>
              <td style="padding: 10px 0; color: #111111; font-weight: bold;">${lead.name}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f0f0f0;">
              <td style="padding: 10px 0; color: #555555; font-weight: 600;">Email Address:</td>
              <td style="padding: 10px 0;"><a href="mailto:${lead.email}" style="color: #2e7d32; text-decoration: none;">${lead.email}</a></td>
            </tr>
            <tr style="border-bottom: 1px solid #f0f0f0;">
              <td style="padding: 10px 0; color: #555555; font-weight: 600;">Phone Number:</td>
              <td style="padding: 10px 0;"><a href="tel:${lead.phone}" style="color: #2e7d32; text-decoration: none;">${lead.phone}</a></td>
            </tr>
            <tr style="border-bottom: 1px solid #f0f0f0;">
              <td style="padding: 10px 0; color: #555555; font-weight: 600;">Service:</td>
              <td style="padding: 10px 0; color: #111111;"><span style="background: #f1f8e9; color: #2e7d32; padding: 3px 8px; border-radius: 4px; font-size: 13px; font-weight: 500;">${lead.service}</span></td>
            </tr>
            <tr style="border-bottom: 1px solid #f0f0f0;">
              <td style="padding: 10px 0; color: #555555; font-weight: 600;">Date & Time:</td>
              <td style="padding: 10px 0; color: #333333;">${lead.date} at ${lead.time} IST</td>
            </tr>
            <tr>
              <td style="padding: 14px 0 6px 0; color: #555555; font-weight: 600; vertical-align: top;">Requirement:</td>
              <td style="padding: 14px 0 6px 0; color: #222222; line-height: 1.6; white-space: pre-wrap;">${lead.message}</td>
            </tr>
          </table>

          <div style="margin-top: 28px; padding-top: 18px; border-top: 1px solid #eeeeee; text-align: center;">
            <a href="https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}" style="display: inline-block; background-color: #25D366; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-size: 13px; font-weight: bold; margin-right: 8px;">Reply on WhatsApp</a>
            <a href="mailto:${lead.email}?subject=Regarding%20your%20Planet%20G%20Inquiry%20(${lead.leadId})" style="display: inline-block; background-color: #1f3a1f; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-size: 13px; font-weight: bold;">Reply via Email</a>
          </div>
        </div>
        <div style="background-color: #f9fbf9; padding: 14px 28px; text-align: center; font-size: 12px; color: #778877; border-top: 1px solid #eef2ee;">
          Lead stored in Google Sheet: <strong>Leads</strong> &middot; Planet G CRM Automation
        </div>
      </div>
    `;

    MailApp.sendEmail({
      to: CONFIG.NOTIFICATION_EMAIL,
      replyTo: lead.email,
      subject: subject,
      body: plainBody,
      htmlBody: htmlBody
    });
  } catch (emailErr) {
    Logger.log("Email dispatch failed: " + emailErr.toString());
    // Do not throw so the sheet record persists even if quota is reached
  }
}
