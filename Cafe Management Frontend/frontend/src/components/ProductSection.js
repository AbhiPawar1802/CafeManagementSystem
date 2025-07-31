import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import deleteIcon from "../assets/images/delete.png";
import editIcon from "../assets/images/edit.png";

const BASE_URL = "http://localhost:8082";

const responsive = {
  superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 5 },
  desktop: { breakpoint: { max: 3000, min: 1024 }, items: 4 },
  tablet: { breakpoint: { max: 1024, min: 768 }, items: 2 },
  mobile: { breakpoint: { max: 768, min: 0 }, items: 1 },
};

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: null,
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      toast.error("Unauthorized access. Please log in.");
      return;
    }
    fetchProducts();
    fetchCategories();
  }, [token]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/product/get`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data);
    } catch (err) {
      toast.error("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/category/get`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(res.data);
    } catch (err) {
      toast.error("Failed to load categories.");
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

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const { name, description, price, image } = formData;

    if (!name || !description || !price || !selectedCategoryId) {
      toast.error("Please fill all required fields including category.");
      return;
    }

    try {
      let imageUrl = "";
      if (image) {
        const imageData = new FormData();
        imageData.append("file", image);

        const uploadRes = await axios.post(
          `${BASE_URL}/product/upload-image`,
          imageData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        imageUrl = uploadRes.data;
      }

      const payload = {
        name,
        description,
        price,
        imageUrl,
        categoryId: selectedCategoryId,
      };

      await axios.post(`${BASE_URL}/product/add`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Product added successfully!");
      setFormData({ name: "", description: "", price: "", image: null });
      setPreviewUrl(null);
      setSelectedCategoryId("");
      fetchProducts();
    } catch (err) {
      toast.error("Failed to add product.");
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`${BASE_URL}/product/delete/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Product deleted successfully.");
        setProducts((prev) => prev.filter((prod) => prod.id !== id));
      } catch (err) {
        toast.error("Failed to delete product.");
      }
    }
  };

  const handleEditProduct = (product) => {
    toast.info(`Edit clicked for product: ${product.name}`);
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
      {/* Carousel Arrow Z-Index Fix */}
      <style>
        {`
          .product-carousel .react-multi-carousel-arrow {
            z-index: 1 !important;
          }
        `}
      </style>

      <div className="container">
        <h2 className="mb-5 text-center fw-bold" style={{ color: "#3E2C20" }}>
          Product Management
        </h2>

        {/* Add Product Form */}
        <div
          className="card mb-5 mx-auto p-4 shadow"
          style={{
            borderRadius: "1.2rem",
            maxWidth: "900px",
            backgroundColor: "#D7C4A3",
            border: "1px solid #5A3E2B",
            color: "#3E2C20",
            backdropFilter: "blur(6px)",
          }}
        >
          <h4 className="mb-4" style={{ color: "#C16E4A" }}>
            Add New Product
          </h4>
          <form onSubmit={handleAddProduct}>
            <div className="row">
              {["name", "description", "price"].map((field, idx) => (
                <div className="col-md-6 mb-3" key={idx}>
                  <input
                    type={field === "price" ? "number" : "text"}
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
                <select
                  className="form-select form-select-lg"
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                  required
                  style={{
                    border: "1px solid #5A3E2B",
                    backgroundColor: "#F3ECE1",
                    color: "#3E2C20",
                    borderRadius: "0.6rem",
                  }}
                >
                  <option value="">-- Select Category --</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

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
                  Add Product
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Product Carousel */}
        {loading ? (
          <div className="text-center mt-5" style={{ color: "#A78C7F" }}>
            Loading products...
          </div>
        ) : products.length === 0 ? (
          <div className="text-center mt-5" style={{ color: "#A78C7F" }}>
            No products available.
          </div>
        ) : (
          <Carousel
            responsive={responsive}
            infinite
            autoPlay
            autoPlaySpeed={3000}
            arrows
            containerClass="pb-5"
            className="product-carousel"
          >
            {products.map((product) => (
              <div key={product.id} className="px-3">
                <div
                  className="product-card"
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
                    src={product.imageUrls?.[0] || product.imageUrl}
                    alt={product.name}
                    style={{
                      width: "100%",
                      height: "180px",
                      objectFit: "cover",
                      borderTopLeftRadius: "1rem",
                      borderTopRightRadius: "1rem",
                    }}
                  />
                  <div className="p-3 d-flex flex-column justify-content-between" style={{ flexGrow: 1 }}>
                    <h5 className="fw-bold mb-1" style={{ fontSize: "1.1rem", color: "#3E2C20" }}>
                      {product.name}
                    </h5>
                    <p
                      className="mb-2"
                      style={{
                        fontSize: "0.85rem",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        color: "#A78C7F",
                      }}
                    >
                      {product.description}
                    </p>
                    <div className="d-flex justify-content-between align-items-center mt-auto">
                      <span className="fw-semibold" style={{ fontSize: "1.1rem", color: "#8B6D5C" }}>
                        ₹{product.price}
                      </span>
                      <div className="d-flex gap-2">
                        <img
                          src={editIcon}
                          alt="Edit"
                          style={{ cursor: "pointer", width: "24px", height: "24px" }}
                          onClick={() => handleEditProduct(product)}
                          title="Edit Product"
                        />
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
                          onClick={() => handleDeleteProduct(product.id)}
                          title="Delete Product"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Carousel>
        )}
      </div>
    </div>
  );
};

export default ProductManagement;
