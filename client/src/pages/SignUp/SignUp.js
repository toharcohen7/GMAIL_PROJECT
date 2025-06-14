import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormField from '../FormField/FormField';
import ProfileImageUpload from '../ProfileImageUpload/ProfileImageUpload';
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
    image: null,
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [isRegistered, setIsRegistered] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      setFormData(prev => ({ ...prev, image: base64String }));
      setPreviewImage(base64String);
    };
    reader.readAsDataURL(file);
  };

  const extractFieldName = (msg) => {
    const fields = ["userName", "password", "firstName", "lastName", "gender", "birthDate"];
    const lower = msg.toLowerCase();
    const match = fields.find(f => lower.includes(f.toLowerCase()));
    return match || "general";
  };

  const registerUser = async (data) => {
    try {
      const response = await fetch("http://localhost:12345/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        const fieldName = extractFieldName(result.error || "");
        setErrors({ [fieldName]: result.error || "Registration failed" });
        return;
      }

      console.log("User registered:", result);
      setIsRegistered(true);

    } catch (error) {
      console.error("Error registering:", error);
      setErrors({ general: "Something went wrong. Please try again." });
    }
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

  if (isRegistered) {
    return (
      <div className="container text-center mt-5">
        <h2 className="text-success">Welcome, {formData.firstName} 🎉</h2>
        <p>Your account has been successfully created.</p>
        <button className="btn btn-primary mt-3" onClick={() => navigate('/signin')}>
          Go to Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="full-screen-wrapper d-flex justify-content-center align-items-center">
      <div className="signup-container p-4 border rounded shadow-sm bg-light">
        <h1 className="text-center mb-4 fw-bold text-primary">Sign Up</h1>
        {errors.general && <div className="alert alert-danger text-center">{errors.general}</div>}
        <form onSubmit={handleSubmit} noValidate>
          <FormField label="User Name" name="userName" value={formData.userName} onChange={handleChange} error={errors.userName} required />
          <FormField label="Password" type="password" name="password" value={formData.password} onChange={handleChange} error={errors.password} required />
          <FormField label="Confirm Password" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} error={errors.confirmPassword} required />
          <FormField label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} error={errors.firstName} required />
          <FormField label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} error={errors.lastName} required />
          <FormField label="Gender" name="gender" type="select" value={formData.gender} onChange={handleChange} error={errors.gender} options={["Male", "Female", "Other"]} required />
          <FormField label="Birth Date" type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} error={errors.birthDate} required />
          
          <ProfileImageUpload previewImage={previewImage} onImageSelect={handleImageUpload} />

          <button type="submit" className="btn btn-primary w-100">Sign Up</button>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
