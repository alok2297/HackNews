import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import './index.css';

import Button from "../Button/index";

const Table = ({ list, onDismiss }) => {
  const [hashSet, setHashSet] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is authenticated
    const isAuthenticated = localStorage.getItem("isAuthenticated");

    if (isAuthenticated === "true") {
      // Fetch hashSet data from the backend
      const id = localStorage.getItem("userId");
      fetch(`http://localhost:5000/api/user/${id}`)
        .then(response => response.json())
        .then(data => {
          // Update hashSet state with the fetched data
          setHashSet(data.user.hashSet);
          console.log(data.user.hashSet);
        })
        .catch(error => console.error('Error fetching hashSet:', error));
    }
  }, []); 

  const filteredList = list.filter(item => hashSet && !hashSet.includes(item.objectID));
  console.log(filteredList);



  const handleClick = async (newsId) => {
    console.log(newsId);
    const item = localStorage.getItem("isAuthenticated");
    const userId = localStorage.getItem("userId");
    if(item==="true"){
      console.log("Hey I am Alok");
      console.log(userId);
    }
    else{
      navigate("/");
    }

    try {
      const response = await fetch('http://localhost:5000/api/hashset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, newsId })
      });
  
      if (response.status === 200) {
        console.log("News ID added to HashSet successfully");
        // Handle success
      } else {
        console.error("Failed to add news ID to HashSet");
        // Handle failure
      }
    } catch (error) {
      console.error("Error occurred while adding news ID to HashSet:", error);
      // Handle error
    }

  }
  return (
    <div className="table">
      <div className="table-header">
        <span className="item-title-header">Title</span>
        <span className="item-author-header">Time</span>
        <span className="item-comments-header">Comments</span>
        <span className="item-points-header">Upvotes</span>
        <span className="item-action-header">Action</span>
      </div>
      {filteredList.map(item =>
        <div key={item.objectID} className="table-row">
          <span className="item-title">
            <a
              href={item.url}
              title="Title"
            >
              {item.title || item.story_title}
            </a>
          </span>
          <span
            title="Author"
            className="item-author"
          >
            {item.created_at}
          </span>
          <span
            title="Number of comments"
            className="item-comments"
          >
            {item.num_comments}
          </span>
          <span
            title="Points"
            className="item-points"
          >
            {item.points}
          </span>
          <span className="item-dismiss">
            <Button
              className="button-inline"
              onClick={() => handleClick(item.objectID)}
            >
              Dismiss
            </Button>
          </span>
        </div>
      )}
    </div>
  );
};

Table.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      objectID: PropTypes.string.isRequired,
      author: PropTypes.string,
      url: PropTypes.string,
      num_comments: PropTypes.number,
    })
  ).isRequired,
  onDismiss: PropTypes.func.isRequired,
};

export default Table;
