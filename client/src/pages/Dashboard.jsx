import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";
import axios from "axios";
import Loading from "../components/Loading";
import DeleteRecipe from "../pages/DeleteRecipe";

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;

  // Redirect to login page if user is not logged in
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/recipes/users/${currentUser.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        if (response.status === 200) {
          setPosts(response.data);
          setLoading(false);
        }
      } catch (err) {
        console.error("Couldn't fetch posts. Details: ", +err);
      }
    };
    fetchPosts();
  }, [currentUser?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return <Loading />;
  }

  return (
    <section className="dashboard">
      {posts.length ? (
        <div className="container dashboard__container">
          {posts.map((post) => {
            return (
              <article key={post.id} className="dashboard__post">
                <div className="dashboard__post-info">
                  <div className="dashboard__post-thumbnail">
                    <img
                      src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${post.thumbnail}`}
                      alt=""
                    />
                  </div>
                  <h5>{post.title}</h5>
                </div>
                <div className="dashboard__post-actions">
                  <Link to={`/recipes/${post._id}`} className="btn sm">
                    View
                  </Link>
                  <Link
                    to={`/recipes/${post._id}/edit`}
                    className="btn sm primary"
                  >
                    Edit
                  </Link>
                  <DeleteRecipe postId={post._id} />
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <h2 className="center">No posts to show.</h2>
      )}
    </section>
  );
};

export default Dashboard;
