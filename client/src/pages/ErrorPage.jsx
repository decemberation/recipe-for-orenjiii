import React from "react";
import "../styles/ErrorPage.css";
import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div id="notfound">
      <div class="notfound">
        <div class="notfound-404">
          <h1>Nawwwwr!</h1>
        </div>
        <h2>Khum cóa gì ở đây hớt</h2>
        <p></p>
        <Link to="/" className="btn primary">
          Quay lại thui
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
