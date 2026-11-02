"use client";

import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import type { Order, OrderStatus } from "@/lib/types";
import { readLocal, writeLocal } from "@/lib/utils";

const LOCAL_ORDERS_KEY = "evercare_orders";

function getLocalOrders(): Order[] {
  return readLocal<Order[]>(LOCAL_ORDERS_KEY, []);
}

function normalizeCreatedAt(value: unknown): string {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && "toDate" in value) {
    try {
      return (value as { toDate: () => Date }).toDate().toISOString();
    } catch {
      return new Date().toISOString();
    }
  }
  return new Date().toISOString();
}

function toOrder(id: string, data: Record<string, unknown>): Order {
  return {
    ...(data as Omit<Order, "id">),
    id,
    createdAt: normalizeCreatedAt(data.createdAt),
  };
}

export async function createOrder(
  order: Omit<Order, "id">,
): Promise<Order> {
  if (isFirebaseConfigured && db) {
    const created = await addDoc(collection(db, "orders"), {
      ...order,
      createdAt: serverTimestamp(),
    });
    return { ...order, id: created.id };
  }
  const local: Order = { ...order, id: `EV-${Date.now().toString(36).toUpperCase()}` };
  writeLocal(LOCAL_ORDERS_KEY, [local, ...getLocalOrders()]);
  return local;
}

export async function fetchOrdersForUser(userId: string): Promise<Order[]> {
  if (isFirebaseConfigured && db) {
    try {
      const snapshot = await getDocs(
        query(collection(db, "orders"), where("userId", "==", userId)),
      );
      const orders = snapshot.docs.map((item) =>
        toOrder(item.id, item.data()),
      );
      return orders.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    } catch (error) {
      console.error("Failed to load orders from Firestore", error);
      return getLocalOrders().filter((order) => order.userId === userId);
    }
  }
  return getLocalOrders().filter((order) => order.userId === userId);
}

export async function fetchAllOrders(): Promise<Order[]> {
  if (isFirebaseConfigured && db) {
    try {
      const snapshot = await getDocs(collection(db, "orders"));
      const orders = snapshot.docs.map((item) =>
        toOrder(item.id, item.data()),
      );
      return orders.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    } catch (error) {
      console.error("Failed to load orders from Firestore", error);
      return getLocalOrders();
    }
  }
  return getLocalOrders();
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
): Promise<void> {
  if (isFirebaseConfigured && db) {
    await updateDoc(doc(db, "orders", id), { status });
    return;
  }
  const orders = getLocalOrders().map((order) =>
    order.id === id ? { ...order, status } : order,
  );
  writeLocal(LOCAL_ORDERS_KEY, orders);
}

export async function markOrderPaid(id: string): Promise<void> {
  return updateOrderStatus(id, "paid");
}
