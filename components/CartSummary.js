import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";

export default function CartSummary() {
  const { items, total, removeItem, decrementItem, addItem, clearCart } =
    useCart();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);


  useEffect(() => {
  if (status) {
    const timer = setTimeout(() => {
      setStatus("");
    }, 1000);

    return () => clearTimeout(timer);
  }
}, [status]);


  async function handleCheckout() {
    if (!items.length) return;

    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, total }),
      });

      if (!res.ok) {
        throw new Error("Checkout failed");
      }

      const data = await res.json();
      if (data.success) {
        setStatus("success");
        clearCart();
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="cart-summary">
      <h2>Cart</h2>
      {items.length === 0 && <p className="cart-empty">Your cart is empty.</p>}

      <ul className="cart-items" aria-live="polite">
        {items.map((item) => (
          <li key={item.id} className="cart-item">
            <div className="cart-item-info">
              <span className="cart-item-title">{item.title}</span>
              <span className="cart-item-price">
                ₹{item.price.toFixed(2)} x {item.quantity}
              </span>
            </div>
            <div className="cart-item-actions">
              <button
                onClick={() => decrementItem(item.id)}
                aria-label={`Decrease quantity of ${item.title}`}
              >
                -
              </button>
              <button
                onClick={() => addItem(item)}
                aria-label={`Increase quantity of ${item.title}`}
              >
                +
              </button>
              <button
                onClick={() => removeItem(item.id)}
                className="remove-btn"
                aria-label={`Remove ${item.title} from cart`}
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="cart-footer">
        <p className="cart-total">
          Total: <strong>₹{total.toFixed(2)}</strong>
        </p>
        <button
          type="button"
          disabled={!items.length || loading}
          onClick={handleCheckout}
          className="checkout-btn"
        >
          {loading ? "Processing..." : "Proceed to Checkout"}
        </button>
        {status === "success" && (
          <p className="status success" role="status">
            Order placed successfully!
          </p>
        )}
        {status === "error" && (
          <p className="status error" role="status">
            Something went wrong. Please try again.
          </p>
        )}
      </div>
    </div>
  );
}
