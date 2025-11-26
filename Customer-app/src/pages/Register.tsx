import React, { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useNavigate, Link } from "react-router-dom";
import logo from '../assets/logo.jpg';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { auth } from '../utils/api';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store/authSlice';

export const Register: React.FC = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ fullName?: string; email?: string; password?: string }>(
        {}
    );
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const validate = () => {
        const next: { fullName?: string; email?: string; password?: string } = {};
        if (!fullName) next.fullName = 'Full name is required';
        if (!email) next.email = 'Email is required';
        else if (!emailRegex.test(email)) next.email = 'Enter a valid email';
        if (!password) next.password = 'Password is required';
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            const response = await auth.register({ email, password, fullName });
            if (response.data?.token) {
                const { token, user } = response.data;
                localStorage.setItem('token', token);
                dispatch(loginSuccess({ user, token }));
                navigate('/'); // Redirect to home or dashboard
            } else {
                setErrors({ ...errors, password: response.message || 'Failed to sign up. Try again.' });
            }
        } catch (error) {
            setErrors({ ...errors, password: 'Failed to sign up. Try again.' });
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
                <div className="text-center mb-6">
                    <img src={logo} alt="HopIn logo" className="mx-auto h-20 w-20 object-contain" />
                    <h1 className="text-2xl font-semibold text-[#0088FF] mt-3">Welcome to HopIn Hotel Booking System</h1>
                    <p className="text-sm text-gray-600 mt-1">Create an Account to get started</p>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                    <div className="mb-4">
                        <label htmlFor="fullName" className="block text-sm font-medium mb-1">Full Name</label>
                        <input
                            id="fullName"
                            type="text"
                            value={fullName}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)}
                            placeholder="Enter your full name"
                            aria-invalid={!!errors.fullName}
                            aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                            className="w-full border rounded px-3 py-2"
                        />
                        {errors.fullName && (
                            <p id="fullName-error" role="alert" className="text-sm text-red-600 mt-1">
                                {errors.fullName}
                            </p>
                        )}
                        <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                            placeholder="Enter your email address"
                            aria-invalid={!!errors.email}
                            aria-describedby={errors.email ? 'email-error' : undefined}
                            className="w-full border rounded px-3 py-2"
                        />
                        {errors.email && (
                            <p id="email-error" role="alert" className="text-sm text-red-600 mt-1">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    <div className="mb-4 relative">
                        <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
                        <div className="flex items-center">
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                aria-invalid={!!errors.password}
                                aria-describedby={errors.password ? 'password-error' : undefined}
                                className="w-full border rounded px-3 py-2 pr-10"
                            />
                            <button
                                type="button"
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                                onClick={() => setShowPassword((s) => !s)}
                                className="absolute right-3 top-[38px] text-gray-600"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        {errors.password && (
                            <p id="password-error" role="alert" className="text-sm text-red-600 mt-1">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center justify-between mb-4">
                        <label className="flex items-center text-sm">
                            <input
                                type="checkbox"
                                checked={remember}
                                onChange={() => setRemember((r) => !r)}
                                className="mr-2"
                            />
                            Remember me
                        </label>
                        <a href="#" className="text-sm text-blue-600 hover:underline">Forgot password?</a>
                    </div>

                    <div className="mb-4">
                        <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded">
                            {loading ? 'Signing Up...' : 'Sign Up'}
                        </button>
                    </div>

                    <p className="text-center text-sm text-gray-600">
                        Already have an account? 
                        <Link to="/login" className="text-[#0088FF] hover:underline">
                            Login
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};
