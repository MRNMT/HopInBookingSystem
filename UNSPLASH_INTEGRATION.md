# Unsplash Integration Guide

## ✅ **Implementation Complete**

The application now uses **Unsplash API** instead of Lummi for fetching hotel images.

---

## 🔑 **Setup Instructions**

### **1. Get Your Unsplash API Key**

1. Go to [Unsplash Developers](https://unsplash.com/developers)
2. Click "Register as a developer"
3. Create a new application
4. Copy your **Access Key**

### **2. Add API Key to Your Project**

Open `Customer-app/src/services/unsplash.service.ts` and replace:

```typescript
const UNSPLASH_ACCESS_KEY = 'YOUR_UNSPLASH_ACCESS_KEY';
```

With your actual key:

```typescript
const UNSPLASH_ACCESS_KEY = 'your-actual-access-key-here';
```

**⚠️ Important**: For production, move this to an environment variable:

1. Create `.env` file in `Customer-app/`:
   ```
   VITE_UNSPLASH_ACCESS_KEY=your-actual-access-key-here
   ```

2. Update `unsplash.service.ts`:
   ```typescript
   const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
   ```

---

## 📸 **How It Works**

### **Image Fetching Strategy**

For each accommodation, the system:

1. **Searches Unsplash** with location-specific queries:
   - `"luxury hotel {city} {country}"`
   - `"{city} hotel interior"`
   - `"{city} accommodation"`

2. **Returns 5 images** per accommodation (uses the first one)

3. **Caches images** in localStorage with accommodation data

4. **Fallback**: Uses default hotel image if Unsplash returns no results

### **API Endpoints Used**

- **Search Photos**: `GET /search/photos`
  - Query parameters: `query`, `per_page`, `orientation`
  - Returns landscape-oriented hotel images

---

## 📁 **Files Modified**

1. **NEW**: `Customer-app/src/services/unsplash.service.ts`
   - Main Unsplash integration service
   - Functions: `searchUnsplashPhotos()`, `getHotelImages()`, `getRandomHotelImage()`

2. **UPDATED**: `Customer-app/src/pages/FindPage.tsx`
   - Changed import from `lummi.service` to `unsplash.service`
   - Fixed syntax errors and completed missing code

3. **UPDATED**: `Customer-app/src/sections/FeaturedHotels.tsx`
   - Changed import from `lummi.service` to `unsplash.service`

---

## 🎨 **Image Quality**

Unsplash provides high-quality, professional hotel images with multiple size options:

- `thumb`: 200px
- `small`: 400px
- `regular`: 1080px (used in app)
- `full`: 2000px+
- `raw`: Original resolution

The app uses `regular` size for optimal balance between quality and performance.

---

## 📊 **Rate Limits**

**Unsplash Free Tier:**
- 50 requests per hour
- 5,000 requests per month

**Tips to stay within limits:**
- ✅ Cache images in localStorage (already implemented)
- ✅ Only fetch images when cache is empty
- ✅ Use fallback images when rate limit is reached

---

## 🔄 **Caching Strategy**

The app implements smart caching:

1. **First Visit**: Fetches images from Unsplash → Saves to localStorage
2. **Subsequent Visits**: Loads images from localStorage (instant)
3. **Cache Duration**: 30 minutes
4. **Cache Validation**: Checks if images exist before using cache

---

## 🧪 **Testing**

1. Clear localStorage: `localStorage.clear()`
2. Refresh the page
3. Check console for: `"Fetching images from Unsplash..."`
4. Verify images load for all accommodations
5. Check localStorage: `localStorage.getItem('hopin_accommodations')`

---

## 🚀 **Next Steps**

- [ ] Add your Unsplash API key
- [ ] Test image loading
- [ ] Monitor API usage in Unsplash dashboard
- [ ] Consider upgrading to paid plan if needed (unlimited requests)

---

## 📝 **API Documentation**

Full Unsplash API docs: https://unsplash.com/documentation

**Search Photos Endpoint:**
```
GET https://api.unsplash.com/search/photos
```

**Required Headers:**
```
Authorization: Client-ID {YOUR_ACCESS_KEY}
```

**Query Parameters:**
- `query`: Search term
- `per_page`: Results per page (max: 30)
- `orientation`: `landscape`, `portrait`, or `squarish`

---

**🎉 Unsplash integration complete!** Add your API key to start fetching beautiful hotel images.
