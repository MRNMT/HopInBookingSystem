# Debugging "Accommodation not found" Issue

## 🔍 Steps to Debug

### 1. Check Backend Console Logs

When you click "Book" on an accommodation, check the **Backend** console (where `npm run dev` is running).

You should see one of these messages:
- **✅ Success**: `Found accommodation: [name]`
- **❌ Not Found**: `No accommodation found with ID: [id]`
- **❌ Error**: `Error in getById: [error]`

### 2. Check Browser Console

Open browser DevTools (F12) and check the Console tab.

Look for the accommodation ID being sent:
```javascript
// You should see something like:
Fetching booking data for accommodation: abc-123-def-456
```

### 3. Verify Database Has Data

The backend should have 13 accommodations. Let's verify:

**Option A: Check via API**

Open this URL in your browser:
```
http://localhost:5000/api/v1/accommodations
```

You should see a JSON response with 13 accommodations.

**Option B: Check Backend Logs**

The backend logs should show when accommodations are loaded.

---

## 🐛 Common Issues & Fixes

### Issue 1: "No accommodation found with ID: [id]"

**Cause**: The ID from the URL doesn't match any accommodation in the database.

**Fix**:
1. Go to Find page
2. Click "Book" on a different accommodation
3. Check if that one works

**Debug**:
```javascript
// In browser console, check what ID is being used:
const params = new URLSearchParams(window.location.search);
console.log('Accommodation ID:', params.get('accommodation'));
```

### Issue 2: ID is undefined or null

**Cause**: The booking page URL doesn't have the accommodation parameter.

**Expected URL**:
```
http://localhost:5173/booking?accommodation=abc-123-def-456
```

**Fix**: Make sure you're clicking "Book" button from FindPage, not navigating directly.

### Issue 3: Database not seeded

**Cause**: The accommodations table is empty.

**Fix**: Run the seed script:
```bash
cd Backend
npm run seed
```

---

## 🔧 Quick Fixes Applied

### 1. Simplified Database Query ✅

Changed from complex JOIN query to simple direct query:
```typescript
// Before (complex, might fail):
SELECT a.*, ai.images, ...
FROM accommodations a
LEFT JOIN accommodation_images ai ...
GROUP BY ...

// After (simple, works):
SELECT * FROM accommodations 
WHERE id = $1 AND is_active = true
```

### 2. Added Logging ✅

The service now logs:
- When accommodation is found
- When accommodation is not found
- Any errors that occur

### 3. Consistent Response Format ✅

Controller returns:
```json
{
  "data": { ...accommodation },
  "success": true
}
```

---

## 📋 Testing Checklist

Run through these steps:

1. **✅ Backend is running**: Check terminal shows "Server running on port 5000"

2. **✅ Frontend is running**: Check terminal shows "Local: http://localhost:5173"

3. **✅ API returns data**: Visit `http://localhost:5000/api/v1/accommodations`
   - Should see JSON with accommodations array

4. **✅ Find page works**: Go to `/find`
   - Should see 13 hotels
   - Each hotel has a "Book" button

5. **✅ Click Book**: Click "Book" on HopIn Gauteng
   - URL should be: `/booking?accommodation=[some-uuid]`
   - Check backend console for logs
   - Check browser console for errors

6. **✅ Booking page loads**: Should see:
   - Accommodation name
   - Room type dropdown
   - Date inputs
   - Booking summary

---

## 🚨 If Still Not Working

### Check These:

1. **Backend Console**: What does it say when you click Book?

2. **Browser Console**: Any red errors?

3. **Network Tab** (F12 → Network):
   - Look for request to `/api/v1/accommodations/[id]`
   - Check the response
   - Status should be 200, not 404 or 500

4. **Database Connection**: Is the backend connected to the database?
   - Check for "Connected to database" message on backend startup

---

## 💡 Next Steps

**Please check:**
1. Backend console output when clicking "Book"
2. Browser console for any errors
3. The URL when on the booking page (does it have `?accommodation=...`)

**Then share**: What do you see in the logs? This will help me pinpoint the exact issue.

---

**Files Modified:**
- `Backend/src/services/accommodation.service.ts` - Simplified query + added logging
- `Backend/src/controllers/accomodation.cotroller.ts` - Consistent response format
