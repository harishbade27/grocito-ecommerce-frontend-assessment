import Link from "next/link";

export default function ProductCard({ product, onAddToCart }) {
  return (
    <article className="product-card" role="listitem">
      <Link href={`/product/${product.id}`} className="product-image-link">
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          className="product-image"
        />
      </Link>
      <div className="product-body">
        <h2 className="product-title">
          <Link href={`/product/${product.id}`}>{product.title}</Link>
        </h2>
        <p className="product-price">₹{product.price.toFixed(2)}</p>
        <button
          type="button"
          className="add-to-cart-btn"
          onClick={onAddToCart}
          aria-label={`Add ${product.title} to cart`}
        >
          Add to Cart
        </button>
      </div>
    </article>
  );
}
