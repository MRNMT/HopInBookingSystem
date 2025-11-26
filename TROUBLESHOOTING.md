# Troubleshooting: "No accommodations available"

## Issue
Frontend shows: "No accommodations available at the moment. Please check back later."

## ✅ Solution Steps

### 1. Verify Database is Seeded
```bash
cd Backend
npm run seed:accommodations
```

**Expected Output:**
```
✓ HopIn Gauteng already exists, updating...
✓ HopIn Western Cape already exists, updating...
...
✅ Successfully seeded accommodations!
   Total: 13 locations
```

### 2. Check Backend is Running
```bash
# Should be running on port 5000
curl http://localhost:5000/api/v1/accommodations
```

**Expected:** JSON response with accommodations data

### 3. Check Browser Console
1. Open browser: `http://localhost:5175`
2. Press `F12` to open Developer Tools
3. Go to **Console** tab
4. Look for these logs:

**Success:**
```
🔄 Fetching accommodations...
✅ Accommodations received: {success: true, data: Array(13)}
📍 Top 3 accommodations: Array(3)
🖼️ Fetching images from Lummi...
Fetching image for: HopIn Gauteng (Johannesburg, South Africa)
✅ Accommodations with images: Array(3)
```

**Error:**
```
❌ Error loading data: [error details]
```

### 4. Common Issues & Fixes

#### Issue: CORS Error
**Error in console:**
```
Access to XMLHttpRequest at 'http://localhost:5000/api/v1/accommodations' 
from origin 'http://localhost:5175' has been blocked by CORS policy
```

**Fix:** Check `Backend/src/app.ts` has CORS enabled:
```typescript
import cors from 'cors';
app.use(cors());
```

#### Issue: Backend Not Running
**Error:**
```
GET http://localhost:5000/api/v1/accommodations net::ERR_CONNECTION_REFUSED
```

**Fix:**
```bash
cd Backend
npm run dev
```

#### Issue: Database Not Connected
**Error in backend console:**
```
Database connection failed
```

**Fix:** Check `.env` file has correct `DATABASE_URL`

#### Issue: Empty Database
**Error in console:**
```
⚠️ No accommodations in response
```

**Fix:** Run seed script:
```bash
cd Backend
npm run seed:accommodations
```

### 5. Manual Verification

**Check database directly:**
```sql
-- Connect to PostgreSQL
psql -U postgres -d hopin_db

-- Count accommodations
SELECT COUNT(*) FROM accommodations;
-- Should return 13

-- View all accommodations
SELECT id, name, city, country FROM accommodations;
```

### 6. Force Refresh Frontend

1. Clear browser cache: `Ctrl + Shift + Delete`
2. Hard refresh: `Ctrl + F5`
3. Or restart dev server:
```bash
cd Customer-app
# Stop with Ctrl+C
npm run dev
```

### 7. Check Network Tab

1. Open DevTools (`F12`)
2. Go to **Network** tab
3. Refresh page
4. Look for request to `/accommodations`
5. Click on it to see:
   - **Status:** Should be `200 OK`
   - **Response:** Should have JSON data

### 8. Test API Directly

**Using curl:**
```bash
curl http://localhost:5000/api/v1/accommodations
```

**Using browser:**
Navigate to: `http://localhost:5000/api/v1/accommodations`

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-here",
      "name": "HopIn Gauteng",
      "city": "Johannesburg",
      "country": "South Africa",
      "star_rating": 5,
      ...
    },
    ...
  ]
}
```

## Quick Fix Checklist

- [ ] Backend running on port 5000
- [ ] Frontend running on port 5175
- [ ] Database seeded with accommodations
- [ ] CORS enabled in backend
- [ ] No errors in browser console
- [ ] No errors in backend console
- [ ] Can access API directly in browser

## Still Not Working?

1. **Restart everything:**
```bash
# Stop all servers (Ctrl+C)

# Backend
cd Backend
npm run dev

# Frontend (new terminal)
cd Customer-app
npm run dev
```

2. **Check the logs:**
   - Browser console (F12)
   - Backend terminal output
   - Look for the emoji logs I added

3. **Verify data:**
```bash
cd Backend
npm run seed:accommodations
```

---

**After following these steps, refresh your browser and you should see the 3 featured hotels!** 🏨
