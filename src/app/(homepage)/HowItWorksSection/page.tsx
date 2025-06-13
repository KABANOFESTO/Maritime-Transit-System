'use client';

const HowItWorksSection = () => {
    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Title */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                        How It Works
                    </h2>
                </div>

                {/* Steps Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
                    {/* Step 1 */}
                    <div className="text-center space-y-4">
                        <div className="relative mx-auto w-32 h-32 mb-6">
                            <div className="w-20 h-20 bg-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                                </svg>
                            </div>
                            <div className="absolute -top-2 -left-2 w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                1
                            </div>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">
                            Automated Vessel Scheduling
                        </h3>
                    </div>

                    {/* Step 2 */}
                    <div className="text-center space-y-4">
                        <div className="relative mx-auto w-32 h-32 mb-6">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <div className="space-y-2">
                                    <div className="w-8 h-6 bg-red-500 rounded-sm"></div>
                                    <div className="flex space-x-1">
                                        {[...Array(6)].map((_, i) => (
                                            <div key={i} className="w-1 h-1 bg-gray-400 rounded-full"></div>
                                        ))}
                                    </div>
                                    <div className="w-6 h-4 bg-blue-500 rounded text-white text-xs flex items-center justify-center">
                                        BOOK
                                    </div>
                                </div>
                            </div>
                            <div className="absolute -top-2 -left-2 w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                2
                            </div>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">
                            Seamless Online Ticket Booking
                        </h3>
                    </div>

                    {/* Step 3 */}
                    <div className="text-center space-y-4">
                        <div className="relative mx-auto w-32 h-32 mb-6">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <div className="relative">
                                    <div className="w-8 h-6 bg-gray-600 rounded"></div>
                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full"></div>
                                    <div className="absolute -bottom-1 -right-2 w-4 h-4 bg-green-500 rounded-full"></div>
                                </div>
                            </div>
                            <div className="absolute -top-2 -left-2 w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                3
                            </div>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">
                            Real-Time Cargo Tracking
                        </h3>
                    </div>

                    {/* Step 4 */}
                    <div className="text-center space-y-4">
                        <div className="relative mx-auto w-32 h-32 mb-6">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <div className="flex space-x-1">
                                    {[...Array(5)].map((_, i) => (
                                        <div key={i} className="w-3 h-8 bg-gray-800 rounded-sm"></div>
                                    ))}
                                </div>
                            </div>
                            <div className="absolute -top-2 -left-2 w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                4
                            </div>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">
                            Efficient Inventory and Fleet Management
                        </h3>
                    </div>

                    {/* Step 5 */}
                    <div className="text-center space-y-4">
                        <div className="relative mx-auto w-32 h-32 mb-6">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <div className="relative">
                                    <div className="w-8 h-12 bg-gray-800 rounded-lg"></div>
                                    <div className="absolute top-1 left-1 w-6 h-8 bg-gray-300 rounded"></div>
                                    <div className="absolute bottom-2 right-1 w-2 h-2 bg-green-500 rounded-full"></div>
                                </div>
                            </div>
                            <div className="absolute -top-2 -left-2 w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                5
                            </div>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">
                            Mobile App Access
                        </h3>
                    </div>

                    {/* Step 6 */}
                    <div className="text-center space-y-4">
                        <div className="relative mx-auto w-32 h-32 mb-6">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <div className="relative">
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-8 bg-orange-400 rounded-sm"></div>
                                        <div className="w-2 h-6 bg-orange-500 rounded-sm"></div>
                                        <div className="w-2 h-10 bg-yellow-400 rounded-sm"></div>
                                        <div className="w-2 h-4 bg-green-500 rounded-sm"></div>
                                    </div>
                                    <div className="absolute -top-2 -right-2 w-6 h-1 bg-green-500 rounded transform rotate-45"></div>
                                </div>
                            </div>
                            <div className="absolute -top-2 -left-2 w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                6
                            </div>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">
                            Performance Monitoring and Analytics
                        </h3>
                    </div>

                    {/* Step 7 */}
                    <div className="text-center space-y-4 md:col-span-2 lg:col-span-1">
                        <div className="relative mx-auto w-32 h-32 mb-6">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <div className="flex space-x-2">
                                    <div className="w-6 h-8 bg-blue-400 rounded-full"></div>
                                    <div className="w-6 h-8 bg-blue-300 rounded-full"></div>
                                </div>
                            </div>
                            <div className="absolute -top-2 -left-2 w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                7
                            </div>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">
                            Customer Support and Feedback
                        </h3>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorksSection;