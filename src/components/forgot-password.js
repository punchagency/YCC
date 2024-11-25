import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

const ForgotPasswordForm = () => {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');

    const handleChange = (e) => {
        const { value } = e.target;
        setEmail(value);
        validateEmail(value);
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setEmailError('Invalid email address');
        } else {
            setEmailError('');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate if email is provided and valid
        if (!email) {
            alert('Please enter your email address.');
            return;
        }

        if (emailError) {
            alert('Please correct the errors before submitting.');
            return;
        }

        console.log('Forgot Password Request:', email);
        // Add your forgot password logic here

        // Assuming the email is valid and the request is successful
        alert('Password reset instructions have been sent to your email address.');
    };

    return (
        <div className="p-d-flex p-jc-center p-ai-center">
            <form onSubmit={handleSubmit}>
                <div className="flex flex-column p-field p-mb-3">
                    <label htmlFor="email">Email Address</label>
                    <InputText
                        id="email"
                        name="email"
                        value={email}
                        onChange={handleChange}
                        placeholder="Enter your email address"
                        className="p-d-block"
                        required
                    />
                    {emailError && <small className="p-error">{emailError}</small>}
                </div>
                <Button
                    type="submit"
                    label="Send Reset Link"
                    className="p-mt-2 p-button-primary w-full"
                />
            </form>
        </div>
    );
};

export default ForgotPasswordForm;
