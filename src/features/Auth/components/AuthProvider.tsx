"use client";

import React, { useEffect, useState } from "react";
import { FirebaseApp, initializeApp } from "@firebase/app";
import { getAuth, UserInfo } from "@firebase/auth";

export const AuthContext = React.createContext<{
  user: UserInfo | null;
}>({ user: null });

let firebaseApp: FirebaseApp;

export function AuthProvider({ children }: { children: JSX.Element }) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };

  if (!firebaseApp) {
    firebaseApp = initializeApp(firebaseConfig);
  }

  useEffect(() => {
    const firebaseAuth = getAuth(firebaseApp);

    firebaseAuth.onIdTokenChanged(async (authUser) => {
      if (authUser) {
        setUser(authUser);
        const token = await authUser.getIdToken();

        document.cookie = `jwt=${token}; max-age=1800; Path=/`;
      } else {
        document.cookie = "jwt=; max-age=-1800; Path=/";
        setUser(null);
      }
    });
  }, []);

  useEffect(() => {
    const firebaseAuth = getAuth(firebaseApp);

    const handle = setInterval(async () => {
      const currentUser = firebaseAuth.currentUser;
      if (currentUser) await currentUser.getIdToken(true);
    }, 10 * 60 * 1000);

    // clean up setInterval
    return () => clearInterval(handle);
  }, []);

  const value = {
    user,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
