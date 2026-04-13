# Settings Management - Quick Reference Guide

## 🚀 Getting Started

### What Was Added/Changed

#### New Files
- **`src/components/settings-manager.tsx`** - Full settings management component with form, preview, and API integration

#### Modified Files
- **`src/app/admin/page.tsx`** - Updated to include tabbed interface (Menu + Settings)

#### Existing Files (Already in Place)
- `src/app/api/settings/route.ts` - API endpoint (GET/POST)
- `src/lib/settings-store.ts` - File operations & validation
- `src/types/settings.ts` - TypeScript types
- `data/settings.json` - Data persistence

---

## 📋 Features at a Glance

| Feature | Details |
|---------|---------|
| **Logo Management** | Upload image or enter URL, live preview |
| **Contact Info** | Phone, WhatsApp, Address, Hours |
| **Social Links** | Instagram, Facebook, Twitter, Zomato |
| **Live Preview** | See changes in real-time before saving |
| **Auto-save** | POST to API on save, updates `settings.json` |
| **Validation** | Required fields validated before save |
| **Responsive** | Mobile-first design with Tailwind CSS |
| **No Auth** | Simple implementation, no login required |

---

## 🎨 UI Components

```
Admin Dashboard
├── Header
│   ├── Title: "Management Dashboard"
│   └── Back to Home button
│
├── Tabs
│   ├── 📋 Menu Management (existing)
│   └── ⚙️ Settings (new)
│
└── Content Area
    ├── Logo Preview Panel
    ├── Contact Information Section
    ├── Social Media Section
    ├── Action Buttons (Save/Reset)
    └── Live Preview Section
```

---

## 🔧 How to Test

### 1. **Start the Development Server**
```bash
cd c:\Projects\P3\sub-on-cloud
npm run dev
# or
yarn dev
```

### 2. **Access Admin Page**
Navigate to: `http://localhost:3000/admin`

### 3. **Test Menu Tab (Existing)**
- Click "📋 Menu Management" tab
- Should see existing menu management interface

### 4. **Test Settings Tab (New)**
- Click "⚙️ Settings" tab
- Should see the new settings form

### 5. **Test Logo Upload**
- Scroll to Logo section
- Click "Choose File" button
- Select an image from your computer
- Image should preview immediately

### 6. **Test Logo URL**
- In "Enter logo URL" field
- Paste: `https://via.placeholder.com/200`
- Logo preview should update

### 7. **Edit Form Fields**
- Try changing any value (phone, address, links)
- Preview section below should update in real-time

### 8. **Test Save**
- Make a small change (e.g., add an Instagram link)
- Click "Save Settings" button
- Should see "✓ Settings saved successfully!" message
- Open `data/settings.json` - changes should be there

### 9. **Test Reset**
- Make changes
- Click "Reset" button
- Form should revert to saved values

### 10. **Test Error Handling**
- Try removing the phone number and saving
- Should see error: "Phone is required"

---

## 📁 File Structure

```
Project Root
├── data/
│   └── settings.json ........................ Data file (auto-updated)
│
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   └── page.tsx ..................... UPDATED (tabbed interface)
│   │   └── api/
│   │       └── settings/
│   │           └── route.ts ................ GET/POST handlers
│   │
│   ├── components/
│   │   ├── admin-panel.tsx ................. Menu management (existing)
│   │   └── settings-manager.tsx ............ NEW Settings component
│   │
│   ├── lib/
│   │   └── settings-store.ts ............... File I/O & validation
│   │
│   └── types/
│       └── settings.ts ..................... TypeScript types
│
├── SETTINGS_MANAGEMENT.md .................. Full documentation
├── SETTINGS_EXAMPLES.md .................... Usage examples
└── QUICK_REFERENCE.md ..................... This file
```

---

## 🔄 API Endpoints

### GET /api/settings
**Fetch current settings**
```bash
curl http://localhost:3000/api/settings
```

