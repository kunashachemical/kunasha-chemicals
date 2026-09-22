import {
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
} from "lucide-react";

function Contact() {
  return (
    <main>
      {/* HERO */}
      <section className="bg-slate-950 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
              Contact Us
            </p>

            <h1 className="mt-4 text-4xl font-black text-white sm:text-5xl">
              Let's Discuss Your Requirement
            </h1>

            <p className="mt-6 text-lg leading-8 text-slate-300">
              Contact KUNASHA CHEMICALS for product enquiries, availability,
              bulk requirements and quotations.
            </p>
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2">
            {/* CONTACT INFO */}
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
                Get In Touch
              </p>

              <h2 className="mt-4 text-3xl font-black text-slate-900">
                Contact KUNASHA CHEMICALS
              </h2>

              <p className="mt-5 max-w-xl leading-8 text-slate-600">
                Have a chemical requirement? Send us your requirement and our
                team will get back to you with the relevant product details
                and quotation.
              </p>

              <div className="mt-10 space-y-5">
                {/* PHONE */}
                <div className="flex gap-4 rounded-2xl border border-slate-200 p-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                    <Phone size={22} />
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900">Phone</h3>
                    <a
                      href="tel:+917084368451"
                      className="mt-1 block text-sm text-slate-500 hover:text-blue-700"
                    >
                      +91 70843 68451
                    </a>
                  </div>
                </div>

                {/* EMAIL */}
                <div className="flex gap-4 rounded-2xl border border-slate-200 p-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                    <Mail size={22} />
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900">Email</h3>
                    <a
                      href="mailto:kunashachemical@gmail.com"
                      className="mt-1 block break-all text-sm text-slate-500 hover:text-blue-700"
                    >
                      kunashachemical@gmail.com
                    </a>
                  </div>
                </div>

                {/* LOCATION */}
                <div className="flex gap-4 rounded-2xl border border-slate-200 p-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                    <MapPin size={22} />
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900">Location</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      V 38 VAMBAY SCHEME, GANGAGANJ, PANKI, KANPUR NAGAR
                    </p>
                  </div>
                </div>

                {/* BUSINESS HOURS */}
                <div className="flex gap-4 rounded-2xl border border-slate-200 p-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                    <Clock size={22} />
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900">
                      Business Hours
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      9:30 AM - 6:30 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* FORM */}
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
              <h2 className="text-2xl font-black text-slate-900">
                Send an Enquiry
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Tell us what product or chemical you are looking for.
              </p>

              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  alert("Thank you. Your enquiry has been submitted.");
                }}
                className="mt-7 space-y-5"
              >
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Name
                  </label>

                  <input
                    type="text"
                    required
                    placeholder="Your name"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    required
                    placeholder="Your phone number"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Email
                  </label>

                  <input
                    type="email"
                    placeholder="Your email"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Requirement
                  </label>

                  <textarea
                    required
                    rows={5}
                    placeholder="Tell us about your chemical/product requirement..."
                    className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-4 font-bold text-white transition hover:bg-blue-700"
                >
                  <Send size={18} />
                  Send Enquiry
                </button>
              </form>

              {/* WHATSAPP */}
              <a
                href="https://wa.me/917084368451"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-4 font-bold text-white transition hover:bg-green-700"
              >
                <MessageCircle size={19} />
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Contact;