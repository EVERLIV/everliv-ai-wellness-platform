
import React from 'react';
import ProtocolTrackingDashboard from './ProtocolTrackingDashboard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const ProtocolTracking = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="flex-grow pt-16">
        <div className="bg-white border-b border-gray-200 my-[20px]">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">Отслеживание протокола</h1>
            <div className="flex gap-2">
              <Link to="/dashboard">
                <Button variant="outline" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Вернуться в панель управления
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-6">
          <ProtocolTrackingDashboard />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ProtocolTracking;
