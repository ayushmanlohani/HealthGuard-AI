import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <div className="navbar">
            <div className="container navbar-inner">
                <Link to="/" className="nav-logo">
                    <span className="nav-logo-badge">V</span>
                    HealthGuard AI
                </Link>

                <div className="nav-links">
                    <Link to="/" className="nav-link">Home</Link>
                    <a href="#about" className="nav-link">About</a>
                    <a href="#contact" className="nav-link">Contact</a>
                </div>
            </div>
        </div>
    );
};

export default Navbar;