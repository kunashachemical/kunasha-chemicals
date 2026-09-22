import { Menu, Search, X } from "lucide-react";
import { useState } from "react";

function Header() {
  const [mobileMenu, setMobileMenu] = useState(false);

  return (
    <>
      {/* Top Bar */}
      <div className="bg-slate-950 px-4 py-2 text-center text-sm text-slate-300">
        Trusted Chemical Supplier & Trader for B2B Requirements
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          
          {/* Logo */}
          <a href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-700 font-bold text-white">
              KC
            </div>

            <div>
              <div className="text-xl font-extrabold tracking-tight">
                KUNASHA
              </div>

              <div className="-mt-1 text-xs font-semibold tracking-[0.25em] text-blue-700">
                CHEMICALS
              </div>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="/"
              className="text-sm font-semibold transition hover:text-blue-700"
            >
              Home
            </a>

            <a
              href="/about"
              className="text-sm font-semibold transition hover:text-blue-700"
            >
              About
            </a>

            <a
              href="/products"
              className="text-sm font-semibold transition hover:text-blue-700"
            >
              Products
            </a>

            <a
              href="/categories"
              className="text-sm font-semibold transition hover:text-blue-700"
            >
              Categories
            </a>

            <a
              href="/contact"
              className="text-sm font-semibold transition hover:text-blue-700"
            >
              Contact
            </a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-3 md:flex">
            <a
              href="/products"
              className="flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-bold transition hover:bg-slate-50"
            >
              <Search size={17} />
              Find Products
            </a>

            <a
              href="/request-quote"
              className="rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-800"
            >
              Request Quote
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="rounded-lg border border-slate-200 p-2 md:hidden"
            aria-label="Toggle menu"
          >
            {mobileMenu ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenu && (
          <div className="border-t border-slate-200 bg-white px-4 py-5 md:hidden">
            <nav className="flex flex-col gap-4">
              <a
                href="/"
                onClick={() => setMobileMenu(false)}
                className="font-semibold"
              >
                Home
              </a>

              <a
                href="/about"
                onClick={() => setMobileMenu(false)}
                className="font-semibold"
              >
                About
              </a>

              <a
                href="/products"
                onClick={() => setMobileMenu(false)}
                className="font-semibold"
              >
                Products
              </a>

              <a
                href="/categories"
                onClick={() => setMobileMenu(false)}
                className="font-semibold"
              >
                Categories
              </a>

              <a
                href="/contact"
                onClick={() => setMobileMenu(false)}
                className="font-semibold"
              >
                Contact
              </a>

              <a
                href="/request-quote"
                onClick={() => setMobileMenu(false)}
                className="rounded-xl bg-blue-700 px-5 py-3 text-center font-bold text-white"
              >
                Request Quote
              </a>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}

export default Header;