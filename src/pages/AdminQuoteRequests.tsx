import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Mail,
  MessageCircle,
  Package,
  Phone,
  Search,
  Trash2,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

type QuoteRequest = {
  id: string;
  name: string;
  company_name: string | null;
  phone: string;
  email: string | null;
  product: string;
  quantity: string | null;
  requirement_details: string;
  status: "new" | "contacted" | "closed";
  created_at: string;
};

function AdminQuoteRequests() {
  const [requests, setRequests] = useState<QuoteRequest[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const loadRequests = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("quote_requests")
      .select(
        `
        id,
        name,
        company_name,
        phone,
        email,
        product,
        quantity,
        requirement_details,
        status,
        created_at
      `
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Quote requests error:", error);
      alert(`Unable to load quote requests: ${error.message}`);
      setLoading(false);
      return;
    }

    setRequests((data as QuoteRequest[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const updateStatus = async (
    id: string,
    status: QuoteRequest["status"]
  ) => {
    const { error } = await supabase
      .from("quote_requests")
      .update({ status })
      .eq("id", id);

    if (error) {
      console.error("Status update error:", error);
      alert(`Unable to update status: ${error.message}`);
      return;
    }

    setRequests((current) =>
      current.map((request) =>
        request.id === id
          ? { ...request, status }
          : request
      )
    );
  };

  const deleteRequest = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this quote request?"
    );

    if (!confirmed) {
      return;
    }

    const { error } = await supabase
      .from("quote_requests")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Delete error:", error);
      alert(`Unable to delete quote request: ${error.message}`);
      return;
    }

    setRequests((current) =>
      current.filter((request) => request.id !== id)
    );
  };

  const filteredRequests = requests.filter((request) => {
    const searchText = search.toLowerCase().trim();

    if (!searchText) {
      return true;
    }

    return [
      request.name,
      request.company_name,
      request.phone,
      request.email,
      request.product,
      request.quantity,
      request.requirement_details,
    ]
      .filter(Boolean)
      .some((value) =>
        String(value).toLowerCase().includes(searchText)
      );
  });

  const getStatusClasses = (status: QuoteRequest["status"]) => {
    if (status === "new") {
      return "bg-amber-50 text-amber-700 border-amber-200";
    }

    if (status === "contacted") {
      return "bg-blue-50 text-blue-700 border-blue-200";
    }

    return "bg-green-50 text-green-700 border-green-200";
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

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
                Quote Requests
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Manage customer product and quotation enquiries.
              </p>
            </div>

            <Link
              to="/admin/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <ArrowLeft size={16} />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        {/* TOP BAR */}
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <Package size={20} />
            </div>

            <div>
              <p className="text-sm font-bold text-slate-900">
                {requests.length} Total Request
                {requests.length === 1 ? "" : "s"}
              </p>

              <p className="text-xs text-slate-500">
                Customer enquiries received from the website.
              </p>
            </div>
          </div>

          <div className="relative w-full lg:max-w-md">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search name, company, phone or product..."
              className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <p className="text-sm font-semibold text-slate-500">
              Loading quote requests...
            </p>
          </div>
        )}

        {/* EMPTY */}
        {!loading && filteredRequests.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500">
              <Package size={24} />
            </div>

            <h2 className="mt-4 text-lg font-black text-slate-900">
              {search
                ? "No matching requests"
                : "No quote requests yet"}
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              {search
                ? "Try a different search term."
                : "Customer enquiries submitted through the Request Quote form will appear here."}
            </p>
          </div>
        )}

        {/* REQUESTS */}
        {!loading && filteredRequests.length > 0 && (
          <div className="space-y-5">
            {filteredRequests.map((request) => (
              <article
                key={request.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                {/* CARD HEADER */}
                <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-lg font-black text-slate-900">
                          {request.product}
                        </h2>

                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-bold uppercase ${getStatusClasses(
                            request.status
                          )}`}
                        >
                          {request.status}
                        </span>
                      </div>

                      <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                        <CalendarDays size={14} />
                        {formatDate(request.created_at)}
                      </div>
                    </div>

                    {/* STATUS */}
                    <div className="relative">
                      <ChevronDown
                        size={16}
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <select
                        value={request.status}
                        onChange={(event) =>
                          updateStatus(
                            request.id,
                            event.target.value as QuoteRequest["status"]
                          )
                        }
                        className="appearance-none rounded-lg border border-slate-300 bg-white py-2 pl-3 pr-9 text-sm font-semibold text-slate-700 outline-none focus:border-blue-600"
                      >
                        <option value="new">New</option>
                        <option value="contacted">
                          Contacted
                        </option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* CARD BODY */}
                <div className="grid gap-6 p-5 lg:grid-cols-3">
                  {/* CUSTOMER */}
                  <div>
                    <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                      Customer
                    </h3>

                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <User
                          size={17}
                          className="mt-0.5 text-slate-400"
                        />

                        <div>
                          <p className="text-sm font-bold text-slate-900">
                            {request.name}
                          </p>

                          {request.company_name && (
                            <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                              <Building2 size={13} />
                              {request.company_name}
                            </div>
                          )}
                        </div>
                      </div>

                      <a
                        href={`tel:${request.phone}`}
                        className="flex items-center gap-3 text-sm font-semibold text-blue-600 hover:underline"
                      >
                        <Phone size={17} />
                        {request.phone}
                      </a>

                      {request.email && (
                        <a
                          href={`mailto:${request.email}`}
                          className="flex items-center gap-3 break-all text-sm font-semibold text-blue-600 hover:underline"
                        >
                          <Mail size={17} />
                          {request.email}
                        </a>
                      )}
                    </div>
                  </div>

                  {/* REQUIREMENT */}
                  <div>
                    <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                      Requirement
                    </h3>

                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-semibold text-slate-400">
                          Product
                        </p>

                        <p className="mt-1 text-sm font-bold text-slate-900">
                          {request.product}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-slate-400">
                          Quantity
                        </p>

                        <p className="mt-1 text-sm font-semibold text-slate-700">
                          {request.quantity || "Not specified"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* DETAILS */}
                  <div>
                    <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                      Requirement Details
                    </h3>

                    <p className="whitespace-pre-wrap text-sm leading-6 text-slate-600">
                      {request.requirement_details}
                    </p>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <a
                    href={`https://wa.me/${request.phone.replace(
                      /\D/g,
                      ""
                    )}?text=${encodeURIComponent(
                      `Hello ${request.name}, this is KUNASHA CHEMICALS regarding your enquiry for ${request.product}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-green-700"
                  >
                    <MessageCircle size={17} />
                    WhatsApp Customer
                  </a>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={() =>
                        updateStatus(request.id, "contacted")
                      }
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-bold text-blue-700 transition hover:bg-blue-100"
                    >
                      <CheckCircle2 size={17} />
                      Mark Contacted
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteRequest(request.id)}
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-50"
                    >
                      <Trash2 size={17} />
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default AdminQuoteRequests;