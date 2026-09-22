import { useEffect, useState } from "react";
import { ArrowLeft, ImagePlus, Save } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

type Category = {
  id: string;
  name: string;
  slug: string;
};

type ProductFormData = {
  name: string;
  slug: string;
  category_id: string;
  short_description: string;
  description: string;
  image_url: string;
  applications: string;
  specifications: string;
  packaging: string;
  moq: string;
  whatsapp_enabled: boolean;
  published: boolean;
};

const emptyForm: ProductFormData = {
  name: "",
  slug: "",
  category_id: "",
  short_description: "",
  description: "",
  image_url: "",
  applications: "",
  specifications: "{}",
  packaging: "",
  moq: "",
  whatsapp_enabled: true,
  published: false,
};

function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const isEditMode = Boolean(id);

  const [form, setForm] = useState<ProductFormData>(emptyForm);
  const [categories, setCategories] = useState<Category[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      const { data: categoryData, error: categoryError } = await supabase
        .from("categories")
        .select("id, name, slug")
        .order("name", { ascending: true });

      if (categoryError) {
        console.error("Category error:", categoryError);
      } else {
        setCategories(categoryData || []);
      }

      if (isEditMode && id) {
        const { data: product, error: productError } = await supabase
          .from("products")
          .select(
            `
            id,
            name,
            slug,
            category_id,
            short_description,
            description,
            image_url,
            applications,
            specifications,
            packaging,
            moq,
            whatsapp_enabled,
            published
          `
          )
          .eq("id", id)
          .single();

        if (productError) {
          console.error("Product error:", productError);
          alert("Unable to load product.");
          navigate("/admin/products");
          return;
        }

        setForm({
          name: product.name || "",
          slug: product.slug || "",
          category_id: product.category_id || "",
          short_description: product.short_description || "",
          description: product.description || "",
          image_url: product.image_url || "",
          applications: Array.isArray(product.applications)
            ? product.applications.join("\n")
            : "",
          specifications: product.specifications
            ? JSON.stringify(product.specifications, null, 2)
            : "{}",
          packaging: product.packaging || "",
          moq: product.moq || "",
          whatsapp_enabled: product.whatsapp_enabled ?? true,
          published: product.published ?? false,
        });
      }

      setLoading(false);
    };

    loadData();
  }, [id, isEditMode, navigate]);

  const createSlug = (value: string) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const updateField = <K extends keyof ProductFormData>(
    field: K,
    value: ProductFormData[K]
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleNameChange = (value: string) => {
    setForm((current) => ({
      ...current,
      name: value,
      slug: isEditMode ? current.slug : createSlug(value),
    }));
  };

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Only JPG, PNG and WEBP images are allowed.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5 MB.");
      return;
    }

    setUploading(true);

    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";

    const filePath = `products/${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 10)}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      alert("Image upload failed.");
      setUploading(false);
      return;
    }

    const { data } = supabase.storage
      .from("product-images")
      .getPublicUrl(filePath);

    updateField("image_url", data.publicUrl);

    setUploading(false);
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.name.trim()) {
      alert("Product name is required.");
      return;
    }

    if (!form.slug.trim()) {
      alert("Slug is required.");
      return;
    }

    let specifications: Record<string, unknown> = {};

    try {
      specifications = JSON.parse(form.specifications || "{}");

      if (
        typeof specifications !== "object" ||
        Array.isArray(specifications) ||
        specifications === null
      ) {
        alert("Specifications must be a valid JSON object.");
        return;
      }
    } catch {
      alert("Specifications JSON is invalid. Please check the format.");
      return;
    }

    const applications = form.applications
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

    setSaving(true);

    const productData = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      category_id: form.category_id || null,
      short_description: form.short_description.trim() || null,
      description: form.description.trim() || null,
      image_url: form.image_url || null,
      applications,
      specifications,
      packaging: form.packaging.trim() || null,
      moq: form.moq.trim() || null,
      whatsapp_enabled: form.whatsapp_enabled,
      published: form.published,
    };

    if (isEditMode && id) {
      const { error } = await supabase
        .from("products")
        .update(productData)
        .eq("id", id);

      if (error) {
        console.error("Update error:", error);
        alert(`Unable to update product: ${error.message}`);
        setSaving(false);
        return;
      }

      alert("Product updated successfully.");
    } else {
      const { error } = await supabase
        .from("products")
        .insert(productData);

      if (error) {
        console.error("Insert error:", error);
        alert(`Unable to add product: ${error.message}`);
        setSaving(false);
        return;
      }

      alert("Product added successfully.");
    }

    setSaving(false);
    navigate("/admin/products");
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="flex min-h-[70vh] items-center justify-center">
          <p className="text-sm font-semibold text-slate-500">
            Loading product...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* HEADER */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-5 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
                KUNASHA CHEMICALS
              </p>

              <h1 className="mt-1 text-2xl font-black text-slate-900">
                {isEditMode ? "Edit Product" : "Add Product"}
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                {isEditMode
                  ? "Update product information."
                  : "Add genuine KUNASHA CHEMICALS product information."}
              </p>
            </div>

            {/* FIXED BACK BUTTON */}
            <Link
              to="/admin/products"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <ArrowLeft size={16} />
              Back to Products
            </Link>
          </div>
        </div>
      </section>

      {/* FORM */}
      <section className="mx-auto max-w-5xl px-6 py-8 lg:px-8">
        <form onSubmit={handleSave} className="space-y-6">
          {/* BASIC INFORMATION */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">
              Basic Information
            </h2>

            <div className="mt-6 space-y-5">
              {/* NAME */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Product Name *
                </label>

                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Acetone"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>

              {/* SLUG */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Slug *
                </label>

                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) =>
                    updateField("slug", createSlug(e.target.value))
                  }
                  placeholder="acetone"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  required
                />

                <p className="mt-1 text-xs text-slate-400">
                  Used in the public product URL.
                </p>
              </div>

              {/* CATEGORY */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Category
                </label>

                <select
                  value={form.category_id}
                  onChange={(e) =>
                    updateField("category_id", e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Select category</option>

                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>

                {categories.length === 0 && (
                  <p className="mt-2 text-xs text-slate-400">
                    No categories available yet. You can add categories from
                    the Categories section.
                  </p>
                )}
              </div>

              {/* SHORT DESCRIPTION */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Short Description
                </label>

                <textarea
                  value={form.short_description}
                  onChange={(e) =>
                    updateField("short_description", e.target.value)
                  }
                  rows={3}
                  placeholder="Short product description"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* FULL DESCRIPTION */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Full Description
                </label>

                <textarea
                  value={form.description}
                  onChange={(e) =>
                    updateField("description", e.target.value)
                  }
                  rows={5}
                  placeholder="Detailed product description"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>
          </div>

          {/* IMAGE */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <ImagePlus size={20} className="text-blue-600" />

              <h2 className="text-lg font-bold text-slate-900">
                Product Image
              </h2>
            </div>

            <p className="mt-1 text-sm text-slate-500">
              Upload a genuine KUNASHA CHEMICALS product image.
            </p>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Choose Image
              </label>

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => {
                  const file = e.target.files?.[0];

                  if (file) {
                    handleImageUpload(file);
                  }
                }}
                className="block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm"
              />

              <p className="mt-2 text-xs text-slate-400">
                JPG, PNG, WEBP • Maximum 5 MB.
              </p>

              {uploading && (
                <p className="mt-3 text-sm font-semibold text-blue-600">
                  Uploading image...
                </p>
              )}

              {form.image_url && (
                <div className="mt-5 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                  <img
                    src={form.image_url}
                    alt={form.name || "Product preview"}
                    className="h-64 w-full object-contain"
                  />
                </div>
              )}
            </div>
          </div>

          {/* PRODUCT DETAILS */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">
              Product Details
            </h2>

            <div className="mt-6 space-y-5">
              {/* APPLICATIONS */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Applications
                </label>

                <textarea
                  value={form.applications}
                  onChange={(e) =>
                    updateField("applications", e.target.value)
                  }
                  rows={5}
                  placeholder={`Paints & coatings
