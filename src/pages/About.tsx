import {
  CheckCircle2,
  FlaskConical,
  PackageCheck,
  ShieldCheck,
  Truck,
} from "lucide-react";

function About() {
  const points = [
    "B2B chemical product supply",
    "Chemical and concentrate sourcing",
    "Business-focused requirements",
    "Direct enquiry and quotation support",
  ];

  return (
    <main>
      {/* HERO */}
      <section className="bg-slate-950 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
              About Us
            </p>

            <h1 className="mt-4 text-4xl font-black leading-tight text-white sm:text-5xl">
              KUNASHA CHEMICALS
            </h1>

            <p className="mt-6 text-lg leading-8 text-slate-300">
              KUNASHA CHEMICALS is a B2B chemical supplier and trader focused
              on providing chemical products and concentrates for business
              requirements.
            </p>
          </div>
        </div>
      </section>

      {/* ABOUT CONTENT */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
                Who We Are
              </p>

              <h2 className="mt-4 text-3xl font-black text-slate-900 sm:text-4xl">
                A Business-Focused Chemical Supply Partner
              </h2>

              <p className="mt-6 leading-8 text-slate-600">
                We work with businesses looking for chemical products and
                concentrates for their operational and commercial requirements.
              </p>

              <p className="mt-4 leading-8 text-slate-600">
                Our focus is on making product sourcing simple by providing
                clear product information and a direct way for customers to
                contact us for enquiries and quotations.
              </p>

              <div className="mt-8 space-y-4">
                {points.map((point) => (
                  <div
                    key={point}
                    className="flex items-center gap-3 text-slate-700"
                  >
                    <CheckCircle2
                      size={20}
                      className="shrink-0 text-blue-600"
                    />
                    <span className="font-semibold">{point}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-slate-50 p-8">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-700 text-2xl font-black text-white">
                KC
              </div>

              <h3 className="mt-7 text-2xl font-black text-slate-900">
                KUNASHA CHEMICALS
              </h3>

              <p className="mt-4 leading-7 text-slate-600">
                Chemical Supplier & Trader
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-white p-5">
                  <FlaskConical className="text-blue-700" size={26} />
                  <h4 className="mt-4 font-bold text-slate-900">
                    Chemical Products
                  </h4>
                </div>

                <div className="rounded-2xl bg-white p-5">
                  <PackageCheck className="text-blue-700" size={26} />
                  <h4 className="mt-4 font-bold text-slate-900">
                    Concentrates
                  </h4>
                </div>

                <div className="rounded-2xl bg-white p-5">
                  <Truck className="text-blue-700" size={26} />
                  <h4 className="mt-4 font-bold text-slate-900">
                    B2B Supply
                  </h4>
                </div>

                <div className="rounded-2xl bg-white p-5">
                  <ShieldCheck className="text-blue-700" size={26} />
                  <h4 className="mt-4 font-bold text-slate-900">
                    Business Support
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-700 py-16">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-black text-white">
            Looking for a Chemical Product?
          </h2>

          <p className="mt-4 leading-7 text-blue-100">
            Explore our available products or contact us with your
            requirement.
          </p>

          <div className="mt-7 flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href="/products"
              className="rounded-xl bg-white px-6 py-3 font-bold text-blue-700 hover:bg-slate-100"
            >
              Explore Products
            </a>

            <a
              href="/request-quote"
              className="rounded-xl border border-white/30 px-6 py-3 font-bold text-white hover:bg-white/10"
            >
              Request a Quote
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

export default About;