
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScienceHero from "@/components/science/ScienceHero";
import ScientificMethods from "@/components/science/ScientificMethods";
import ScienceSection from "@/components/about/ScienceSection";
import ExpertCollaboration from "@/components/science/ExpertCollaboration";

const Science = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <ScienceHero />

        {/* Scientific Methods Section */}
        <ScientificMethods />

        {/* Scientific Approach */}
        <ScienceSection />

        {/* Expert Collaboration */}
        <ExpertCollaboration />
      </main>
      <Footer />
    </div>
  );
};

export default Science;
