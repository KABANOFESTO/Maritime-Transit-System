'use client';
import React, { useState, useEffect } from 'react';
import {
  useGetComplaintsQuery,
  useUpdateComplaintMutation,
  useDeleteComplaintMutation,
} from '@/lib/redux/slices/ComplaintSlice';

interface User {
  id: number;
  email: string;
  username: string;
  role: string;
}

interface Complaint {
  id: number;
  user: User;
  subject: string;
  message: string;
  status: 'Pending' | 'In_Progress' | 'Resolved' | 'REJECTED';
  submittedAt: string;
  conversations?: Conversation[];
}

interface Conversation {
  id: string;
  author: string;
  message: string;
  timestamp: string;
  isCustomer: boolean;
}

const SupportTickets = () => {
  // RTK Query hooks
  const { data: complaints, isLoading, isError, refetch } = useGetComplaintsQuery({});
  const [updateComplaint] = useUpdateComplaintMutation();
  const [deleteComplaint] = useDeleteComplaintMutation();

  // Local state
  const [replyTexts, setReplyTexts] = useState<{ [key: number]: string }>({});
  const [selectedStatus, setSelectedStatus] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    if (complaints) {
      const initialStatus: { [key: number]: string } = {};
      complaints.forEach((complaint: Complaint) => {
        initialStatus[complaint.id] = complaint.status;
      });
      setSelectedStatus(initialStatus);
    }
  }, [complaints]);

  const handleReplyChange = (complaintId: number, value: string) => {
    setReplyTexts(prev => ({
      ...prev,
      [complaintId]: value
    }));
  };

  const handleReply = async (complaintId: number) => {
    const replyText = replyTexts[complaintId];
    const complaint = complaints?.find((c: Complaint) => c.id === complaintId);
    
    if (replyText?.trim() && complaint) {
      try {
        // Create email reply
        const emailSubject = `Re: ${complaint.subject} - Complaint ID: ${complaint.id}`;
        const emailBody = `Dear ${complaint.user.username},

Thank you for contacting our support team. We have received your complaint regarding "${complaint.subject}".

${replyText}

Best regards,
Support Team

---
Original message:
${complaint.message}

Complaint ID: ${complaint.id}
Submitted: ${new Date(complaint.submittedAt).toLocaleDateString()}`;

        // Open email client with pre-filled content
        const mailtoLink = `mailto:${complaint.user.email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
        window.open(mailtoLink);

        // Clear the reply text
        setReplyTexts(prev => ({
          ...prev,
          [complaintId]: ''
        }));

        console.log(`Email reply prepared for complaint ${complaintId} to ${complaint.user.email}`);
      } catch (error) {
        console.error('Error preparing email reply:', error);
      }
    }
  };

  const handleStatusChange = async (complaintId: number, newStatus: string) => {
    try {
      await updateComplaint({
        id: complaintId,
        status: newStatus
      }).unwrap();

      setSelectedStatus(prev => ({
        ...prev,
        [complaintId]: newStatus
      }));

      refetch();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDeleteComplaint = async (complaintId: number) => {
    if (window.confirm('Are you sure you want to delete this complaint?')) {
      try {
        await deleteComplaint(complaintId).unwrap();
        refetch();
      } catch (error) {
        console.error('Error deleting complaint:', error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-red-100 text-red-800';
      case 'In_Progress': return 'bg-yellow-100 text-yellow-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex justify-center items-center">
        <div className="text-xl font-medium text-gray-700">Loading complaints...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex justify-center items-center">
        <div className="text-xl font-medium text-red-600">Error loading complaints. Please try again.</div>
      </div>
    );
  }

  if (!complaints || complaints.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex justify-center items-center">
        <div className="text-xl font-medium text-gray-700">No complaints found.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="px-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Support Tickets</h1>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Refresh
          </button>
        </div>

        <div className="space-y-6">
          {complaints.map((complaint: Complaint) => (
            <div key={complaint.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">

              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    Complaint ID: {complaint.id}
                  </h2>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(complaint.status)}`}>
                    {complaint.status}
                  </span>
                </div>

                {/* Complaint Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Customer</h3>
                    <p className="text-gray-700">{complaint.user.username}</p>
                    <a
                      href={`mailto:${complaint.user.email}`}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      {complaint.user.email}
                    </a>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Subject</h3>
                    <p className="text-gray-700">{complaint.subject}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Submitted At</h3>
                    <p className="text-gray-700">{formatDate(complaint.submittedAt)}</p>
                  </div>
                </div>
              </div>

              {/* Message Section */}
              <div className="p-6">
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-semibold text-gray-900">
                        Original Message
                      </h4>
                      <span className="text-sm text-gray-500">
                        {formatDate(complaint.submittedAt)}
                      </span>
                    </div>
                    <div className="mb-3">
                      <span className="text-sm font-medium text-gray-700">
                        {complaint.user.username}
                      </span>
                    </div>
                    <p className="text-gray-800 mb-4 leading-relaxed">
                      {complaint.message}
                    </p>

                    {/* Reply Section */}
                    <div className="space-y-3">
                      <textarea
                        placeholder="Type your reply..."
                        value={replyTexts[complaint.id] || ''}
                        onChange={(e) => handleReplyChange(complaint.id, e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                        rows={3}
                      />
                      <div className="flex justify-center">
                        <button
                          onClick={() => handleReply(complaint.id)}
                          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                          Reply via Email
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Display any existing conversations */}
                  {complaint.conversations?.map((conversation) => (
                    <div key={conversation.id} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-semibold text-gray-900">
                          Response
                        </h4>
                        <span className="text-sm text-gray-500">
                          {conversation.timestamp}
                        </span>
                      </div>
                      <div className="mb-3">
                        <span className="text-sm font-medium text-gray-700">
                          {conversation.author}
                        </span>
                      </div>
                      <p className="text-gray-800 leading-relaxed">
                        {conversation.message}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Ticket Actions */}
                <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-gray-200">
                  <select
                    value={selectedStatus[complaint.id] || complaint.status}
                    onChange={(e) => handleStatusChange(complaint.id, e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 text-sm font-medium"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In_Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="REJECTED">Closed</option>
                  </select>

                  <button
                    onClick={() => handleDeleteComplaint(complaint.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {complaints.filter((c: Complaint) => c.status === 'Pending').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">
                  {complaints.filter((c: Complaint) => c.status === 'In_Progress').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <div>
                <p className="text-sm text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-gray-900">
                  {complaints.filter((c: Complaint) => c.status === 'Resolved').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gray-500 rounded-full mr-3"></div>
              <div>
                <p className="text-sm text-gray-600">Total Tickets</p>
                <p className="text-2xl font-bold text-gray-900">
                  {complaints.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportTickets;