import { useEffect, useMemo, useState, useRef } from "react";
import ProductCard from "../components/ProductCard";
import Filters from "../components/Filters";
import SearchBar from "../components/SearchBar";
import SkeletonCard from "../components/SkeletonCard";
import { useCart } from "../context/CartContext";
import { toast, Slide } from "react-toastify";


export default function HomePage() {
  const { addItem } = useCart();

  const [products, setProducts] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [visibleCount, setVisibleCount] = useState(15);
  const [loadingMore, setLoadingMore] = useState(false);

  const sentinelRef = useRef(null);

  //  Fetch products
  useEffect(() => {
    async function loadProducts() {
      try {
        setInitialLoading(true);
        setFetchError(null);
        const res = await fetch("https://fakestoreapi.com/products");

        if (!res.ok) {
          throw new Error("Failed to load products");
        }

        const data = await res.json();
        setProducts(data);
      } catch (e) {
        console.error("Error fetching products:", e);
        setFetchError("Failed to load products. Please try again later.");
      } finally {
        setInitialLoading(false);
      }
    }

    loadProducts();
  }, []);

  useEffect(() => {
    if (fetchError && !initialLoading) {
      document.body.classList.add("hide-cart");
    } else {
      document.body.classList.remove("hide-cart");
    }
    return () => {
      document.body.classList.remove("hide-cart");
    };
  }, [fetchError, initialLoading]);

  // Retry button
  const handleRetry = async () => {
    try {
      setInitialLoading(true);
      setFetchError(null);
      const res = await fetch("https://fakestoreapi.com/products");
      if (!res.ok) throw new Error("Failed to load products");
      const data = await res.json();
      setProducts(data);
    } catch (e) {
      console.error("Error fetching products:", e);
      setFetchError("Failed to load products. Please try again later.");
    } finally {
      setInitialLoading(false);
    }
  };

  const categories = useMemo(() => {
    const set = new Set();
    products.forEach((p) => set.add(p.category));
    return Array.from(set);
  }, [products]);

  const filtered = useMemo(() => {
    return products
      .filter((p) => (category === "all" ? true : p.category === category))
      .filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase())
      )
      .filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);
  }, [products, category, search, priceRange]);

  const visibleProducts = useMemo(
    () => filtered.slice(0, visibleCount),
    [filtered, visibleCount]
  );

  useEffect(() => {
    if (!sentinelRef.current) return;
    if (visibleProducts.length >= filtered.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setLoadingMore(true);
          setTimeout(() => {
            setVisibleCount((prev) => prev + 8);
            setLoadingMore(false);
          }, 400);
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [visibleProducts.length, filtered.length]);

  function handleAddToCart(product) {
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
    });

    toast.success("Added to cart!", {
    transition: Slide
  });
  }

  // Error State
  if (fetchError && !initialLoading) {
    return (
      <div className="page">
        <section aria-labelledby="product-listing-title">
          <h1 id="product-listing-title" className="sr-only">
            Product Listing
          </h1>

          <div className="error-page">
            <div className="error-card">
              <h2>Something went wrong</h2>
              <p>{fetchError}</p>
              <button
                type="button"
                onClick={handleRetry}
                className="error-btn"
              >
                Retry
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }


  return (
    <div className="page">
      <section aria-labelledby="product-listing-title">
        <h1 id="product-listing-title" className="sr-only">
          Product Listing
        </h1>
        <div className="listing-layout">
          <aside className="filters-desktop" aria-label="Filters">
            <Filters
              categories={categories}
              category={category}
              onCategoryChange={setCategory}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
            />
          </aside>

          <div className="listing-main">
            <div className="filters-mobile" aria-label="Filters for mobile">
              <details>
                <summary>Filters</summary>
                <Filters
                  categories={categories}
                  category={category}
                  onCategoryChange={setCategory}
                  priceRange={priceRange}
                  onPriceRangeChange={setPriceRange}
                />
              </details>
            </div>

            <SearchBar value={search} onDebouncedChange={setSearch} />

            {initialLoading ? (
              <div className="product-grid">
                {Array.from({ length: 10 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : (
              <>
                <div
                  className="product-grid"
                  role="list"
                  aria-label="Product grid"
                >
                  {visibleProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={() => handleAddToCart(product)}
                    />
                  ))}

                  {visibleProducts.length === 0 && (
                    <div className="no-products" role="alert">
                      No products found.
                    </div>
                  )}
                </div>

                {visibleProducts.length < filtered.length && (
                  <div
                    ref={sentinelRef}
                    className="infinite-sentinel"
                    aria-hidden="true"
                  >
                    {loadingMore && (
                      <div className="loader" role="status">
                        <span className="sr-only">
                          Loading more products…
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
