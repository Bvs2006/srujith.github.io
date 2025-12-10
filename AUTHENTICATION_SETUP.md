# Authentication System Setup

## Overview
A complete login and registration system for students and teachers has been implemented for the Course Companion application.

## Files Modified/Created

### 1. **Login Page** (`/src/app/page.tsx`)
- Dual-mode login interface:
  - **Demo Mode**: Quick login buttons for Teacher and Student demo accounts
  - **Standard Mode**: Email and password login form
- Features:
  - Form validation for email and password
  - Demo credentials support for quick testing
  - Link to registration page
  - Error handling and user feedback
- Demo Accounts:
  - Teacher: `e.reed@university.edu`
  - Student: `a.johnson@student.edu`
  - Any password works for demo accounts

### 2. **Registration Page** (`/src/app/register/page.tsx`) - NEW FILE
- Tab-based registration for both roles:
  - **Student Registration**: Name, Email, Password
  - **Teacher Registration**: Name, Email, Subject, Password
- Features:
  - Input validation (email format, password matching, required fields)
  - Password confirmation
  - Clear error messages
  - Auto-login after successful registration
  - Back button to login page
- Data Storage: Registered users are stored in localStorage

### 3. **Authentication Context** (`/src/context/auth-context.tsx`) - UPDATED
- Enhanced with new authentication methods:
  - `login(email: string, password: string)`: Email/password login
  - `register(userData)`: New user registration with auto-login
- Features:
  - User persistence via localStorage
  - Registered user storage in `course-companion-registered-users`
  - Current user storage in `course-companion-user`
  - Protected routes (auto-redirect to login if not authenticated)
  - Support for both demo and registered users

## User Flow

### Registration Flow
1. User visits `/register`
2. Selects Student or Teacher tab
3. Fills in required information
4. Submits form (validation runs)
5. User is registered and auto-logged in
6. Redirected to appropriate dashboard

### Login Flow
1. User visits `/` (home page)
2. Can choose Demo Login or Standard Login
3. Demo: Click role button → instant login
4. Standard: Enter email & password → login
5. Redirected to appropriate dashboard based on role

## Technical Details

### Data Storage
```
localStorage Keys:
- course-companion-user: Current logged-in user
- course-companion-registered-users: Array of all registered users
```

### User Object Structure
```typescript
User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher';
  avatarUrl: string;
  subject?: string; // For teachers only
}
```

### Validation Rules
**Students:**
- Name: Required, non-empty
- Email: Valid email format required
- Password: Minimum 6 characters

**Teachers:**
- Name: Required, non-empty
- Email: Valid email format required
- Subject: Required, non-empty
- Password: Minimum 6 characters

Both roles require password confirmation.

## Navigation

- `/` - Login page (home)
- `/register` - Registration page
- `/dashboard` - Student dashboard (protected)
- `/teacher/dashboard` - Teacher dashboard (protected)

## Features

✅ Student and Teacher registration
✅ Email and password authentication
✅ Demo login for quick testing
✅ Form validation with error messages
✅ User persistence across sessions
✅ Protected routes
✅ Automatic role-based redirects
✅ Auto-login after registration
✅ Profile creation with avatar

## Security Notes

⚠️ **This is a demo/development implementation:**
- Passwords are stored in plain text in localStorage
- No backend validation
- No HTTPS requirement enforcement
- For production, implement:
  - Backend password hashing (bcrypt, argon2)
  - JWT or session-based authentication
  - Database persistence
  - HTTPS only
  - CSRF protection
  - Rate limiting

## Testing

### Test Demo Login
1. Go to `/` 
2. Click "I am a Student" or "I am a Teacher"
3. Should be logged in and redirected

### Test Registration
1. Go to `/register`
2. Fill in student/teacher form
3. Submit and verify redirect to dashboard
4. Refresh page - user should still be logged in
5. Check localStorage for stored user data

### Test Protected Routes
1. Open DevTools and clear localStorage
2. Try to access `/dashboard` or `/teacher/dashboard`
3. Should be redirected to login page
