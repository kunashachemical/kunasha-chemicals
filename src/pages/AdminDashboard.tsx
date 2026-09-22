import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FolderOpen,
  LogOut,
  MessageSquareQuote,
  Package,
} from "lucide-react";
import { supabase } from "../lib/supabase";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [productCount, setProductCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [quoteRequestCount, setQuoteRequestCount] = useState(0);

  useEffect(() => {
    checkAdmin();
  }, []);

  async function checkAdmin() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      navigate("/admin/login");
      return;
    }

    const { data: adminUser } = await supabase
      .from("admin_users")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!adminUser) {
      await supabase.auth.signOut();
      navigate("/admin/login");
      return;
    }

    const { count: products } = await supabase
      .from("products")
      .select("*", {
        count: "exact",
        head: true,
      });

    const { count: categories } = await supabase
      .from("categories")
      .select("*", {
        count: "exact",
        head: true,
      });

    const { count: quoteRequests } = await supabase
      .from("quote_requests")
      .select("*", {
        count: "exact",
        head: true,
      });

    setProductCount(products ?? 0);
    setCategoryCount(categories ?? 0);
    setQuoteRequestCount(quoteRequests ?? 0);

    setLoading(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/admin/login");
  }

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <p className="text-slate-500">
          Loading admin dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold text-blue-600">
              KUNASHA CHEMICALS
            </p>

            <h1 className="mt-1 text-3xl font-black text-slate-900">
              Admin Dashboard
            </h1>

            <p className="mt-2 text-slate-500">
              Manage your products, categories and customer enquiries.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

        {/* STATS */}
        <div className="mt-10 grid gap-6 md:grid-cols-3">

          {/* PRODUCTS */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500">
                  Total Products
                </p>

                <p className="mt-3 text-4xl font-black text-slate-900">
                  {productCount}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Package size={24} />
              </div>
            </div>

            <Link
              to="/admin/products"
              className="mt-5 inline-block font-semibold text-blue-600 hover:text-blue-700"
            >
              Manage Products →
            </Link>
          </div>

          {/* CATEGORIES */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500">
                  Total Categories
                </p>

                <p className="mt-3 text-4xl font-black text-slate-900">
                  {categoryCount}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <FolderOpen size={24} />
              </div>
            </div>

            <Link
              to="/admin/categories"
              className="mt-5 inline-block font-semibold text-purple-600 hover:text-purple-700"
            >
              Manage Categories →
            </Link>
          </div>

          {/* QUOTE REQUESTS */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500">
                  Quote Requests
                </p>

                <p className="mt-3 text-4xl font-black text-slate-900">
                  {quoteRequestCount}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600">
                <MessageSquareQuote size={24} />
              </div>
            </div>

            <Link
              to="/admin/quote-requests"
              className="mt-5 inline-block font-semibold text-green-600 hover:text-green-700"
            >
              View Quote Requests →
            </Link>
          </div>
        </div>

        {/* PRODUCT MANAGEMENT */}
        <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-6">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Product Management
              </h2>

              <p className="mt-2 text-slate-600">
                Add products, update specifications, upload images
                and publish or unpublish products.
              </p>
            </div>

            <Link
              to="/admin/products"
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 font-bold text-white transition hover:bg-blue-700"
            >
              Open Product Manager
            </Link>
          </div>
        </div>

        {/* QUOTE MANAGEMENT */}
        <div className="mt-6 rounded-2xl border border-green-100 bg-green-50 p-6">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Customer Quote Requests
              </h2>

              <p className="mt-2 text-slate-600">
                View customer requirements, contact customers,
                update enquiry status and manage quote requests.
              </p>
            </div>

            <Link
              to="/admin/quote-requests"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-bold text-white transition hover:bg-green-700"
            >
              <MessageSquareQuote size={18} />
              Open Quote Requests
            </Link>
          </div>
        </div>

        {/* CATEGORY MANAGEMENT */}
        <div className="mt-6 rounded-2xl border border-purple-100 bg-purple-50 p-6">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Category Management
              </h2>

              <p className="mt-2 text-slate-600">
                Create, edit and delete product categories for
                your public catalogue.
              </p>
            </div>

            <Link
              to="/admin/categories"
              className="inline-flex items-center justify-center rounded-xl bg-purple-600 px-5 py-3 font-bold text-white transition hover:bg-purple-700"
            >
              Open Categories
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}