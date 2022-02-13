import { useEffect, useRef } from "react";

import { getApp, getApps, initializeApp } from "firebase/app";
import type { FirebaseOptions } from "firebase/app";

import type { Auth } from "firebase/auth";
import { getAuth } from "firebase/auth";

import { getAnalytics } from "firebase/analytics";
import type { Analytics } from "firebase/analytics";

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim(),
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN?.trim(),
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL?.trim(),
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim(),
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?.trim(),
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID?.trim(),
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID?.trim(),
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID?.trim(),
};

const _app = () => {
  if (getApps().length <= 0) {
    const app = initializeApp(firebaseConfig);
    // Check that `window` is in scope for the analytics module!
    if (typeof window !== "undefined") {
      getAuth();

      // Enable analytics. https://firebase.google.com/docs/analytics/get-started
      if ("measurementId" in firebaseConfig) {
        getAnalytics();
      }
    }
    return app;
  } else {
    return getApp();
  }
};

export const firebaseApp = _app();

export const useFirebaseAuth = () => {
  const auth = useRef<Auth>();

  useEffect(() => {
    auth.current = getAuth(firebaseApp);
  }, []);

  return auth;
};

export const useFirebaseAnalytics = () => {
  const analytics = useRef<Analytics>();

  useEffect(() => {
    analytics.current = getAnalytics(firebaseApp);
  }, []);

  return analytics;
};
