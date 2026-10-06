import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  MessageCircle,
  Package,
  Send,
} from "lucide-react";
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
  gallery_images: string[];
  applications: string[];
  specifications: Record<string, string>;
  packaging: string | null;
  moq: string | null;
  whatsapp_enabled: boolean;
  published: boolean;
  category_id: string | null;
  categories: Category | null;
};

function ProductDetails() {
  const { slug } = useParams<{ slug: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProduct() {
      if (!slug) {
        setError("Product not found.");
        setLoading(false);
        return;
      }

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
          gallery_images,
          applications,
          specifications,
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
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();

      if (error) {
        console.error("Error fetching product:", error);
        setError("Product load nahi ho pa raha hai.");
        setProduct(null);
      } else if (!data) {
        setError("Product not found.");
        setProduct(null);
      } else {
        setProduct(data as unknown as Product);
      }

      setLoading(false);
    }

    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <section className="bg-slate-950 py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="h-4 w-24 animate-pulse rounded bg-slate-700" />
            <div className="mt-5 h-12 w-2/3 animate-pulse rounded bg-slate-800" />
            <div className="mt-5 h-6 w-1/2 animate-pulse rounded bg-slate-800" />
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-2">
              <div className="h-[450px] animate-pulse rounded-2xl bg-slate-200" />

              <div className="space-y-5">
                <div className="h-5 w-32 animate-pulse rounded bg-slate-200" />
                <div className="h-10 w-3/4 animate-pulse rounded bg-slate-200" />
                <div className="h-24 animate-pulse rounded bg-slate-200" />
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen bg-slate-50">
        <section className="bg-slate-950 py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
              Product
            </p>

            <h1 className="mt-4 text-4xl font-black text-white sm:text-5xl">
              Product Not Found
            </h1>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-2xl px-6 text-center">
            <h2 className="text-2xl font-black text-slate-900">
              This product is not available
            </h2>

            <p className="mt-3 text-slate-500">
              {error || "The requested product could not be found."}
            </p>

            <Link
              to="/products"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700"
            >
              <ArrowLeft size={17} />
              Back to Products
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const specifications = product.specifications || {};
  const applications = product.applications || [];

  return (
    <main>
      {/* HERO */}
      <section className="bg-slate-950 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-300 hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to Products
          </Link>

          <p className="mt-8 text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
            {product.categories?.name || "Chemical Product"}
          </p>

          <h1 className="mt-4 max-w-4xl text-4xl font-black text-white sm:text-5xl">
            {product.name}
          </h1>

          {product.short_description && (
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
              {product.short_description}
            </p>
          )}
        </div>
      </section>

      {/* PRODUCT INFORMATION */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2">
            {/* IMAGE */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex min-h-[420px] items-center justify-center bg-slate-100">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="h-full max-h-[550px] w-full object-contain"
                  />
                ) : (
                  <div className="flex h-32 w-32 items-center justify-center rounded-3xl bg-blue-700 text-4xl font-black text-white">
                    KC
                  </div>
                )}
              </div>

              {/* GALLERY */}
              {product.gallery_images?.length > 0 && (
                <div className="grid grid-cols-4 gap-3 border-t border-slate-200 p-4">
                  {product.gallery_images.map((image, index) => (
                    <img
                      key={`${image}-${index}`}
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="h-24 w-full rounded-xl border border-slate-200 object-cover"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* SUMMARY */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-blue-700">
                Product Information
              </p>

              <h2 className="mt-2 text-3xl font-black text-slate-900">
                {product.name}
              </h2>

              {product.description && (
                <p className="mt-5 whitespace-pre-line leading-8 text-slate-600">
                  {product.description}
                </p>
              )}

              {/* QUICK DETAILS */}
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {product.packaging && (
                  <div className="rounded-xl border border-slate-200 bg-white p-5">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Packaging
                    </p>
                    <p className="mt-2 font-bold text-slate-900">
                      {product.packaging}
                    </p>
                  </div>
                )}

                {product.moq && (
                  <div className="rounded-xl border border-slate-200 bg-white p-5">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      MOQ
                    </p>
                    <p className="mt-2 font-bold text-slate-900">
                      {product.moq}
                    </p>
                  </div>
                )}
              </div>

              {/* BUTTONS */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                {product.whatsapp_enabled && (
                  <a
                    href="https://wa.me/917084368451"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-4 font-bold text-white hover:bg-green-700"
                  >
                    <MessageCircle size={19} />
                    WhatsApp Enquiry
                  </a>
                )}

                <Link
                  to="/request-quote"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-4 font-bold text-white hover:bg-blue-700"
                >
                  <Send size={18} />
                  Request a Quote
                </Link>
              </div>
            </div>
          </div>

          {/* APPLICATIONS */}
          {applications.length > 0 && (
            <section className="mt-16 rounded-2xl border border-slate-200 bg-white p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                  <Package size={21} />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-blue-700">
                    Applications
                  </p>

                  <h2 className="text-2xl font-black text-slate-900">
                    Product Applications
                  </h2>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {applications.map((application, index) => (
                  <div
                    key={`${application}-${index}`}
                    className="rounded-xl bg-slate-50 p-4 text-sm font-semibold text-slate-700"
                  >
                    {application}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* SPECIFICATIONS */}
          {Object.keys(specifications).length > 0 && (
            <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-8">
              <p className="text-xs font-bold uppercase tracking-wider text-blue-700">
                Specifications
              </p>

              <h2 className="mt-2 text-2xl font-black text-slate-900">
                Technical Specifications
              </h2>

              <div className="mt-6 overflow-hidden rounded-xl border border-slate-200">
                {Object.entries(specifications).map(
                  ([key, value], index) => (
                    <div
                      key={key}
                      className={`grid gap-3 px-5 py-4 sm:grid-cols-2 ${
                        index % 2 === 0 ? "bg-slate-50" : "bg-white"
                      }`}
                    >
                      <p className="font-bold text-slate-700">{key}</p>
                      <p className="text-slate-600">{String(value)}</p>
                    </div>
                  )
                )}
              </div>
            </section>
          )}

          {/* BOTTOM CTA */}
          <section className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-8 text-center">
            <h2 className="text-2xl font-black text-slate-900">
              Need More Information?
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-slate-600">
              Contact KUNASHA CHEMICALS for product availability, specifications,
              packaging and quotation requirements.
            </p>

            <Link
              to="/contact"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700"
            >
              Contact Us
              <ArrowRightIcon />
            </Link>
          </section>
        </div>
      </section>
    </main>
  );
}

function ArrowRightIcon() {
  return <span aria-hidden="true">→</span>;
}

export default ProductDetails;
