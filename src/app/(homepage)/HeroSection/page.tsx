'use client';
import { Link } from 'lucide-react';
import Image from 'next/image';

const HeroSection = () => {
    return (
        <main className="bg-gray-50 min-h-screen flex items-center justify-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <div className="space-y-8">
                        <div className="space-y-6">
                            <h1 className="text-4xl md:text-5xl lg:text-5xl font-normal text-gray-900 leading-tight">
                                "Streamline vessel operations, optimize cargo tracking, and enhance passenger experiences with our innovative digital solution."
                            </h1>
                        </div>

                        <div className="pt-4">
                            <a href="/auth/signup">
                                <button className="bg-sky-400 hover:bg-sky-500 text-white font-medium py-3 px-8 rounded-md transition-colors duration-300">
                                    GET STARTED
                                </button>
                            </a>
                        </div>
                    </div>

                    {/* Right Content - Image */}
                    <div className="relative">
                        <div className="relative rounded-2xl overflow-hidden">
                            <div className="aspect-[4/3]">
                                <Image
                                    priority
                                    src="/images/ship.jpg"
                                    alt="Container ship on ocean"
                                    width={800}
                                    height={600}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default HeroSection;