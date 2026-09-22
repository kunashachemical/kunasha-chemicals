import {
  ArrowRight,
  CheckCircle2,
  MessageCircle,
  PackageCheck,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
};

const benefits = [
  "B2B chemical sourcing",
  "Business-focused product supply",
  "Bulk and regular requirements",
  "Direct enquiry through WhatsApp",
];

function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name, slug, description, image_url")
        .order("name", { ascending: true });

      if (!error) {
        setCategories(data || []);
      }

      setCategoriesLoading(false);
    };

    fetchCategories();
  }, []);

  return (
    <main>
      {/* HERO */}
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(37,99,235,0.25),_transparent_40%)]" />

        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-28">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-300">
              <CheckCircle2 size={17} />
              Trusted B2B Chemical Supplier
            </div>

            <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
  Reliable Chemical
  <br />
  <span className="text-blue-500">Supply Solutions</span> for
  <br />
  Businesses
</h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              KUNASHA CHEMICALS is a B2B chemical supplier and trader providing
              chemical products and concentrates for business and industrial
              requirements.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-4 font-bold text-white transition hover:bg-blue-700"
              >
                Explore Products
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/request-quote"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-4 font-bold text-white transition hover:bg-white/10"
              >
                Request a Quote
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-4">
              <div>
                <div className="text-2xl font-black text-white">B2B</div>
                <div className="mt-1 text-sm text-slate-400">
                  Focused Supply
                </div>
              </div>

              <div>
                <div className="text-2xl font-black text-white">Bulk</div>
                <div className="mt-1 text-sm text-slate-400">
                  Requirements
                </div>
              </div>

              <div>
                <div className="text-2xl font-black text-white">Direct</div>
                <div className="mt-1 text-sm text-slate-400">
                  Enquiry
                </div>
              </div>

              <div>
                <div className="text-2xl font-black text-white">Fast</div>
                <div className="mt-1 text-sm text-slate-400">
                  Response
                </div>
              </div>
            </div>
          </div>

          {/* HERO CARD */}
          <div className="lg:pl-10">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur">
              <div className="rounded-2xl bg-white p-8">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-700 text-2xl font-black text-white">
                  KC
                </div>

                <h2 className="mt-7 text-2xl font-black text-slate-900">
                  KUNASHA CHEMICALS
                </h2>

                <p className="mt-3 leading-7 text-slate-500">
                  Chemical supplier and trader serving business requirements
                  with product sourcing and supply solutions.
                </p>

                <div className="mt-7 space-y-4">
                  {benefits.map((benefit) => (
                    <div
                      key={benefit}
                      className="flex items-center gap-3 text-sm font-semibold text-slate-700"
                    >
                      <CheckCircle2
                        size={19}
                        className="shrink-0 text-blue-600"
                      />
                      {benefit}
                    </div>
                  ))}
                </div>

                <Link
                  to="/contact"
                  className="mt-8 flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-4 font-bold text-white transition hover:bg-slate-800"
                >
                  Contact Us
                  <ArrowRight size={17} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
                About KUNASHA CHEMICALS
              </p>

              <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                Your B2B Partner for Chemical Supply
              </h2>

              <p className="mt-6 leading-8 text-slate-600">
                We focus on supplying chemical products and concentrates to
                businesses according to their requirements. Our goal is to make
                chemical sourcing simple, transparent and convenient for B2B
                customers.
              </p>

              <p className="mt-4 leading-8 text-slate-600">
                Browse available products, check product information and
                contact our team directly for enquiries and quotations.
              </p>

              <Link
                to="/about"
                className="mt-8 inline-flex items-center gap-2 font-bold text-blue-700 hover:text-blue-800"
              >
                Learn More About Us
                <ArrowRight size={17} />
              </Link>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-7">
                <Truck className="text-blue-700" size={30} />

                <h3 className="mt-5 text-xl font-bold text-slate-900">
                  B2B Supply
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Supply solutions designed around business requirements.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-7">
                <PackageCheck className="text-blue-700" size={30} />

                <h3 className="mt-5 text-xl font-bold text-slate-900">
                  Product Range
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Browse available chemicals and concentrate products.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-7">
                <MessageCircle className="text-blue-700" size={30} />

                <h3 className="mt-5 text-xl font-bold text-slate-900">
                  Direct Enquiry
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Contact us directly for product enquiries and quotations.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-7">
                <ShieldCheck className="text-blue-700" size={30} />

                <h3 className="mt-5 text-xl font-bold text-slate-900">
                  Business Focus
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Focused on serving genuine B2B chemical requirements.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
              Product Categories
            </p>

            <h2 className="mt-4 text-3xl font-black text-slate-900 sm:text-4xl">
              Explore Our Chemical Categories
            </h2>

            <p className="mt-4 leading-7 text-slate-500">
              Explore available products and contact us for your business
              requirements.
            </p>
          </div>

          {categoriesLoading ? (
            <div className="mt-12 text-center">
              <p className="text-slate-500">Loading categories...</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-10 text-center">
              <PackageCheck
                size={42}
                className="mx-auto text-slate-400"
              />

              <h3 className="mt-4 text-xl font-bold text-slate-900">
                Categories will be available soon
              </h3>

              <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
                Our product categories are currently being updated. Please
                check back soon or contact us for your requirements.
              </p>

              <Link
                to="/contact"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-bold text-white transition hover:bg-blue-700"
              >
                Contact Us
                <ArrowRight size={17} />
              </Link>
            </div>
          ) : (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/products?category=${encodeURIComponent(
                    category.slug
                  )}`}
                  className="group rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-blue-700 transition group-hover:bg-blue-700 group-hover:text-white">
                    <PackageCheck size={27} />
                  </div>

                  <h3 className="mt-6 text-lg font-bold text-slate-900">
                    {category.name}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    {category.description ||
                      "Explore products available in this category."}
                  </p>

                  <div className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue-700">
                    View Products

                    <ArrowRight
                      size={16}
                      className="transition group-hover:translate-x-1"
                    />
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-10 text-center">
            <Link
              to="/categories"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 font-bold text-slate-700 transition hover:border-blue-600 hover:text-blue-700"
            >
              View All Categories
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      {/* PRODUCT CTA */}
      <section className="bg-blue-700 py-20">
        <div className="mx-auto max-w-5xl px-6 text-center lg:px-8">
          <h2 className="text-3xl font-black text-white sm:text-4xl">
            Looking for a Chemical Product?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-blue-100">
            Browse our available product range or send us your requirement.
            Our team can help you with product details and quotation.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-4 font-bold text-blue-700 transition hover:bg-slate-100"
            >
              Browse Products
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/request-quote"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 px-7 py-4 font-bold text-white transition hover:bg-white/10"
            >
              Request a Quote
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;  