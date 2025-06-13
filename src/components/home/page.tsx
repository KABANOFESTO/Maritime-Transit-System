
'use client';
import HeroSection from '@/app/(homepage)/HeroSection/page';
import HowItWorksSection from '@/app/(homepage)/HowItWorksSection/page';
import BenefitsSection from '@/app/(homepage)/BenefitsSection/page';
import MobileAppSection from '@/app/(homepage)/MobileAppSection/page';
import TestimonialsSection from '@/app/(homepage)/TestimonialsSection/page';
import ContactUs from '@/app/(homepage)/ContactUs/page';

export default function HomePage() {
    return (
        <div className="flex flex-col min-h-screen">
            <HeroSection />
            <HowItWorksSection />
            <BenefitsSection />
            <MobileAppSection />
            <TestimonialsSection />
            <ContactUs />
        </div>
    );
}
