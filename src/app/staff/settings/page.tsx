'use client';
import React, { useState } from 'react';
import { useUpdateProfileMutation, useChangePasswordMutation } from '@/lib/redux/slices/AuthSlice';
import { useSession } from 'next-auth/react';

const Settings = () => {
    const { data: sessionData } = useSession();
    const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateProfileMutation();
    const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();

    // Form states
    const [username, setUsername] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // UI states
    const [profileUpdateSuccess, setProfileUpdateSuccess] = useState(false);
    const [passwordUpdateSuccess, setPasswordUpdateSuccess] = useState(false);
    const [profileError, setProfileError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    // Handle profile update
    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username.trim()) {
            setProfileError('Username is required');
            return;
        }

        // Clear previous states
        setProfileError('');
        setProfileUpdateSuccess(false);

        try {
            const result = await updateProfile({
                email: sessionData?.user?.email || '',
                username: username.trim()
            }).unwrap();

            // Set success state immediately after successful API call
            setProfileUpdateSuccess(true);
            setUsername('');

            // Hide success message after 3 seconds
            setTimeout(() => setProfileUpdateSuccess(false), 3000);
        } catch (error: any) {
            // Check if it's a parsing error but the request was successful
            if (error?.status === 'PARSING_ERROR' && error?.originalStatus === 200) {
                // API returned success but with non-JSON response
                setProfileUpdateSuccess(true);
                setUsername('');
                setTimeout(() => setProfileUpdateSuccess(false), 3000);
            } else {
                console.error('Profile update error:', error);
                setProfileError(error?.data?.message || error?.message || 'Failed to update profile');
                setProfileUpdateSuccess(false);
            }
        }
    };

    // Handle password change
    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!currentPassword || !newPassword || !confirmPassword) {
            setPasswordError('All password fields are required');
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordError('New passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            setPasswordError('New password must be at least 6 characters');
            return;
        }

        // Clear previous states
        setPasswordError('');
        setPasswordUpdateSuccess(false);

        try {
            const result = await changePassword({
                email: sessionData?.user?.email || '',
                currentPassword,
                newPassword
            }).unwrap();

            // Set success state immediately after successful API call
            setPasswordUpdateSuccess(true);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');

            // Hide success message after 3 seconds
            setTimeout(() => setPasswordUpdateSuccess(false), 3000);
        } catch (error: any) {
            // Check if it's a parsing error but the request was successful
            if (error?.status === 'PARSING_ERROR' && error?.originalStatus === 200) {
                // API returned success but with non-JSON response
                setPasswordUpdateSuccess(true);
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setTimeout(() => setPasswordUpdateSuccess(false), 3000);
            } else {
                console.error('Password change error:', error);
                setPasswordError(error?.data?.message || error?.message || 'Failed to change password');
                setPasswordUpdateSuccess(false);
            }
        }
    };

    return (
        <div className="w-full bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                    <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Update Profile Section */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">Update Profile</h2>
                                <p className="text-sm text-gray-600">Change your username</p>
                            </div>
                        </div>

                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Current Email
                                </label>
                                <input
                                    type="email"
                                    value={sessionData?.user?.email || ''}
                                    disabled
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    New Username
                                </label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter new username"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            {profileError && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                                    <p className="text-sm text-red-600">{profileError}</p>
                                </div>
                            )}

                            {profileUpdateSuccess && (
                                <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <p className="text-sm text-green-600">Profile updated successfully!</p>
                                    </div>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isUpdatingProfile}
                                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isUpdatingProfile ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Updating...
                                    </>
                                ) : (
                                    'Update Profile'
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Change Password Section */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-green-50 rounded-lg">
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>
                                <p className="text-sm text-gray-600">Update your account password</p>
                            </div>
                        </div>

                        <form onSubmit={handleChangePassword} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Current Password
                                </label>
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    placeholder="Enter current password"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter new password"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm new password"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                            </div>

                            {passwordError && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                                    <p className="text-sm text-red-600">{passwordError}</p>
                                </div>
                            )}

                            {passwordUpdateSuccess && (
                                <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <p className="text-sm text-green-600">Password changed successfully!</p>
                                    </div>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isChangingPassword}
                                className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isChangingPassword ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Changing...
                                    </>
                                ) : (
                                    'Change Password'
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Security Tips */}
                <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-yellow-50 rounded-lg">
                            <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Security Tips</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div className="flex items-start gap-2">
                            <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span>Use a strong password with at least 6 characters</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span>Include uppercase, lowercase, numbers, and symbols</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span>Don't reuse passwords from other accounts</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span>Change your password regularly</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;