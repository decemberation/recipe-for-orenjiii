import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import axios from "axios";

import { UserContext } from "../context/userContext";

const LogIn = () => {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { setCurrentUser } = useContext(UserContext);

  const changeInputHandler = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const loginUser = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/users/login`,
        userData
      );

      const user = await response.data;
      setCurrentUser(user);
      navigate("/");
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  return (
    <div className="wrapper">
      <section className="login">
        <div className="container">
          <h2>Welcome homeee</h2>
          <form className="form login__form" onSubmit={loginUser}>
            {error && <p className="form__err-msg">{error}</p>}
            <div className="input__box">
              <input
                type="text"
                name="email"
                placeholder="Email"
                value={userData.email}
                onChange={changeInputHandler}
                autoFocus
              />
              <FaUser className="icon" />
            </div>
            <div className="input__box">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={userData.password}
                onChange={changeInputHandler}
              />
              <FaLock className="icon" />
            </div>
            <button type="submit">Login</button>
          </form>
          <small className="form__redirect">
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </small>
        </div>
      </section>
    </div>
  );
};

export default LogIn;
