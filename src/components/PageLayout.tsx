
import React, { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import PageBreadcrumb from "./PageBreadcrumb";

interface PageLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
  breadcrumbItems?: Array<{ title: string; href?: string }>;
}

const PageLayout = ({ children, title, description, breadcrumbItems = [] }: PageLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {breadcrumbItems.length > 0 && <PageBreadcrumb items={breadcrumbItems} />}
            <h1 className="text-3xl font-bold mb-2">{title}</h1>
            {description && <p className="text-gray-700 mb-6">{description}</p>}
            {children}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PageLayout;
