'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Home } from 'lucide-react';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [focusedField, setFocusedField] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setEmail(e.target.value);
    };

    const handleFocus = (fieldName: string) => {
        setFocusedField(fieldName);
    };

    const handleBlur = () => {
        setFocusedField('');
    };

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        setIsLoading(true);

        // Basic validation
        if (!email) {
            toast.error('Please enter your email address', {
                style: {
                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                    color: 'white',
                    border: '1px solid #fca5a5',
                },
            });
            setIsLoading(false);
            return;
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error('Please enter a valid email address', {
                style: {
                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                    color: 'white',
                    border: '1px solid #fca5a5',
                },
            });
            setIsLoading(false);
            return;
        }

        try {
            // Simulate API call
            console.log('Sending password reset email to:', email);
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Show success message
            toast.success('Password reset link sent! Check your email.', {
                style: {
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: 'white',
                    border: '1px solid #6ee7b7',
                    fontWeight: '600',
                },
            });

            // Clear form
            setEmail('');

            // Redirect after delay
            setTimeout(() => {
                router.push('/auth');
            }, 2000);
        } catch (error) {
            console.error('Password reset error:', error);
            toast.error('Failed to send reset link. Please try again.', {
                style: {
                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                    color: 'white',
                    border: '1px solid #fca5a5',
                },
            });
        } finally {
            setIsLoading(false);
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
                            <div className="space-y-2 animate-slideInDown delay-200" style={{ textAlign: 'center' }}>
                                <h1 className="text-3xl font-bold text-white italic transform transition-all duration-500 hover:scale-105">
                                    FORGOT PASSWORD?
                                </h1>
                                <p className="text-white opacity-90">
                                    Enter your email and we'll send you a link to reset your password.
                                </p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Email Field */}
                                <div className="space-y-2 animate-slideInRight delay-300">
                                    <label className={`block text-sm font-medium transition-all duration-300 ${focusedField === 'email' ? 'text-blue-400 transform scale-105' : 'text-white'}`}>
                                        Email *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            name="email"
                                            value={email}
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

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isLoading || !email}
                                    className="w-full bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 disabled:from-sky-300 disabled:to-blue-400 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center animate-slideInUp delay-400"
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span className="animate-pulse">Sending...</span>
                                        </>
                                    ) : (
                                        'Send Reset Link'
                                    )}
                                </button>

                                {/* Back to Login Link */}
                                <div className="text-center animate-slideInUp delay-500">
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
                        <div className="relative animate-fadeInRight delay-600">
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
      `}</style>
        </div>
    );
}