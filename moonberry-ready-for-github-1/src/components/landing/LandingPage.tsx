import React from 'react';
import { Hero } from './Hero';
import { ProductOverview } from './ProductOverview';
import { FeaturesGrid } from './FeaturesGrid';
import { ToolShowcase } from './ToolShowcase';
import { CTASection } from './CTASection';
import { Footer } from './Footer';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#090A15] dark:bg-[#090A15] light:bg-[#FFFFFF] text-[#F3F4F6] dark:text-[#F3F4F6] light:text-[#111827]">
      <Hero />
      <ProductOverview />
      <FeaturesGrid />
      <ToolShowcase />
      <CTASection />
      <Footer />
    </div>
  );
};
