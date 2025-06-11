import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './SignUp.css';

function SignUp() {
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    gender: "",
    birthDate: "",
    image: null
  });

  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [isRegistered, setIsRegistered] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setErrors({});

  if (formData.password !== formData.confirmPassword) {
    setErrors({ confirmPassword: "Passwords do not match" });
    return;
  }

  await registerUser(formData);
 };


async function registerUser(data) {

  await fetch("http://localhost:12345/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data) 
  })
    .then(async (response) => {
      const result = await response.json();
      if (!response.ok) {
        const errorMsg = result.error || "Registration failed";
        const fieldName = extractFieldName(errorMsg);
        setErrors({ [fieldName]: errorMsg });
        return;
      }
      console.log("User registered:", result);
      setIsRegistered(true);
    })
    .catch((error) => {
      console.error("Error registering:", error);
      setErrors({ general: "Something went wrong. Please try again." });
    });
  }

  const extractFieldName = (msg) => {
    const fields = ["userName", "password", "firstName", "lastName", "gender", "birthDate"];
    const lower = msg.toLowerCase();
    const match = fields.find(f => lower.includes(f.toLowerCase()));
    return match || "general";
  };

 if (isRegistered) {
  return (
    <div className="container text-center mt-5">
      <h2 className="text-success">Welcome, {formData.firstName} 🎉</h2>
      <p>Your account has been successfully created.</p>
      <button
        className="btn btn-primary mt-3"
        onClick={() => navigate('/signin')}
      >
        Go to Sign In
      </button>
    </div>
  );}

  return (
    <div className="full-screen-wrapper d-flex justify-content-center align-items-center">
      <div className="signup-container p-4 border rounded shadow-sm bg-light">
        <h1 className="text-center mb-4 fw-bold text-primary">Sign Up</h1>
        {errors.general && (<div className="alert alert-danger text-center">{errors.general}</div>)}
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label className="form-label">User Name</label>
            <input type="text"
              className={`form-control input-hover-effect ${errors.userName ? "is-invalid" : ""}`}
              name="userName"
              required
              value={formData.userName}
              onChange={handleChange} />
            {errors.userName && <div className="invalid-feedback">{errors.userName}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input type="password"
              className={`form-control input-hover-effect ${errors.password ? "is-invalid" : ""}`}
              name="password"
              required
              value={formData.password}
              onChange={handleChange} />
            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              className={`form-control input-hover-effect ${errors.confirmPassword ? "is-invalid" : ""}`}
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && (
              <div className="invalid-feedback">{errors.confirmPassword}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">First Name</label>
            <input type="text"
              className={`form-control input-hover-effect ${errors.firstName ? "is-invalid" : ""}`}
              name="firstName"
              required
              value={formData.firstName}
              onChange={handleChange} />
            {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Last Name</label>
            <input type="text"
              className={`form-control input-hover-effect ${errors.lastName ? "is-invalid" : ""}`}
              name="lastName"
              required
              value={formData.lastName}
              onChange={handleChange} />
            {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Gender</label>
            <select
              className={`form-control input-hover-effect ${errors.gender ? "is-invalid" : ""}`}
              name="gender"
              required
              value={formData.gender}
              onChange={handleChange}>
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && <div className="invalid-feedback">{errors.gender}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Birth Date</label>
            <input type="date"
              className={`form-control input-hover-effect ${errors.birthDate ? "is-invalid" : ""}`}
              name="birthDate"
              required
              value={formData.birthDate}
              onChange={handleChange} />
            {errors.birthDate && <div className="invalid-feedback">{errors.birthDate}</div>}
          </div>

          <div className="mb-4 text-center">
            <input
              type="file"
              id="imageInput"
              accept="image/*"
              onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  const base64String = reader.result;
                  setFormData({ ...formData, image: base64String });
                  setPreviewImage(base64String);
                };
                reader.readAsDataURL(file);
              }
            }}
              hidden
            />
            <label htmlFor="imageInput" className="image-upload-label">
              <div className="profile-image-wrapper">
                {previewImage ? (<img src={previewImage} alt="Preview" className="profile-image" />) : (<div className="plus-icon">+</div>)}
              </div>
            </label>
            <p className="text-muted small">Click the circle to upload a profile picture</p>
          </div>
         <button type="submit" className="btn btn-primary w-100">Sign Up</button>
        </form>
      </div>
    </div>
  );
}
export default SignUp;
