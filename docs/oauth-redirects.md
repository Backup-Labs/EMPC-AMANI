# Google / Supabase OAuth redirect setup

## Problem
After "Sign in with Google", users land on
`http://localhost:3000/?code=...` instead of production.

## Cause
Supabase **Site URL** is still `http://localhost:3000`, and/or production
redirect URLs are not allowlisted.

## Fix in Supabase Dashboard

1. Open **Authentication → URL Configuration**
2. Set **Site URL** to your production origin:
   `https://empc-amani.amaniishimwe36.workers.dev`
   (or your custom domain when you add one)
3. Under **Redirect URLs**, add all of these:

```
https://empc-amani.amaniishimwe36.workers.dev/auth/callback
https://empc-amani.amaniishimwe36.workers.dev/**
http://localhost:3000/auth/callback
http://localhost:3000/**
```

4. Save

## Google Cloud Console (usually already OK)
Authorized redirect URI for the Google OAuth client should be Supabase's callback:

```
https://umnojpnaamzvkpychddm.supabase.co/auth/v1/callback
```

(Not your app URL — Google → Supabase → your app.)

## App behavior (already in code)
- Google sign-in uses: `{origin}/auth/callback?next=/portal/dashboard`
- `/auth/callback` exchanges `code` for a session, then redirects to the portal
- If a user somehow lands on `/?code=...`, they are forwarded to `/auth/callback`

## After changing Supabase settings
Redeploy is not required for Site URL changes. Just try Google sign-in again
from the production portal login page.
