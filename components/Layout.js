// components/Layout.jsx
import Link from "next/link";
import { useCart } from "../context/CartContext";
import { useState } from "react";
import CartSummary from "./CartSummary";
import { FiShoppingCart, FiX } from "react-icons/fi";

export default function Layout({ children }) {
  const { itemCount } = useCart();

  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleCartClick = () => setIsCartOpen(true);
  const handleCloseCart = () => setIsCartOpen(false);

  return (
    <div className="app-root">

      <header className="app-header">
        <div className="header-left">
          <Link href="/" className="brand" aria-label="Go to home page">
            Grocito
          </Link>
        </div>

        {/* <nav aria-label="Main navigation">
          <Link href="/" className="nav-link">
            Products
          </Link>
        </nav> */}

        {/* Cart button in header */}
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

      <main className="app-main">{children}</main>

      {/* Cart sidebar */}
      <aside className={`app-cart ${isCartOpen ? "open" : ""}`} aria-label="Cart summary">
        <div className="cart-sidebar-header">
          <h2>Cart</h2>
          <button
            type="button"
            className="cart-close-btn"
            onClick={handleCloseCart}
            aria-label="Close cart"
          >
            <FiX size={18} />
          </button>
        </div>

        <CartSummary />
      </aside>

    </div>
  );
}
