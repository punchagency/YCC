import React, { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Message } from "primereact/message";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { login } from "../services/authService";
import { useUser } from "../context/userContext"; // Import UserContext

const LoginForm = () => {
  // Define the options for the user roles
  const navigate = useNavigate(); // Add useNavigate hook
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleCheckboxChange = (e) => {
    setFormData({
      ...formData,
      rememberMe: e.checked,
    });
  };

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const { loginUser } = useUser(); // Get loginUser function from context

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 10000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = (email) => {
    let isValid = true;
    setEmailError("");
    setPasswordError("");
    if (!formData.email || !formData.password) {
      setError("All fields are required.");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Role before submission:", formData.role);
    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await login(formData);
      console.log("Login response:", response);

      if (response.status === "success") {
        // Store the token from the nested data object
        if (response.data && response.data.token) {
          console.log("Saving token to localStorage:", response.data.token);
          localStorage.setItem("token", response.data.token);
        }

        // Store user data
        loginUser(response.data.user);

        if (response.data.user.role === "admin") {
          navigate("/admin/dashboard");
        } else if (response.data.user.role === "supplier") {
          navigate("/supplier/onboarding");
        } else if (response.data.user.role === "service_provider") {
          navigate("/vendor/onboarding");
        }
      } else {
        setError(response.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.log("Error during login:", error);
      setError(error.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-d-flex p-jc-center p-ai-center">
      <form onSubmit={handleSubmit}>
        {error && <Message severity="error" text={error} className="p-mb-3 " />}
        <div className="flex flex-column p-field p-mb-3">
          <label htmlFor="username">Email Address</label>
          <InputText
            id="email"
            name="email"
            value={formData.email}
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
            value={formData.password}
            onChange={handleChange}
            feedback={false}
            toggleMask
            placeholder="Password"
            required
            className="w-full" // Apply the full-width class
          />
          {passwordError && <small className="p-error">{passwordError}</small>}
        </div>
        <div className="p-field-checkbox p-d-flex p-ai-center p-jc-between">
          <div className="p-d-flex p-ai-center">
            <Checkbox
              inputId="rememberMe"
              checked={formData.rememberMe}
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
