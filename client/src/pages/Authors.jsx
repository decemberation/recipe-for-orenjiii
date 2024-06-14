import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Loading from "../components/Loading";

const Authors = () => {
  // eslint-disable-next-line
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAuthors = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/users`
        );
        setAuthors(response.data);
        console.log(response.data);
      } catch (error) {
        console.log(error);
      }

      setLoading(false);
    };

    fetchAuthors();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return <Loading />;
  }

  return (
    <section className="authors">
      {authors.length > 0 ? (
        <div className="container authors__container">
          {authors.map(({ _id: id, avatar, name, posts }) => (
            <Link to={`/recipes/users/${id}`} key={id} className="author">
              <div className="author__avatar">
                <img
                  src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${avatar}`}
                  alt={`${name}`}
                />
              </div>
              <div className="author__info">
                <h4>{name}</h4>
                <p>{posts} post(s)</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <h2 className="center">No users found.</h2>
      )}
    </section>
  );
};

export default Authors;
