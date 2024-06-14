import React, { useEffect, useState } from "react";
import PostItem from "./PostItem";
import Loading from "./Loading";
import axios from "axios";

const Posts = () => {
  // eslint-disable-next-line
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/recipes`
        );
        setPosts(response.data);
      } catch (err) {
        console.log(err);
      }

      setLoading(false);
    };

    fetchPosts();
  }, []);

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
          Ẹc, bài này chưa cóa nội dung. Eiu quay lại sau nhennn, iu emmmm ❤️
        </h2>
      )}
    </section>
  );
};

export default Posts;
