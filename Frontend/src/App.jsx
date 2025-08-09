import React, { useState } from "react";

export default function UploadForm() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    profilePic: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("username", formData.username);
    data.append("email", formData.email);
    data.append("profilePic", formData.profilePic);

    try {
      const res = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: data,
      });

      const result = await res.json();
      console.log("Server response:", result);
      alert("Form submitted successfully!");
    } catch (error) {
      console.error("Error uploading:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <div>
        <label>Username:</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Profile Picture:</label>
        <input
          type="file"
          name="profilePic"
          accept="image/*"
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit">Submit</button>
    </form>
  );
}