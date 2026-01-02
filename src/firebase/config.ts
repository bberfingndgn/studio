// This configuration is used for the Firebase Studio environment.
// For local development, use the .env.local file.
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyD7FHD8S2dKeqEVNMB7EsGNmI1MqYP9Z2Q",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "studio-7794648938-bab60.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "studio-7794648938-bab60",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "138621825454",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:138621825454:web:8066e15f7cfe71fdb4183f",
};
