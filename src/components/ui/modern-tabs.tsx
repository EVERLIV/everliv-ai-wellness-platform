import React, { useState } from 'react';

interface Tab {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  content: React.ReactNode;
}

interface ModernTabsProps {
  tabs: Tab[];
  defaultTab?: string;
  className?: string;
  variant?: 'default' | 'compact';
}

const ModernTabs: React.FC<ModernTabsProps> = ({ 
  tabs, 
  defaultTab, 
  className = '', 
  variant = 'default' 
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || '');

  if (!tabs.length) return null;

  const activeTabIndex = tabs.findIndex(tab => tab.id === activeTab);

  return (
    <div className={`w-full ${className}`}>
      {/* Десктопная навигация табов */}
      <div className="hidden sm:block">
        <div className="bg-background/70 backdrop-blur-xl rounded-2xl shadow-lg border p-1 mb-6">
          <div className="relative">
            {/* Подвижный индикатор фона */}
            <div 
              className="absolute top-1 bottom-1 bg-primary rounded-xl shadow-md transition-all duration-500 ease-out"
              style={{
                left: `${(activeTabIndex * 100) / tabs.length}%`,
                width: `${100 / tabs.length}%`,
                transform: 'translateX(0.125rem)',
                right: '0.125rem'
              }}
            />
            
            {/* Кнопки табов */}
            <div className="relative flex rounded-xl overflow-hidden">
              {tabs.map((tab, index) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex-1 relative z-10 flex items-center justify-center space-x-2 
                      py-3 px-4 text-sm font-semibold transition-all duration-300
                      hover:scale-105 active:scale-95
                      ${activeTab === tab.id 
                        ? 'text-primary-foreground shadow-lg' 
                        : 'text-muted-foreground hover:text-foreground'
                      }
                    `}
                  >
                    {Icon && <Icon className="h-4 w-4" />}
                    <span className="truncate">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Мобильная навигация внизу */}
      <div className="fixed bottom-4 left-4 right-4 sm:hidden z-50">
        <div className="bg-background/90 backdrop-blur-xl rounded-2xl shadow-2xl border p-2">
          <div className="flex justify-around">
            {tabs.map((tab, index) => {
              const Icon = tab.icon;
              return (
                <button
                  key={`mobile-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300
                    ${activeTab === tab.id 
                      ? 'bg-primary text-primary-foreground shadow-lg transform scale-110' 
                      : 'text-muted-foreground hover:bg-muted'
                    }
                  `}
                >
                  {Icon && <Icon className="h-5 w-5 mb-1" />}
                  <span className="text-xs font-medium truncate max-w-16">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Контент активного таба */}
      <div className="relative overflow-hidden">
        <div 
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${activeTabIndex * 100}%)` }}
        >
          {tabs.map((tab) => (
            <div key={tab.id} className="w-full flex-shrink-0 px-2">
              <div className="bg-background/70 backdrop-blur-xl rounded-2xl shadow-xl border p-6 min-h-[400px] mb-20 sm:mb-0">
                {tab.content}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModernTabs;