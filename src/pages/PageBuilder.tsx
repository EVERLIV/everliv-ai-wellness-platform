
import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PagesTab from '@/components/editor/tabs/PagesTab';
import ProtocolsTab from '@/components/editor/tabs/ProtocolsTab';
import EditorTab from '@/components/editor/tabs/EditorTab';
import ProtectedRoute from '@/components/ProtectedRoute';

const PageBuilder: React.FC = () => {
  const [activeTab, setActiveTab] = useState('pages');

  return (
    <ProtectedRoute adminRequired>
      <DashboardLayout>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">Конструктор страниц</h1>
          
          <Tabs defaultValue="pages" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="pages">Страницы</TabsTrigger>
              <TabsTrigger value="protocols">Протоколы</TabsTrigger>
              <TabsTrigger value="editor">Редактор</TabsTrigger>
            </TabsList>
            
            <TabsContent value="pages">
              <PagesTab />
            </TabsContent>
            
            <TabsContent value="protocols">
              <ProtocolsTab />
            </TabsContent>
            
            <TabsContent value="editor">
              <EditorTab />
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default PageBuilder;
