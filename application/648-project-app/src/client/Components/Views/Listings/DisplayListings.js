import React, { useRef, useEffect, useState } from 'react';
import Search from '../Search/Search';
import ListingComponent from './ListingComponent';
import ListingFilter from '../Filter/ListingFilter';
import './index.css';

const DisplayListings = () => {
    const searchRef = useRef();
    const [contents, setContents] = useState([]);
    const [resetFilter, setResetFilter] = useState(false);
    // search only valuable when we click seach button when we click "search"
    // we should not monitor as useState
    // let [search, setSearch] = useState("");

    function searchChange() {
        fetch(`api/listing/getAll?key=${searchRef.current.value}`)
            .then((data) => data.json())
            .then((data) => data.results)
            .then((data) => {
                setResetFilter((previousValue) => !previousValue);
                setContents(data);
            });
    }

    //  http://localhost:3000/api/listing/search?max_rent=1200&&housing_type=condo&&location=90050

  function filterHandler(housing_type, max_rent) {
    let url = `/api/listing/search?max_rent=${max_rent}&&housing_type=${housing_type}&&custom=${searchRef.current.value}`;
    fetch(url)
      .then((data) => data.json())
      .then((data) => data.results)
      .then((data) => {
        // console.log(data);
        setContents(data);
      });
  }
  function getInitial(){
    fetch(`api/listing/initial`)
      .then((data) => data.json())
      .then((data) => data.results)
      .then((data) => {
        setContents(data);
      });
  }
    useEffect(() => {
        getInitial();
    }, []);
    return (
        <div className="display-listings">
            <Search onClick={searchChange} ref={searchRef} placeholder="Enter Zip" />
            <ListingFilter handleFilter={filterHandler} reset={resetFilter} />
            <div className="results">
                {contents.map((listing) => (
                <ListingComponent key={listing.listing_id} listing={listing} />
                ))}
          </div>
            {!contents.length && <h3>No listings meet your expectation at this time</h3>}
      </div>
    );
};
export default DisplayListings;
