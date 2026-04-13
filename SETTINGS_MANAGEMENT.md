# Settings Management System - Implementation Guide

## Overview
The admin panel has been upgraded to include a complete Settings Management section alongside the existing Menu Manager. Users can now manage restaurant information, contact details, social media links, and logo through a clean, tabbed interface.

## Features Implemented

### 1. **Settings Manager Component** (`/src/components/settings-manager.tsx`)
A full-featured React component with:
- **Logo Management**
  - Image file upload with preview
  - URL input for remote logo sources
  - Live logo preview display
  
- **Contact Information**
  - Phone number field
  - WhatsApp number field
  - Address textarea
  - Opening hours field

- **Social Media Links**
  - Instagram profile URL
  - Facebook profile URL
  - Twitter profile URL
  - Zomato restaurant link

- **Live Preview Section**
  - Shows current values in real-time
  - Clickable social media links for testing
  - Contact information formatted for display

- **Auto-save Features**
  - Save button triggers POST to `/api/settings`
  - Reset button to revert unsaved changes
  - Success/error messages with auto-dismiss
  - Loading states during fetch/save operations

### 2. **API Integration** (`/src/app/api/settings/route.ts`)
Already implemented with:
- **GET /api/settings** - Fetches current settings from `data/settings.json`
- **POST /api/settings** - Updates settings with validation
- Automatic cache revalidation after updates
- Error handling and validation

### 3. **Data Persistence** (`/src/lib/settings-store.ts`)
- Reads/writes to `data/settings.json`
- Validates incoming data
- Provides default values
- File-based persistence (no database needed)

### 4. **Updated Admin Page** (`/src/app/admin/page.tsx`)
- Now uses "use client" for client-side interactivity
- Tabbed interface: Menu Management | Settings
- Easy switching between sections
- Clean, professional layout

## Usage

### Accessing the Admin Panel
```
http://localhost:3000/admin
```

### Tabs Available
1. **📋 Menu Management** - Manage menu items and categories (existing functionality)
2. **⚙️ Settings** - Manage restaurant settings (new)

### Making Changes in Settings
1. Click the "⚙️ Settings" tab
2. Edit any field:
   - Upload logo image or enter URL
   - Update contact information
   - Add/update social media links
3. See live preview on the right (desktop) or below (mobile)
4. Click "Save Settings" to persist changes
5. Click "Reset" to discard unsaved changes

## API Examples

### Get Current Settings
```bash
GET /api/settings

Response:
{
  "logo": "/images/logo.png",
  "phone": "9999999999",
  "whatsapp": "919999999999",
  "address": "Manjalpur, Vadodara",
  "instagram": "https://instagram.com/...",
  "facebook": "https://facebook.com/...",
  "twitter": "https://twitter.com/...",
  "zomato": "https://zomato.com/...",
  "openingHours": "11 AM - 11 PM"
}
```

### Update Settings
```bash
POST /api/settings
Content-Type: application/json

{
  "phone": "9876543210",
  "address": "New Address, City",
  "instagram": "https://instagram.com/newprofile"
}

Response: (Updated settings object)
```

## File Structure

```
src/
├── components/
│   ├── admin-panel.tsx          (Menu management - existing)
│   └── settings-manager.tsx     (NEW - Settings management)
├── app/
│   ├── admin/
│   │   └── page.tsx             (UPDATED - Tabbed interface)
│   └── api/
│       └── settings/
│           └── route.ts         (Existing - GET/POST handlers)
├── lib/
│   └── settings-store.ts        (Existing - File I/O & validation)
├── types/
│   └── settings.ts              (Existing - TypeScript types)
└── data/
    └── settings.json            (Data file - auto-updated)
```

## UI/UX Details

### Design
- **Color Scheme**: Uses brand colors (#E60000 for primary red)
- **Layout**: Responsive grid (1 column mobile, 3 columns desktop)
- **Logo Preview**: Large preview area with dashed border
- **Form Fields**: Clear labels with grouped sections
- **Preview Section**: Shows how data appears to users

### Validation
- Required fields: Logo, Phone, WhatsApp, Address, Opening Hours
- Optional fields: All social media links
- Real-time preview updates as you type
- Error messages displayed prominently
- Success confirmation with auto-dismiss

### Accessibility
- Semantic HTML labels
- Proper form inputs with types
- Clear visual feedback for interactions
- Loading spinner during async operations

## No Authentication Required
This implementation is intentionally simple with no authentication. For production, consider adding:
- Admin authentication middleware
- Role-based access control
- Audit logging for changes
- Backup/version history

## Styling
All styles use **Tailwind CSS** with:
- Responsive design (mobile-first)
- Smooth transitions and hover effects
- Professional spacing and typography
- Consistent with existing admin theme

## Troubleshooting

### Settings Not Saving?
- Check browser console for API errors
- Verify `/api/settings` endpoint is accessible
- Ensure `data/settings.json` exists and is writable

### Logo Preview Not Showing?
- For URL uploads: Verify CORS settings if from external domain
- For file uploads: Check browser file upload permissions
- Supported formats: PNG, JPG, JPEG, GIF, WebP

### Changes Not Persisting?
- Check if file write permissions are set correctly
- Verify `data/` directory exists
- Check Next.js logs for file system errors

## Future Enhancements
- Image optimization and compression
- Drag-and-drop logo upload
- Settings version history
- Admin authentication
- Preview on multiple devices
- Settings templates/presets
