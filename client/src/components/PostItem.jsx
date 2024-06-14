import React from "react";
import { Link } from "react-router-dom";
import PostAuthor from "./PostAuthor";

const PostItem = ({
  postID,
  category,
  title,
  desc,
  authorID,
  thumbnail,
  createdAt,
}) => {
  // eslint-disable-next-line
  const shortDesc = desc.length > 100 ? desc.substring(0, 100) + "..." : desc;
  // eslint-disable-next-line
  const shortTitle = title.length > 30 ? title.substring(0, 30) + "..." : title;
  return (
    <article className="post">
      <div className="post__thumbnail">
        <Link to={`/recipes/${postID}`}>
          <img
            src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${thumbnail}`}
            alt={title}
          />
        </Link>
      </div>
      <div className="post__content">
        <Link to={`/recipes/${postID}`}>
          <h3>{shortTitle}</h3>
        </Link>
        <p dangerouslySetInnerHTML={{ __html: shortDesc }} />
        <div className="post__footer">
          <PostAuthor authorID={authorID} createdAt={createdAt} />
          <Link to={`/recipes/categories/${category}`} className="btn category">
            {category}
          </Link>
        </div>
      </div>
    </article>
  );
};

export default PostItem;
