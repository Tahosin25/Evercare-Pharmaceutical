"use client";

import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { readLocal, writeLocal } from "@/lib/utils";

const SUBSCRIBERS_KEY = "evercare_subscribers";

export async function subscribeEmail(email: string): Promise<void> {
  if (isFirebaseConfigured && db) {
    await addDoc(collection(db, "subscribers"), {
      email,
      createdAt: serverTimestamp(),
    });
    return;
  }
  const existing = readLocal<string[]>(SUBSCRIBERS_KEY, []);
  if (!existing.includes(email)) {
    writeLocal(SUBSCRIBERS_KEY, [...existing, email]);
  }
}
