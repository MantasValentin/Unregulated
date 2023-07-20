# Unregulated social media site

Fully functional Reddit style social media site

## Requirements

As this website uses Firebase for account and data handling, you will need to set up a connection to your Firebase project with your environment variables in ".env.local" file.

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
```

Set up Firestore Database and add Google, Github authentication or delete "OAuthButtons.tsx" file to only require Firestore.

## Getting Started

To get all the packages.

```bash
npm install
```

To launch the app.

```bash
npm run dev
```

## Visit site

https://unregulated.vercel.app/
