'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Home, Lock, Eye, EyeOff } from 'lucide-react';
import { useResetPasswordMutation } from '@/lib/redux/slices/AuthSlice';

export default function ResetPassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [focusedField, setFocusedField] = useState('');
    const router = useRouter();
    const searchParams = useSearchParams();

    const [resetPassword, { isLoading, error }] = useResetPasswordMutation();

    const token = searchParams?.get('token') || '';

    const handleFocus = (fieldName: string) => {
        setFocusedField(fieldName);
    };

    const handleBlur = () => {
        setFocusedField('');
    };

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();

        // Validation
        if (!password || !confirmPassword) {
            toast.error('Please fill in all fields', {
                style: {
                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                    color: 'white',
                    border: '1px solid #fca5a5',
                },
            });
            return;
        }

        if (password !== confirmPassword) {
            toast.error('Passwords do not match', {
                style: {
                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                    color: 'white',
                    border: '1px solid #fca5a5',
                },
            });
            return;
        }

        if (password.length < 8) {
            toast.error('Password must be at least 8 characters', {
                style: {
                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                    color: 'white',
                    border: '1px solid #fca5a5',
                },
            });
            return;
        }

        if (!token) {
            toast.error('Invalid or missing reset token. Please request a new password reset link.', {
                style: {
                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                    color: 'white',
                    border: '1px solid #fca5a5',
                },
            });
            return;
        }

        try {
            // Call the reset password mutation
            const result = await resetPassword({
                token,
                password,
                confirmPassword
            }).unwrap();

            // Show success message
            toast.success('Password reset successfully! Redirecting to login...', {
                style: {
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: 'white',
                    border: '1px solid #6ee7b7',
                    fontWeight: '600',
                },
            });

            // Clear form and redirect
            setPassword('');
            setConfirmPassword('');

            setTimeout(() => {
                router.push('/auth');
            }, 2000);
        } catch (error: any) {
            console.error('Password reset error:', error);

            // Handle different types of errors
            const errorMessage = error?.data?.message || error?.message || 'Failed to reset password. Please try again.';

            toast.error(errorMessage, {
                style: {
                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                    color: 'white',
                    border: '1px solid #fca5a5',
                },
            });
        }
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
                            <div className="space-y-2 animate-slideInDown delay-200 text-center">
                                <div className="flex justify-center">
                                    <Lock className="w-10 h-10 text-blue-400 animate-bounce" />
                                </div>
                                <h1 className="text-3xl font-bold text-white italic transform transition-all duration-500 hover:scale-105">
                                    RESET PASSWORD
                                </h1>
                                <p className="text-white opacity-90">
                                    Create a new password for your account
                                </p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* New Password Field */}
                                <div className="space-y-2 animate-slideInRight delay-300">
                                    <label className={`block text-sm font-medium transition-all duration-300 ${focusedField === 'password' ? 'text-blue-400 transform scale-105' : 'text-white'}`}>
                                        New Password *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            onFocus={() => handleFocus('password')}
                                            onBlur={handleBlur}
                                            placeholder="••••••••••"
                                            className={`w-full px-4 py-3 pr-10 border rounded-lg transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:scale-105 hover:shadow-lg ${focusedField === 'password'
                                                ? 'border-blue-500 shadow-xl bg-white'
                                                : 'border-gray-300 bg-white hover:border-gray-400'
                                                }`}
                                            disabled={isLoading}
                                        />
                                        <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 ${focusedField === 'password' ? 'w-full' : 'w-0'
                                            }`}></div>
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-500"
                                            disabled={isLoading}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="w-5 h-5" />
                                            ) : (
                                                <Eye className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-300 mt-1">
                                        Must be at least 8 characters
                                    </p>
                                </div>

                                {/* Confirm Password Field */}
                                <div className="space-y-2 animate-slideInRight delay-400">
                                    <label className={`block text-sm font-medium transition-all duration-300 ${focusedField === 'confirmPassword' ? 'text-blue-400 transform scale-105' : 'text-white'}`}>
                                        Confirm Password *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            onFocus={() => handleFocus('confirmPassword')}
                                            onBlur={handleBlur}
                                            placeholder="••••••••••"
                                            className={`w-full px-4 py-3 pr-10 border rounded-lg transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:scale-105 hover:shadow-lg ${focusedField === 'confirmPassword'
                                                ? 'border-blue-500 shadow-xl bg-white'
                                                : 'border-gray-300 bg-white hover:border-gray-400'
                                                }`}
                                            disabled={isLoading}
                                        />
                                        <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 ${focusedField === 'confirmPassword' ? 'w-full' : 'w-0'
                                            }`}></div>
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-500"
                                            disabled={isLoading}
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="w-5 h-5" />
                                            ) : (
                                                <Eye className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isLoading || !password || !confirmPassword}
                                    className="w-full bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 disabled:from-sky-300 disabled:to-blue-400 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center animate-slideInUp delay-500"
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span className="animate-pulse">Resetting...</span>
                                        </>
                                    ) : (
                                        'Reset Password'
                                    )}
                                </button>

                                {/* Back to Login Link */}
                                <div className="text-center animate-slideInUp delay-600">
                                    <Link
                                        href="/auth"
                                        className="text-sm text-white hover:text-blue-400 transition-colors duration-300 inline-flex items-center"
                                    >
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                        </svg>
                                        Back to Sign In
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Right side - Image */}
                    <div className="w-full lg:w-1/2 flex justify-center lg:justify-end mt-12 lg:mt-0">
                        <div className="relative animate-fadeInRight delay-700">
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
      `}</style>
        </div>
    );
}