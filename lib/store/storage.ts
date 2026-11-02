"use client";

import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/lib/firebase";

export async function uploadImage(file: File, folder = "products") {
  if (!storage) {
    throw new Error(
      "Firebase Storage is not configured. Add your Firebase environment variables or paste an image URL instead.",
    );
  }
  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "-");
  const path = `${folder}/${Date.now()}-${safeName}`;
  const fileRef = ref(storage, path);
  await uploadBytes(fileRef, file);
  return getDownloadURL(fileRef);
}
