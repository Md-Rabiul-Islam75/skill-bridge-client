/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/set-state-in-effect */
"use client";

import { FormEvent, useEffect, useState } from "react";
import { getCategories } from "@/lib/apiClient";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getCategories()
      .then((res) => {
        if (!res.ok) throw new Error(res.error || "Unable to fetch categories");
        setCategories(res.data?.categories || []);
      })
      .catch((e) => setError((e as any).message || "Failed"))
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = (e: FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    setCategories((prev) => [...prev, { id: String(prev.length + 1), name: newCategory.trim() }]);
    setNewCategory("");
    setSuccess("Category added locally. Server API path pending.");
  };

  return (
    <main className="sb-page">
      <h1 className="sb-title">Manage Categories</h1>
      {loading && <p className="mt-4">Loading categories...</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}

      <form onSubmit={handleAdd} className="mt-4 flex gap-2">
        <input
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Add a new category"
          className="sb-input"
        />
        <button className="sb-btn sb-btn-primary">Add</button>
      </form>

      <div className="mt-4 space-y-2">
        {categories.map((cat) => (
          <div key={cat.id} className="sb-panel px-3 py-2">
            {cat.name}
          </div>
        ))}
      </div>

      {success && <p className="mt-2 text-green-600">{success}</p>}
    </main>
  );
}

