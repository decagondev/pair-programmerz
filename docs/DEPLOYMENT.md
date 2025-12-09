# Deployment Guide: PairCode on Netlify

This guide covers deploying PairCode to Netlify while using Firebase Auth and Firestore for backend services.

## Architecture

- **Hosting**: Netlify (static site hosting with CDN)
- **Authentication**: Firebase Auth
- **Database**: Firestore
- **Real-time**: Liveblocks
- **Video**: Jitsi Meet

## Prerequisites

1. Netlify account
2. Firebase project with Auth and Firestore enabled
3. GitHub repository
4. Environment variables configured

## Setup Steps

### 1. Firebase Configuration

Firebase Auth and Firestore are already configured in the codebase. No changes needed.

Ensure your Firebase project has:
- Authentication enabled (Anonymous auth)
- Firestore database created
- Security rules configured (see `firestore.rules`)
- Cloud Functions deployed (if using magic link generation)

### 2. Netlify Setup

#### Option A: Automatic Deployment via GitHub Integration (Recommended)

1. Go to [Netlify](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect your GitHub repository
4. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Add environment variables (see below)
6. Click "Deploy site"

#### Option B: Manual Deployment via CLI

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Login to Netlify:
   ```bash
   netlify login
   ```

3. Initialize site:
   ```bash
   netlify init
   ```

4. Deploy:
   ```bash
   npm run build
   netlify deploy --prod
   ```

### 3. Environment Variables

Add these environment variables in Netlify Dashboard (Site settings → Environment variables):

**Required:**
- `VITE_FIREBASE_API_KEY` - Firebase API key
- `VITE_FIREBASE_AUTH_DOMAIN` - Firebase auth domain
- `VITE_FIREBASE_PROJECT_ID` - Firebase project ID
- `VITE_FIREBASE_STORAGE_BUCKET` - Firebase storage bucket
- `VITE_FIREBASE_MESSAGING_SENDER_ID` - Firebase messaging sender ID
- `VITE_FIREBASE_APP_ID` - Firebase app ID
- `VITE_LIVEBLOCKS_PUBLIC_KEY` - Liveblocks public key

**Optional:**
- `VITE_JITSI_DOMAIN` - Jitsi domain (defaults to `meet.jit.si`)

### 4. GitHub Actions (CI/CD)

The GitHub Actions workflow (`.github/workflows/deploy.yml`) will:
1. Run linter
2. Run TypeScript check
3. Build production bundle
4. Deploy to Netlify

**Required GitHub Secrets:**
- `NETLIFY_AUTH_TOKEN` - Get from Netlify (User settings → Applications → New access token)
- `NETLIFY_SITE_ID` - Found in Netlify site settings (Site information → Site ID)
- All environment variables listed above

### 5. Firebase Security Rules

Ensure Firestore security rules are deployed:

```bash
firebase deploy --only firestore:rules
```

Rules are in `firestore.rules`.

### 6. Custom Domain (Optional)

1. In Netlify Dashboard → Domain settings
2. Add custom domain
3. Configure DNS records as instructed
4. SSL certificate is automatically provisioned

## Configuration Files

- `netlify.toml` - Netlify build and redirect configuration
- `firestore.rules` - Firestore security rules
- `.github/workflows/deploy.yml` - CI/CD pipeline

## Build Process

1. Netlify runs `npm ci` to install dependencies
2. Runs `npm run build` which:
   - Type checks with `tsc -b`
   - Builds with Vite
   - Outputs to `dist/` directory
3. Netlify serves `dist/` directory

## SPA Routing

The `netlify.toml` file includes a redirect rule that sends all routes to `index.html` for client-side routing:

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## Caching Strategy

- **Static assets** (JS, CSS, images): Cached for 1 year (immutable)
- **HTML files**: No cache (always fresh)
- **Security headers**: Applied to all responses

## Monitoring

- **Netlify Analytics**: Available in Netlify Dashboard
- **Firebase Console**: Monitor Auth and Firestore usage
- **Liveblocks Dashboard**: Monitor real-time connections

## Rollback

1. Go to Netlify Dashboard → Deploys
2. Find the previous successful deploy
3. Click "Publish deploy" to rollback

## Troubleshooting

### Build Fails

- Check build logs in Netlify Dashboard
- Verify all environment variables are set
- Ensure Node.js version matches (18+)

### Authentication Issues

- Verify Firebase Auth is enabled
- Check Firebase Auth domain matches `VITE_FIREBASE_AUTH_DOMAIN`
- Verify security rules allow anonymous auth

### Firestore Connection Issues

- Check Firestore is enabled in Firebase Console
- Verify security rules are deployed
- Check `VITE_FIREBASE_PROJECT_ID` is correct

### Routing Issues

- Verify `netlify.toml` redirect rule is present
- Check that all routes redirect to `/index.html`

## Local Testing

Test the production build locally:

```bash
npm run build
npm run preview
```

This uses Vite's preview server to test the production build.

## Performance

- Netlify CDN automatically caches static assets
- Code splitting reduces initial bundle size
- Lazy loading for Jitsi SDK reduces initial load
- React.memo optimizations reduce re-renders

## Security

- Security headers configured in `netlify.toml`
- Firebase security rules protect Firestore data
- Environment variables stored securely in Netlify
- HTTPS automatically enabled by Netlify

