
import React from 'react';
import HomeHeader from '@/components/home/HomeHeader';
import TrialChat from '@/components/home/TrialChat';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <HomeHeader />
      
      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 pt-16">
        <TrialChat />
      </main>
    </div>
  );
};

export default Home;
