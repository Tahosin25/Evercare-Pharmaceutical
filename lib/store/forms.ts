"use client";

import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import type { ContactMessage, JobApplication } from "@/lib/types";
import { readLocal, writeLocal } from "@/lib/utils";

const APPLICATIONS_KEY = "evercare_applications";
const MESSAGES_KEY = "evercare_messages";

export async function submitApplication(
  application: Omit<JobApplication, "id" | "createdAt">,
): Promise<void> {
  if (isFirebaseConfigured && db) {
    await addDoc(collection(db, "applications"), {
      ...application,
      createdAt: serverTimestamp(),
    });
    return;
  }
  const existing = readLocal<JobApplication[]>(APPLICATIONS_KEY, []);
  writeLocal(APPLICATIONS_KEY, [
    {
      ...application,
      id: `app-${Date.now()}`,
      createdAt: new Date().toISOString(),
    },
    ...existing,
  ]);
}

export async function submitContactMessage(
  message: Omit<ContactMessage, "id" | "createdAt">,
): Promise<void> {
  if (isFirebaseConfigured && db) {
    await addDoc(collection(db, "messages"), {
      ...message,
      createdAt: serverTimestamp(),
    });
    return;
  }
  const existing = readLocal<ContactMessage[]>(MESSAGES_KEY, []);
  writeLocal(MESSAGES_KEY, [
    {
      ...message,
      id: `msg-${Date.now()}`,
      createdAt: new Date().toISOString(),
    },
    ...existing,
  ]);
}
