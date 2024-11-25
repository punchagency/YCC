import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { Link, useNavigate } from 'react-router-dom';

const SignupForm = () => {
    const [credentials, setCredentials] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        rememberMe: false,
    });

    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    const handleCheckboxChange = (e) => {
        setCredentials({
            ...credentials,
            rememberMe: e.checked,
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'email') {
            validateEmail(value);
        }
        if (name === 'password' || name === 'confirmPassword') {
            validatePassword(credentials.password, value);
        }

        setCredentials({
            ...credentials,
            [name]: value,
        });
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setEmailError('Invalid email address');
        } else {
            setEmailError('');
        }
    };

    const validatePassword = (password, confirmPassword) => {
        if (confirmPassword && password !== confirmPassword) {
            setConfirmPasswordError('Passwords do not match');
        } else {
            setConfirmPasswordError('');
        }

        if (password && password.length < 6) {
            setPasswordError('Password must be at least 6 characters');
        } else {
            setPasswordError('');
        }
    };

    const navigate = useNavigate();  // Add useNavigate hook

    const handleSubmit = (e) => {
        e.preventDefault();
        if (emailError || passwordError || confirmPasswordError || !credentials.fullName || !credentials.email || !credentials.password || !credentials.confirmPassword) {
            alert('Please fix the errors before submitting.');
            return;
        }
        console.log('Signup Credentials:', credentials);
        // Add your signup logic here

        // Assuming login is successful, navigate to Dashboard
        navigate('/dashboard');
    };

    return (
        <div className="p-d-flex p-jc-center p-ai-center">
            <form onSubmit={handleSubmit}>
                <div className="flex flex-column p-field p-mb-3">
                    <label htmlFor="fullName">Full Name</label>
                    <InputText
                        id="fullName"
                        name="fullName"
                        value={credentials.fullName}
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
                        className="w-full"
                    />
                    {passwordError && <small className="p-error">{passwordError}</small>}
                </div>
                <div className="flex flex-column p-field p-mb-3">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <Password
                        id="confirmPassword"
                        name="confirmPassword"
                        value={credentials.confirmPassword}
                        onChange={handleChange}
                        feedback={false}
                        toggleMask
                        placeholder="Confirm password"
                        required
                        className="w-full"
                    />
                    {confirmPasswordError && <small className="p-error">{confirmPasswordError}</small>}
                </div>
                <div className="p-field-checkbox p-d-flex p-ai-center p-jc-between">
                    <div className="p-d-flex p-ai-center">
                        <Checkbox
                            inputId="rememberMe"
                            checked={credentials.rememberMe}
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