/**
 * AI Usage Assessment — submission relay (Google Apps Script Web App)
 * ------------------------------------------------------------------
 * Receives a POSTed assessment report and writes it as a .md file into the
 * AI Spend Assessment Drive folder. The skill carries ONLY the submit token
 * (below); this script holds the Drive access (runs as you). That keeps Drive
 * credentials server-side and out of the distributed skill.
 *
 * DEPLOY (one time):
 *   1. drive.google.com → New → Google Apps Script  (or script.google.com → New project)
 *   2. Paste this whole file, Save.
 *   3. Deploy → New deployment → type "Web app".
 *        - Description: AI Usage Assessment relay
 *        - Execute as: Me (your @trilogy.com account — it must have write access to the folder)
 *        - Who has access: Anyone        (the SUBMIT_TOKEN below gates writes)
 *   4. Authorize when prompted. Copy the "Web app" URL (ends in /exec).
 *   5. Send that URL to the skill owner so it can be baked into the skill.
 *
 * To rotate the token: change SUBMIT_TOKEN here AND in the skill, then redeploy
 *   (Deploy → Manage deployments → edit → new version).
 */

const FOLDER_ID    = '1AfXB0oAa2EJTVCCyhbfges3LZruqbTSS';   // AI Spend Assessment folder
const SUBMIT_TOKEN = 'SET_IN_DEPLOYED_SCRIPT';             // PLACEHOLDER — set the real token only in the deployed Apps Script, never commit it

function doPost(e) {
  try {
    var body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (body.token !== SUBMIT_TOKEN) {
      return _json({ ok: false, error: 'unauthorized' });
    }
    var person = (body.person || 'unknown').toString();
    var name = (body.filename || ('ai-usage_' + person + '_' + new Date().toISOString().slice(0, 10)))
                 .replace(/[^A-Za-z0-9_\-\.]/g, '_');
    if (!/\.md$/i.test(name)) name += '.md';
    // de-duplicate same-name submissions with a timestamp suffix
    var folder = DriveApp.getFolderById(FOLDER_ID);
    if (folder.getFilesByName(name).hasNext()) {
      name = name.replace(/\.md$/i, '') + '_' + new Date().getTime() + '.md';
    }
    folder.createFile(name, (body.report || '').toString(), MimeType.PLAIN_TEXT);
    return _json({ ok: true, saved: name });
  } catch (err) {
    return _json({ ok: false, error: String(err) });
  }
}

function doGet() {
  return ContentService.createTextOutput('AI Usage Assessment relay is running. POST reports here.');
}

function _json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
