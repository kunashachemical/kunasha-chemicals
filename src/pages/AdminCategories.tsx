import { useEffect, useState } from "react";
import {
  Edit,
  FolderOpen,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { supabase } from "../lib/supabase";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
};

function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(
    null
  );

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("categories")
      .select("id, name, slug, description, image_url")
      .order("name", { ascending: true });

    if (error) {
      console.error(error);
      alert("Unable to load categories.");
    } else {
      setCategories(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const resetForm = () => {
    setName("");
    setSlug("");
    setDescription("");
    setImageUrl("");
    setEditingCategory(null);
    setShowForm(false);
  };

  const createSlug = (value: string) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const handleNameChange = (value: string) => {
    setName(value);

    if (!editingCategory) {
      setSlug(createSlug(value));
    }
  };

  const startEdit = (category: Category) => {
    setEditingCategory(category);
    setName(category.name);
    setSlug(category.slug);
    setDescription(category.description || "");
    setImageUrl(category.image_url || "");
    setShowForm(true);
  };

  const uploadImage = async (file: File) => {
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      alert("Please upload JPG, PNG or WEBP image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be smaller than 5 MB.");
      return;
    }

    setUploadingImage(true);

    const extension = file.name.split(".").pop() || "jpg";

    const filePath = `categories/${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}.${extension}`;

    const { error } = await supabase.storage
      .from("product-images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error(error);
      alert("Unable to upload image.");
      setUploadingImage(false);
      return;
    }

    const { data } = supabase.storage
      .from("product-images")
      .getPublicUrl(filePath);

    setImageUrl(data.publicUrl);
    setUploadingImage(false);
  };

  const saveCategory = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!name.trim()) {
      alert("Category name is required.");
      return;
    }

    if (!slug.trim()) {
      alert("Category slug is required.");
      return;
    }

    setSaving(true);

    const categoryData = {
      name: name.trim(),
      slug: slug.trim(),
      description: description.trim() || null,
      image_url: imageUrl || null,
    };

    if (editingCategory) {
      const { error } = await supabase
        .from("categories")
        .update(categoryData)
        .eq("id", editingCategory.id);

      if (error) {
        console.error(error);
        alert("Unable to update category.");
      } else {
        alert("Category updated successfully.");
        resetForm();
        await fetchCategories();
      }
    } else {
      const { error } = await supabase
        .from("categories")
        .insert(categoryData);

      if (error) {
        console.error(error);
        alert("Unable to create category.");
      } else {
        alert("Category added successfully.");
        resetForm();
        await fetchCategories();
      }
    }

    setSaving(false);
  };

  const deleteCategory = async (category: Category) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${category.name}"?`
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", category.id);

    if (error) {
      console.error(error);
      alert(
        "Unable to delete category. Make sure no product depends on this category."
      );
      return;
    }

    setCategories((current) =>
      current.filter((item) => item.id !== category.id)
    );
  };

  return (
    <main className="min-h-screen bg-slate-50">
      {/* HEADER */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
                KUNASHA CHEMICALS
              </p>

              <h1 className="mt-2 text-3xl font-black text-slate-900">
                Category Manager
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Create and manage product categories.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
            >
              <Plus size={18} />
              Add Category
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        {/* FORM */}
        {showForm && (
          <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {editingCategory ? "Edit Category" : "Add Category"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Add category information for your product catalogue.
                </p>
              </div>

              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={saveCategory} className="space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Category Name *
                  </label>

                  <input
                    type="text"
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. Industrial Chemicals"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Slug *
                  </label>

                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(createSlug(e.target.value))}
                    placeholder="industrial-chemicals"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Short description of this category..."
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Category Image
                </label>

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => {
                    const file = e.target.files?.[0];

                    if (file) {
                      uploadImage(file);
                    }
                  }}
                  className="block w-full rounded-xl border border-slate-300 px-4 py-3 text-sm"
                />

                <p className="mt-2 text-xs text-slate-400">
                  JPG, PNG or WEBP. Maximum 5 MB.
                </p>

                {uploadingImage && (
                  <p className="mt-2 text-sm font-semibold text-blue-600">
                    Uploading image...
                  </p>
                )}

                {imageUrl && (
                  <div className="mt-4 h-32 w-48 overflow-hidden rounded-xl border border-slate-200">
                    <img
                      src={imageUrl}
                      alt="Category preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving || uploadingImage}
                  className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editingCategory
                    ? "Update Category"
                    : "Save Category"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* CATEGORY LIST */}
        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
            <p className="text-sm font-semibold text-slate-500">
              Loading categories...
            </p>
          </div>
        ) : categories.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
            <FolderOpen
              size={48}
              className="mx-auto text-slate-300"
            />

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              No categories yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Your product categories will appear here after you add them.
            </p>

            <button
              type="button"
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700"
            >
              <Plus size={17} />
              Add Category
            </button>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <div
                key={category.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="aspect-[16/9] bg-slate-100">
                  {category.image_url ? (
                    <img
                      src={category.image_url}
                      alt={category.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <FolderOpen
                        size={45}
                        className="text-slate-300"
                      />
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-bold text-slate-900">
                    {category.name}
                  </h3>

                  <p className="mt-1 text-xs text-slate-400">
                    /{category.slug}
                  </p>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    {category.description ||
                      "No category description added."}
                  </p>

                  <div className="mt-5 flex gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(category)}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100"
                    >
                      <Edit size={16} />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteCategory(category)}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default AdminCategories;