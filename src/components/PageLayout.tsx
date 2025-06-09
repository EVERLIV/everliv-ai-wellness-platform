
import React, { ReactNode } from "react";
import Header from "./Header";
import PageBreadcrumb from "./PageBreadcrumb";

interface PageLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
  breadcrumbItems?: Array<{ title: string; href?: string }>;
  fullWidth?: boolean;
}

const PageLayout = ({ 
  children, 
  title, 
  description, 
  breadcrumbItems = [],
  fullWidth = false
}: PageLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24">
        <div className={fullWidth ? "w-full" : "container mx-auto px-4 py-8"}>
          <div className={fullWidth ? "" : "max-w-4xl mx-auto"}>
            {!fullWidth && breadcrumbItems.length > 0 && <PageBreadcrumb items={breadcrumbItems} />}
            {!fullWidth && (
              <>
                <h1 className="text-3xl font-bold mb-2">{title}</h1>
                {description && <p className="text-gray-700 mb-6">{description}</p>}
              </>
            )}
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PageLayout;
