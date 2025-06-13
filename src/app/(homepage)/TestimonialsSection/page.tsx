'use client';
import Image from "next/image";

const TestimonialsSection = () => {
    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Title */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                        Testimonies
                    </h2>
                </div>

                {/* Testimonials Grid */}
                <div className="space-y-16">
                    {/* First Testimonial - Ghislaine Biyo */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="order-2 lg:order-1">
                            <div className="mb-6">
                                <h3 className="text-2xl md:text-3xl font-bold text-blue-600 mb-4">
                                    Ghislaine Biyo
                                </h3>
                            </div>
                            <div className="bg-gray-50 p-8 rounded-lg">
                                <blockquote className="text-lg md:text-xl text-gray-800 font-medium leading-relaxed">
                                    "Efficient vessel and cargo management has transformed our operations and boosted productivity."
                                </blockquote>
                            </div>
                        </div>
                        <div className="order-1 lg:order-2">
                            <div className="w-80 h-96 mx-auto lg:ml-auto lg:mr-0">
                                <Image
                                    src="/images/Ghislaine.jpg"
                                    alt="Ghislaine Biyo"
                                    width={320}
                                    height={384}
                                    className="w-full h-full object-cover rounded-lg shadow-lg"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Second Testimonial - Marvin Tomo */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="order-1">
                            <div className="w-80 h-96 mx-auto lg:mr-auto lg:ml-0">
                                <Image
                                    src="/images/tomo.jpg"
                                    alt="Marvin Tomo"
                                    width={320}
                                    height={384}
                                    className="w-full h-full object-cover rounded-lg shadow-lg"
                                />
                            </div>
                        </div>
                        <div className="order-2">
                            <div className="text-right mb-6">
                                <h3 className="text-2xl md:text-3xl font-bold text-blue-600 mb-4">
                                    Marvin Tomo
                                </h3>
                            </div>
                            <div className="bg-gray-50 p-8 rounded-lg">
                                <blockquote className="text-lg md:text-xl text-gray-800 font-medium leading-relaxed text-right">
                                    "Efficient vessel and cargo management has transformed our operations and boosted productivity."
                                </blockquote>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;