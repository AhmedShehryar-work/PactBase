import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function RegistrationForm() {
  
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    //profileImage: null,
    //TODO: add file uploads
    cnicNo: "",
    //cnicFrontImage: null,
    //cnicBackImage: null,
    //Image1: null,
    //Image2: null,
    //Image3: null,
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
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    try {
      const res = await axios.post("http://localhost:4000/api/auth/signup", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Server response:", res.data);
      navigate("/login");
    } catch (error) {
      console.error("Error uploading:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <div>
        <label>Full Name:</label>
        <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
      </div>

      <div>
        <label>Username:</label>
        <input type="text" name="username" value={formData.username} onChange={handleChange} required />
      </div>

      <div>
        <label>Email:</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
      </div>

      <div>
        <label>Password:</label>
        <input type="password" name="password" value={formData.password} onChange={handleChange} required />
      </div>

      {/* <div>
        <label>Profile Image:</label>
        <input type="file" name="profileImage" accept="image/jpeg, image/png, image/webp" capture="user" onChange={handleChange} required />
      </div> */
      //TODO: add file uploads
      }

      <div>
        <label>CNIC Number:</label>
        <input type="text" name="cnicNo" value={formData.cnicNo} onChange={handleChange} required />
      </div>

      {/* <div>
        <label>CNIC Front Image:</label>
        <input type="file" name="cnicFrontImage" accept="image/jpeg, image/png, image/webp" capture="environment" onChange={handleChange} required />
      </div>

      <div>
        <label>CNIC Back Image:</label>
        <input type="file" name="cnicBackImage" accept="image/jpeg, image/png, image/webp" capture="environment" onChange={handleChange} required />
      </div>

      <div>
        <label>Test Image 1:</label>
        <input type="file" name="Image1" accept="image/jpeg, image/png, image/webp" onChange={handleChange} />
      </div>

      <div>
        <label>Test Image 2:</label>
        <input type="file" name="Image2" accept="image/jpeg, image/png, image/webp" onChange={handleChange} />
      </div>

      <div>
        <label>Test Image 3:</label>
        <input type="file" name="Image3" accept="image/jpeg, image/png, image/webp" onChange={handleChange} />
      </div> */}

      <button type="submit">Register</button>
    </form>
  );
}
