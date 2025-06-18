"use client"
import React, { useState } from 'react'

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive';
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconColor: string;
}

const StatCard = ({ title, value, icon, iconColor }: StatCardProps) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex flex-col items-center text-center">
        <div className={`mb-4 ${iconColor}`}>
          {icon}
        </div>
        <h3 className="text-sm font-medium text-gray-600 mb-2">{title}</h3>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
      </div>
    </div>
  )
}

const UserManagementDashboard = () => {
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: "Kayitare Sabine",
      email: "Kayitare@gmail.com",
      role: "Passenger",
      status: "Active"
    },
    {
      id: 2,
      name: "Kayitare Sabine",
      email: "Kayitare@gmail.com",
      role: "Passenger",
      status: "Inactive"
    },
    {
      id: 3,
      name: "Kayitare Sabine",
      email: "Kayitare@gmail.com",
      role: "Staff",
      status: "Active"
    }
  ]);

  const handleEdit = (userId: number) => {
    console.log('Edit user:', userId);
  };

  const handleDelete = (userId: number) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content - matches navbar spacing */}
      <div className="px-6 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total User"
            value="5,420"
            icon={
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
                <circle cx="12" cy="8" r="5" stroke="currentColor" strokeWidth="2"/>
                <path d="M20 21C20 16.0294 16.4183 12 12 12C7.58172 12 4 16.0294 4 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            }
            iconColor="text-blue-500"
          />
          
          <StatCard
            title="Active Users"
            value="3,240"
            icon={
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
                <circle cx="12" cy="8" r="5" stroke="currentColor" strokeWidth="2"/>
                <path d="M20 21C20 16.0294 16.4183 12 12 12C7.58172 12 4 16.0294 4 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="18" cy="6" r="3" fill="currentColor"/>
              </svg>
            }
            iconColor="text-green-500"
          />
          
          <StatCard
            title="User Roles"
            value="3 Types"
            icon={
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
                <circle cx="12" cy="8" r="5" stroke="currentColor" strokeWidth="2"/>
                <path d="M20 21C20 16.0294 16.4183 12 12 12C7.58172 12 4 16.0294 4 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M8 2L12 6L16 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            }
            iconColor="text-purple-500"
          />
        </div>

        {/* User Availability Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">User Availability</h3>
          <div className="flex items-center justify-center">
            <div className="relative w-64 h-64">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="35"
                  fill="none"
                  stroke="#F3F4F6"
                  strokeWidth="8"
                />
                {/* Members (green) - 15 users, largest segment */}
                <circle
                  cx="50"
                  cy="50"
                  r="35"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="8"
                  strokeDasharray="131.95 219.91"
                  strokeDashoffset="0"
                />
                {/* Staff (light blue) - 3 users */}
                <circle
                  cx="50"
                  cy="50"
                  r="35"
                  fill="none"
                  stroke="#7DD3FC"
                  strokeWidth="8"
                  strokeDasharray="26.39 219.91"
                  strokeDashoffset="-131.95"
                />
                {/* Admin (yellow) - 2 users */}
                <circle
                  cx="50"
                  cy="50"
                  r="35"
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="8"
                  strokeDasharray="17.59 219.91"
                  strokeDashoffset="-158.34"
                />
              </svg>
              
              {/* Numbers positioned around the chart */}
              <div className="absolute top-4 right-8 text-2xl font-bold text-gray-900">15</div>
              <div className="absolute left-4 top-16 text-2xl font-bold text-gray-900">3</div>
              <div className="absolute bottom-8 left-8 text-2xl font-bold text-gray-900">2</div>
            </div>
          </div>
          
          {/* Legend */}
          <div className="flex justify-center gap-8 mt-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm text-gray-600">Members</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-sky-300"></div>
              <span className="text-sm text-gray-600">Staff</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span className="text-sm text-gray-600">Admin</span>
            </div>
          </div>
        </div>

        {/* User Management Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-200">
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">#</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">name</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">Email</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">Role</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">Status</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-6 text-sm text-gray-900">{index + 1}</td>
                    <td className="py-4 px-6 text-sm text-gray-900 font-medium">{user.name}</td>
                    <td className="py-4 px-6 text-sm text-blue-600 underline cursor-pointer hover:text-blue-800">
                      {user.email}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-900">{user.role}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        user.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(user.id)}
                          className="px-3 py-1 bg-green-100 text-green-700 rounded text-xs font-medium hover:bg-green-200 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded text-xs font-medium hover:bg-red-200 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserManagementDashboard