# Stock Sync Server

A small web app + backend that reads and writes stock quantities **directly to your
existing Google Sheet**, in real time, with no manual export/import step.

Your Google Sheet tabs (`QLD`, `WA`, `SA`) are the database — there is no separate
storage. Every click in the app writes straight to the matching cell in your sheet.

## 1. Create a Google Cloud service account

1. Go to https://console.cloud.google.com/ and create a new project (or use an existing one).
2. In the search bar, enable the **Google Sheets API** for that project.
3. Go to **IAM & Admin > Service Accounts > Create Service Account**.
   - Name it anything, e.g. `stock-sync`.
   - You don't need to grant it any project-level roles — skip that step.
4. Open the new service account > **Keys** tab > **Add Key > Create new key > JSON**.
   This downloads a `.json` file — keep it safe, you'll need its contents in step 3 below.
5. Open the downloaded JSON file and copy the value of `"client_email"`
   (looks like `stock-sync@your-project.iam.gserviceaccount.com`).

## 2. Share your Google Sheet with the service account

1. Open your Google Sheet.
2. Click **Share**.
3. Paste in the service account's `client_email` from above.
4. Give it **Editor** access. Click Send/Share.

Without this step, the service account can't read or write your sheet.

## 3. Deploy to Render.com

1. Push this folder to a new GitHub repo (or upload it directly if Render supports that).
2. Go to https://render.com > **New > Web Service** > connect your repo.
3. Settings:
   - **Build command:** `npm install`
   - **Start command:** `npm start`
4. Under **Environment**, add these environment variables:
   - `SPREADSHEET_ID` — the ID from your sheet's URL (the long string between `/d/` and `/edit`)
   - `GOOGLE_SERVICE_ACCOUNT_JSON` — paste the **entire contents** of the JSON key file
     from step 1.4, as one single-line value.
5. Click **Deploy**. Render will give you a URL like `https://stock-sync-xxxx.onrender.com`.
6. Open that URL — you should see the stock app, reading live values from your sheet.

Render's free tier spins the server down after inactivity, so the first request after
a while may take ~30 seconds to wake up. Paid tiers avoid this.

## 4. Test it

1. Open the deployed URL.
2. Adjust a quantity for any item.
3. Open your Google Sheet in another tab — the cell should update within a second or two.

## Notes / current limitations of this first version

- Only **quantity syncing** is included (the core ask). The reorder-point ("par") value,
  daily usage log, CSV export, and add/remove-ingredient features from the earlier
  Claude Artifact version are not yet ported over — they can be added on top of this
  same backend later if you want them.
- If an item's code can't be found in a sheet tab (e.g. row was deleted or renamed),
  updating that item will fail with a clear error message rather than silently doing nothing.
- Locations are hardcoded to match your existing tab names: `QLD`, `WA`, `SA`
  (see `items.js` to change this).
