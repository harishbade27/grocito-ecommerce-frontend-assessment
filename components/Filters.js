export default function Filters({
  categories,
  category,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
}) {
  const [min, max] = priceRange;

  function handleMinChange(e) {
    const value = Number(e.target.value) || 0;
    onPriceRangeChange([value, max]);
  }

  function handleMaxChange(e) {
    const value = Number(e.target.value) || 0;
    onPriceRangeChange([min, value]);
  }

  return (
    <form className="filters" aria-label="Product filters">
      <fieldset>
        <legend>Category</legend>
        <label className="filter-label">
          <span className="sr-only">Category</span>
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            <option value="all">All</option>
            {categories.map((cat) => (
              <option value={cat} key={cat}>
                {cat}
              </option>
            ))}
          </select>
        </label>
      </fieldset>

      <fieldset>
        <legend>Price Range</legend>
        <div className="price-inputs">
          <label>
            Min
            <input
              type="number"
              value={min}
              onChange={handleMinChange}
              min="0"
            />
          </label>
          <label>
            Max
            <input
              type="number"
              value={max}
              onChange={handleMaxChange}
              min="0"
            />
          </label>
        </div>
      </fieldset>
    </form>
  );
}
