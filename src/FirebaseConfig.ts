// Import the functions you need from the SDKs you need
import { initializeApp, FirebaseApp } from "firebase/app";
import { getAnalytics, isSupported, Analytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, Auth, GoogleAuthProvider as GoogleAuthProviderType } from "firebase/auth";
import { getStorage, FirebaseStorage } from "firebase/storage";
import { getDatabase, Database } from "firebase/database";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || ""
};

// Extract project ID from authDomain for validation
const extractProjectIdFromAuthDomain = (authDomain: string | undefined): string | null => {
  if (!authDomain) return null;
  const match = authDomain.match(/^([^.]+)\.firebaseapp\.com$/);
  return match ? match[1] : null;
};

// Check if Firebase config is valid (authDomain is required for authentication)
const authDomainProjectId = extractProjectIdFromAuthDomain(firebaseConfig.authDomain);
const projectIdMatches = !authDomainProjectId || !firebaseConfig.projectId ||
  authDomainProjectId === firebaseConfig.projectId;

const isFirebaseConfigured = firebaseConfig.projectId &&
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId !== "" &&
  firebaseConfig.apiKey !== "" &&
  firebaseConfig.authDomain !== "" &&
  projectIdMatches;

// Debug: Log configuration status (only in development)
if (import.meta.env.DEV) {
  console.log('Firebase Config Check:', {
    hasProjectId: !!firebaseConfig.projectId,
    hasApiKey: !!firebaseConfig.apiKey,
    hasAuthDomain: !!firebaseConfig.authDomain,
    projectId: firebaseConfig.projectId ? firebaseConfig.projectId.substring(0, 10) + '...' : 'missing',
    apiKey: firebaseConfig.apiKey ? firebaseConfig.apiKey.substring(0, 10) + '...' : 'missing',
    authDomain: firebaseConfig.authDomain || 'missing',
    authDomainProjectId: authDomainProjectId || 'N/A',
    projectIdMatches: projectIdMatches,
    isConfigured: isFirebaseConfigured
  });

  if (!projectIdMatches && firebaseConfig.authDomain && firebaseConfig.projectId) {
    console.warn('⚠️ Project ID mismatch detected!', {
      configuredProjectId: firebaseConfig.projectId,
      authDomainProjectId: authDomainProjectId,
      authDomain: firebaseConfig.authDomain,
      message: 'The project ID in VITE_FIREBASE_PROJECT_ID should match the project ID in VITE_FIREBASE_AUTH_DOMAIN'
    });
  }
}

// Initialize Firebase only if configured
let app: FirebaseApp | null = null;
let analytics: Analytics | null = null;

if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    console.log('Firebase initialized successfully');

    // Initialize Analytics only in browser environment and if supported
    if (typeof window !== 'undefined') {
      isSupported().then((supported) => {
        if (supported && firebaseConfig.measurementId && app) {
          analytics = getAnalytics(app);
        }
      }).catch(() => {
        // Analytics not supported or failed to initialize
        console.warn('Firebase Analytics not available');
      });
    }
  } catch (error: unknown) {
    console.error('Firebase initialization error:', error);
    // Create a minimal app object to prevent crashes
    app = null;
  }
} else {
  console.warn('Firebase configuration is missing. Please set environment variables in .env file.');
  console.warn('Required variables: VITE_FIREBASE_PROJECT_ID, VITE_FIREBASE_API_KEY');
  // Create a dummy config to prevent crashes
  app = null;
}

// Initialize Firebase Auth only if app is initialized
let auth: Auth | null = null;
let googleProvider: GoogleAuthProviderType | null = null;
let storage: FirebaseStorage | null = null;
let db: Database | null = null;

if (app) {
  try {
    // Ensure we're in a browser environment before initializing auth
    if (typeof window !== 'undefined') {
      // Initialize auth with the app instance explicitly
      auth = getAuth(app);

      // Verify the auth instance has the correct configuration
      if (!auth || !auth.app || !auth.app.options) {
        throw new Error('Firebase Auth instance is invalid');
      }

      // Verify authDomain is set in the app options
      if (!auth.app.options.authDomain) {
        console.error('Firebase Auth: authDomain is missing from app options');
        throw new Error('Firebase Auth configuration is incomplete: authDomain is missing');
      }

      // Initialize Google provider
      googleProvider = new GoogleAuthProvider();
      googleProvider.addScope('profile');
      googleProvider.addScope('email');

      // Initialize Firebase Storage
      storage = getStorage(app);

      // Initialize Realtime Database
      if (firebaseConfig.databaseURL) {
        db = getDatabase(app);
        console.log('Firebase Realtime Database initialized successfully');
      } else {
        console.warn('Firebase Realtime Database URL not found. Please set VITE_FIREBASE_DATABASE_URL in your .env file.');
      }

      console.log('Firebase Auth initialized successfully', {
        authDomain: auth.app.options.authDomain,
        projectId: auth.app.options.projectId
      });
    } else {
      console.warn('Firebase Auth can only be initialized in browser environment');
    }
  } catch (error: unknown) {
    console.error('Firebase Auth initialization error:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        code: (error as any).code,
        message: error.message,
        authDomain: firebaseConfig.authDomain,
        projectId: firebaseConfig.projectId,
        appInitialized: !!app,
        appOptions: app ? app.options : null
      });
    }
    auth = null;
    googleProvider = null;
    storage = null;
    db = null;
  }
}

// Export with fallbacks
export { auth, googleProvider, storage, db, analytics };
export default app;

