'use client';

import React, { useState } from 'react';
import { Phone, Mail, MapPin, Twitter, Instagram } from 'lucide-react';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  subject: string;
  message: string;
}

export default function ContactUs() {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '+250785206970',
    subject: 'General Inquiry',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission here
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-gray-600 text-lg">Any question or remarks? Just write us a message!</p>
        </div>

        {/* Main Container */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Left Side - Contact Information */}
            <div className="lg:w-2/5 bg-gradient-to-br from-teal-500 to-teal-600 p-8 lg:p-12 text-white relative overflow-hidden">
              {/* Background decorative circles */}
              <div className="absolute bottom-20 right-16 w-32 h-32 bg-teal-400 rounded-full opacity-40"></div>
              <div className="absolute bottom-8 right-32 w-24 h-24 bg-teal-700 rounded-full opacity-60"></div>
              
              <div className="relative z-10">
                <h2 className="text-2xl font-semibold mb-2">Contact Information</h2>
                <p className="text-teal-100 mb-8">Say something to start a live chat!</p>

                <div className="space-y-6">
                  {/* Phone */}
                  <div className="flex items-center space-x-4">
                    <Phone className="w-5 h-5 text-white" />
                    <span className="text-white">+250785206970</span>
                  </div>

                  {/* Email */}
                  <div className="flex items-center space-x-4">
                    <Mail className="w-5 h-5 text-white" />
                    <span className="text-white">demo@gmail.com</span>
                  </div>

                  {/* Address */}
                  <div className="flex items-start space-x-4">
                    <MapPin className="w-5 h-5 text-white mt-1 flex-shrink-0" />
                    <span className="text-white">
                      132 Dartmouth Street Boston,<br />
                      Massachusetts 02156 United States
                    </span>
                  </div>
                </div>

                {/* Social Media Icons */}
                <div className="flex space-x-4 mt-16">
                  <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-colors">
                    <Twitter className="w-4 h-4 text-white" />
                  </div>
                  <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-colors">
                    <Instagram className="w-4 h-4 text-white" />
                  </div>
                  <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-colors">
                    <div className="w-4 h-4 bg-white rounded text-xs flex items-center justify-center text-gray-800 font-bold">
                      f
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Contact Form */}
            <div className="lg:w-3/5 p-8 lg:p-12">
              <div className="space-y-6">
                {/* First Row - First Name & Last Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full border-0 border-b-2 border-gray-200 focus:border-teal-500 focus:outline-none py-2 text-gray-900 placeholder-gray-400"
                      placeholder=""
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full border-0 border-b-2 border-gray-200 focus:border-teal-500 focus:outline-none py-2 text-gray-900 placeholder-gray-400"
                      placeholder="Name"
                    />
                  </div>
                </div>

                {/* Second Row - Email & Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full border-0 border-b-2 border-gray-200 focus:border-teal-500 focus:outline-none py-2 text-gray-900 placeholder-gray-400"
                      placeholder=""
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className="w-full border-0 border-b-2 border-gray-200 focus:border-teal-500 focus:outline-none py-2 text-gray-900 placeholder-gray-400"
                    />
                  </div>
                </div>

                {/* Subject Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-4">
                    Select Subject?
                  </label>
                  <div className="flex flex-wrap gap-6">
                    {['General Inquiry', 'General Inquiry', 'General Inquiry', 'General Inquiry'].map((option: string, index: number) => (
                      <label key={index} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="subject"
                          value={option}
                          checked={formData.subject === option && index === 0}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                          formData.subject === option && index === 0
                            ? 'border-gray-900 bg-gray-900'
                            : 'border-gray-300'
                        }`}>
                          {formData.subject === option && index === 0 && (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )}
                        </div>
                        <span className="text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full border-0 border-b-2 border-gray-200 focus:border-teal-500 focus:outline-none py-2 text-gray-900 placeholder-gray-400 resize-none"
                    placeholder="Write your message.."
                  ></textarea>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200"
                  >
                    Send Message
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}