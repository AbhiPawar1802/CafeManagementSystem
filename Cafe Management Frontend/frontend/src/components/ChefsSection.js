import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "./ChefSection.css";

const BASE_URL = "http://localhost:8082";

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 1200 },
    items: 3,
  },
  desktop: {
    breakpoint: { max: 1200, min: 992 },
    items: 2,
  },
  tablet: {
    breakpoint: { max: 992, min: 768 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 768, min: 0 },
    items: 1,
  },
};

const ChefSection = () => {
  const [chefs, setChefs] = useState([]);
  const [chefLoading, setChefLoading] = useState(true);

  useEffect(() => {
    const fetchChefs = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Unauthorized access. Please log in.");
          setChefLoading(false);
          return;
        }
        const response = await axios.get(`${BASE_URL}/chef/get`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setChefs(response.data);
        setChefLoading(false);
      } catch (error) {
        console.error("Error fetching chefs: ", error);
        toast.error("Failed to load chefs.");
        setChefLoading(false);
      }
    };
    fetchChefs();
  }, []);

  return (
    <section className="chef-section section-bg" id="chefs">
      <div className="container-fluid px-4">
        <div className="text-center mb-5">
          <h6 className="text-accent">Our Talented Chefs</h6>
          <h2 className="section-title">Meet The Team</h2>
          <p className="chef-description mt-3 px-3">
            At <strong>Coffee Point</strong>, we have a team of talented chefs who
            create magic in the kitchen with love and passion. Get to know the culinary
            experts behind the flavors you love.
          </p>
        </div>

        {chefLoading ? (
          <p className="text-center loading-text">Loading Chefs...</p>
        ) : chefs.length === 0 ? (
          <p className="text-center no-chefs-text">No chefs available</p>
        ) : (
          <Carousel
            responsive={responsive}
            infinite
            autoPlay
            autoPlaySpeed={3000}
            arrows
            showDots={true}
            dotListClass="custom-dot-list-style"
            itemClass="carousel-item-padding-40-px"
            containerClass="carousel-container"
            removeArrowOnDeviceType={["tablet", "mobile"]}
          >
            {chefs.map((chef) => (
              <div className="chef-card-wrapper" key={chef.id}>
                <div className="chef-card">
                  <img
                    src={chef.imageUrl || "/assets/images/default.png"}
                    alt={chef.name}
                    className="chef-img"
                  />
                  <div className="chef-content">
                    <h4>{chef.name}</h4>
                    <p>{chef.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </Carousel>
        )}
      </div>
    </section>
  );
};

export default ChefSection;
