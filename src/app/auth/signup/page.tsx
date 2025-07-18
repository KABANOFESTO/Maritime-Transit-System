'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRegisterMutation } from '@/lib/redux/slices/AuthSlice';
import { Home } from 'lucide-react';

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  rememberMe: boolean;
}

export default function SignUp() {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    rememberMe: false
  });

  const [focusedField, setFocusedField] = useState<string>('');
  const [registerUser, { isLoading, error, isSuccess }] = useRegisterMutation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFocus = (fieldName: string) => {
    setFocusedField(fieldName);
  };

  const handleBlur = () => {
    setFocusedField('');
  };

  const handleSignUp = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    if (!formData.username || !formData.email || !formData.password) {
      alert("Please fill in all required fields!");
      return;
    }

    try {
      const result = await registerUser({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      }).unwrap();

      alert('🎉 Welcome! Your account has been created successfully. You can now sign in and start your journey with us!');

      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        rememberMe: false
      });

    } catch (err: any) {
      console.error('Registration failed:', err);

      let errorMessage = 'Registration failed. Please try again.';

      if (err?.status === 'PARSING_ERROR') {
        console.warn('Parsing error occurred, but registration may have succeeded');
        errorMessage = 'Good news! Your account might have been created successfully. We had trouble confirming this, so please try signing in with your new credentials.';
      } else if (err?.data?.message) {
        errorMessage = err.data.message;
      } else if (err?.message) {
        errorMessage = err.message;
      } else if (err?.status) {
        switch (err.status) {
          case 400:
            errorMessage = 'Oops! Please check your information and make sure all fields are filled correctly.';
            break;
          case 409:
            errorMessage = 'This username or email is already taken. Please try a different one.';
            break;
          case 422:
            errorMessage = 'Please check your input - make sure your email is valid and password meets requirements.';
            break;
          case 500:
            errorMessage = 'Our servers are having trouble right now. Please try again in a few moments.';
            break;
          case 503:
            errorMessage = 'Service temporarily unavailable. Please try again later.';
            break;
          default:
            errorMessage = 'Something unexpected happened. Please try again or contact support if the problem persists.';
        }
      }

      alert(errorMessage);
    }
  };

  const handleGoogleSignUp = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    console.log('Google sign up');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent">
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-between max-w-6xl mx-auto">
          {/* Left side - Form */}
          <div className="w-full lg:w-1/2 max-w-md animate-fadeInLeft">
            <div className="space-y-6">
              {/* Back to Home Link */}
              <div className="animate-slideInDown">
                <Link href="/" className="group flex items-center space-x-2 text-white hover:text-blue-400 transition-all duration-300 transform hover:scale-105" style={{ textDecoration: 'none', justifyContent: 'center' }}>
                  <Home className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
                  <span className="relative">
                    Back to Home
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
                  </span>
                </Link>
              </div>

              {/* Header */}
              <div className="space-y-2 animate-slideInDown delay-200" style={{ textAlign: 'center' }}>
                <h1 className="text-3xl font-bold text-white italic transform transition-all duration-500 hover:scale-105">
                  CREATE AN ACCOUNT
                </h1>
                <p className="text-white opacity-90 animate-pulse">Join us! Please enter your details.</p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start space-x-3 animate-slideInDown shadow-lg">
                  <div className="flex-shrink-0">
                    {(error as any)?.status === 'PARSING_ERROR' ? (
                      <svg className="w-5 h-5 text-yellow-500 animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-red-500 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium">
                      {(error as any)?.status === 'PARSING_ERROR' ? 'Registration Status Unclear' : 'Registration Failed'}
                    </h3>
                    <p className="mt-1 text-sm">
                      {(error as any)?.status === 'PARSING_ERROR'
                        ? 'Your account might have been created successfully! We had trouble confirming this. Please try signing in with your credentials.'
                        : (error as any)?.data?.message || (error as any)?.message || 'Something went wrong during registration. Please check your information and try again.'
                      }
                    </p>
                  </div>
                </div>
              )}

              {/* Success Message */}
              {isSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center space-x-3 animate-slideInDown shadow-lg">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-green-500 animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Welcome aboard! 🎉</h3>
                    <p className="mt-1 text-sm">Your account has been created successfully. You can now sign in and start exploring!</p>
                  </div>
                </div>
              )}

              {/* Form Fields */}
              <div className="space-y-4">
                {/* Username Field */}
                <div className="space-y-2 animate-slideInRight delay-300">
                  <label className={`block text-sm font-medium transition-all duration-300 ${focusedField === 'username' ? 'text-blue-400 transform scale-105' : 'text-white'}`}>
                    Username *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      onFocus={() => handleFocus('username')}
                      onBlur={handleBlur}
                      placeholder="Enter your username"
                      className={`w-full px-4 py-3 border rounded-lg transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:scale-105 hover:shadow-lg ${focusedField === 'username'
                          ? 'border-blue-500 shadow-xl bg-white'
                          : 'border-gray-300 bg-white hover:border-gray-400'
                        }`}
                      disabled={isLoading}
                    />
                    <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 ${focusedField === 'username' ? 'w-full' : 'w-0'
                      }`}></div>
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-2 animate-slideInRight delay-400">
                  <label className={`block text-sm font-medium transition-all duration-300 ${focusedField === 'email' ? 'text-blue-400 transform scale-105' : 'text-white'}`}>
                    Email *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onFocus={() => handleFocus('email')}
                      onBlur={handleBlur}
                      placeholder="Enter your email"
                      className={`w-full px-4 py-3 border rounded-lg transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:scale-105 hover:shadow-lg ${focusedField === 'email'
                          ? 'border-blue-500 shadow-xl bg-white'
                          : 'border-gray-300 bg-white hover:border-gray-400'
                        }`}
                      disabled={isLoading}
                    />
                    <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 ${focusedField === 'email' ? 'w-full' : 'w-0'
                      }`}></div>
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2 animate-slideInRight delay-500">
                  <label className={`block text-sm font-medium transition-all duration-300 ${focusedField === 'password' ? 'text-blue-400 transform scale-105' : 'text-white'}`}>
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      onFocus={() => handleFocus('password')}
                      onBlur={handleBlur}
                      placeholder="••••••••••"
                      className={`w-full px-4 py-3 border rounded-lg transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:scale-105 hover:shadow-lg ${focusedField === 'password'
                          ? 'border-blue-500 shadow-xl bg-white'
                          : 'border-gray-300 bg-white hover:border-gray-400'
                        }`}
                      disabled={isLoading}
                    />
                    <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 ${focusedField === 'password' ? 'w-full' : 'w-0'
                      }`}></div>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2 animate-slideInRight delay-600">
                  <label className={`block text-sm font-medium transition-all duration-300 ${focusedField === 'confirmPassword' ? 'text-blue-400 transform scale-105' : 'text-white'}`}>
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      onFocus={() => handleFocus('confirmPassword')}
                      onBlur={handleBlur}
                      placeholder="••••••••••"
                      className={`w-full px-4 py-3 border rounded-lg transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:scale-105 hover:shadow-lg ${focusedField === 'confirmPassword'
                          ? 'border-blue-500 shadow-xl bg-white'
                          : 'border-gray-300 bg-white hover:border-gray-400'
                        }`}
                      disabled={isLoading}
                    />
                    <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 ${focusedField === 'confirmPassword' ? 'w-full' : 'w-0'
                      }`}></div>
                  </div>
                </div>

                {/* Remember Me Checkbox */}
                <div className="flex items-center animate-slideInRight delay-700">
                  <label className="flex items-center space-x-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 transition-all duration-300 transform group-hover:scale-110"
                      disabled={isLoading}
                    />
                    <span className="text-sm text-white group-hover:text-blue-400 transition-colors duration-300">Remember me</span>
                  </label>
                </div>

                {/* Sign Up Button */}
                <button
                  onClick={handleSignUp}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 disabled:from-sky-300 disabled:to-blue-400 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center animate-slideInUp delay-800"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="animate-pulse">Creating Account...</span>
                    </>
                  ) : (
                    'Sign up'
                  )}
                </button>

                {/* Google Sign Up Button */}
                <button
                  onClick={handleGoogleSignUp}
                  disabled={isLoading}
                  className="w-full bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-700 font-medium py-3 px-4 rounded-lg border border-gray-300 transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center space-x-3 animate-slideInUp delay-900"
                >
                  <svg className="w-5 h-5 transition-transform duration-300 hover:rotate-12" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <span>Sign up with Google</span>
                </button>

                {/* Sign In Link */}
                <p className="text-center text-sm text-white animate-slideInUp delay-1000">
                  Already have an account?{' '}
                  <Link href="/auth" className="text-red-500 hover:text-red-400 font-medium transition-all duration-300 transform hover:scale-105 inline-block">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Right side - Image */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end mt-12 lg:mt-0">
            <div className="relative animate-fadeInRight delay-1200">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
              <Image
                src="/images/yacht.png"
                alt="Yacht Illustration"
                width={400}
                height={300}
                className="w-full max-w-md relative z-10 transition-transform duration-500 hover:scale-110"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fadeInLeft {
          animation: fadeInLeft 0.8s ease-out;
        }

        .animate-fadeInRight {
          animation: fadeInRight 0.8s ease-out;
        }

        .animate-slideInDown {
          animation: slideInDown 0.6s ease-out;
        }

        .animate-slideInUp {
          animation: slideInUp 0.6s ease-out;
        }

        .animate-slideInRight {
          animation: slideInRight 0.6s ease-out;
        }

        .delay-200 {
          animation-delay: 0.2s;
        }

        .delay-300 {
          animation-delay: 0.3s;
        }

        .delay-400 {
          animation-delay: 0.4s;
        }

        .delay-500 {
          animation-delay: 0.5s;
        }

        .delay-600 {
          animation-delay: 0.6s;
        }

        .delay-700 {
          animation-delay: 0.7s;
        }

        .delay-800 {
          animation-delay: 0.8s;
        }

        .delay-900 {
          animation-delay: 0.9s;
        }

        .delay-1000 {
          animation-delay: 1s;
        }

        .delay-1200 {
          animation-delay: 1.2s;
        }
      `}</style>
    </div>
  );
}