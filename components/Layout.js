import Link from "next/link";
import { useCart } from "../context/CartContext";
import { useState, useEffect } from "react";
import CartSummary from "./CartSummary";
import { FiShoppingCart, FiX } from "react-icons/fi";
import Router from "next/router";

export default function Layout({ children }) {
  const { itemCount } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [routeLoading, setRouteLoading] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== "undefined") {
        setIsMobile(window.innerWidth <= 768);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleStart = () => setRouteLoading(true);
    const handleDone = () => setRouteLoading(false);

    Router.events.on("routeChangeStart", handleStart);
    Router.events.on("routeChangeComplete", handleDone);
    Router.events.on("routeChangeError", handleDone);

    return () => {
      Router.events.off("routeChangeStart", handleStart);
      Router.events.off("routeChangeComplete", handleDone);
      Router.events.off("routeChangeError", handleDone);
    };
  }, []);

  const handleCartClick = () => {
    setIsCartOpen(true);
  };

  const handleCloseCart = () => {
    setIsCartOpen(false);
  };

  return (
    <div className="app-root">
      <header className="app-header">
        <div className="header-left">
          <Link href="/" className="brand" aria-label="Go to home page">
            Grocito
          </Link>
        </div>

        <nav aria-label="Main navigation">
          <Link href="/" className="nav-link">
            Products
          </Link>
        </nav>

        <button
          type="button"
          className="header-cart"
          onClick={handleCartClick}
          aria-label={`Open cart, ${itemCount} items`}
        >
          <span className="header-cart-icon">
            <FiShoppingCart size={20} />
          </span>
          <span className="header-cart-count">{itemCount}</span>
        </button>
      </header>

      {routeLoading && (
        <div className="page-loader" aria-label="Loading page">
          <div className="loader" role="status" aria-live="polite">
            <span className="sr-only">Loading…</span>
          </div>
        </div>
      )}

      <main className="app-main">{children}</main>

      <aside
        className={`app-cart ${isCartOpen ? "open" : ""}`}
        aria-label="Cart summary"
      >
        {isMobile ? (
          <button
            type="button"
            className="cart-close-btn"
            onClick={handleCloseCart}
            aria-label="Close cart"
          >
            <FiX size={18} />
          </button>
        ) : null}
        <CartSummary />
      </aside>
    </div>
  );
}
