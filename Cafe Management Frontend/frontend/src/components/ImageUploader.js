import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = "http://localhost:8082";

const ImageUploader = () => {
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false); 

  const token = localStorage.getItem("token");

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true); 
      const res = await axios.post(`${BASE_URL}/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

     
      const uploadedUrl = res.data.url || res.data;
      setImageUrl(uploadedUrl);
      toast.success("Image uploaded successfully.");
    } catch (err) {
      console.error("Image upload failed:", err);
      toast.error("Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container my-5">
      <h2 className="mb-4 text-center text-warning">Upload Image</h2>

      <div className="card mb-5 p-4">
        <h5 className="mb-3">Upload Image</h5>
        <form>
          <div className="row">
            <div className="col-md-6 mb-3">
              <input
                type="file"
                accept="image/*"
                className="form-control"
                onChange={handleImageChange}
              />
            </div>

            {imageUrl && (
              <div className="col-md-6 mb-3">
                <img
                  src={imageUrl}
                  alt="Preview"
                  style={{
                    maxWidth: "200px",
                    maxHeight: "200px",
                    objectFit: "contain",
                  }}
                />
              </div>
            )}

            {imageFile && !uploading && (
              <div className="col-md-12">
                <p>Ready to upload: {imageFile.name}</p>
              </div>
            )}

            {uploading && (
              <div className="col-md-12">
                <p>Uploading...</p>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ImageUploader;
