import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Link, useNavigate, useLocation } from "react-router-dom";

const LoginForm = () => {
  // Define the options for the user roles

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleCheckboxChange = (e) => {
    setCredentials({
      ...credentials,
      rememberMe: e.checked,
    });
  };

  const [emailError, setEmailError] = useState("");
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "email") {
      validateEmail(value);
    }

    setCredentials({
      ...credentials,
      [name]: value,
    });
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Invalid email address");
    } else {
      setEmailError("");
    }
  };

  const navigate = useNavigate(); // Add useNavigate hook
  const location = useLocation();
  const role = location.state?.role || "Guest"; // Default to 'Guest' if no role is passed
  console.log("role", role);
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate if email and password are provided and the email is valid
    if (!credentials.email || !credentials.password) {
      alert("Please fill in both email and password.");
      return;
    }

    if (emailError) {
      alert("Please correct the errors before submitting.");
      return;
    }

    console.log("Login Credentials:", credentials);
    // Add your login logic here

    // Assuming login is successful, navigate to Dashboard
    navigate("/dashboard");

    // Navigate to different dashboards based on the role
    if (role === "Captain/Manager") {
      navigate("/dashboard");
    } else if (role === "Crew Member") {
      navigate("/crew/dashboard");
    } else {
      alert("Unknown role. Please try again.");
    }
  };

  return (
    <div className="p-d-flex p-jc-center p-ai-center">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-column p-field p-mb-3">
          <label htmlFor="username">Email Address</label>
          <InputText
            id="email"
            name="email"
            value={credentials.email}
            onChange={handleChange}
            placeholder="Email address"
            className="p-d-block"
            required
          />
          {emailError && <small className="p-error">{emailError}</small>}
        </div>
        <div className="flex flex-column p-field p-mb-3">
          <label htmlFor="password">Password</label>
          <Password
            id="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            feedback={false}
            toggleMask
            placeholder="Password"
            required
            className="w-full" // Apply the full-width class
          />
        </div>
        <div className="p-field-checkbox p-d-flex p-ai-center p-jc-between">
          <div className="p-d-flex p-ai-center">
            <Checkbox
              inputId="rememberMe"
              checked={credentials.rememberMe}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="rememberMe" className="p-ml-2">
              Remember Me
            </label>
          </div>
          <Link to="/forgot-password">Forgot Your Password?</Link>
        </div>
        <Button
          type="submit"
          label="Sign In"
          className="p-mt-2 p-button-primary w-full"
        />
      </form>
    </div>
  );
};

export default LoginForm;
