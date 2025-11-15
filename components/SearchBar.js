import { useEffect, useState } from "react";

export default function SearchBar({ value, onDebouncedChange }) {
  const [inputValue, setInputValue] = useState(value || "");

  useEffect(() => {
    const id = setTimeout(() => {
      onDebouncedChange(inputValue);
    }, 500);
    return () => clearTimeout(id);
  }, [inputValue, onDebouncedChange]);

  return (
    <div className="search-bar">
      <label htmlFor="search" className="sr-only">
        Search products
      </label>
      <input
        id="search"
        type="search"
        placeholder="Search products..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        aria-label="Search products"
      />
    </div>
  );
}
