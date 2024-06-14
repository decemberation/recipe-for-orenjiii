import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const SignUp = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const changeInputHandler = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const signUpUser = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/users/signup`,
        userData
      );
      console.log(response.data);
      console.log("Error: " + error);
      navigate("/login");
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  return (
    <div className="signup__container">
      <section className="register">
        <div className="container">
          <h2>Let's get started!</h2>
          <form className="form registration__form" onSubmit={signUpUser}>
            {error && <p className="form__err-msg">{error}</p>}
            <input
              type="text"
              name="name"
              placeholder="Username"
              value={userData.name}
              onChange={changeInputHandler}
              autoFocus
            />
            <input
              type="text"
              name="email"
              placeholder="Email"
              value={userData.email}
              onChange={changeInputHandler}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={userData.password}
              onChange={changeInputHandler}
            />
            <input
              type="password"
              name="password2"
              placeholder="Confirm password"
              value={userData.password2}
              onChange={changeInputHandler}
            />
            <button type="submit" className="btn primary">
              Sign Up
            </button>
          </form>
          <small className="form__redirect">
            Already have an account? <Link to="/login">Log In</Link>
          </small>
        </div>
      </section>
    </div>
  );
};

export default SignUp;
