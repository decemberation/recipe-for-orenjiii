import React, { useContext, useEffect, useState } from "react";
import PostAuthor from "../components/PostAuthor";
import { Link, useParams } from "react-router-dom";
import Loading from "../components/Loading";
import DeleteRecipe from "./DeleteRecipe";
import { UserContext } from "../context/userContext";
import axios from "axios";

const RecipeContent = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    const getPost = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/recipes/${id}`
        );
        setPost(response.data);
        console.log(response.data);
      } catch (error) {
        setError(error);
      }
      setLoading(false);
    };

    getPost();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return <Loading />;
  }

  return (
    <section className="post-detail">
      {error && <p className="error">{error}</p>}
      {post && (
        <div className="container post-detail__container">
          <div className="post-detail__header">
            <PostAuthor authorID={post.creator} createdAt={post.createdAt} />
            {currentUser?.id === post?.creator && (
              <div className="post-detail__buttons">
                <Link
                  to={`/recipes/${post?._id}/edit`}
                  className="btn sm primary"
                >
                  Edit
                </Link>
                <DeleteRecipe postId={id} />
              </div>
            )}
          </div>
          <h1>{post.title}</h1>
          <div className="post-detail__thumbnail">
            <img
              src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${post.thumbnail}`}
              alt=""
            />
          </div>
          <p dangerouslySetInnerHTML={{ __html: post.desc }}></p>
        </div>
      )}
    </section>
  );
};

export default RecipeContent;
