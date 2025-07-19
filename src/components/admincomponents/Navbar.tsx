"use client"
import { useSession, signOut } from 'next-auth/react'
import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import { useGetUserByEmailQuery } from "../../lib/redux/slices/AuthSlice";

interface NavbarProps {
    onSearch: (query: string) => void;
}

interface UserDetails {
    id: number;
    email: string;
    username: string;
    role: string;
}

const Navbar = ({ onSearch }: NavbarProps) => {
    const { data: session, status } = useSession()
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const userEmail = session?.user?.email;

    const {
        data: userDetails,
        isLoading,
        isError,
        error
    } = useGetUserByEmailQuery(userEmail!, {
        skip: !session || !userEmail,
    });

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            onSearch(searchQuery);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery, onSearch]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleProfileClick = () => {
        setShowUserDropdown(!showUserDropdown);
    };

    const handleSignOut = async () => {
        localStorage.clear();
        await signOut({ callbackUrl: '/auth' });
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest('.user-dropdown-container')) {
                setShowUserDropdown(false);
            }
        };

        if (showUserDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showUserDropdown]);

    // Format role for display
    const formatRole = (role: string) => {
        return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
    };

    // Get user initials from username
    const getUserInitials = (username: string) => {
        if (!username) return 'U';
        return username.split(' ').map(name => name.charAt(0).toUpperCase()).join('').slice(0, 2);
    };

    // Display values - prioritize backend data, fallback to session
    const displayName = userDetails?.username || session?.user?.name || 'User';
    const displayEmail = userDetails?.email || session?.user?.email || '';
    const displayRole = userDetails?.role ? formatRole(userDetails.role) : 'User';
    const userInitials = getUserInitials(displayName);

    // Don't render if not authenticated
    if (status === 'loading') {
        return (
            <div className='w-full flex flex-row items-center bg-white px-6 py-4 justify-center border-b border-gray-100'>
                <div className="animate-pulse">Loading...</div>
            </div>
        );
    }

    if (!session) {
        return null; // Or redirect to login
    }

    return (
        <div className='w-full flex flex-row items-center bg-white px-6 py-4 justify-center border-b border-gray-100'>
            {/* Centered Search Bar */}
            <div className='flex-1 max-w-md mx-auto'>
                <div className='flex flex-row items-center p-3 bg-gray-50 rounded-full w-full'>
                    <input
                        type="text"
                        placeholder='Search for Everything'
                        className='bg-transparent outline-none border-none w-full px-3 text-sm text-gray-600 placeholder-gray-400'
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                    <button className="flex-shrink-0 p-1">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17 17L12.3333 12.3333M13.8889 8.44444C13.8889 11.4513 11.4513 13.8889 8.44444 13.8889C5.43756 13.8889 3 11.4513 3 8.44444C3 5.43756 5.43756 3 8.44444 3C11.4513 3 13.8889 5.43756 13.8889 8.44444Z" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Right Side - User Profile and Notifications */}
            <div className='flex flex-row gap-4 items-center ml-6'>
                {/* Notification Bell */}
                <div className='relative'>
                    <div className='p-2 cursor-pointer rounded-full hover:bg-gray-100 flex items-center justify-center'>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M10.834 2.49999C10.834 2.03975 10.4609 1.66666 10.0006 1.66666C9.54038 1.66666 9.16728 2.03975 9.16728 2.49999V2.97571C6.34052 3.37993 4.16729 5.81018 4.16729 8.74908L4.16728 12.0827C4.16728 12.0827 4.16729 12.0826 4.16728 12.0827C4.1672 12.0843 4.16664 12.0955 4.16302 12.1174C4.15869 12.1436 4.15098 12.1793 4.13827 12.2252C4.1125 12.3183 4.07148 12.4342 4.01418 12.5712C3.89929 12.8459 3.73732 13.1622 3.55819 13.4813C3.2214 14.0813 3.05164 14.7962 3.17909 15.476C3.31349 16.193 3.77499 16.8182 4.56317 17.1183C5.26726 17.3864 6.20448 17.6316 7.44217 17.7775C7.47162 17.803 7.50644 17.8323 7.54645 17.8643C7.67169 17.9644 7.85062 18.0943 8.07675 18.2235C8.52556 18.48 9.18914 18.75 10.0006 18.75C10.8121 18.75 11.4757 18.48 11.9245 18.2235C12.1506 18.0943 12.3295 17.9644 12.4548 17.8643C12.4948 17.8323 12.5296 17.803 12.5591 17.7775C13.7968 17.6316 14.734 17.3864 15.4381 17.1183C16.2262 16.8182 16.6877 16.193 16.8221 15.476C16.9496 14.7962 16.7798 14.0813 16.443 13.4813C16.2639 13.1622 16.1019 12.8459 15.9871 12.5712C15.9298 12.4342 15.8887 12.3183 15.863 12.2252C15.8503 12.1793 15.8426 12.1436 15.8382 12.1174C15.8346 12.0955 15.834 12.0845 15.834 12.083C15.834 12.0828 15.834 12.083 15.834 12.083L15.834 12.0759V8.74948C15.834 5.81066 13.6608 3.38 10.834 2.97572V2.49999ZM5.83395 8.74908C5.83395 6.44809 7.69923 4.58332 10.0006 4.58332C12.3019 4.58332 14.1673 6.4484 14.1673 8.74948V12.0833C14.1673 12.4691 14.3118 12.8852 14.4494 13.2143C14.5989 13.5717 14.7948 13.95 14.9897 14.2971C15.1792 14.6347 15.2244 14.9537 15.184 15.1689C15.1506 15.3471 15.0615 15.4783 14.845 15.5608C13.9493 15.9018 12.4372 16.25 10.0006 16.25C7.56401 16.25 6.05196 15.9018 5.15624 15.5608C4.93969 15.4783 4.85063 15.3471 4.81722 15.1689C4.77686 14.9537 4.82205 14.6347 5.01153 14.2971C5.2064 13.95 5.40231 13.5717 5.5518 13.2143C5.68941 12.8852 5.83395 12.4691 5.83395 12.0833V8.74908Z" fill="#6B7280" />
                        </svg>
                    </div>
                    <div className="absolute -top-1 -right-1 bg-red-500 rounded-full w-3 h-3"></div>
                </div>

                {/* User Profile */}
                <div className='relative user-dropdown-container'>
                    <div
                        className='flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded-full p-1 pr-3'
                        onClick={handleProfileClick}
                    >
                        <div className='flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-blue-500 to-purple-600 w-8 h-8'>
                            {session?.user?.image ? (
                                <Image
                                    src={session.user.image}
                                    alt='profile'
                                    width={32}
                                    height={32}
                                    className='object-cover rounded-full'
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full w-full text-white font-semibold text-sm">
                                    {userInitials}
                                </div>
                            )}
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                            {isLoading ? 'Loading...' : displayName}
                        </span>
                        <svg
                            className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${showUserDropdown ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>

                    {showUserDropdown && (
                        <div className="absolute right-0 top-12 bg-white rounded-xl shadow-lg border border-gray-200 p-6 min-w-[320px] z-50">
                            {isLoading ? (
                                <div className="flex items-center justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                </div>
                            ) : isError ? (
                                <div className="text-center py-6">
                                    <div className="text-red-500 text-sm mb-3">Failed to load profile</div>
                                    <p className="text-gray-600 text-xs">{error?.toString()}</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {/* User Profile Header */}
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-blue-500 to-purple-600 w-16 h-16">
                                            {session?.user?.image ? (
                                                <Image
                                                    src={session.user.image}
                                                    alt='profile'
                                                    width={64}
                                                    height={64}
                                                    className='object-cover rounded-full'
                                                />
                                            ) : (
                                                <span className="font-bold text-white text-2xl">
                                                    {userInitials}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-900 text-xl">{displayName}</h3>
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                                                    {displayRole}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* User Information Cards */}
                                    <div className="space-y-4">
                                        {/* Username */}
                                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Username</label>
                                                    <p className="text-sm text-gray-900 font-semibold">{displayName}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Email */}
                                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <label className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Email Address</label>
                                                    <p className="text-sm text-gray-900 font-semibold">{displayEmail}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Role */}
                                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <label className="text-xs font-semibold text-green-600 uppercase tracking-wide">Role</label>
                                                    <p className="text-sm text-gray-900 font-semibold">{displayRole}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="pt-4 border-t border-gray-200 space-y-2">
                                        <button className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-all duration-200 flex items-center gap-3 font-medium">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            View Profile
                                        </button>
                                        <button className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-all duration-200 flex items-center gap-3 font-medium">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            Settings
                                        </button>
                                        <button
                                            onClick={handleSignOut}
                                            className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 flex items-center gap-3 font-medium"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Navbar;