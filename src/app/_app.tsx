// app/_app.tsx
import '@/styles/globals.css';
import { useEffect } from 'react';
import { initializeApp, getApps } from 'firebase/app';

// Your Firebase configuration (replace with your actual values)
const firebaseConfig = {
  apiKey: "AIzaSyDdeOTZZ83Yj9eGn1xDZlGlUi9TT4Ncbao",
  authDomain: "quality-rating-prediction.firebaseapp.com",
  projectId: "quality-rating-prediction",
  storageBucket: "quality-rating-prediction.firebasestorage.app",
  messagingSenderId: "946214891389",
  appId: "1:946214891389:web:90afb943b6854b2474a614",
  measurementId: "G-DX74LL95Q2"
};

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Your App Title</title>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}

export default function App({ Component, pageProps }: { Component: React.ElementType; pageProps: any }) {
  useEffect(() => {
    if (!getApps().length) {
      initializeApp(firebaseConfig);
      console.log('Firebase app initialized in _app.tsx'); // Add this log
    } else {
      console.log('Firebase app already initialized'); // Add this log
    }
  }, []);

  return (
    <RootLayout>
      <Component {...pageProps} />
    </RootLayout>
  );
}