import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import Logo from "../images/sakura.png";
import { FaBars } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { UserContext } from "../context/userContext";

const Header = () => {
  const [isNavOpen, setIsNavOpen] = useState(
    window.innerWidth > 800 ? true : false
  );
  const { currentUser } = useContext(UserContext);

  const closeNavHandler = () => {
    if (window.innerWidth < 800) {
      setIsNavOpen(false);
    } else {
      setIsNavOpen(true);
    }
  };

  return (
    <nav>
      <div className="container nav__container">
        <Link to="/" className="nav__logo" onClick={closeNavHandler}>
          <img src={Logo} alt="logo" />
        </Link>
        {currentUser?.id && isNavOpen && (
          <ul className="nav__menu">
            <li>
              <Link to={`/profile/${currentUser.id}`} onClick={closeNavHandler}>
                {currentUser?.name}
              </Link>
            </li>
            <li>
              <Link to="/create" onClick={closeNavHandler}>
                Create a Post
              </Link>
            </li>
            <li>
              <Link to="/authors" onClick={closeNavHandler}>
                Authors
              </Link>
            </li>
            <li>
              <Link to="/logout" onClick={closeNavHandler}>
                Log Out
              </Link>
            </li>
          </ul>
        )}
        {!currentUser?.id && isNavOpen && (
          <ul className="nav__menu">
            <li>
              <Link to="/authors" onClick={closeNavHandler}>
                Authors
              </Link>
            </li>
            <li>
              <Link to="/login" onClick={closeNavHandler}>
                Log In
              </Link>
            </li>
          </ul>
        )}
        <button
          className="nav__toggle-btn"
          onClick={() => setIsNavOpen(!isNavOpen)}
        >
          {isNavOpen ? <AiOutlineClose /> : <FaBars />}
        </button>
      </div>
    </nav>
  );
};

export default Header;
