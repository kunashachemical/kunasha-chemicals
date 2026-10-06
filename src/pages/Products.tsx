import { useEffect, useMemo, useState } from "react";
import { Search, MessageCircle, ArrowRight, PackageOpen } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

type Category = {
  id: string;
  name: string;
  slug: string;
};

type Product = {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  image_url: string | null;
  packaging: string | null;
  moq: string | null;
  whatsapp_enabled: boolean;
  published: boolean;
  category_id: string | null;
  categories: Category | null;
};

function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchParams] = useSearchParams();
  const categorySlug = searchParams.get("category");

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setError("");

      const { data, error } = await supabase
        .from("products")
        .select(`
          id,
          name,
          slug,
          short_description,
          description,
          image_url,
          packaging,
          moq,
          whatsapp_enabled,
          published,
          category_id,
          categories (
            id,
            name,
            slug
          )
        `)
        .eq("published", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching products:", error);
        setError("Products load nahi ho pa rahe hain. Please try again.");
        setProducts([]);
      } else {
        setProducts((data as unknown as Product[]) || []);
      }

      setLoading(false);
    }

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !query ||
        product.name?.toLowerCase().includes(query) ||
        product.short_description?.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query) ||
        product.categories?.name?.toLowerCase().includes(query);

      const matchesCategory =
        !categorySlug ||
        product.categories?.slug === categorySlug;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, categorySlug]);

  return (
    <main>
      {/* HERO */}
      <section className="bg-slate-950 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
            Products
          </p>

          <h1 className="mt-4 text-4xl font-black text-white sm:text-5xl">
            Chemical Products
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Browse chemical products and concentrates available from KUNASHA
            CHEMICALS for B2B requirements.
          </p>
        </div>
      </section>

      {/* SEARCH */}
      <section className="border-b border-slate-200 bg-white py-8">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="relative max-w-2xl">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search chemical products..."
              className="w-full rounded-xl border border-slate-300 bg-white py-4 pl-12 pr-4 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* LOADING */}
          {loading && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                >
                  <div className="h-56 animate-pulse bg-slate-200" />

                  <div className="space-y-4 p-6">
                    <div className="h-3 w-24 animate-pulse rounded bg-slate-200" />
                    <div className="h-6 w-3/4 animate-pulse rounded bg-slate-200" />
                    <div className="h-12 animate-pulse rounded bg-slate-100" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ERROR */}
          {!loading && error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
              <h2 className="text-xl font-black text-red-900">
                Something went wrong
              </h2>

              <p className="mt-2 text-red-700">{error}</p>

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-5 rounded-xl bg-red-600 px-5 py-3 font-bold text-white hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          )}

          {/* EMPTY / NO SEARCH RESULT */}
          {!loading && !error && filteredProducts.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                <PackageOpen size={30} className="text-slate-400" />
              </div>

              <h2 className="mt-5 text-2xl font-black text-slate-900">
                {search
                  ? "No products found"
                  : "Products will be available soon"}
              </h2>

              <p className="mx-auto mt-3 max-w-xl text-slate-500">
                {search
                  ? "Try searching with a different product name or category."
                  : "We are currently updating our product catalogue. Please contact us for your chemical requirements."}
              </p>
            </div>
          )}

          {/* PRODUCT GRID */}
          {!loading && !error && filteredProducts.length > 0 && (
            <>
              <div className="mb-6">
                <p className="text-sm font-semibold text-slate-500">
                  {filteredProducts.length}{" "}
                  {filteredProducts.length === 1 ? "product" : "products"}{" "}
                  available
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredProducts.map((product) => (
                  <article
                    key={product.id}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    {/* PRODUCT IMAGE */}
                    <div className="flex h-56 items-center justify-center bg-slate-100">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-blue-700 text-2xl font-black text-white">
                          KC
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      {/* CATEGORY */}
                      <p className="text-xs font-bold uppercase tracking-wider text-blue-700">
                        {product.categories?.name || "Chemical Products"}
                      </p>

                      {/* NAME */}
                      <h2 className="mt-2 text-xl font-black text-slate-900">
                        {product.name}
                      </h2>

                      {/* DESCRIPTION */}
                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">
                        {product.short_description ||
                          product.description ||
                          "Chemical product supplied by KUNASHA CHEMICALS."}
                      </p>

                      {/* ACTIONS */}
                      <div className="mt-6 flex gap-3">
                        <Link
                          to={`/products/${product.slug}`}
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-3 text-sm font-bold text-slate-700 hover:border-blue-600 hover:text-blue-700"
                        >
                          View Details
                          <ArrowRight size={16} />
                        </Link>

                        {product.whatsapp_enabled && (
                          <a
                            href="https://wa.me/917084368451"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center rounded-xl bg-green-600 px-4 py-3 text-white hover:bg-green-700"
                            aria-label={`Enquire about ${product.name}`}
                          >
                            <MessageCircle size={19} />
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}

          {/* REQUEST QUOTE */}
          <div className="mt-12 rounded-2xl border border-blue-100 bg-blue-50 p-8 text-center">
            <h2 className="text-2xl font-black text-slate-900">
              Looking for a Specific Chemical?
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-slate-600">
              Send us your requirement and contact our team for availability
              and quotation.
            </p>

            <Link
              to="/request-quote"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700"
            >
              Request a Quote
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Products;
