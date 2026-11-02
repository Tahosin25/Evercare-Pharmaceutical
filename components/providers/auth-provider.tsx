"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User as FirebaseUser,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db, isFirebaseConfigured } from "@/lib/firebase";
import type { AuthUser, DemoUserRecord } from "@/lib/types";
import { readLocal, writeLocal } from "@/lib/utils";

const DEMO_USERS_KEY = "evercare_demo_users";
const DEMO_SESSION_KEY = "evercare_demo_session";

const DEMO_ADMIN: DemoUserRecord = {
  uid: "demo-admin",
  email: "admin@evercare.com",
  name: "Evercare Admin",
  password: "admin123",
  role: "admin",
};

function ensureDemoUsers(): DemoUserRecord[] {
  const users = readLocal<DemoUserRecord[]>(DEMO_USERS_KEY, []);
  if (!users.some((user) => user.email === DEMO_ADMIN.email)) {
    const next = [...users, DEMO_ADMIN];
    writeLocal(DEMO_USERS_KEY, next);
    return next;
  }
  return users;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  isAdmin: boolean;
  demoMode: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function loadFirebaseUser(fbUser: FirebaseUser): Promise<AuthUser> {
  let role: AuthUser["role"] = "customer";
  let name = fbUser.displayName ?? "";

  if (db) {
    try {
      const snapshot = await getDoc(doc(db, "users", fbUser.uid));
      if (snapshot.exists()) {
        const data = snapshot.data();
        role = data.role === "admin" ? "admin" : "customer";
        name = data.name ?? name;
      }
    } catch (error) {
      console.error("Failed to load user profile", error);
    }
  }

  return {
    uid: fbUser.uid,
    email: fbUser.email ?? "",
    name: name || fbUser.email?.split("@")[0] || "Customer",
    role,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
        if (fbUser) {
          setUser(await loadFirebaseUser(fbUser));
        } else {
          setUser(null);
        }
        setLoading(false);
      });
      return unsubscribe;
    }

    ensureDemoUsers();
    const session = readLocal<AuthUser | null>(DEMO_SESSION_KEY, null);
    setUser(session);
    setLoading(false);
  }, []);

  const signIn = useCallback(
    async (email: string, password: string) => {
      if (isFirebaseConfigured && auth) {
        const credential = await signInWithEmailAndPassword(
          auth,
          email,
          password,
        );
        setUser(await loadFirebaseUser(credential.user));
        return;
      }

      const users = ensureDemoUsers();
      const match = users.find(
        (item) =>
          item.email.toLowerCase() === email.toLowerCase() &&
          item.password === password,
      );
      if (!match) {
        throw new Error("Invalid email or password.");
      }
      const session: AuthUser = {
        uid: match.uid,
        email: match.email,
        name: match.name,
        role: match.role,
      };
      writeLocal(DEMO_SESSION_KEY, session);
      setUser(session);
    },
    [],
  );

  const signUp = useCallback(
    async (name: string, email: string, password: string) => {
      if (isFirebaseConfigured && auth && db) {
        const credential = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );
        await updateProfile(credential.user, { displayName: name });
        await setDoc(doc(db, "users", credential.user.uid), {
          uid: credential.user.uid,
          name,
          email,
          role: "customer",
          createdAt: new Date().toISOString(),
        });
        setUser({
          uid: credential.user.uid,
          email,
          name,
          role: "customer",
        });
        return;
      }

      const users = ensureDemoUsers();
      if (users.some((item) => item.email.toLowerCase() === email.toLowerCase())) {
        throw new Error("An account with this email already exists.");
      }
      const record: DemoUserRecord = {
        uid: `demo-${Date.now()}`,
        email,
        name,
        password,
        role: "customer",
      };
      writeLocal(DEMO_USERS_KEY, [...users, record]);
      const session: AuthUser = {
        uid: record.uid,
        email: record.email,
        name: record.name,
        role: record.role,
      };
      writeLocal(DEMO_SESSION_KEY, session);
      setUser(session);
    },
    [],
  );

  const signOutUser = useCallback(async () => {
    if (isFirebaseConfigured && auth) {
      await signOut(auth);
    }
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(DEMO_SESSION_KEY);
    }
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAdmin: user?.role === "admin",
      demoMode: !isFirebaseConfigured,
      signIn,
      signUp,
      signOutUser,
    }),
    [user, loading, signIn, signUp, signOutUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }
  return context;
}
