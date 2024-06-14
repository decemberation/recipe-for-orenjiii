import { Link, useNavigate, useLocation } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/userContext";
import axios from "axios";
import Loading from "../components/Loading";

const DeleteRecipe = ({ postId: id }) => {
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;

  // Redirect to login page if user is not logged in
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  const removePost = async (id) => {
    setLoading(true);
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_BASE_URL}/recipes/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        if (location.pathname === `/myposts/${currentUser.id}`) {
          navigate(0);
        } else {
          navigate("/");
        }
      }
      setLoading(false);
    } catch (err) {
      console.error("Couldn't delete post. Details: ", +err);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Link className="btn sm danger" onClick={() => removePost(id)}>
      Delete
    </Link>
  );
};

export default DeleteRecipe;
