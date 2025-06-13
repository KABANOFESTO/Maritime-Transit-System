'use client';
import React, { useState } from 'react';

interface SupportTicket {
  id: string;
  customerName: string;
  contact: string;
  subject: string;
  assignedTo: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  priority: 'High' | 'Medium' | 'Low';
  conversations: Conversation[];
}

interface Conversation {
  id: string;
  author: string;
  message: string;
  timestamp: string;
  isCustomer: boolean;
}

interface SupportTicketsProps {
  tickets?: SupportTicket[];
}

const SupportTickets: React.FC<SupportTicketsProps> = ({ 
  tickets = [
    {
      id: 'SUP001',
      customerName: 'Kezavaliante',
      contact: 'Keza@gmail.com',
      subject: 'Delayed Cargo Shipment',
      assignedTo: 'Support Team A',
      status: 'Open',
      priority: 'High',
      conversations: [
        {
          id: '1',
          author: 'Keza Valiante',
          message: 'My cargo shipment from Miami to Nassau is significantly delayed.',
          timestamp: '2/10/2024, 9:30:00 AM',
          isCustomer: true
        }
      ]
    },
    {
      id: 'SUP002',
      customerName: 'Kezavaliante',
      contact: 'Keza@gmail.com',
      subject: 'Delayed Cargo Shipment',
      assignedTo: 'Support Team A',
      status: 'In Progress',
      priority: 'Medium',
      conversations: [
        {
          id: '2',
          author: 'Keza Valiante',
          message: 'My cargo shipment from Miami to Nassau is significantly delayed.',
          timestamp: '2/10/2024, 9:30:00 AM',
          isCustomer: true
        }
      ]
    }
  ]
}) => {
  const [replyTexts, setReplyTexts] = useState<{[key: string]: string}>({});

  const handleReplyChange = (ticketId: string, value: string) => {
    setReplyTexts(prev => ({
      ...prev,
      [ticketId]: value
    }));
  };

  const handleReply = (ticketId: string) => {
    const replyText = replyTexts[ticketId];
    if (replyText?.trim()) {
      console.log(`Replying to ticket ${ticketId}:`, replyText);
      // Add reply logic here
      setReplyTexts(prev => ({
        ...prev,
        [ticketId]: ''
      }));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-red-100 text-red-800';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      case 'Closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="px-6 max-w-7xl mx-auto">
        <div className="space-y-6">
          {tickets.map((ticket, index) => (
            <div key={ticket.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* Priority Indicator */}
              <div className="relative">
                <div className={`absolute right-0 top-0 bottom-0 w-2 ${getPriorityColor(ticket.priority)}`}></div>
                
                {/* Ticket Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-start justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900">
                      Support Ticket: {ticket.id}
                    </h2>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(ticket.status)}`}>
                      {ticket.status}
                    </span>
                  </div>

                  {/* Ticket Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-2">Customer Name</h3>
                      <p className="text-gray-700">{ticket.customerName}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-2">Contact</h3>
                      <a 
                        href={`mailto:${ticket.contact}`}
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        {ticket.contact}
                      </a>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-2">Subject</h3>
                      <p className="text-gray-700">{ticket.subject}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-2">Assigned To:</h3>
                      <p className="text-gray-700">{ticket.assignedTo}</p>
                    </div>
                  </div>
                </div>

                {/* Conversation Section */}
                <div className="p-6">
                  <div className="space-y-4">
                    {ticket.conversations.map((conversation) => (
                      <div key={conversation.id} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-semibold text-gray-900">
                            Conversation
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
                        <p className="text-gray-800 mb-4 leading-relaxed">
                          {conversation.message}
                        </p>
                        
                        {/* Reply Section */}
                        <div className="space-y-3">
                          <textarea
                            placeholder="Type your reply..."
                            value={replyTexts[ticket.id] || ''}
                            onChange={(e) => handleReplyChange(ticket.id, e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                            rows={3}
                          />
                          <div className="flex justify-center">
                            <button
                              onClick={() => handleReply(ticket.id)}
                              className="px-6 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors font-medium"
                            >
                              Reply
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Ticket Actions */}
                  <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-gray-200">
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                      Mark as Resolved
                    </button>
                    <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium">
                      Escalate
                    </button>
                    <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium">
                      Close Ticket
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                      Transfer
                    </button>
                  </div>
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
                <p className="text-sm text-gray-600">High Priority</p>
                <p className="text-2xl font-bold text-gray-900">
                  {tickets.filter(t => t.priority === 'High').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
              <div>
                <p className="text-sm text-gray-600">Open Tickets</p>
                <p className="text-2xl font-bold text-gray-900">
                  {tickets.filter(t => t.status === 'Open').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">
                  {tickets.filter(t => t.status === 'In Progress').length}
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
                  {tickets.filter(t => t.status === 'Resolved').length}
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