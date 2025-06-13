'use client';

const BenefitsSection = () => {
    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Title */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                        Benefits
                    </h2>
                </div>

                {/* Benefits Layout */}
                <div className="relative flex items-center justify-center min-h-[600px]">
                    {/* Central Team Illustration */}
                    <div className="relative z-10 flex items-end justify-center space-x-2">
                        {/* Person 1 - Yellow */}
                        <div className="w-16 h-20 relative">
                            <div className="w-10 h-10 bg-pink-200 rounded-full mx-auto mb-1 border-2 border-gray-800"></div>
                            <div className="w-16 h-12 bg-yellow-400 rounded-t-2xl border-2 border-gray-800"></div>
                            <div className="absolute top-1 left-3 w-10 h-4 bg-gray-800 rounded-full"></div>
                        </div>

                        {/* Person 2 - Back/Teal */}
                        <div className="w-16 h-24 relative -mb-4">
                            <div className="w-10 h-10 bg-pink-200 rounded-full mx-auto mb-1 border-2 border-gray-800"></div>
                            <div className="w-16 h-16 bg-teal-400 rounded-t-2xl border-2 border-gray-800"></div>
                            <div className="absolute top-1 left-3 w-10 h-4 bg-gray-800 rounded-full"></div>
                        </div>

                        {/* Person 3 - Blue */}
                        <div className="w-16 h-20 relative">
                            <div className="w-10 h-10 bg-pink-200 rounded-full mx-auto mb-1 border-2 border-gray-800"></div>
                            <div className="w-16 h-12 bg-cyan-400 rounded-t-2xl border-2 border-gray-800"></div>
                            <div className="absolute top-1 left-3 w-10 h-4 bg-gray-800 rounded-full"></div>
                        </div>

                        {/* Person 4 - Front/Pink */}
                        <div className="w-16 h-16 relative -ml-8 -mr-8 z-20">
                            <div className="w-10 h-10 bg-pink-200 rounded-full mx-auto mb-1 border-2 border-gray-800"></div>
                            <div className="w-16 h-8 bg-pink-500 rounded-t-2xl border-2 border-gray-800"></div>
                            <div className="absolute top-1 left-3 w-10 h-4 bg-gray-800 rounded-full"></div>
                        </div>
                    </div>

                    {/* Benefit Circles */}
                    {/* Enhanced Operational Efficiency - Top */}
                    <div className="absolute top-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-4">
                        <div className="w-20 h-20 border-4 border-yellow-500 bg-white rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z"/>
                            </svg>
                        </div>
                        <div className="text-left">
                            <p className="text-lg font-semibold text-yellow-600">Enhanced Operational Efficiency</p>
                        </div>
                    </div>

                    {/* Greater Accessibility with Mobile Integration - Left */}
                    <div className="absolute left-8 top-1/2 transform -translate-y-1/2 flex items-center space-x-4">
                        <div className="text-right">
                            <p className="text-lg font-semibold text-green-600">Greater<br />Accessibility with<br />Mobile Integration</p>
                        </div>
                        <div className="w-20 h-20 border-4 border-green-500 bg-white rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                                <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                                <path d="M12 18h.01"/>
                            </svg>
                        </div>
                    </div>

                    {/* Improved Customer Experience - Right */}
                    <div className="absolute right-8 top-1/2 transform -translate-y-1/2 flex items-center space-x-4">
                        <div className="w-20 h-20 border-4 border-red-500 bg-white rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="3"/>
                                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                            </svg>
                        </div>
                        <div className="text-left">
                            <p className="text-lg font-semibold text-red-600">Improved Customer<br />Experience</p>
                        </div>
                    </div>

                    {/* Increased Safety and Compliance - Bottom Left */}
                    <div className="absolute bottom-8 left-1/4 transform -translate-x-1/2 flex items-center space-x-4">
                        <div className="text-right">
                            <p className="text-lg font-semibold text-red-600">Increased<br />Safety and<br />Compliance</p>
                        </div>
                        <div className="w-20 h-20 border-4 border-red-500 bg-white rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                <polyline points="14,2 14,8 20,8"/>
                                <line x1="16" y1="13" x2="8" y2="13"/>
                                <line x1="16" y1="17" x2="8" y2="17"/>
                                <polyline points="10,9 9,9 8,9"/>
                            </svg>
                        </div>
                    </div>

                    {/* Real-Time Data Access - Bottom Right */}
                    <div className="absolute bottom-8 right-1/4 transform translate-x-1/2 flex items-center space-x-4">
                        <div className="w-20 h-20 border-4 border-green-500 bg-white rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                                <ellipse cx="12" cy="5" rx="9" ry="3"/>
                                <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
                                <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
                            </svg>
                        </div>
                        <div className="text-left">
                            <p className="text-lg font-semibold text-green-600">Real-Time Data<br />Access</p>
                        </div>
                    </div>

                    {/* Cost Optimization - Bottom Center */}
                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-4">
                        <div className="w-20 h-20 border-4 border-yellow-500 bg-white rounded-full flex items-center justify-center">
                            <div className="text-center">
                                <div className="text-xs font-bold text-yellow-600">BEST</div>
                                <div className="text-xs font-bold text-yellow-600">PRICE</div>
                            </div>
                        </div>
                        <div className="text-left">
                            <p className="text-lg font-semibold text-yellow-600">Cost Optimization</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BenefitsSection;