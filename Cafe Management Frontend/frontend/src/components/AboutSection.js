import React from "react";
import about1 from "../assets/images/about1.jpg";
import about2 from "../assets/images/about2.jpg";
import about3 from "../assets/images/about3.jpg";
import about4 from "../assets/images/about4.jpg";
import about5 from "../assets/images/about5.jpg";
import about6 from "../assets/images/about6.jpg";
import about7 from "../assets/images/about7.jpg";
import './AboutSection.css';

const AboutSection = () => {
  return (
    <section className="section about-section" id="about">
      <div className="container">
        <div className="row align-items-center">
          
          {/* Left Text Content */}
          <div className="col-lg-6 about-left">
            <div className="left-text-content">
              <div className="section-heading">
                <h6 className="text-accent">Our Story</h6>
                <h2 className="about-heading">We Leave A Delicious Memory For You</h2>
              </div>
              <p className="about-description">
                Klassy Cafe is a place where food meets passion. Our dishes are
                crafted with fresh ingredients and traditional flavors to give you a unique experience.
              </p>
            </div>
          </div>

          {/* Right Carousel */}
          <div className="col-lg-6 mt-4 mt-lg-0">
            <div
              id="aboutCarousel"
              className="carousel slide about-carousel"
              data-bs-ride="carousel"
              data-bs-interval="3000"
              data-bs-pause="hover"
            >
              <div className="carousel-inner">
                {[about1, about2, about3, about4, about5, about6, about7].map((img, idx) => (
                  <div className={`carousel-item ${idx === 0 ? "active" : ""}`} key={idx}>
                    <img
                      src={img}
                      className="d-block w-100"
                      alt={`About ${idx + 1}`}
                      style={{ objectFit: "cover", height: "400px" }}
                    />
                  </div>
                ))}
              </div>

              {/* Carousel Controls */}
              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#aboutCarousel"
                data-bs-slide="prev"
              >
                <span className="carousel-control-prev-icon custom-control-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#aboutCarousel"
                data-bs-slide="next"
              >
                <span className="carousel-control-next-icon custom-control-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
