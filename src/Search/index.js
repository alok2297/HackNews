import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Search({ searchTerm, onChange, children: text, onSubmit, onClick }) {
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleClick = () => {
    // Call the onClick callback with the click value
    onClick(1);
    // Navigate to the Login page
    navigate("/login");
  };

  return (
    <div className='main' style={{ display: "flex" }}>
      <form onSubmit={onSubmit}>
        <input
          type="search"
          onChange={onChange}
          value={searchTerm}
          ref={inputRef}
        />
        <button type="submit">{text}</button>
      </form>
      <button onClick={handleClick} style={{ marginLeft: "auto", marginRight: "50px" }}>Login/Signup</button>
    </div>
  );
}

export default Search;
