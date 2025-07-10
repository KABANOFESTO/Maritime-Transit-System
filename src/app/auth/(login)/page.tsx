'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { signIn, signOut, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Shield, Package, User, Home } from 'lucide-react';

interface FormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export default function SignIn() {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    rememberMe: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSignIn = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);

    // Basic validation
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields', {
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
    if (!emailRegex.test(formData.email)) {
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
      console.log('Attempting sign-in with:', {
        email: formData.email,
        passwordLength: formData.password.length
      });

      // First, check if there's an existing session
      const existingSession = await getSession();
      if (existingSession) {
        console.log('Found existing session, signing out first...');
        await signOut({ redirect: false });
        // Wait a moment for the session to clear
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      console.log('Attempting fresh sign-in...');
      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email.trim().toLowerCase(), // Normalize email
        password: formData.password,
      });

      console.log('SignIn result:', result);

      if (result?.error) {
        console.error('SignIn error:', result.error);

        // Handle different error types
        let errorMessage = 'Login failed. Please try again.';

        switch (result.error) {
          case 'CredentialsSignin':
            errorMessage = 'Invalid email or password. Please check your credentials.';
            break;
          case 'CallbackRouteError':
            errorMessage = 'Authentication service error. Please try again.';
            break;
          case 'Configuration':
            errorMessage = 'Authentication configuration error. Please contact support.';
            break;
          case 'Authentication server error':
            errorMessage = 'Server authentication error. Please try again.';
            break;
          default:
            errorMessage = result.error;
        }

        toast.error(errorMessage, {
          style: {
            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
            color: 'white',
            border: '1px solid #fca5a5',
          },
        });
      } else if (result?.ok) {
        console.log('SignIn successful, fetching session...');

        // Wait a moment for the session to be created
        await new Promise(resolve => setTimeout(resolve, 500));

        // Get session to check user role
        const session = await getSession();
        console.log('Current session:', session);

        if (!session?.user) {
          toast.error('Session creation failed. Please try again.', {
            style: {
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              color: 'white',
              border: '1px solid #fca5a5',
            },
          });
          setIsLoading(false);
          return;
        }

        const userRole = session.user.role || 'User';
        console.log('User role:', userRole);

        // Show success message
        toast.success('Welcome back! Redirecting...', {
          style: {
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: 'white',
            border: '1px solid #6ee7b7',
            fontWeight: '600',
          },
        });

        // Redirect based on role
        const redirectPath = getRedirectPath(userRole);
        console.log('Redirecting to:', redirectPath);

        // Clear form
        setFormData({
          email: '',
          password: '',
          rememberMe: false
        });

        setTimeout(() => {
          router.push(redirectPath);
        }, 1500);
      } else {
        // This shouldn't happen, but handle just in case
        toast.error('Unexpected error occurred. Please try again.', {
          style: {
            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
            color: 'white',
            border: '1px solid #fca5a5',
          },
        });
      }
    } catch (error) {
      console.error('SignIn catch error:', error);
      toast.error('Network error. Please check your connection and try again.', {
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

  const handleGoogleSignIn = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Check for existing session and sign out if needed
      const existingSession = await getSession();
      if (existingSession) {
        console.log('Found existing session, signing out first...');
        await signOut({ redirect: false });
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      const result = await signIn('google', {
        redirect: false,
        callbackUrl: '/'
      });

      if (result?.error) {
        toast.error('Google sign in failed', {
          style: {
            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
            color: 'white',
            border: '1px solid #fca5a5',
          },
        });
      } else if (result?.ok) {
        toast.success('Google sign in successful!', {
          style: {
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: 'white',
            border: '1px solid #6ee7b7',
            fontWeight: '600',
          },
        });

        // Redirect after successful Google sign in
        setTimeout(() => {
          router.push('/d');
        }, 1500);
      }
    } catch (error) {
      console.error('Google sign in error:', error);
      toast.error('Google sign in failed. Please try again.', {
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

  const getRedirectPath = (role: string): string => {
    switch (role) {
      case 'ADMIN':
        return '/Admin';
      case 'STAFF':
        return '/staff';
      case 'USER':
        return '/client';
      default:
        return '/dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-between max-w-6xl mx-auto">


          <div className="w-full lg:w-1/2 max-w-md">
            <div className="space-y-6">
              <div>
                <Link href="/" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700" style={{ textDecoration: 'none', justifyContent: 'center' }}>
                  <Home className="w-5 h-5" />
                  <span>Back to Home</span>
                </Link>
              </div>
              <div className="space-y-2 justify-center text-center">
                <h1 className="text-3xl font-bold text-gray-900">WELCOME BACK</h1>
                <p className="text-gray-600">Welcome back! Please enter your details.</p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading}
                  required
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••••"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading}
                  required
                />
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    disabled={isLoading}
                  />
                  <span className="text-sm text-gray-700">Remember me</span>
                </label>
                <Link href="/forgot-password" className="text-sm text-gray-700 hover:text-blue-600">
                  Forgot password
                </Link>
              </div>

              {/* Sign In Button */}
              <button
                onClick={handleSignIn}
                disabled={isLoading || !formData.email || !formData.password}
                className="w-full bg-sky-400 hover:bg-sky-500 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </button>

              {/* Google Sign In Button */}
              <button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-lg border border-gray-300 transition-colors duration-200 flex items-center justify-center space-x-3 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span>Sign in with Google</span>
              </button>

              {/* Sign Up Link */}
              <p className="text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <Link href="/auth/signup" className="text-red-500 hover:text-red-600 font-medium">
                  Sign up for free!
                </Link>
              </p>
            </div>
          </div>

          {/* Right Side - Ship Illustration */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end mt-12 lg:mt-0">
            <div className="relative">
              <Image
                src="/images/yacht.png"
                alt="Yacht Illustration"
                width={400}
                height={300}
                className="w-full max-w-md"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}