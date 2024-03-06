import React from 'react';
import { Link } from 'react-router-dom';
import './Homepage.css'; // Styling file for Homepage

const Homepage = () => {
  return (
    <div className="homepage-container">
      <header className="homepage-header">
        <div className="header-content">
          <h1>Welcome to Your App</h1>
          <p>Discover and explore amazing restaurants and activities</p>
          <Link to="/explore" className="explore-btn">Explore Now</Link>
        </div>
      </header>
      <section className="featured-section">
        <h2>Featured Places</h2>
        <div className="featured-cards">
          <div className="featured-card">
            <img src="restaurant1.jpg" alt="Restaurant 1" />
            <div className="card-details">
              <h3>Restaurant 1</h3>
              <p>Description of Restaurant 1</p>
              <Link to="/restaurant/1" className="view-details">View Details</Link>
            </div>
          </div>
          <div className="featured-card">
            <img src="activity1.jpg" alt="Activity 1" />
            <div className="card-details">
              <h3>Activity 1</h3>
              <p>Description of Activity 1</p>
              <Link to="/activity/1" className="view-details">View Details</Link>
            </div>
          </div>
          {/* Add more featured cards as needed */}
        </div>
      </section>
      <section className="explore-section">
        <div className="explore-content">
          <h2>Explore More</h2>
          <p>Find more restaurants and activities near you</p>
          <Link to="/explore" className="explore-btn">Explore Now</Link>
        </div>
      </section>
      <footer className="homepage-footer">
        <p>&copy; 2024 Your App. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Homepage;