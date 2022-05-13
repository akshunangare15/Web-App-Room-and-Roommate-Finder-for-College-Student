import React, { useRef, useEffect, useState } from 'react';
import UserComponent from './UserComponent';
import Search from '../Search/Search';
import UserFilter from '../Filter/UserFilter';

import './index.css';

const DisplayUsers = () => {
    const searchRef = useRef();
    const [contents, setContents] = useState([]);
    const [search, setSearch] = useState('');

    function searchChange() {
        setSearch(searchRef.current.value);
    }
    function fetchContents() {
        fetch(`api/user/search?key=${search}`)
            .then((data) => data.json())
            .then((data) => data.results)
            .then((data) => setContents(data));
    }
    useEffect(() => {
        fetchContents();
    }, [search]);
    return (
      <div className="display-users">
          <Search onClick={searchChange} ref={searchRef} placeholder="Enter Any: First name, Last name" />
          <UserFilter handleFilter={(data) => setContents(data)} />
          <div className="results">
              {contents.map((user) => <UserComponent key={user.user_id} user={user} />)}
            </div>
        </div>
    );
};
export default DisplayUsers;
