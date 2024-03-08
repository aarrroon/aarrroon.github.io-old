export default function Home() {
  return (
    <div className="App">
      <div className='background-img'></div>
      <div className="line left-line"></div>
      <div className="line right-line"></div>
      <div id="header-hero">
        <section className="hero">
          <div className="hero-content">
            <h1>Discover a Culinary Journey</h1>
            <p>Experience the essence of Japanese cuisine at Wakuda</p>
            <a href="#header-hero" className="cta-button">
              Book a Table
            </a>
          </div>
        </section>
      </div>
      <section className="about-section">
        <div className="about-content">
          <h2>About Us</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed et
            felis non velit ultrices consectetur sit amet ac urna. Vivamus vel
            quam tellus. Morbi bibendum ipsum a sem mattis vehicula. Vestibulum
            aliquet ex ut lorem feugiat, nec finibus risus mattis.
          </p>
        </div>
      </section>
      <section className="menu-section">
        <div className="menu-content">
          <h2>Our Menu</h2>
          <div className="menu-items">
            <div className="menu-item">
              <img src="path/to/menu-item-1.jpg" alt="Menu Item 1" />
              <h3>Menu Item 1</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </div>
            <div className="menu-item">
              <img src="path/to/menu-item-2.jpg" alt="Menu Item 2" />
              <h3>Menu Item 2</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </div>
            {/* Add more menu items */}
          </div>
        </div>
      </section>
      <section className="reservations-section">
        <div className="reservations-content">
          <h2>Make a Reservation</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed et
            felis non velit ultrices consectetur sit amet ac urna. Vivamus vel
            quam tellus. Morbi bibendum ipsum a sem mattis vehicula. Vestibulum
            aliquet ex ut lorem feugiat, nec finibus risus mattis.
          </p>
        </div>
      </section>
      <section className="contact-section">
        <div className="contact-content">
          <h2>Contact Us</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed et
            felis non velit ultrices consectetur sit amet ac urna. Vivamus vel
            quam tellus. Morbi bibendum ipsum a sem mattis vehicula. Vestibulum
            aliquet ex ut lorem feugiat, nec finibus risus mattis.
          </p>
        </div>
      </section>
      <footer className="footer">
        <p>&copy; 2024 Wakuda Restaurant</p>
      </footer>
    </div>
  );
}
