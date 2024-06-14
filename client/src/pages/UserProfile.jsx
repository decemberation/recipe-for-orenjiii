import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdUploadFile } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import { UserContext } from "../context/userContext";
import axios from "axios";

const UserProfile = () => {
  // eslint-disable-next-line
  const [avatar, setAvatar] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");
  const [isAvatarTouched, setIsAvatarTouched] = useState(false);

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
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/users/${currentUser?.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        setName(response?.data.name);
        setEmail(response?.data.email);
        setAvatar(response?.data.avatar);
      } catch (error) {
        console.log("Error fetching user details: ", error);
      }
    };

    fetchUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const changeAvatarHandler = async () => {
    setIsAvatarTouched(false);
    try {
      const formData = new FormData();
      formData.set("avatar", avatar);
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/users/change-pfp`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      setAvatar(response?.data.avatar);
    } catch (error) {
      setError("Error updating avatar");
    }
  };

  const updateUserDetails = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.set("name", name);
      formData.set("email", email);
      formData.set("currentPassword", currentPassword);
      formData.set("newPassword", newPassword);
      formData.set("confirmNewPassword", confirmNewPassword);

      const response = await axios.patch(
        `${process.env.REACT_APP_BASE_URL}/users/edit-user`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        // Logout user after updating details
        navigate("/logout");
      }
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  return (
    <section className="profile">
      <div className="container profile__container">
        <Link to={`/myposts/${currentUser?.id}`} className="btn primary">
          My Posts
        </Link>
        <div className="profile__details">
          <div className="avatar__wrapper">
            <div className="profile__avatar">
              <img
                src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${avatar}`}
                alt=""
              />
            </div>
            {/* Form to update avatar */}
            <form className="avatar__form">
              <input
                type="file"
                id="avatar"
                name="avatar"
                onChange={(e) => setAvatar(e.target.files[0])}
                accept="png, jpg, jpeg"
              />
              <label htmlFor="avatar" onClick={() => setIsAvatarTouched(true)}>
                <MdUploadFile />
              </label>
            </form>
            {isAvatarTouched && (
              <button
                className="profile__avatar-btn"
                onClick={changeAvatarHandler}
              >
                <FaCheck />
              </button>
            )}
          </div>
          <h1>{currentUser?.name}</h1>

          {/* Form to update user details */}
          <form className="form profile__form" onSubmit={updateUserDetails}>
            {error && <p className="form__err-msg">{error}</p>}
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
            />
            <button type="submit" className="btn primary">
              Update
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default UserProfile;
