import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";

const LogOut = () => {
  const { setCurrentUser } = useContext(UserContext);
  const navigate = useNavigate();
  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCurrentUser(null);
    navigate("/login");
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <></>;
};

export default LogOut;
