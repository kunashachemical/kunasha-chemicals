import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import AdminRoute from "./components/AdminRoute";

import Home from "./pages/Home";
import About from "./pages/About";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import Contact from "./pages/Contact";
import RequestQuote from "./pages/RequestQuote";
import ProductDetails from "./pages/ProductDetails";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import AdminProductForm from "./pages/AdminProductForm";
import AdminCategories from "./pages/AdminCategories";
import AdminQuoteRequests from "./pages/AdminQuoteRequests";

function PublicLayout() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/about" element={<About />} />

        <Route path="/products" element={<Products />} />

        <Route
          path="/products/:slug"
          element={<ProductDetails />}
        />

        <Route path="/categories" element={<Categories />} />

        <Route path="/contact" element={<Contact />} />

        <Route
          path="/request-quote"
          element={<RequestQuote />}
        />

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>

      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ================================
            ADMIN LOGIN
        ================================= */}
        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

        {/* ================================
            PROTECTED ADMIN ROUTES
        ================================= */}
        <Route element={<AdminRoute />}>
          {/* Dashboard */}
          <Route
            path="/admin/dashboard"
            element={<AdminDashboard />}
          />

          {/* Products */}
          <Route
            path="/admin/products"
            element={<AdminProducts />}
          />

          <Route
            path="/admin/products/new"
            element={<AdminProductForm />}
          />

          <Route
            path="/admin/products/:id/edit"
            element={<AdminProductForm />}
          />

          {/* Categories */}
          <Route
            path="/admin/categories"
            element={<AdminCategories />}
          />

          {/* Quote Requests */}
          <Route
            path="/admin/quote-requests"
            element={<AdminQuoteRequests />}
          />
        </Route>

        {/* ================================
            PUBLIC WEBSITE
        ================================= */}
        <Route
          path="/*"
          element={<PublicLayout />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;