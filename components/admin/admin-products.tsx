"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import {
  Database,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import {
  deleteProduct,
  fetchAllProducts,
  saveProduct,
  seedDemoProducts,
} from "@/lib/store/products";
import { uploadImage } from "@/lib/store/storage";
import type { Product } from "@/lib/types";
import { isFirebaseConfigured } from "@/lib/firebase";
import { formatPrice } from "@/lib/utils";

const categories = [
  { value: "tablets", label: "Tablets & Capsules" },
  { value: "syrups", label: "Syrups & Suspensions" },
  { value: "injectables", label: "Injectables" },
  { value: "ointments", label: "Ointments & Creams" },
];

export function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setProducts(await fetchAllProducts());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function openCreate() {
    setEditing(null);
    setImageUrl("");
    setError("");
    setMessage("");
    setFormOpen(true);
  }

  function openEdit(product: Product) {
    setEditing(product);
    setImageUrl(product.imageUrl);
    setError("");
    setMessage("");
    setFormOpen(true);
  }

  async function handleUpload(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const url = await uploadImage(file);
      setImageUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    const form = new FormData(event.currentTarget);
    try {
      await saveProduct({
        id: editing?.id,
        name: String(form.get("name") ?? "").trim(),
        category: String(form.get("category") ?? "tablets"),
        description: String(form.get("description") ?? "").trim(),
        price: Number(form.get("price") ?? 0),
        stock: Number(form.get("stock") ?? 0),
        imageUrl: imageUrl.trim(),
        dosage: String(form.get("dosage") ?? "").trim(),
        uses: String(form.get("uses") ?? "")
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        sideEffects: String(form.get("sideEffects") ?? "")
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        featured: form.get("featured") === "on",
        active: form.get("active") === "on",
      });
      setMessage(editing ? "Product updated." : "Product created.");
      setFormOpen(false);
      setEditing(null);
      setImageUrl("");
      await load();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to save the product.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(product: Product) {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) {
      return;
    }
    try {
      await deleteProduct(product.id);
      setMessage("Product deleted.");
      await load();
    } catch {
      setError("Unable to delete the product.");
    }
  }

  async function handleSeed() {
    try {
      const count = await seedDemoProducts();
      setMessage(
        count > 0
          ? `${count} demo products seeded.`
          : "Products already exist — nothing to seed.",
      );
      await load();
    } catch {
      setError("Unable to seed products.");
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-ink sm:text-3xl">
            Products
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            {products.length} product{products.length === 1 ? "" : "s"} in your
            catalogue.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={load}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-ink-soft transition hover:text-ink"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </button>
          {isFirebaseConfigured ? (
            <button
              type="button"
              onClick={handleSeed}
              className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-white px-4 py-2.5 text-xs font-bold text-brand-800 transition hover:bg-brand-50"
            >
              <Database className="h-3.5 w-3.5" /> Seed demo data
            </button>
          ) : null}
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-1.5 rounded-full bg-brand-700 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-brand-800"
          >
            <Plus className="h-3.5 w-3.5" /> Add product
          </button>
        </div>
      </div>

      {message ? (
        <p className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-700">
          {message}
        </p>
      ) : null}
      {error && !formOpen ? (
        <p className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-700">
          {error}
        </p>
      ) : null}

      {formOpen ? (
        <form
          key={editing?.id ?? "new"}
          onSubmit={handleSubmit}
          className="mt-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-ink">
              {editing ? "Edit product" : "New product"}
            </h2>
            <button
              type="button"
              onClick={() => setFormOpen(false)}
              aria-label="Close form"
              className="grid h-9 w-9 place-items-center rounded-full text-ink-soft hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-soft">
                Product name
              </span>
              <input
                name="name"
                required
                defaultValue={editing?.name}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-soft">
                Category
              </span>
              <select
                name="category"
                defaultValue={editing?.category ?? "tablets"}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-400"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-soft">
                Price (USD)
              </span>
              <input
                name="price"
                type="number"
                min={0}
                step="0.01"
                required
                defaultValue={editing?.price ?? 9.99}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-400"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-soft">
                Stock quantity
              </span>
              <input
                name="stock"
                type="number"
                min={0}
                required
                defaultValue={editing?.stock ?? 100}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-400"
              />
            </label>

            <div className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-soft">
                Product image
              </span>
              <div className="flex gap-2">
                <input
                  value={imageUrl}
                  onChange={(event) => setImageUrl(event.target.value)}
                  placeholder="https://..."
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-400"
                />
                {isFirebaseConfigured ? (
                  <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 px-4 text-xs font-bold text-ink-soft transition hover:border-brand-300 hover:text-brand-800">
                    {uploading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                    Upload
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(event) => handleUpload(event.target.files?.[0])}
                    />
                  </label>
                ) : null}
              </div>
              {imageUrl ? (
                <div className="relative mt-2 h-20 w-20 overflow-hidden rounded-xl bg-slate-100">
                  <Image
                    src={imageUrl}
                    alt="Product preview"
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
              ) : null}
            </div>

            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-soft">
                Description
              </span>
              <textarea
                name="description"
                required
                rows={3}
                defaultValue={editing?.description}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-400"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-soft">
                Dosage
              </span>
              <input
                name="dosage"
                defaultValue={editing?.dosage}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-400"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-soft">
                Uses (comma separated)
              </span>
              <input
                name="uses"
                defaultValue={editing?.uses?.join(", ")}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-400"
              />
            </label>

            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-soft">
                Side effects (comma separated)
              </span>
              <input
                name="sideEffects"
                defaultValue={editing?.sideEffects?.join(", ")}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-400"
              />
            </label>

            <div className="flex items-center gap-6 sm:col-span-2">
              <label className="flex items-center gap-2 text-sm font-medium text-ink">
                <input
                  type="checkbox"
                  name="featured"
                  defaultChecked={editing?.featured}
                  className="h-4 w-4 accent-brand-700"
                />
                Featured
              </label>
              <label className="flex items-center gap-2 text-sm font-medium text-ink">
                <input
                  type="checkbox"
                  name="active"
                  defaultChecked={editing?.active ?? true}
                  className="h-4 w-4 accent-brand-700"
                />
                Active
              </label>
            </div>
          </div>

          {error ? (
            <p className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-700">
              {error}
            </p>
          ) : null}

          <div className="mt-6 flex gap-2">
            <button
              type="submit"
              disabled={saving || uploading}
              className="inline-flex items-center gap-2 rounded-full bg-brand-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-800 disabled:opacity-70"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {editing ? "Save changes" : "Create product"}
            </button>
            <button
              type="button"
              onClick={() => setFormOpen(false)}
              className="rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-ink-soft"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : null}

      <div className="mt-6 overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-100">
        {loading ? (
          <div className="h-64 animate-pulse bg-slate-50" />
        ) : products.length === 0 ? (
          <p className="px-6 py-16 text-center text-sm text-ink-soft">
            No products yet. Add your first product to get started.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-ink-soft">
                  <th className="px-5 py-3.5">Product</th>
                  <th className="px-5 py-3.5">Category</th>
                  <th className="px-5 py-3.5">Price</th>
                  <th className="px-5 py-3.5">Stock</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            sizes="44px"
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="max-w-52 truncate font-semibold text-ink">
                            {product.name}
                          </p>
                          <p className="text-[11px] text-ink-soft">
                            {product.slug}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 capitalize text-ink-soft">
                      {product.category}
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-ink">
                      {formatPrice(product.price)}
                    </td>
                    <td className="px-5 py-3.5 text-ink-soft">
                      {product.stock}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex flex-wrap gap-1">
                        {product.featured ? (
                          <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-700">
                            Featured
                          </span>
                        ) : null}
                        <span
                          className={
                            "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase " +
                            (product.active !== false
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-slate-100 text-slate-500")
                          }
                        >
                          {product.active !== false ? "Active" : "Hidden"}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => openEdit(product)}
                          aria-label={`Edit ${product.name}`}
                          className="grid h-8 w-8 place-items-center rounded-full text-ink-soft transition hover:bg-brand-50 hover:text-brand-800"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(product)}
                          aria-label={`Delete ${product.name}`}
                          className="grid h-8 w-8 place-items-center rounded-full text-ink-soft transition hover:bg-rose-50 hover:text-rose-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
