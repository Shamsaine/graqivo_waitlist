# Graqivo waitlist

A single Next.js landing page with two supplied images. Signups go to Google Sheets. No database, Prisma, or separate backend service.

## Run

1. `npm install`
2. `npm run dev`
3. Open http://localhost:3000

## Connect Google Sheets

1. Create a Google Sheet. Open **Extensions → Apps Script**.
2. Paste the contents of `scripts/google-sheets.gs` and save.
3. Choose **Deploy → New deployment → Web app**. Execute as yourself and allow access for **Anyone**. Authorize the script and copy its deployed `/exec` URL.
4. Copy `.env.example` to `.env.local`. Set `GOOGLE_SHEETS_WEBHOOK_URL` to the copied URL.
5. Restart the app. Submit a signup and check the new **Waitlist** tab in your Sheet.

Both forms use the same Sheet. Emails are normalized and duplicates return the same confirmation without creating extra rows. The small Next.js endpoint forwards submissions to Google; there is no database to maintain. The page only confirms success when Google acknowledges the save. Without a configured URL it shows an honest unavailable message.

For deployment, use a Next.js-compatible host and set the same environment variable. `npm run build` builds the site and `npm start` serves it. Google Sheets storage needs the deployed Apps Script URL before live signup testing is possible.
