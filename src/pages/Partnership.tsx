
import React from 'react';
import Header from "@/components/Header";
import PartnershipHero from "@/components/partnership/PartnershipHero";
import PartnershipCards from "@/components/partnership/PartnershipCards";
import PartnershipBenefits from "@/components/partnership/PartnershipBenefits";
import HowToBecomePartner from "@/components/partnership/HowToBecomePartner";
import SuccessStories from "@/components/partnership/SuccessStories";
import PartnershipCTA from "@/components/partnership/PartnershipCTA";

const Partnership = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-16">
        <PartnershipHero />
        
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <PartnershipCards />
            <PartnershipBenefits />
          </div>
        </section>
        
        <section className="py-16 bg-primary/5">
          <div className="container mx-auto px-4">
            <HowToBecomePartner />
          </div>
        </section>
        
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <SuccessStories />
          </div>
        </section>
        
        <section className="py-16 bg-gray-50">
          <PartnershipCTA />
        </section>
      </main>
    </div>
  );
};

export default Partnership;
