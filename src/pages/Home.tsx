
import React from 'react';
import TrialChat from '@/components/home/TrialChat';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header with just login button */}
      <header className="absolute top-4 right-4 z-10">
        <button className="text-blue-600 hover:text-blue-800 transition-colors">
          Log in
        </button>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4">
        <TrialChat />
      </main>
    </div>
  );
};

export default Home;
