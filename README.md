# Business Directory Application

## Overview

A responsive business directory application that allows users to browse, search, and filter local businesses using Firebase Firestore as the backend database.

## Features

- **Business Listings**: Display businesses in a grid view with company logo, name, category, and rating
- **Search & Filtering**: Search businesses by name or description, filter by category, location, and rating
- **Business Details**: View detailed business information including contact details, hours, location map, and reviews
- **User Authentication**: Firebase authentication for user accounts
- **Favorites**: Authenticated users can save businesses to their favorites list
- **Reviews**: Authenticated users can submit reviews for businesses
- **Responsive Design**: Mobile-friendly interface that works on all device sizes

## Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **UI Components**: Shadcn UI (built on Radix UI)
- **Backend**: Firebase (Authentication, Firestore)
- **Routing**: React Router
- **Form Handling**: React Hook Form with Zod validation
- **Maps**: Google Maps API integration

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase account

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd business-directory
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Set up environment variables

Create a `.env` file in the root directory with the following variables:

```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

4. Start the development server

```bash
npm run dev
# or
yarn dev
```

5. Seed the database (first time setup)

The application will prompt you to seed the database with sample data on first run.

## Project Structure

```
src/
├── components/       # UI components
│   ├── auth/         # Authentication components
│   ├── business/     # Business-related components
│   ├── layout/       # Layout components (Header, Footer)
│   └── ui/           # Shadcn UI components
├── context/          # React context providers
├── layouts/          # Page layouts
├── lib/              # Utility functions and services
│   ├── authService.ts       # Firebase auth functions
│   ├── businessService.ts   # Firestore business operations
│   ├── firebase.ts          # Firebase initialization
│   └── seedData.ts          # Database seeding utilities
├── pages/            # Page components
├── types/            # TypeScript type definitions
└── main.tsx          # Application entry point
```

## Firebase Setup

1. Create a Firebase project at [firebase.google.com](https://firebase.google.com)
2. Enable Authentication (Email/Password)
3. Create a Firestore database
4. Set up security rules for Firestore
5. Add your Firebase configuration to environment variables

## License

MIT
