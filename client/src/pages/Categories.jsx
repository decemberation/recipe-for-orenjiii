import React, { useState, useEffect } from "react";
import PostItem from "../components/PostItem";
import Loading from "../components/Loading";
import { useParams } from "react-router-dom";
import axios from "axios";

const Categories = () => {
  // eslint-disable-next-line
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const { category } = useParams();

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/recipes/categories/${category}`
        );
        setPosts(response.data);
      } catch (err) {
        console.log(err);
      }

      setLoading(false);
    };

    fetchPosts();
  }, [category]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return <Loading />;
  }

  return (
    <section className="posts">
      {posts.length > 0 ? (
        <div className="container posts__container">
          {posts.map(
            ({
              _id: id,
              thumbnail,
              category,
              title,
              desc,
              creator,
              createdAt,
            }) => (
              <PostItem
                key={id}
                postID={id}
                thumbnail={thumbnail}
                category={category}
                title={title}
                desc={desc}
                authorID={creator}
                createdAt={createdAt}
              />
            )
          )}
        </div>
      ) : (
        <h2 className="center">
          Ẹc, chưa cóa bài đăng nèo. Eiu quay lại sau nhennn, iu emmmm ❤️
        </h2>
      )}
    </section>
  );
};

export default Categories;
