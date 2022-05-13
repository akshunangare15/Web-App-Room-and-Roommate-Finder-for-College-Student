import React, { useEffect, useState } from "react";
import "./index.css";

const ListingFilter = (props) => {
  let [housing, setHousing] = useState("");
  let [price, setPrice] = useState("");

  useEffect(() => {
    setHousing("");
    setPrice("");
  }, [props.reset]);
  return (
    <div className="filter">
      <form className="filter-form">
        <div id="housing-type-filter">
          <select
            name="housing_type"
            value={housing}
            onChange={(event) => setHousing(event.target.value)}
          >
            <option value="">Housing type...</option>
            <option value="house">House</option>
            <option value="apartment">Apartment</option>
          </select>
        </div>
        <div id="rent-filter">
          <select
            name="min_rent"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
          >
            <option value="">Max Price range...</option>
            <option value="800">$800</option>
            <option value="900">$900</option>
            <option value="1000">$1000</option>
            <option value="2000">$2000</option>
            <option value="3000">$3000</option>
          </select>
        </div>
      </form>
      <div className="filter-btn">
        <button
          htmlFor="filter-form"
          onClick={() => props.handleFilter(housing, price)}
          type="submit"
        >
          Filter
        </button>
      </div>
    </div>
  );
};
export default ListingFilter;
