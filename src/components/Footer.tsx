function Footer() {
  return (
    <footer className="bg-slate-950 text-white">
      {/* Main Footer */}
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        
        {/* Company */}
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-700 font-bold">
              KC
            </div>

            <div>
              <div className="text-xl font-extrabold">
                KUNASHA
              </div>

              <div className="-mt-1 text-xs font-semibold tracking-[0.25em] text-blue-400">
                CHEMICALS
              </div>
            </div>
          </div>

          <p className="mt-5 text-sm leading-7 text-slate-400">
            KUNASHA CHEMICALS is a B2B chemical supplier and trader providing
            chemical products and concentrates for business requirements.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-bold">Quick Links</h3>

          <div className="mt-5 flex flex-col gap-3 text-sm text-slate-400">
            <a href="/" className="transition hover:text-white">
              Home
            </a>

            <a href="/about" className="transition hover:text-white">
              About Us
            </a>

            <a href="/products" className="transition hover:text-white">
              Products
            </a>

            <a href="/categories" className="transition hover:text-white">
              Categories
            </a>

            <a href="/contact" className="transition hover:text-white">
              Contact
            </a>
          </div>
        </div>

        {/* Products */}
        <div>
          <h3 className="font-bold">Our Products</h3>

          <div className="mt-5 flex flex-col gap-3 text-sm text-slate-400">
            <a href="/products" className="transition hover:text-white">
              Industrial Chemicals
            </a>

            <a href="/products" className="transition hover:text-white">
              Solvents
            </a>

            <a href="/products" className="transition hover:text-white">
              Chemical Concentrates
            </a>

            <a href="/products" className="transition hover:text-white">
              Cleaning Chemicals
            </a>

            <a href="/products" className="transition hover:text-white">
              Water Treatment Chemicals
            </a>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-bold">Contact Us</h3>

          <div className="mt-5 space-y-4 text-sm text-slate-400">
            <div>
              <div className="font-semibold text-white">Business Enquiries</div>
              <div className="mt-1">
                Contact us for product and quotation enquiries.
              </div>
            </div>

            <div>
              <div className="font-semibold text-white">WhatsApp</div>
              <div className="mt-1">
                Available for direct product enquiries.
              </div>
            </div>

            <a
              href="/request-quote"
              className="inline-block rounded-xl bg-blue-700 px-5 py-3 font-bold text-white transition hover:bg-blue-800"
            >
              Request a Quote
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-sm text-slate-500 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p>
            © {new Date().getFullYear()} KUNASHA CHEMICALS. All rights reserved.
          </p>

          <p>
            Chemical Supplier & Trader
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;