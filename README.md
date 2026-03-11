# Selah

Selah is a Node/Express Bible library with:

- account signup, login, email verification, password reset, and welcome email delivery
- Bible books and chapter reading
- reading plans, saved verses, study notes, and prayer tracking
- server-backed AI guidance with an optional OpenAI key

## Render Deploy

This repo includes a `render.yaml` Blueprint for direct GitHub deployment on Render.

### What the Blueprint does

- deploys a Node web service
- runs `npm ci` and `npm start`
- configures a health check at `/healthz`
- mounts a persistent disk at `/var/data`
- stores JSON app data in `/var/data/data`
- stores email previews in `/var/data/emails`
- generates a strong `SESSION_SECRET`

### Required values to set in Render

Set these in the Render dashboard before using the app in production:

- `APP_BASE_URL`
  Use your public Render URL, for example `https://selah.onrender.com`.
- `EMAIL_FROM`
  Use a sender address that matches your SMTP provider.
- `SMTP_HOST`
- `SMTP_USER`
- `SMTP_PASS`

Optional:

- `OPENAI_API_KEY`

Branding:

- Drop your logo image at `assets/selah-logo.png` to show it on the landing page and inside account emails.

### Important storage note

This app writes users, saved verses, notes, prayer entries, and AI sessions to local JSON files.
For persistent data on Render, keep the disk in `render.yaml`. Without a persistent disk, your app data will reset on redeploy or restart.

## Before pushing to GitHub

This repo ignores runtime JSON and generated email previews:

- `data/*.json`
- `emails/*.html`

If any of those files were already committed earlier, untrack them before pushing:

```bash
git rm --cached data/*.json
git rm --cached emails/*.html
```

Then commit again.
