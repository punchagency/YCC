import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { Message } from 'primereact/message';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { signup } from "../services/authService";
import { useUser } from "../context/userContext"; // Import UserContext

const SignupForm = () => {

    const navigate = useNavigate();  // Add useNavigate hook
    const location = useLocation();
    const role = location.state?.role || ""; // Default to 'Guest' if no role is passed 
    console.log('Received role:', role);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        rememberMe: false,
        role: role
    });

   

    const [error, setError] = useState(null);
    const [setLoading] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const { signupUser } = useUser();

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(null), 10000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    if (!formData.role) {
        console.error("User role is missing! Cannot navigate.");
        return;
    }

    
    
    const handleCheckboxChange = (e) => {
        setFormData({
            ...formData,
            rememberMe: e.checked,
        });
    };

    console.log('Role before submission okk:', formData.role);
    // Handle form field changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        let isValid = true;
        setEmailError('');
        setPasswordError('');
        setConfirmPasswordError('');

        if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
            setError('All fields are required.');
            isValid = false;
        }

        if (!/^[\w.-]+@([\w-]+\.)+[a-zA-Z]{2,}$/.test(formData.email)) {
            setEmailError('Invalid email format.');
            isValid = false;
        }
        

        if (formData.password.length < 6) {
            setPasswordError('Password must be at least 6 characters long.');
            isValid = false;
        }

        if (formData.password !== formData.confirmPassword) {
            setConfirmPasswordError('Passwords do not match.');
            isValid = false;
        }

        return isValid;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Role before submission:', formData.role);
        if(!validateForm()) return;

        setLoading(true);

        try {

            console.log("submitting form Data", formData)
            const response = await signup(formData);
            console.log('Signup API response:', response);

            if (!response || typeof response !== 'object') {
                console.error("Invalid API response:", response);
                setError("Unexpected API response format.");
                return;
            }

            if (response.status === "success") {
                // Debug: Confirm the role value before navigating
                
                console.log('Redirecting user with role:', formData.role);

                signupUser(response.user); // Store user data after signup

                if (formData.role === "captain") {
                    navigate("/dashboard")
                } else if (formData.role === "service_provider") {
                    navigate("/service_provider/dashboard")
                } else if (formData.role === "supplier") {
                    navigate("/supplier/dashboard")
                } else if (formData.role === "crew_member") {
                    navigate("/crew/dashboard")
                }
            } else {

                setError(response.message || 'Signup failed. Please try again.');

            }


        } catch (error) {
            console.log("error during signup")
            setError(error.message || 'An error occurred. Please try again.');
        } finally {
            setLoading(false)
        }


    };

    return (
        <div className="p-d-flex p-jc-center p-ai-center">
            <form onSubmit={handleSubmit}>
            {error && <Message severity="error" text={error} className="p-mb-3 "/>}
                <div className="flex flex-column p-field p-mb-3">
                    <label htmlFor="fullName">Full Name</label>
                    <InputText
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Full name"
                        className="p-d-block"
                        required
                    />
                </div>
                <div className="flex flex-column p-field p-mb-3">
                    <label htmlFor="email">Email Address</label>
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
                        className="w-full"
                    />
                    {passwordError && <small className="p-error">{passwordError}</small>}
                </div>
                <div className="flex flex-column p-field p-mb-3">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <Password
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        feedback={false}
                        toggleMask
                        placeholder="Confirm password"
                        required
                        className="w-full"
                    />
                   {confirmPasswordError && <small className="p-error">{confirmPasswordError}</small>}
                </div>
                <div className="p-field-checkbox p-d-flex p-ai-center p-jc-between signup-checkbox">
                    <div className="p-d-flex p-ai-center">
                        <Checkbox
                            inputId="rememberMe"
                            checked={formData.rememberMe}
                            onChange={handleCheckboxChange}
                        />
                        <label htmlFor="rememberMe" className="p-ml-2">
                            I agree to the <Link to="#">Terms of Service</Link> and <Link to="#">Privacy Policy</Link>.
                        </label>
                    </div>
                </div>
                <Button
                    type="submit"
                    label="Sign Up"
                    className="p-mt-2 p-button-primary w-full"
                />
            </form>
        </div>
    );
};

export default SignupForm;