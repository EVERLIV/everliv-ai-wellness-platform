
import React from 'react';
import EditorCanvas from '@/components/editor/EditorCanvas';
import ComponentLibrary from '@/components/editor/ComponentLibrary';
import ComponentSettings from '@/components/editor/ComponentSettings';
import { usePageEditor } from '@/hooks/usePageEditor';

const EditorTab: React.FC = () => {
  const { selectedComponent, setSelectedComponent, handleComponentUpdate } = usePageEditor();

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-3 bg-white p-4 rounded-lg shadow">
        <ComponentLibrary />
      </div>
      
      <div className="col-span-6 bg-gray-100 p-4 rounded-lg">
        <EditorCanvas onSelectComponent={setSelectedComponent} />
      </div>
      
      <div className="col-span-3 bg-white p-4 rounded-lg shadow">
        {selectedComponent ? (
          <ComponentSettings 
            component={selectedComponent} 
            onUpdate={handleComponentUpdate} 
          />
        ) : (
          <div className="p-4 text-gray-500 text-center">
            <div className="p-4 text-gray-500 text-center">
              Выберите компонент для редактирования
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditorTab;
