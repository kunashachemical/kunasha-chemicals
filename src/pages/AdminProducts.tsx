import { useEffect, useMemo, useState } from "react";
import {
  Edit,
  Eye,
  EyeOff,
  PackageOpen,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

type Product = {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  image_url: string | null;
  category_id: string | null;
  packaging: string | null;
  moq: string | null;
  whatsapp_enabled: boolean;
  published: boolean;
  created_at: string;
};

type Category = {
  id: string;
  name: string;
};

function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const fetchProducts = async () => {
    setLoading(true);

    const [{ data: productData, error: productError }, { data: categoryData }] =
      await Promise.all([
        supabase
          .from("products")
          .select(
            `
            id,
            name,
            slug,
            short_description,
            image_url,
            category_id,
            packaging,
            moq,
            whatsapp_enabled,
            published,
            created_at
          `
          )
          .order("created_at", { ascending: false }),

        supabase
          .from("categories")
          .select("id, name")
          .order("name", { ascending: true }),
      ]);

    if (productError) {
      console.error(productError);
      alert("Unable to load products.");
    } else {
      setProducts(productData || []);
    }

    setCategories(categoryData || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const categoryMap = useMemo(() => {
    const map = new Map<string, string>();

    categories.forEach((category) => {
      map.set(category.id, category.name);
    });

    return map;
  }, [categories]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return products;
    }

    return products.filter((product) => {
      const categoryName = product.category_id
        ? categoryMap.get(product.category_id) || ""
        : "";

      return (
        product.name.toLowerCase().includes(query) ||
        product.slug.toLowerCase().includes(query) ||
        categoryName.toLowerCase().includes(query)
      );
    });
  }, [products, search, categoryMap]);

  const togglePublished = async (product: Product) => {
    setActionLoading(product.id);

    const { error } = await supabase
      .from("products")
      .update({
        published: !product.published,
      })
      .eq("id", product.id);

    if (error) {
      console.error(error);
      alert("Unable to update product status.");
    } else {
      setProducts((current) =>
        current.map((item) =>
          item.id === product.id
            ? { ...item, published: !item.published }
            : item
        )
      );
    }

    setActionLoading(null);
  };

  const deleteProduct = async (product: Product) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?`
    );

    if (!confirmed) {
      return;
    }

    setActionLoading(product.id);

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", product.id);

    if (error) {
      console.error(error);
      alert("Unable to delete product.");
    } else {
      setProducts((current) =>
        current.filter((item) => item.id !== product.id)
      );
    }

    setActionLoading(null);
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
                Product Manager
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Add, edit, publish, unpublish and manage your products.
              </p>
            </div>

            <Link
              to="/admin/products/new"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
            >
              <Plus size={18} />
              Add Product
            </Link>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        {/* SEARCH */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products..."
              className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
            <p className="text-sm font-semibold text-slate-500">
              Loading products...
            </p>
          </div>
        ) : filteredProducts.length === 0 ? (
          /* EMPTY */
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
            <PackageOpen
              size={48}
              className="mx-auto text-slate-300"
            />

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              {search ? "No products found" : "No products yet"}
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              {search
                ? "Try a different product name, slug or category."
                : "Your products will appear here after you add them."}
            </p>

            {!search && (
              <Link
                to="/admin/products/new"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700"
              >
                <Plus size={17} />
                Add Product
              </Link>
            )}
          </div>
        ) : (
          /* PRODUCT LIST */
          <div className="space-y-4">
            {filteredProducts.map((product) => {
              const categoryName = product.category_id
                ? categoryMap.get(product.category_id)
                : null;

              return (
                <div
                  key={product.id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                >
                  <div className="flex flex-col gap-5 p-5 lg:flex-row lg:items-center">
                    {/* IMAGE */}
                    <div className="h-28 w-full shrink-0 overflow-hidden rounded-xl bg-slate-100 lg:h-28 lg:w-36">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <PackageOpen
                            size={34}
                            className="text-slate-300"
                          />
                        </div>
                      )}
                    </div>

                    {/* DETAILS */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-xl font-bold text-slate-900">
                          {product.name}
                        </h2>

                        {product.published ? (
                          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                            Published
                          </span>
                        ) : (
                          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
                            Unpublished
                          </span>
                        )}
                      </div>

                      <p className="mt-1 text-xs text-slate-400">
                        /products/{product.slug}
                      </p>

                      {categoryName && (
                        <p className="mt-3 text-sm font-semibold text-blue-600">
                          {categoryName}
                        </p>
                      )}

                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                        {product.short_description ||
                          "No short description added."}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">
                        {product.packaging && (
                          <span>
                            <strong>Packaging:</strong>{" "}
                            {product.packaging}
                          </span>
                        )}

                        {product.moq && (
                          <span>
                            <strong>MOQ:</strong> {product.moq}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex flex-wrap gap-2 lg:w-64 lg:justify-end">
                      {product.published && (
                        <Link
                          to={`/products/${product.slug}`}
                          target="_blank"
                          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          <Eye size={16} />
                          View
                        </Link>
                      )}

                      <Link
                        to={`/admin/products/${product.id}/edit`}
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                      >
                        <Edit size={16} />
                        Edit
                      </Link>

                      <button
                        type="button"
                        disabled={actionLoading === product.id}
                        onClick={() => togglePublished(product)}
                        className={`inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                          product.published
                            ? "border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
                            : "border border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                        }`}
                      >
                        {product.published ? (
                          <>
                            <EyeOff size={16} />
                            Unpublish
                          </>
                        ) : (
                          <>
                            <Eye size={16} />
                            Publish
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        disabled={actionLoading === product.id}
                        onClick={() => deleteProduct(product)}
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

export default AdminProducts;