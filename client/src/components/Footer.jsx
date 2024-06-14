import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer>
      <ul className="footer__categories">
        <li>
          <Link to="/recipes/categories/Food">Food</Link>
        </li>
        <li>
          <Link to="/recipes/categories/Game">Game</Link>
        </li>
        <li>
          <Link to="/recipes/categories/Tech">Tech</Link>
        </li>
        <li>
          <Link to="/recipes/categories/Life">Life</Link>
        </li>
      </ul>
      <div className="footer__copyright">
        <small>Made with ❤️ by ぺろ </small>
      </div>
    </footer>
  );
};

export default Footer;
