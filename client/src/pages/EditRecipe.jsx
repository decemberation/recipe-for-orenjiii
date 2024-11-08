import React, { useState, useEffect, useContext } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../context/userContext";
import axios from "axios";

const EditRecipe = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Uncategorized");
  const [desc, setDesc] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { id } = useParams();
  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;

  // Redirect to login page if user is not logged in
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underine",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
  ];

  const POST_CATEGORIES = ["Food", "Game", "Tech", "Life", "Uncategorized"];

  useEffect(() => {
    const getPost = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/recipes/${id}`
        );
        setTitle(response.data.title);
        setCategory(response.data.category);
        setDesc(response.data.desc);
      } catch (err) {
        setError(err.response.data.message);
      }
    };

    getPost();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const editRecipe = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.set("title", title);
    formData.set("category", category);
    formData.set("desc", desc);
    formData.set("thumbnail", thumbnail);

    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_BASE_URL}/recipes/${id}`,
        formData,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        return navigate(`/recipes/${id}`);
      }
    } catch (err) {
      setError(err.response.data.message);
    }
  }; // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section className="create-post">
      <div className="container">
        <h2>Edit your post</h2>
        {error && <p className="form__err-msg">{error}</p>}
        <form className="form create-post__form" onSubmit={editRecipe}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
          <select
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {POST_CATEGORIES.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
          <ReactQuill
            modules={modules}
            formats={formats}
            value={desc}
            onChange={setDesc}
          />
          <input
            type="file"
            onChange={(e) => setThumbnail(e.target.files[0])}
            accept="png, jpg, jpeg"
          />
          <button type="submit" className="btn primary">
            Update
          </button>
        </form>
      </div>
    </section>
  );
};

export default EditRecipe;
