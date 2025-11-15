import Link from "next/link";

export default function Custom404() {
  return (
    <div className="error-page">
      <div className="error-card">
        <h1>404</h1>
        <h2>Oops! Page not found</h2>
        <p>
          The page you’re looking for doesn’t exist or may have been moved.
        </p>
        <Link href="/" className="error-btn">
          Go back to Products
        </Link>
      </div>
    </div>
  );
}
