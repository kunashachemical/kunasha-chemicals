import {
  Building2,
  Mail,
  MessageCircle,
  Package,
  Phone,
  Send,
  User,
} from "lucide-react";
import { useState } from "react";
import { supabase } from "../lib/supabase";

function RequestQuote() {
  const [form, setForm] = useState({
    name: "",
    company_name: "",
    phone: "",
    email: "",
    product: "",
    quantity: "",
    requirement_details: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const updateField = (
    field: keyof typeof form,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setSuccess(false);
    setSubmitting(true);

    const quoteData = {
      name: form.name.trim(),
      company_name: form.company_name.trim() || null,
      phone: form.phone.trim(),
      email: form.email.trim() || null,
      product: form.product.trim(),
      quantity: form.quantity.trim() || null,
      requirement_details: form.requirement_details.trim(),
    };

    try {
      // STEP 1: Save quote request in Supabase
      const { error: databaseError } = await supabase
        .from("quote_requests")
        .insert(quoteData);

      if (databaseError) {
        console.error(
          "Quote database error:",
          databaseError
        );

        alert(
          `Unable to submit your quote request. ${databaseError.message}`
        );

        setSubmitting(false);
        return;
      }

      // STEP 2: Send email notification through Edge Function
      const { data: emailData, error: emailError } =
        await supabase.functions.invoke(
          "send-quote-email",
          {
            body: quoteData,
          }
        );

      if (emailError) {
        console.error(
          "Quote email function error:",
          emailError
        );

        // Quote is already saved successfully.
        // Email failure should not delete the customer's request.
        alert(
          "Your quote request was saved successfully, but the email notification could not be sent. The request is still available in the Admin Panel."
        );
      } else {
        console.log(
          "Quote email sent:",
          emailData
        );
      }

      // STEP 3: Reset form
      setForm({
        name: "",
        company_name: "",
        phone: "",
        email: "",
        product: "",
        quantity: "",
        requirement_details: "",
      });

      setSuccess(true);
    } catch (error) {
      console.error(
        "Unexpected quote submission error:",
        error
      );

      alert(
        "Something went wrong while submitting your quote request."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hello KUNASHA CHEMICALS,

I would like to enquire about a chemical/product.

Name: ${form.name || "Not provided"}
Company: ${form.company_name || "Not provided"}
Phone: ${form.phone || "Not provided"}
Product: ${form.product || "Not provided"}
Quantity: ${form.quantity || "Not provided"}

Requirement:
${form.requirement_details || "Not provided"}`
  );

  return (
    <main>
      {/* HERO */}
      <section className="bg-slate-950 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
              Request a Quote
            </p>

            <h1 className="mt-4 text-4xl font-black text-white sm:text-5xl">
              Tell Us Your Requirement
            </h1>

            <p className="mt-6 text-lg leading-8 text-slate-300">
              Share your chemical requirement with KUNASHA
              CHEMICALS and our team will contact you regarding
              product availability and pricing.
            </p>
          </div>
        </div>
      </section>

      {/* FORM */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
            <div className="mb-8">
              <h2 className="text-2xl font-black text-slate-900">
                Quote Request
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Please provide your business and product
                requirement details.
              </p>
            </div>

            {success && (
              <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-4 text-sm font-semibold text-green-700">
                Your quote request has been submitted
                successfully. Our team will contact you
                regarding your requirement.
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="grid gap-6 md:grid-cols-2"
            >
              {/* NAME */}
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Your Name *
                </label>

                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    required
                    type="text"
                    value={form.name}
                    onChange={(e) =>
                      updateField("name", e.target.value)
                    }
                    placeholder="Enter your name"
                    className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* COMPANY */}
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Company Name
                </label>

                <div className="relative">
                  <Building2
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    value={form.company_name}
                    onChange={(e) =>
                      updateField(
                        "company_name",
                        e.target.value
                      )
                    }
                    placeholder="Enter company name"
                    className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* PHONE */}
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Phone Number *
                </label>

                <div className="relative">
                  <Phone
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    required
                    type="tel"
                    value={form.phone}
                    onChange={(e) =>
                      updateField("phone", e.target.value)
                    }
                    placeholder="Enter phone number"
                    className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Email
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      updateField("email", e.target.value)
                    }
                    placeholder="Enter email address"
                    className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* PRODUCT */}
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Product / Chemical Required *
                </label>

                <div className="relative">
                  <Package
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    required
                    type="text"
                    value={form.product}
                    onChange={(e) =>
                      updateField("product", e.target.value)
                    }
                    placeholder="Product or chemical name"
                    className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* QUANTITY */}
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Required Quantity
                </label>

                <input
                  type="text"
                  value={form.quantity}
                  onChange={(e) =>
                    updateField("quantity", e.target.value)
                  }
                  placeholder="Example: 100 Kg / 1 MT"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* MESSAGE */}
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Requirement Details *
                </label>

                <textarea
                  required
                  rows={6}
                  value={form.requirement_details}
                  onChange={(e) =>
                    updateField(
                      "requirement_details",
                      e.target.value
                    )
                  }
                  placeholder="Please describe your requirement, specifications, packaging preference, delivery location, etc."
                  className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* SUBMIT */}
              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-4 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Send size={18} />

                  {submitting
                    ? "Submitting..."
                    : "Submit Quote Request"}
                </button>
              </div>
            </form>

            {/* WHATSAPP */}
            <div className="mt-6 border-t border-slate-200 pt-6">
              <a
                href={`https://wa.me/917084368451?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-4 font-bold text-white transition hover:bg-green-700"
              >
                <MessageCircle size={19} />
                Send Requirement on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default RequestQuote;