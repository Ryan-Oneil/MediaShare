import React, { useEffect, useState } from "react";
import { initializeApp } from "@firebase/app";
import { Auth, getAuth, UserInfo } from "@firebase/auth";

export const AuthContext = React.createContext<{
  initializing: boolean;
  user: UserInfo | null;
  auth?: Auth;
}>({ initializing: true, user: null });

export function AuthProvider({ children }: { children: JSX.Element }) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [auth, setAuth] = useState<Auth>();
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };
  const firebaseApp = initializeApp(firebaseConfig);

  useEffect(() => {
    const firebaseAuth = getAuth(firebaseApp);

    firebaseAuth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
      setInitializing(false);
    });
    setAuth(firebaseAuth);
  }, []);

  const value = {
    user,
    initializing,
    auth,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
