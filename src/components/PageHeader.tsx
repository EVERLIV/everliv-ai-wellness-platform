
import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

const PageHeader = ({ title, description, children }: PageHeaderProps) => {
  return (
    <section className="py-16 bg-gradient-to-b from-primary/10 to-transparent">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">{title}</h1>
        {description && (
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            {description}
          </p>
        )}
        {children}
      </div>
    </section>
  );
};

export default PageHeader;
