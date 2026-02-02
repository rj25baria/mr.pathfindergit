# Test Credentials

## HR Portal Login
**Email:** `hr@demo.com`  
**Password:** `password123`

After login, you'll be redirected to `/hr-dashboard` where you can:
- View all student candidates in card grid format
- Search and filter candidates
- View detailed student profiles with contact information
- See recent signup alerts

## Student Login (Sample)
**Email:** `rahul.demo@example.com`  
**Password:** `password123`

After login, you'll be redirected to `/dashboard` for the student portal.

## Key Features Implemented

### Auth Page Updates
✅ **Contact Number Field** - Added optional contact number field in signup form
✅ **Signup Redirect** - After signup, users are redirected to login page instead of dashboard
✅ **HR Login Support** - Demo HR user is auto-seeded for testing
✅ **Form Validation** - Phone and contact numbers must be 10 digits

### HR Dashboard
✅ **Card Grid Layout** - Candidates displayed in beautiful card format with:
  - Score badge
  - Email (clickable)
  - Phone (clickable)
  - **Alternate Contact Number** display
  - Career Goal
  - Interests as tags
  - View Profile & Remove buttons

✅ **View Profile Modal** - Shows complete details including:
  - Primary phone number (editable)
  - **Alternate contact number**
  - Email (editable)
  - Education
  - Career goal
  - Badges & achievements
  - Contact action buttons

✅ **Recent Signups Alert** - Shows 6 most recent student signups forwarded to HR

### Candidate Alerts
✅ When a student signs up, their info is automatically sent to HR portal
✅ HR can see recent signups in the alerts panel
✅ Includes: Name, Email, Phone, Contact Number