**Response:**
```json
{
  "logo": "/images/logo.png",
  "phone": "9999999999",
  "whatsapp": "919999999999",
  "address": "Manjalpur, Vadodara",
  "instagram": "",
  "facebook": "",
  "twitter": "",
  "zomato": "",
  "openingHours": "11 AM - 11 PM"
}
```

### POST /api/settings
**Update settings**
```bash
curl -X POST http://localhost:3000/api/settings \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "9876543210",
    "address": "New Address, City"
  }'
```

---

## ✅ Required Fields

These fields are **required** and must have values:
- ✅ Logo
- ✅ Phone
- ✅ WhatsApp
- ✅ Address
- ✅ Opening Hours

**Optional fields** (can be empty):
- Instagram link
- Facebook link
- Twitter link
- Zomato link

---

## 🎯 Component Props & Exports

### SettingsManager Component
```typescript
// No props required - handles its own state
import { SettingsManager } from "@/components/settings-manager";

export function YourComponent() {
  return <SettingsManager />;
}
```

---

## 🛠️ Customization Options

### Change Brand Color
Edit `settings-manager.tsx` - replace `#E60000` with your color:
```tsx
// Change button color
className="bg-[#E60000]" // Replace with your color
```

### Add More Fields
1. Add field to `src/types/settings.ts`
2. Update `data/settings.json`
3. Update validation in `src/lib/settings-store.ts`
4. Add input field to form in `settings-manager.tsx`
5. Add to preview section

### Change Form Layout
Modify the grid in `settings-manager.tsx`:
```tsx
// Currently: 1 col mobile, 3 cols desktop
<div className="grid gap-8 lg:grid-cols-3">
  {/* Logo preview */}
  {/* Form fields */}
</div>

// Change to 2 columns:
<div className="grid gap-8 lg:grid-cols-2">
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Settings page shows loading spinner | Check if `/api/settings` endpoint is working |
| Changes not saving | Check browser Network tab for POST errors |
| Logo preview not showing | Verify image URL is accessible (CORS issues?) |
| Form keeps resetting | Check browser console for API errors |
| File not being created | Ensure `data/` directory exists and has write permissions |

---

## 📝 Data Flow Diagram

```
┌──────────────────┐
│  Frontend Form   │ (SettingsManager component)
└────────┬─────────┘
         │ onChange (live)
         ▼
┌──────────────────┐
│  Live Preview    │ (real-time updates)
└──────────────────┘

         │ onClick Save
         ▼
┌──────────────────┐
│   POST Request   │ (to /api/settings)
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  API Handler     │ (route.ts)
└────────┬─────────┘
         │ validateSettingsPayload
         ▼
┌──────────────────┐
│   Validation     │ (settings-store.ts)
└────────┬─────────┘
         │ valid
         ▼
┌──────────────────┐
│ Write to File    │ (data/settings.json)
└────────┬─────────┘
         │ revalidatePath
         ▼
┌──────────────────┐
│ Response + Show  │ (success message)
│ Success Message  │
└──────────────────┘
```

---

## 🚀 Production Checklist

Before deploying to production, consider:

- [ ] Add authentication/authorization
- [ ] Implement audit logging for who changed what and when
- [ ] Add backup/version history
- [ ] Validate image uploads (size, format)
- [ ] Compress images before saving
- [ ] Add rate limiting to API
- [ ] Use environment variables for config
- [ ] Implement database instead of file-based storage
- [ ] Add proper error monitoring/logging
- [ ] Create admin user management

---

## 📞 Support

For issues or questions:
1. Check `SETTINGS_MANAGEMENT.md` for detailed documentation
2. Review `SETTINGS_EXAMPLES.md` for usage examples
3. Check browser console for client-side errors
4. Check server logs for API errors
5. Verify file permissions on `data/settings.json`

---

**Last Updated**: April 12, 2026
**Status**: ✅ Ready for Testing
