# 🔑 Unsplash API Key Setup Guide

## Quick Setup (3 Steps)

### **Step 1: Get Your Unsplash API Key**

1. Visit **https://unsplash.com/developers**
2. Click **"Register as a developer"** (it's free!)
3. Create a **New Application**
4. Copy your **Access Key** (looks like: `abc123xyz456...`)

---

### **Step 2: Create Your .env File**

In the `Customer-app` folder, you'll find `.env.example`. 

**Option A: Copy the example file**
```bash
cd Customer-app
copy .env.example .env
```

**Option B: Create manually**
Create a new file called `.env` in the `Customer-app` folder with this content:

```env
VITE_UNSPLASH_ACCESS_KEY=your_actual_key_here
```

---

### **Step 3: Add Your API Key**

Open `Customer-app/.env` and replace `your_actual_key_here` with your actual Unsplash Access Key:

```env
VITE_UNSPLASH_ACCESS_KEY=abc123xyz456_your_real_key_from_unsplash
```

**Save the file!**

---

## ✅ Verify It's Working

1. **Restart the dev server** (important for env variables):
   ```bash
   # Stop the current server (Ctrl+C)
   npm run dev
   ```

2. **Clear localStorage** (in browser console):
   ```javascript
   localStorage.clear()
   ```

3. **Refresh the page** and check the console for:
   ```
   Fetching images from Unsplash...
   ```

4. **You should see beautiful hotel images loading!** 🎉

---

## 🚨 Troubleshooting

### **Images not loading?**

1. **Check your API key is correct**:
   - Open `Customer-app/.env`
   - Verify the key matches your Unsplash dashboard

2. **Restart the dev server**:
   - Vite only loads `.env` on startup
   - Stop and restart: `npm run dev`

3. **Check the browser console**:
   - Look for errors like "401 Unauthorized"
   - This means the API key is invalid

4. **Verify the .env file location**:
   - Must be in `Customer-app/.env` (not in root)
   - File name is exactly `.env` (not `.env.txt`)

### **Rate limit exceeded?**

Unsplash free tier: **50 requests/hour**

- Clear localStorage less frequently
- Images are cached, so you won't hit limits in normal use
- Consider upgrading to Unsplash+ for unlimited requests

---

## 📁 File Structure

```
HopInBookingSystem/
├── Customer-app/
│   ├── .env                    ← Your actual API key (gitignored)
│   ├── .env.example            ← Template file
│   └── src/
│       └── services/
│           └── unsplash.service.ts  ← Uses the API key
```

---

## 🔒 Security Notes

- ✅ `.env` is in `.gitignore` (won't be committed to Git)
- ✅ API key is loaded from environment variable
- ✅ Safe to use in frontend (Unsplash allows browser requests)
- ⚠️ Don't share your `.env` file publicly

---

## 📊 Current Setup

- **Service**: `Customer-app/src/services/unsplash.service.ts`
- **Environment Variable**: `VITE_UNSPLASH_ACCESS_KEY`
- **Used in**: FindPage.tsx, FeaturedHotels.tsx
- **Caching**: 30 minutes in localStorage

---

**That's it! Add your API key and enjoy beautiful hotel images from Unsplash!** 🏨✨
