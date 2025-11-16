import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useCart } from "../../context/CartContext";
import SkeletonProductDetail from "../../components/SkeletonProductDetail";
import { toast, Slide } from "react-toastify";


export default function ProductDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setError("");

    fetch(`https://fakestoreapi.com/products/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to load product");
        }
        return res.json();
      })
      .then((data) => {
        setProduct(data);
      })
      .catch(() => {
        setError("We couldn’t load this product right now. Please try again.");
        setProduct(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
    });

    toast.success("Added to cart!", { transition: Slide });
  };


  if (loading) {
    return <SkeletonProductDetail />;
  }


  if (error) {
    return (
      <>
        <Head>
          <title>Product</title>
          <meta
            name="description"
            content="There was a problem loading this product."
          />
        </Head>
        <div className="error-page">
          <div className="error-card">
            <h2>Something went wrong</h2>
            <p>{error}</p>
            <Link href="/" className="error-btn">
              Back to Products
            </Link>
          </div>
        </div>
      </>
    );
  }


  if (!product) {
    return (
      <div className="error-page">
        <div className="error-card">
          <h2>Product not found</h2>
          <p>This product is not available.</p>
          <Link href="/" className="error-btn">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const seoTitle = `${product.title} | Grocito`;
  const seoDescription = product.description.slice(0, 150);

  return (
    <>
      <Head>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:type" content="product" />
      </Head>

      <article className="product-detail">
        <div className="product-detail-image-wrapper">
          <img
            src={product.image}
            alt={product.title}
            loading="lazy"
            className="product-detail-image"
          />
        </div>
        <div className="product-detail-info">
          <h1>{product.title}</h1>
          <p className="product-detail-price">
            Price: ₹{product.price.toFixed(2)}
          </p>
          <p className="product-detail-description">
            {product.description}
          </p>
          <button
            type="button"
            onClick={handleAddToCart}
            className="add-to-cart-btn"
          >
            Add to Cart
          </button>
        </div>
      </article>
    </>
  );
}
