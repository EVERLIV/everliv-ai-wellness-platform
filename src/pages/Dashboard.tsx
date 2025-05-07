
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageManagement from "@/components/editor/PageManagement";
import BlogManagement from "@/components/blog/BlogManagement";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("pages");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="pages">Pages</TabsTrigger>
            <TabsTrigger value="blog">Blog</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pages" className="mt-0">
            <PageManagement />
          </TabsContent>
          
          <TabsContent value="blog" className="mt-0">
            <BlogManagement />
          </TabsContent>
          
          <TabsContent value="media" className="mt-0">
            <div className="bg-white p-6 rounded-md shadow-sm">
              <h2 className="text-lg font-medium mb-4">Media Library</h2>
              <p className="text-gray-500">Media library functionality will be implemented soon.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
