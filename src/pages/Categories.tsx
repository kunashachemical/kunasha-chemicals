import { useEffect, useState } from "react";
import { ArrowRight, FolderOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
};

function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchCategories() {
      setLoading(true);
      setError("");

      const { data, error } = await supabase
        .from("categories")
        .select("id, name, slug, description, image_url")
        .order("name", { ascending: true });

      if (error) {
        console.error("Error fetching categories:", error);
        setError("Categories load nahi ho pa rahi hain. Please try again.");
        setCategories([]);
      } else {
        setCategories(data || []);
      }

      setLoading(false);
    }

    fetchCategories();
  }, []);

  return (
    <main>
      {/* HERO */}
      <section className="bg-slate-950 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
              Product Categories
            </p>

            <h1 className="mt-4 text-4xl font-black text-white sm:text-5xl">
              Explore Our Categories
            </h1>

            <p className="mt-6 text-lg leading-8 text-slate-300">
              Browse product categories available through KUNASHA CHEMICALS
              and find products relevant to your business requirements.
            </p>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* LOADING */}
          {loading && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-slate-200 bg-white p-7"
                >
                  <div className="h-14 w-14 animate-pulse rounded-xl bg-slate-200" />

                  <div className="mt-6 h-6 w-3/4 animate-pulse rounded bg-slate-200" />

                  <div className="mt-4 h-14 animate-pulse rounded bg-slate-100" />

                  <div className="mt-6 h-5 w-32 animate-pulse rounded bg-slate-200" />
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

          {/* EMPTY */}
          {!loading && !error && categories.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                <FolderOpen size={30} className="text-slate-400" />
              </div>

              <h2 className="mt-5 text-2xl font-black text-slate-900">
                Categories will be available soon
              </h2>

              <p className="mx-auto mt-3 max-w-xl text-slate-500">
                Our product categories are currently being updated. Please
                contact KUNASHA CHEMICALS for your requirements.
              </p>
            </div>
          )}

          {/* CATEGORY GRID */}
          {!loading && !error && categories.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/products?category=${encodeURIComponent(category.slug)}`}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* IMAGE / ICON */}
                  <div className="flex h-48 items-center justify-center bg-slate-100">
                    {category.image_url ? (
                      <img
                        src={category.image_url}
                        alt={category.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 transition group-hover:bg-blue-700 group-hover:text-white">
                        <FolderOpen size={34} />
                      </div>
                    )}
                  </div>

                  <div className="p-7">
                    <h2 className="text-xl font-bold text-slate-900">
                      {category.name}
                    </h2>

                    <p className="mt-3 leading-7 text-slate-500">
                      {category.description ||
                        `Explore products available in ${category.name}.`}
                    </p>

                    <div className="mt-6 flex items-center gap-2 text-sm font-bold text-blue-700">
                      View Products
                      <ArrowRight
                        size={16}
                        className="transition group-hover:translate-x-1"
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-700 py-16">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-black text-white">
            Can't Find What You Need?
          </h2>

          <p className="mt-4 leading-7 text-blue-100">
            Send us your requirement and contact our team for product
            availability and quotation.
          </p>

          <Link
            to="/request-quote"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-4 font-bold text-blue-700 transition hover:bg-slate-100"
          >
            Request a Quote
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Categories;