import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import MenuItem from "./MenuItem";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "./MenuSection.css";
import { CartContext } from "./CartContext";

const BASE_URL = "http://localhost:8082";

const responsive = {
  superLargeDesktop: { breakpoint: { max: 4000, min: 1200 }, items: 3 },
  desktop: { breakpoint: { max: 1200, min: 992 }, items: 2 },
  tablet: { breakpoint: { max: 992, min: 768 }, items: 2 },
  mobile: { breakpoint: { max: 768, min: 0 }, items: 1 },
};

const MenuSection = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [menuLoading, setMenuLoading] = useState(true);

  const { cartItems, addToCart, removeFromCart } = useContext(CartContext);
  const navigate = useNavigate();
  const handleAdd = (item) => {
    addToCart(item);
    toast.info(`🛒 ${item.name} added to cart. View Cart.`, {
      toastId: `${item.id}-${Date.now()}`,
      position: "bottom-center",
      autoClose: 3000,
      closeOnClick: true,
      onClick: () => navigate("/customer/cart"), 
      style: {
        cursor: "pointer",
        textAlign: "center",
      },
    });
  };

  const handleIncrease = (item) => {
    addToCart(item);
  };

  const handleDecrease = (item) => {
    removeFromCart(item.id);
  };

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Unauthorized access. Please log in.");
          setMenuLoading(false);
          return;
        }
        const response = await axios.get(`${BASE_URL}/product/get`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setMenuItems(response.data);
        setMenuLoading(false);
      } catch (error) {
        console.error("Error fetching menu: ", error);
        toast.error("Failed to load items.");
        setMenuLoading(false);
      }
    };
    fetchMenuItems();
  }, []);

  return (
    <section className="menu-section section" id="menu">
      <div className="container-fluid px-4">
        <div className="text-center mb-4">
          <h6 className="text-accent">Our Menu</h6>
          <h2 className="section-title">Delicious Items</h2>
          <p className="menu-description mt-3 px-3">
            At <strong>Coffee Point</strong>, our journey has been flavored with love, tradition, and innovation.
            As our family has grown, so has our menu — evolving into a perfect blend of timeless classics and modern favorites.
            From rich aromatic brews to youthful bites, we serve dishes that bring generations together.
            Discover what's brewing on our menu!
          </p>
        </div>

        {menuLoading ? (
          <p className="text-center">Loading Menu...</p>
        ) : menuItems.length === 0 ? (
          <p className="text-center">No items available</p>
        ) : (
          <Carousel responsive={responsive} infinite arrows={true} autoPlay={false}>
            {menuItems.map((item) => (
              <div className="menu-card-wrapper" key={item.id}>
                <MenuItem
                  item={item}
                  quantity={cartItems[item.id]?.quantity || 0}
                  onAdd={() => handleAdd(item)}
                  onIncrease={() => handleIncrease(item)}
                  onDecrease={() => handleDecrease(item)}
                />
              </div>
            ))}
          </Carousel>
        )}
      </div>
    </section>
  );
};

export default MenuSection;
