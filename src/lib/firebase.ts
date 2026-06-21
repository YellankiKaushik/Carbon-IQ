import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAnalytics, isSupported, type Analytics } from 'firebase/analytics';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

function hasFirebaseConfig() {
    return Boolean(
        firebaseConfig.apiKey &&
        firebaseConfig.authDomain &&
        firebaseConfig.projectId &&
        firebaseConfig.appId &&
        firebaseConfig.measurementId
    );
}

export const firebaseApp: FirebaseApp | null = hasFirebaseConfig()
    ? getApps()[0] ?? initializeApp(firebaseConfig)
    : null;

let analyticsPromise: Promise<Analytics | null> | null = null;

export function getFirebaseAnalytics(): Promise<Analytics | null> {
    if (!firebaseApp || typeof window === 'undefined') {
        return Promise.resolve(null);
    }

    if (!analyticsPromise) {
        analyticsPromise = isSupported()
            .then((supported) => (supported ? getAnalytics(firebaseApp) : null))
            .catch(() => null);
    }

    return analyticsPromise;
}
