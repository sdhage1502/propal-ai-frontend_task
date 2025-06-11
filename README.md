# PROPAL-AI-FRONTEND: Frontend Engineering Internship Task
## Overview
This project, PROPAL-AI-FRONTEND, is a Next.js application developed as part of the Frontend Engineering Internship task for proPAL AI, an indigenous Voice AI platform revolutionizing customer interactions for small and medium businesses (SMBs) in India. The app implements a user authentication system, a settings dashboard, and dynamic UI features, focusing on clean code, responsive design, and user-friendly interactions.
The application meets all task requirements, including form handling, authentication, dynamic dropdowns, and data persistence using Firebase Firestore. Additionally, it incorporates optional features like dark mode, smooth animations, and toast notifications for enhanced user experience.
Live Demo

Deployed URL: propal-ai-frontend-task.vercel.app
Repository:[ https://github.com/your-username/PROPAL-AI-FRONTEND (Replace with your GitHub repository URL)](https://github.com/sdhage1502/propal-ai-frontend_task)

Features
Required Features

Landing Page (/):

Simple layout with a "Sign Up" button that navigates to /signup.
Redirects to /home for a clean user experience.


Signup Page (/signup):

Fields: username, email, password, phone (optional).
Validates input using Joi with custom error messages.
Saves user data to Firebase Firestore (users collection).
Redirects to /login on successful signup with a toast notification.


Login Page (/login):

Fields: loginId (email or username), password.
Validates credentials against Firestore data.
On success, redirects to /dashboard/profile and saves user data to localStorage.
Displays error messages via toast notifications on failure.


Dashboard (/dashboard):

Protected route; redirects to /login if not authenticated.
Includes a sidebar with two pages: Profile and Agent.
Highlights the active sidebar item using dynamic styling.


Profile Page (/dashboard/profile):

Displays user details: username, email, phone.
Allows updating email and password (with old password verification).
Saves updates to Firestore and updates localStorage.
Shows success/error messages via toast notifications.


Agent Page (/dashboard/agent):

Loads configuration from public/stt.json.
Implements three interdependent dropdowns: Provider, Model, Language.
Changing one dropdown updates the others dynamically.


Displays a "Summary Card" below the dropdowns showing selected values (e.g., "Provider: Deepgram (deepgram)").
Persists selected values in localStorage for session continuity.



Optional Features (Bonus Points)

Dark Mode:

Implemented using a custom ThemeProviders.jsx component.
Toggles between light and dark modes with a button in the navbar.
Persists theme selection in localStorage.


Smooth UI Interactions:

Uses Framer Motion for animations (e.g., form fade-ins, button hover/tap effects, navbar slide-in).
Toast notifications (react-hot-toast) for success/error messages with a 3-second duration.


Redirects:

Redirects to /login after successful signup.
Redirects to /dashboard/profile after successful login.


Feedback Messages:

Displays success/error messages for signup, login, and profile updates using toast notifications.



Tech Stack

Framework: Next.js 14.x (App Router)
Styling: Tailwind CSS
State Management: React (useState, useEffect)
Data Storage: Firebase Firestore
Validation: Joi
Animations: Framer Motion
Notifications: React Hot Toast
Deployment: Vercel

File Structure
PROPAL-AI-FRONTEND/
├── public/
│   ├── favicon.ico
│   └── stt.json
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── users/
│   │   │       ├── [username]/
│   │   │       │   └── route.js
│   │   │       └── route.js
│   │   ├── dashboard/
│   │   │   ├── agent/
│   │   │   │   └── page.jsx
│   │   │   └── profile/
│   │   │       └── page.jsx
│   │   ├── home/
│   │   │   └── page.js
│   │   ├── login/
│   │   │   └── page.js
│   │   ├── signup/
│   │   │   └── page.js
│   │   ├── globals.css
│   │   ├── layout.js
│   │   └── page.js
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   └── ThemeProviders.jsx
│   ├── lib/
│   │   └── firebase.js
│   ├── utils/
│   │   ├── animations.js
│   │   ├── ThemeToggle.js
│   │   └── validation.js
├── .env
├── .gitignore
├── eslint.config.mjs
├── jsconfig.json
├── next.config.mjs
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── README.md
└── tailwind.config.js

Setup Instructions
Prerequisites

Node.js: Version 18.x or higher
npm: Version 8.x or higher
Firebase Account: Required for Firestore setup
Vercel Account: For deployment

1. Clone the Repository
git clone https://github.com/your-username/PROPAL-AI-FRONTEND.git
cd PROPAL-AI-FRONTEND

2. Install Dependencies
npm install

3. Configure Firebase

Create a Firebase Project:

Go to the Firebase Console.
Create a new project and enable Firestore.


Get Firebase Configuration:

In the Firebase Console, go to Project Settings.
Copy the Firebase configuration object (API key, auth domain, etc.).


Set Up Environment Variables:

Create a .env file in the project root.
Add the following Firebase environment variables:

NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id



4. Run the Development Server
npm run dev

The app will be available at http://localhost:3000.
Implementation Details
Validation
Validation is centralized in src/utils/validation.js using the Joi library, ensuring robust input validation across all forms.
Validation Schemas

Username:

Min: 3 characters, Max: 30 characters.
Allowed: Letters, numbers, underscores, hyphens (/^[a-zA-Z0-9_-]+$/).
Disallowed: Periods (.), slashes (/), empty strings, reserved names (..).
Error Examples: "Username cannot contain periods, slashes, or be empty", "Username must be at least 3 characters".


Email:

Must be a valid email format with specific top-level domains (e.g., .com, .org, .in) or multi-level domains (e.g., .co.in, .org.uk).
Required for signup and profile updates.
Error Example: "Invalid email domain (e.g., use .com, .in, .co.in)".


Phone:

Optional field.
Format: +?[1-9]\d{1,14} (e.g., +1234567890 or 1234567890).
Error Example: "Invalid phone number (e.g., +1234567890)".


Password:

Min: 8 characters.
Must include uppercase, lowercase, numbers, and special characters (@$!%*?&).
Required for signup and login; optional for profile updates (with old password verification).
Error Example: "Password must include uppercase, lowercase, number, and special character (@$!%*?&)".



Usage

Signup: Validates form data before saving to Firestore.
Login: Validates credentials before authentication.
Profile Update: Validates updated fields, ensuring the new password differs from the old one.

Errors are displayed via react-hot-toast notifications with a 3-second duration.
Firebase Integration
Firebase Firestore is used as the backend database, configured in src/lib/firebase.js.
Configuration

File: src/lib/firebase.js
SDK: Firebase 11.9.0
Environment Variables: Stored in .env (see Setup Instructions).

Firestore Structure

Collection: users
Document ID: User’s username (e.g., /users/siraj).
Document Fields:
id: Numeric user ID (auto-incremented).
username: String, unique.
email: String.
phone: String, optional.
password: String, plaintext (not recommended for production; see Security Recommendations).



Operations

Create User (POST /api/users): Saves new user data to Firestore.
Fetch Users (GET /api/users): Retrieves all users for login validation.
Update User (PUT /api/users/[username]): Updates user data in Firestore.

Authentication
The app uses a client-side authentication system with localStorage for session management.
Flow

Login:

Validates credentials against Firestore data.
On success, saves user data to localStorage and redirects to /dashboard/profile.
On failure, displays a toast error.


Session Management:

Protected routes check for a valid user in localStorage.
Redirects to /login if not authenticated.


Profile Update:

Updates user data in Firestore and localStorage.


Logout: Not implemented (see Future Improvements).


Dynamic Logic (Agent Page)
The /dashboard/agent page implements interdependent dropdowns for Provider, Model, and Language, loaded from public/stt.json. Changing one dropdown updates the others, and the selected configuration is persisted in localStorage. A Summary Card displays the selected values.
Example public/stt.json
{
  "providers": [
    {
      "name": "Deepgram",
      "value": "deepgram",
      "models": [
        {
          "name": "Nova-2",
          "value": "nova-2",
          "languages": [
            { "name": "English-US", "value": "en-US" },
            { "name": "English-IN", "value": "en-IN" }
          ]
        }
      ]
    }
  ]
}

Deployment on Vercel
1. Prepare for Deployment

Push to Git Repository:
git add .
git commit -m "Final submission for proPAL AI internship task"
git push origin main


Add Environment Variables to Vercel:

In the Vercel dashboard, go to your project settings.
Add the Firebase environment variables from .env.



2. Deploy
vercel deploy --prod

3. Test the Deployed App

Landing Page: Redirects to /home.
Signup/Login: Saves and validates user data with Firestore.
Dashboard: Displays sidebar with Profile and Agent pages.
Agent Page: Interdependent dropdowns with persisted selections.

Security Recommendations

Password Hashing: Passwords are stored in plaintext in Firestore. Use bcrypt to hash passwords in production.
Firebase Security Rules: Restrict Firestore access to authenticated users.
Server-Side Authentication: Move authentication logic to the server side using Firebase Authentication.

Future Improvements

Logout Feature: Add a logout button to clear localStorage and redirect to /login.
Enhanced Security: Implement Firebase Authentication for secure user management.
Advanced UI: Add more animations and transitions for a richer user experience.

Dependencies

next: 14.x
react: 18.x
firebase: 11.9.0
joi: 17.13.3
react-hot-toast: 2.4.1
framer-motion: 11.11.9
tailwindcss: 3.4.14

Submission Notes
This project fulfills all requirements of the proPAL AI Frontend Engineering Internship task, including:

Next.js fundamentals with App Router.
Clean UI using Tailwind CSS.
Firebase Firestore for data storage.
Simple authentication flow with form management.
Dynamic logic with interdependent dropdowns.

Additionally, it includes optional features like dark mode, animations, and toast notifications, demonstrating attention to detail and user experience.
Submitted by: [Your Name]Date: June 11, 2025Email: [your-email@example.com]GitHub: https://github.com/your-username
