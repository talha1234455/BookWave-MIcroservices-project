import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-4 shadow-sm">
      <Link className="navbar-brand fw-bold text-primary" to="/">
        📘 BookWave
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto">
          <li className="nav-item mx-1">
            <Link className="btn btn-outline-primary" to="/">Home</Link>
          </li>
          <li className="nav-item mx-1">
            <Link className="btn btn-outline-primary" to="/users">Users</Link>
          </li>
          <li className="nav-item mx-1">
            <Link className="btn btn-outline-primary" to="/products">Products</Link>
          </li>
          <li className="nav-item mx-1">
            <Link className="btn btn-outline-primary" to="/orders">Orders</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