Adhesives
Industrial cleaning`}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />

                <p className="mt-1 text-xs text-slate-400">
                  Enter one application per line.
                </p>
              </div>

              {/* SPECIFICATIONS */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Specifications
                </label>

                <textarea
                  value={form.specifications}
                  onChange={(e) =>
                    updateField("specifications", e.target.value)
                  }
                  rows={7}
                  placeholder={`{
  "purity": "99%",
  "appearance": "Clear liquid"
}`}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 font-mono text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />

                <p className="mt-1 text-xs text-slate-400">
                  Use valid JSON format.
                </p>
              </div>

              {/* PACKAGING */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Packaging
                </label>

                <input
                  type="text"
                  value={form.packaging}
                  onChange={(e) =>
                    updateField("packaging", e.target.value)
                  }
                  placeholder="Drums, cans, bulk etc."
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* MOQ */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  MOQ
                </label>

                <input
                  type="text"
                  value={form.moq}
                  onChange={(e) => updateField("moq", e.target.value)}
                  placeholder="e.g. 100 KG"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>
          </div>

          {/* PUBLISHING */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">
              Publishing
            </h2>

            <div className="mt-5 space-y-4">
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={form.whatsapp_enabled}
                  onChange={(e) =>
                    updateField("whatsapp_enabled", e.target.checked)
                  }
                  className="h-4 w-4 rounded border-slate-300"
                />

                <span className="text-sm font-semibold text-slate-700">
                  Enable WhatsApp Enquiry
                </span>
              </label>

              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) =>
                    updateField("published", e.target.checked)
                  }
                  className="h-4 w-4 rounded border-slate-300"
                />

                <span className="text-sm font-semibold text-slate-700">
                  Publish Product
                </span>
              </label>

              <p className="text-xs text-slate-400">
                Unpublished products will not appear on the public website.
              </p>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              to="/admin/products"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving || uploading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save size={17} />

              {saving
                ? "Saving..."
                : isEditMode
                ? "Update Product"
                : "Save Product"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default AdminProductForm;