'use client';

const MobileAppSection = () => {
    return (
        <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Title */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Mobile-App
                    </h2>
                    <div className="max-w-4xl mx-auto">
                        <h3 className="text-2xl md:text-3xl font-semibold text-gray-300 mb-4">
                            Stay Connected Anytime, Anywhere with Our Mobile App
                        </h3>
                        <p className="text-lg text-gray-400">
                            Book tickets, track cargo, view schedules, and receive real-time updates—all at your fingertips.
                        </p>
                    </div>
                </div>

                {/* Feature Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    {/* Book Tickets Anytime */}
                    <div className="bg-blue-600 rounded-xl p-8 text-white flex items-center space-x-6">
                        <div className="flex-shrink-0">
                            <div className="w-16 h-16 bg-yellow-400 rounded-lg flex items-center justify-center">
                                <svg className="w-10 h-10 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                    <rect x="3" y="4" width="18" height="15" rx="2" ry="2"/>
                                    <path d="M8 2v4"/>
                                    <path d="M16 2v4"/>
                                    <path d="M3 10h18"/>
                                </svg>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-xl font-bold mb-2">Book Tickets Anytime</h4>
                            <p className="text-blue-100">
                                Secure your travel plans quickly and conveniently.
                            </p>
                        </div>
                    </div>

                    {/* Real-Time Cargo Tracking */}
                    <div className="bg-blue-600 rounded-xl p-8 text-white flex items-center space-x-6">
                        <div className="flex-shrink-0">
                            <div className="w-16 h-16 bg-green-500 rounded-lg flex items-center justify-center">
                                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                                    <circle cx="12" cy="10" r="3"/>
                                </svg>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-xl font-bold mb-2">Real-Time Cargo Tracking</h4>
                            <p className="text-blue-100">
                                Monitor shipments from departure to destination.
                            </p>
                        </div>
                    </div>

                    {/* Live Vessel Schedules */}
                    <div className="bg-blue-600 rounded-xl p-8 text-white flex items-center space-x-6">
                        <div className="flex-shrink-0">
                            <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
                                <svg className="w-10 h-10 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M3 20c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-2H3v2z"/>
                                    <path d="M15 8V4c0-1.1-.9-2-2-2h-2c-1.1 0-2 .9-2 2v4l-4 6h12l-4-6z"/>
                                    <path d="M19 17h2v3h-2z"/>
                                    <path d="M3 17h2v3H3z"/>
                                    <path d="M5 17h14"/>
                                </svg>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-xl font-bold mb-2">Live Vessel Schedules</h4>
                            <p className="text-blue-100">
                                Stay updated on departures and arrivals.
                            </p>
                        </div>
                    </div>

                    {/* Push Notifications */}
                    <div className="bg-blue-600 rounded-xl p-8 text-white flex items-center space-x-6">
                        <div className="flex-shrink-0">
                            <div className="w-16 h-16 bg-red-500 rounded-lg flex items-center justify-center">
                                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                                    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                                </svg>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-xl font-bold mb-2">Push Notifications</h4>
                            <p className="text-blue-100">
                                Get instant alerts for schedule changes.
                            </p>
                        </div>
                    </div>
                </div>

            
                <div className="text-center">
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-300 mb-8">
                        Download the NGV Smart App Today!
                    </h3>
                    
                    <button className="bg-white border-2 border-blue-600 text-blue-600 px-12 py-4 rounded-full text-xl font-semibold hover:bg-blue-50 transition-colors duration-200">
                        Explore Mobile App Features
                    </button>
                </div>
            </div>
        </section>
    );
};

export default MobileAppSection;