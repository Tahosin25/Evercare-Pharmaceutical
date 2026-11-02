"use client";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { DEMO_PRODUCTS } from "@/lib/demo-data";
import type { Product } from "@/lib/types";
import { readLocal, slugify, writeLocal } from "@/lib/utils";

const CUSTOM_KEY = "evercare_custom_products";
const DELETED_KEY = "evercare_deleted_products";

function getLocalProducts(): Product[] {
  const custom = readLocal<Product[]>(CUSTOM_KEY, []);
  const deleted = readLocal<string[]>(DELETED_KEY, []);
  const base = DEMO_PRODUCTS.filter((p) => !deleted.includes(p.id));
  const merged = base.map(
    (product) => custom.find((p) => p.id === product.id) ?? product,
  );
  const added = custom.filter(
    (p) => !DEMO_PRODUCTS.some((demo) => demo.id === p.id),
  );
  return [...merged, ...added];
}

export async function fetchProducts(
  includeInactive = false,
): Promise<Product[]> {
  if (isFirebaseConfigured && db) {
    try {
      const snapshot = await getDocs(collection(db, "products"));
      const products = snapshot.docs.map((item) => ({
        id: item.id,
        ...(item.data() as Omit<Product, "id">),
      }));
      if (products.length > 0) {
        return includeInactive
          ? products
          : products.filter((p) => p.active !== false);
      }
    } catch (error) {
      console.error("Failed to load products from Firestore", error);
    }
  }

  const local = getLocalProducts();
  return includeInactive ? local : local.filter((p) => p.active !== false);
}

export async function fetchAllProducts(): Promise<Product[]> {
  const products = await fetchProducts(true);
  return products.sort((a, b) => a.name.localeCompare(b.name));
}

export async function fetchProductBySlug(
  slug: string,
): Promise<Product | undefined> {
  const products = await fetchProducts();
  return products.find((product) => product.slug === slug);
}

export interface ProductInput {
  id?: string;
  name: string;
  category: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  dosage?: string;
  uses?: string[];
  sideEffects?: string[];
  featured?: boolean;
  active?: boolean;
}

export async function saveProduct(input: ProductInput): Promise<Product> {
  const slug = slugify(input.name);
  const payload = {
    name: input.name,
    slug,
    category: input.category,
    description: input.description,
    price: input.price,
    stock: input.stock,
    imageUrl: input.imageUrl,
    dosage: input.dosage ?? "",
    uses: input.uses ?? [],
    sideEffects: input.sideEffects ?? [],
    featured: input.featured ?? false,
    active: input.active ?? true,
  };

  if (isFirebaseConfigured && db) {
    if (input.id) {
      await updateDoc(doc(db, "products", input.id), payload);
      return { id: input.id, ...payload };
    }
    const created = await addDoc(collection(db, "products"), {
      ...payload,
      createdAt: serverTimestamp(),
    });
    return { id: created.id, ...payload };
  }

  const custom = readLocal<Product[]>(CUSTOM_KEY, []);
  const id = input.id ?? `local-${Date.now()}`;
  const product: Product = { id, ...payload };
  const next = [...custom.filter((p) => p.id !== id), product];
  writeLocal(CUSTOM_KEY, next);
  return product;
}

export async function deleteProduct(id: string): Promise<void> {
  if (isFirebaseConfigured && db) {
    await deleteDoc(doc(db, "products", id));
    return;
  }
  const deleted = readLocal<string[]>(DELETED_KEY, []);
  if (!deleted.includes(id)) {
    writeLocal(DELETED_KEY, [...deleted, id]);
  }
  const custom = readLocal<Product[]>(CUSTOM_KEY, []);
  writeLocal(
    CUSTOM_KEY,
    custom.filter((p) => p.id !== id),
  );
}

export async function seedDemoProducts(): Promise<number> {
  if (!(isFirebaseConfigured && db)) {
    writeLocal(CUSTOM_KEY, []);
    writeLocal(DELETED_KEY, []);
    return DEMO_PRODUCTS.length;
  }
  const firestore = db;
  const existing = await getDocs(collection(firestore, "products"));
  if (!existing.empty) return 0;
  await Promise.all(
    DEMO_PRODUCTS.map((product) => {
      const { id, ...rest } = product;
      return setDoc(doc(firestore, "products", id), {
        ...rest,
        createdAt: serverTimestamp(),
      });
    }),
  );
  return DEMO_PRODUCTS.length;
}
