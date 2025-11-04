# Instagram Feed Setup Instructions

Your website is now ready to display live Instagram posts! However, you need to provide an Instagram access token to enable this feature.

## What You Need

1. **Instagram Business or Creator Account** (not a personal account)
2. **Facebook Page** connected to your Instagram account
3. **Instagram Access Token** from the Meta (Facebook) Developer Portal

## Step-by-Step Setup Guide

### Step 1: Convert to Instagram Business Account (if needed)

1. Open Instagram app on your phone
2. Go to Settings → Account → Switch to Professional Account
3. Choose "Business" or "Creator"
4. Connect to your Facebook Page (create one if needed)

### Step 2: Get Your Instagram Access Token

#### Option A: Quick Setup (Easier - Temporary Token for Testing)

1. Go to [Meta for Developers](https://developers.facebook.com/apps)
2. Click "Create App"
3. Choose "Business" as the app type
4. Fill in app details (name, contact email)
5. Once created, go to **Tools** → **Graph API Explorer**
6. In the top right, select your app
7. Click "Generate Access Token"
8. Grant permissions: `instagram_basic`, `pages_show_list`, `pages_read_engagement`
9. Copy the generated access token

**Note:** This token expires in 1-2 hours. For production use, follow Option B.

#### Option B: Production Setup (Long-Lived Token)

1. Follow Option A to get a short-lived token first
2. Use this URL to exchange for a long-lived token (60 days):
   ```
   https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id={app-id}&client_secret={app-secret}&fb_exchange_token={short-lived-token}
   ```
   Replace:
   - `{app-id}` with your Facebook App ID
   - `{app-secret}` with your App Secret (found in App Settings → Basic)
   - `{short-lived-token}` with the token from Option A

3. The response will contain a long-lived token (valid for 60 days)

#### Option C: Never-Expiring Token (Recommended for Production)

Follow Meta's guide: [Long-Lived Page Access Tokens](https://developers.facebook.com/docs/pages/access-tokens/)

### Step 3: Add Token to Replit

1. In your Replit project, open the **Secrets** tool (padlock icon in the left sidebar)
2. Click "New Secret"
3. Name: `INSTAGRAM_ACCESS_TOKEN`
4. Value: Paste your access token
5. Click "Add Secret"

### Step 4: Verify It's Working

1. Restart your application (it should restart automatically)
2. Visit your website and scroll to the footer
3. You should now see your 3 most recent Instagram posts!

## What Happens Without a Token?

- The Instagram feed will gracefully fallback to showing placeholder boxes
- Clicking the boxes will take visitors to your Instagram page
- No errors will be displayed to users

## Troubleshooting

### "Instagram access token not configured" message
- Make sure you added the secret with the exact name `INSTAGRAM_ACCESS_TOKEN`
- Restart your application after adding the secret

### Posts not showing but no error
- Check that your Instagram account has at least 3 posts
- Verify your Instagram account is a Business or Creator account
- Make sure your Facebook Page is properly connected to Instagram

### "Failed to fetch Instagram posts" error
- Your access token may have expired
- Verify the token has the correct permissions
- Check that your Facebook Page is still connected to Instagram

## Need Help?

Contact Meta for Developers support or refer to:
- [Instagram Graph API Documentation](https://developers.facebook.com/docs/instagram-api)
- [Access Token Guide](https://developers.facebook.com/docs/instagram-basic-display-api/guides/getting-access-tokens-and-permissions)

---

## Technical Details

**API Endpoint:** `/api/instagram/feed`

**What It Fetches:**
- Your 3 most recent Instagram posts (images or videos only)
- Post images, captions, permalinks, and timestamps
- Automatically filters out carousel posts for simplicity

**Refresh Rate:**
- Data is cached for 10 minutes
- Automatically refetches every 15 minutes
- Users won't see stale data

**Performance:**
- Graceful fallback to placeholders if API fails
- No impact on page load speed
- Images lazy-loaded for optimal performance
