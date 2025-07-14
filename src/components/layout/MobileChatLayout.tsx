import React from 'react';

interface MobileChatLayoutProps {
  children: React.ReactNode;
}

export function MobileChatLayout({ children }: MobileChatLayoutProps) {
  return (
    <div className="h-screen w-full bg-background overflow-hidden">
      {children}
    </div>
  );
}