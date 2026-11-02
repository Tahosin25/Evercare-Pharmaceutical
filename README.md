# Evercare Pharmaceuticals

A complete full-stack pharmaceutical e-commerce website built with **Next.js (App Router)**, **Tailwind CSS v4**, **Firebase** and **Stripe**, designed for deployment on **Vercel**.

## Features

- Modern, responsive marketing site (hero, features, categories, about, wellness, testimonials)
- Product catalogue with search, category filters and sorting
- Product detail pages with dosage, uses and side effects
- Cart drawer + cart page with quantity controls
- Secure checkout (shipping form, Stripe Checkout, cash on delivery)
- Free shipping automatically applied on orders over **$50**
- Customer accounts (Firebase Auth), order history
- Admin dashboard: revenue/order stats, product CRUD with image upload, order status management
- Careers page with application form, contact form, newsletter signup
- Graceful **demo mode**: the entire store works out of the box without Firebase/Stripe credentials, storing data in `localStorage`

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Environment variables are optional — the store runs in demo mode without them. To configure, copy `.env.example` to `.env.local` and fill in your keys (Windows: `copy .env.example .env.local`).

> If `npm install` reports a peer-dependency conflict or leaves a partially installed `node_modules`, delete that folder and retry with `npm install --legacy-peer-deps`.

### Demo credentials

| Role  | Email               | Password |
| ----- | ------------------- | -------- |
| Admin | admin@evercare.com  | admin123 |

In demo mode, sign up creates a local customer account, checkout is simulated (no real charge), and all data (orders, products, applications) is stored in the browser.

## Environment variables

See `.env.example`. Add your Firebase web config to enable real authentication, Firestore and Storage; add Stripe keys to enable live card payments.

## Firebase setup

1. Create a project in the [Firebase console](https://console.firebase.google.com).
2. Enable **Authentication → Email/Password**.
3. Create a **Firestore** database and a **Storage** bucket.
4. Register a web app and copy the config into `.env.local`.
5. Create an admin user (Authentication → Users), then add a document in the `users` collection with the user's UID and:

```json
{ "uid": "<uid>", "name": "Admin", "email": "admin@evercare.com", "role": "admin", "createdAt": "..." }
```

6. In the admin dashboard, use **Seed demo data** to populate the `products` collection with the demo catalogue.

### Suggested Firestore rules

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAdmin() {
      return request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    match /products/{id} {
      allow read: if true;
      allow write: if isAdmin();
    }
    match /orders/{id} {
      allow read: if isAdmin() || (request.auth != null && resource.data.userId == request.auth.uid);
      allow create: if request.auth != null;
      allow update: if isAdmin() || (request.auth != null && resource.data.userId == request.auth.uid);
      allow delete: if isAdmin();
    }
    match /users/{uid} {
      allow read: if request.auth != null && (request.auth.uid == uid || isAdmin());
      allow write: if request.auth != null && request.auth.uid == uid;
    }
    match /{collection}/{id} {
      allow read, write: if isAdmin();
      allow create: if collection in ['subscribers', 'applications', 'messages'];
    }
  }
}
```

### Firebase Storage rules

```js
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{file} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Stripe setup

1. Add `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` and `STRIPE_SECRET_KEY` to `.env.local`.
2. For production webhooks, create an endpoint at `https://your-domain.com/api/webhook` listening for `checkout.session.completed` and set `STRIPE_WEBHOOK_SECRET`.
3. The webhook logs completed payments; to mark Firestore orders as paid server-side, add the Firebase Admin SDK with a service account (the success page also confirms payment client-side in the current implementation).

## Deploy to Vercel

1. Push the `evercare` folder to a GitHub repository.
2. Import the repo in [Vercel](https://vercel.com/new).
3. Add all environment variables from `.env.example` in **Project → Settings → Environment Variables**.
4. Deploy. Set `NEXT_PUBLIC_SITE_URL` to your production URL for correct Stripe redirects.

## Scripts

```bash
npm run dev     # development server
npm run build   # production build
npm run start   # production server
npm run lint    # ESLint
```

## Tech stack

- Next.js 16 (App Router, TypeScript)
- Tailwind CSS v4
- Firebase (Auth, Firestore, Storage)
- Stripe Checkout
- Zustand (cart state, persisted)
- Framer Motion, Lucide icons
- React Hook Form + Zod
