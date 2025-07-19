"use client"
import React, { useState, useMemo } from 'react'
import { useGetAllUsersQuery, useDeleteUserMutation } from '@/lib/redux/slices/AuthSlice'

interface User {
  id: number;
  email: string;
  username: string;
  role: string;
  resetPasswordToken?: string | null;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconColor: string;
  isLoading?: boolean;
}

const StatCard = ({ title, value, icon, iconColor, isLoading = false }: StatCardProps) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col items-center text-center">
        <div className={`mb-4 ${iconColor}`}>
          {icon}
        </div>
        <h3 className="text-sm font-medium text-gray-600 mb-2">{title}</h3>
        <div className="text-2xl font-bold text-gray-900">
          {isLoading ? (
            <div className="animate-pulse bg-gray-300 h-8 w-16 rounded"></div>
          ) : (
            value
          )}
        </div>
      </div>
    </div>
  )
}

const UserManagementDashboard = () => {
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10);
  const [deleteMessage, setDeleteMessage] = useState<string>('');
  const [deleteMessageType, setDeleteMessageType] = useState<'success' | 'error'>('success');

  // Query hooks
  const { data: usersData, isLoading, isError, error, refetch } = useGetAllUsersQuery({});
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const users = usersData || [];
  const totalUsers = users.length;
  const activeUsers: number = users.filter((user: User) => !user.resetPasswordToken).length;
  const userRoles: string[] = [...new Set<string>(users.map((user: User) => user.role as string))];
  const roleCount = userRoles.length;

  // Role statistics for chart
  interface RoleStat {
    role: string;
    count: number;
    percentage: number;
  }

  const roleStats: RoleStat[] = userRoles.map((role: string): RoleStat => ({
    role,
    count: users.filter((user: User) => user.role === role).length,
    percentage: (users.filter((user: User) => user.role === role).length / totalUsers) * 100
  }));

  // Filtered and paginated users
  const filteredUsers = useMemo(() => {
    return users.filter((user: User) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredUsers.slice(startIndex, endIndex);
  }, [filteredUsers, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handleEdit = (userId: number) => {
    console.log('Edit user:', userId);
    // TODO: Implement edit functionality
  };

  const handleDeleteConfirm = async (email: string) => {
    try {
      const result = await deleteUser(email).unwrap();
      setDeleteConfirmId(null);
      setDeleteMessage('User deleted successfully!');
      setDeleteMessageType('success');
      refetch(); // Refresh the data

      // Clear message after 3 seconds
      setTimeout(() => setDeleteMessage(''), 3000);
    } catch (error: any) {
      console.error('Failed to delete user:', error);
      
      // Handle different error types
      let errorMessage = 'Failed to delete user. Please try again.';
      
      if (error?.status === 'PARSING_ERROR') {
        // If it's a parsing error but status is 200, it might be successful
        if (error?.originalStatus === 200) {
          setDeleteConfirmId(null);
          setDeleteMessage('User deleted successfully!');
          setDeleteMessageType('success');
          refetch(); // Refresh the data
          setTimeout(() => setDeleteMessage(''), 3000);
          return;
        }
      }
      
      if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      setDeleteMessage(errorMessage);
      setDeleteMessageType('error');

      // Clear message after 5 seconds
      setTimeout(() => setDeleteMessage(''), 5000);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmId(null);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'bg-amber-100 text-amber-800';
      case 'staff':
        return 'bg-blue-100 text-blue-800';
      case 'user':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Chart colors for roles
  const chartColors = ['#10B981', '#7DD3FC', '#F59E0B', '#EF4444', '#8B5CF6'];

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Users</h3>
            <p className="text-gray-600 mb-4">
              {(error && typeof error === 'object' && 'data' in error && typeof (error as any).data === 'object' && (error as any).data?.message)
                ? (error as any).data.message
                : 'Failed to load user data'}
            </p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="px-6 py-6">
        {/* Delete Message */}
        {deleteMessage && (
          <div className={`mb-4 p-4 rounded-lg ${deleteMessageType === 'success' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
            <div className="flex items-center justify-between">
              <span>{deleteMessage}</span>
              <button
                onClick={() => setDeleteMessage('')}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={totalUsers}
            isLoading={isLoading}
            icon={
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
                <circle cx="12" cy="8" r="5" stroke="currentColor" strokeWidth="2" />
                <path d="M20 21C20 16.0294 16.4183 12 12 12C7.58172 12 4 16.0294 4 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            }
            iconColor="text-blue-500"
          />

          <StatCard
            title="Active Users"
            value={activeUsers}
            isLoading={isLoading}
            icon={
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
                <circle cx="12" cy="8" r="5" stroke="currentColor" strokeWidth="2" />
                <path d="M20 21C20 16.0294 16.4183 12 12 12C7.58172 12 4 16.0294 4 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <circle cx="18" cy="6" r="3" fill="currentColor" />
              </svg>
            }
            iconColor="text-green-500"
          />

          <StatCard
            title="User Roles"
            value={`${roleCount} Types`}
            isLoading={isLoading}
            icon={
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
                <circle cx="12" cy="8" r="5" stroke="currentColor" strokeWidth="2" />
                <path d="M20 21C20 16.0294 16.4183 12 12 12C7.58172 12 4 16.0294 4 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M8 2L12 6L16 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
            iconColor="text-purple-500"
          />
        </div>

        {/* User Distribution Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">User Distribution by Role</h3>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-pulse">
                <div className="w-64 h-64 bg-gray-300 rounded-full"></div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <div className="relative w-64 h-64">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="35"
                    fill="none"
                    stroke="#F3F4F6"
                    strokeWidth="8"
                  />
                  {roleStats.map((stat, index) => {
                    const circumference = 2 * Math.PI * 35;
                    const strokeDasharray = `${(stat.percentage / 100) * circumference} ${circumference}`;
                    const strokeDashoffset = -roleStats.slice(0, index).reduce((acc, curr) =>
                      acc + (curr.percentage / 100) * circumference, 0
                    );

                    return (
                      <circle
                        key={stat.role}
                        cx="50"
                        cy="50"
                        r="35"
                        fill="none"
                        stroke={chartColors[index % chartColors.length]}
                        strokeWidth="8"
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                      />
                    );
                  })}
                </svg>

                {/* Role counts positioned around the chart using div instead of text */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{totalUsers}</div>
                    <div className="text-sm text-gray-600">Total Users</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            {roleStats.map((stat, index) => (
              <div key={stat.role} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: chartColors[index % chartColors.length] }}
                ></div>
                <span className="text-sm text-gray-600 capitalize">
                  {stat.role} ({stat.count})
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* User Management Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
              <div className="flex gap-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                <button
                  onClick={() => refetch()}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Refresh
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading users...</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">#</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">Username</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">Email</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">Role</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.map((user: User, index: number) => (
                    <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6 text-sm text-gray-900">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td className="py-4 px-6 text-sm text-gray-900 font-medium">{user.username}</td>
                      <td className="py-4 px-6 text-sm text-blue-600 underline cursor-pointer hover:text-blue-800">
                        {user.email}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(user.id)}
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium hover:bg-blue-200 transition-colors"
                          >
                            Edit
                          </button>
                          {deleteConfirmId === user.id ? (
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-red-600 mr-2">Are you sure?</span>
                              <button
                                onClick={() => handleDeleteConfirm(user.email)}
                                disabled={isDeleting}
                                className="px-3 py-1 bg-red-600 text-white rounded text-xs font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                              >
                                {isDeleting ? 'Deleting...' : 'Yes, Delete'}
                              </button>
                              <button
                                onClick={handleDeleteCancel}
                                className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium hover:bg-gray-200 transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirmId(user.id)}
                              className="px-3 py-1 bg-red-100 text-red-700 rounded text-xs font-medium hover:bg-red-200 transition-colors"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {filteredUsers.length > 0 && totalPages > 1 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 text-sm rounded-md ${currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}

          {filteredUsers.length === 0 && !isLoading && (
            <div className="p-8 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <p className="text-gray-600">
                {searchTerm ? 'No users found matching your search.' : 'No users found'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserManagementDashboard