import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import deleteIcon from "../assets/images/delete.png";

const BASE_URL = "http://localhost:8082";

const responsive = {
  superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 5 },
  desktop: { breakpoint: { max: 3000, min: 1024 }, items: 4 },
  tablet: { breakpoint: { max: 1024, min: 768 }, items: 2 },
  mobile: { breakpoint: { max: 768, min: 0 }, items: 1 },
};

const ChefManagement = () => {
  const [chefs, setChefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    speciality: "",
    description: "",
    image: null,
  });
  const [previewUrl, setPreviewUrl] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      toast.error("Unauthorized access. Please log in.");
      return;
    }
    fetchChefs();
  }, [token]);

  const fetchChefs = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/chef/get`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setChefs(response.data);
    } catch (error) {
      toast.error("Failed to load chef data.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleAddChef = async (e) => {
    e.preventDefault();
    const { name, speciality, description, image } = formData;

    if (!name || !speciality || !description) {
      toast.error("Please fill all required fields.");
      return;
    }

    try {
      let imageUrl = "";
      if (image) {
        const imageData = new FormData();
        imageData.append("file", image);

        const imageUploadRes = await axios.post(
          `${BASE_URL}/chef/upload-image`,
          imageData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        imageUrl = imageUploadRes.data;
      }

      const chefPayload = {
        name,
        speciality,
        description,
        imageUrl,
      };

      await axios.post(`${BASE_URL}/chef/add`, chefPayload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Chef added successfully!");
      setFormData({ name: "", speciality: "", description: "", image: null });
      setPreviewUrl(null);
      fetchChefs();
    } catch (err) {
      toast.error("Failed to add chef.");
    }
  };

  const handleDeleteChef = async (id) => {
    if (window.confirm("Are you sure you want to delete this chef?")) {
      try {
        await axios.delete(`${BASE_URL}/chef/delete/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Chef deleted successfully.");
        setChefs((prev) => prev.filter((chef) => chef.id !== id));
      } catch (err) {
        toast.error("Failed to delete chef.");
      }
    }
  };

  return (
    <div
      className="py-5"
      style={{
        minHeight: "100vh",
        backgroundColor: "#F3ECE1",
        fontFamily: "'Segoe UI', sans-serif",
        color: "#3E2C20",
        position: "relative",
        zIndex: 1,
      }}
    >
      <div className="container">
        <h2 className="mb-5 text-center fw-bold" style={{ color: "#3E2C20" }}>
          Chef Management
        </h2>

        {/* Add Chef Form */}
        <div
          className="card mb-5 mx-auto p-4 shadow"
          style={{
            borderRadius: "1.2rem",
            maxWidth: "900px",
            backgroundColor: "#D7C4A3",
            border: "1px solid #5A3E2B",
            color: "#3E2C20",
          }}
        >
          <h4 className="mb-4" style={{ color: "#C16E4A" }}>
            Add New Chef
          </h4>
          <form onSubmit={handleAddChef}>
            <div className="row">
              {["name", "speciality", "description"].map((field, idx) => (
                <div className="col-md-6 mb-3" key={idx}>
                  <input
                    type="text"
                    name={field}
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    className="form-control form-control-lg"
                    value={formData[field]}
                    onChange={handleInputChange}
                    required
                    style={{
                      borderRadius: "0.6rem",
                      border: "1px solid #5A3E2B",
                      backgroundColor: "#F3ECE1",
                      color: "#3E2C20",
                    }}
                  />
                </div>
              ))}

              <div className="col-md-6 mb-3">
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{
                    border: "1px solid #5A3E2B",
                    backgroundColor: "#F3ECE1",
                    color: "#3E2C20",
                    borderRadius: "0.6rem",
                  }}
                />
                {previewUrl && (
                  <div className="mt-2">
                    <small style={{ color: "#A78C7F" }}>Preview:</small>
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="mt-1"
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        border: "1px solid #ccc",
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="col-md-12">
                <button
                  type="submit"
                  className="btn w-100 py-2"
                  style={{
                    backgroundColor: "#8B6D5C",
                    color: "#F3ECE1",
                    fontWeight: "bold",
                    borderRadius: "0.6rem",
                    transition: "0.3s",
                  }}
                >
                  Add Chef
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Carousel Wrapper with Z-Index Fix */}
        <div className="carousel-container-fix">
          {loading ? (
            <div className="text-center mt-5" style={{ color: "#A78C7F" }}>
              Loading chefs...
            </div>
          ) : chefs.length === 0 ? (
            <div className="text-center mt-5" style={{ color: "#A78C7F" }}>
              No chefs available.
            </div>
          ) : (
            <Carousel
              responsive={responsive}
              infinite
              autoPlay
              autoPlaySpeed={3000}
              arrows
              containerClass="pb-5"
            >
              {chefs.map((chef) => (
                <div key={chef.id} className="px-3">
                  <div
                    className="chef-card"
                    style={{
                      width: "100%",
                      maxWidth: "320px",
                      backgroundColor: "#D7C4A3",
                      borderRadius: "1rem",
                      boxShadow:
                        "0 4px 15px rgba(90, 62, 43, 0.2), 0 1px 3px rgba(90, 62, 43, 0.1)",
                      display: "flex",
                      flexDirection: "column",
                      overflow: "hidden",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      color: "#3E2C20",
                      margin: "0 auto",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-6px)";
                      e.currentTarget.style.boxShadow =
                        "0 10px 30px rgba(90, 62, 43, 0.35), 0 4px 8px rgba(90, 62, 43, 0.25)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "none";
                      e.currentTarget.style.boxShadow =
                        "0 4px 15px rgba(90, 62, 43, 0.2), 0 1px 3px rgba(90, 62, 43, 0.1)";
                    }}
                  >
                    <img
                      src={
                        chef.imageUrl ||
                        "https://via.placeholder.com/320x180?text=No+Image"
                      }
                      alt={chef.name}
                      style={{
                        width: "100%",
                        height: "180px",
                        objectFit: "cover",
                        borderTopLeftRadius: "1rem",
                        borderTopRightRadius: "1rem",
                      }}
                    />
                    <div
                      className="p-3 d-flex flex-column justify-content-between"
                      style={{ flexGrow: 1 }}
                    >
                      <h5 className="fw-bold mb-1">{chef.name}</h5>
                      <p
                        className="mb-2"
                        style={{
                          fontSize: "0.85rem",
                          color: "#A78C7F",
                          fontStyle: "italic",
                        }}
                      >
                        {chef.speciality}
                      </p>
                      <p
                        className="text-truncate"
                        style={{
                          fontSize: "0.9rem",
                          color: "#5A3E2B",
                          wordWrap: "break-word",
                        }}
                      >
                        {chef.description}
                      </p>
                      <div className="d-flex justify-content-end mt-auto">
                        <img
                          src={deleteIcon}
                          alt="Delete"
                          style={{
                            cursor: "pointer",
                            width: "24px",
                            height: "24px",
                            filter:
                              "invert(23%) sepia(43%) saturate(2970%) hue-rotate(346deg) brightness(93%) contrast(88%)",
                          }}
                          onClick={() => handleDeleteChef(chef.id)}
                          title="Delete Chef"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Carousel>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChefManagement;
