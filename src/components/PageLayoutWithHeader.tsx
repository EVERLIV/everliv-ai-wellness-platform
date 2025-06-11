
import React from "react";
import Header from "./Header";
import MinimalFooter from "./MinimalFooter";

interface PageLayoutWithHeaderProps {
  children: React.ReactNode;
  headerComponent: React.ReactNode;
  fullWidth?: boolean;
}

const PageLayoutWithHeader: React.FC<PageLayoutWithHeaderProps> = ({
  children,
  headerComponent,
  fullWidth = false
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex-grow pt-16">
        {headerComponent}
        <div className={fullWidth ? "w-full" : "container mx-auto px-4 py-8 max-w-7xl"}>
          {children}
        </div>
      </div>
      <MinimalFooter />
    </div>
  );
};

export default PageLayoutWithHeader;
