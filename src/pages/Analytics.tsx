
import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft, TrendingUp, Calendar, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AnalyticsHeader from "@/components/analytics/AnalyticsHeader";
import AnalyticsSummary from "@/components/analytics/AnalyticsSummary";
import BiomArkersList from "@/components/analytics/BiomarkersList";
import BiomarkerDetails from "@/components/analytics/BiomarkerDetails";

const Analytics = () => {
  const [selectedBiomarker, setSelectedBiomarker] = useState<string | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="flex-grow pt-16">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <AnalyticsHeader />
          
          <div className="mt-6">
            <AnalyticsSummary />
          </div>

          <div className="mt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Показатели крови</h2>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>08.06.2025</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              <div className="xl:col-span-3">
                <BiomArkersList 
                  onSelectBiomarker={setSelectedBiomarker}
                  selectedBiomarker={selectedBiomarker}
                />
              </div>
              
              {selectedBiomarker && (
                <div className="xl:col-span-1">
                  <BiomarkerDetails 
                    biomarkerId={selectedBiomarker}
                    onClose={() => setSelectedBiomarker(null)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Analytics;
