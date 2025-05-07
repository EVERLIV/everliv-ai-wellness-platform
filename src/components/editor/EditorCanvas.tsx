
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { PanelRight, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ComponentLibrary from "./ComponentLibrary";
import ComponentSettings from "./ComponentSettings";
import { componentRegistry } from "./componentRegistry";

export type ComponentData = {
  id: string;
  type: string;
  props: Record<string, any>;
  children?: ComponentData[];
};

const EditorCanvas = () => {
  const [components, setComponents] = useState<ComponentData[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [showLibrary, setShowLibrary] = useState(true);

  const handleDragEnd = (result: any) => {
    const { source, destination, draggableId } = result;
    
    // Dropped outside the list
    if (!destination) return;
    
    // If it's coming from the component library
    if (source.droppableId === 'component-library') {
      const componentType = draggableId.split('-')[0];
      const newComponentId = `${componentType}-${Date.now()}`;
      const newComponent = {
        id: newComponentId,
        type: componentType,
        props: componentRegistry[componentType]?.defaultProps || {},
      };
      
      const newComponents = [...components];
      newComponents.splice(destination.index, 0, newComponent);
      setComponents(newComponents);
      return;
    }
    
    // Reordering within the canvas
    if (source.droppableId === 'editor-canvas') {
      const newComponents = [...components];
      const [removed] = newComponents.splice(source.index, 1);
      newComponents.splice(destination.index, 0, removed);
      setComponents(newComponents);
    }
  };

  const handleComponentSelect = (componentId: string) => {
    setSelectedComponent(componentId);
  };

  const handleComponentDelete = (componentId: string) => {
    setComponents(components.filter(comp => comp.id !== componentId));
    if (selectedComponent === componentId) setSelectedComponent(null);
  };

  const handleComponentUpdate = (componentId: string, newProps: Record<string, any>) => {
    setComponents(components.map(comp => 
      comp.id === componentId ? { ...comp, props: { ...comp.props, ...newProps } } : comp
    ));
  };

  const renderComponent = (component: ComponentData) => {
    const ComponentToRender = componentRegistry[component.type]?.component;
    if (!ComponentToRender) return <div>Component type not found: {component.type}</div>;
    
    return <ComponentToRender {...component.props} />;
  };

  const selectedComponentData = selectedComponent 
    ? components.find(comp => comp.id === selectedComponent) 
    : null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Component Library Sidebar */}
      <div className={cn(
        "transition-all duration-300 bg-white border-r border-gray-200 shadow-sm",
        showLibrary ? "w-64" : "w-0 overflow-hidden"
      )}>
        <ComponentLibrary />
      </div>
      
      {/* Main Editor Canvas */}
      <div className="flex-1 flex flex-col">
        <div className="bg-white p-2 border-b border-gray-200 flex justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowLibrary(!showLibrary)}
          >
            <PanelRight className={cn("h-4 w-4", showLibrary && "rotate-180")} />
            <span className="ml-2 hidden sm:inline-block">
              {showLibrary ? "Hide" : "Show"} Library
            </span>
          </Button>
          
          <div className="flex space-x-2">
            <Button size="sm" variant="secondary">Preview</Button>
            <Button size="sm">Save Page</Button>
          </div>
        </div>
        
        <Droppable droppableId="editor-canvas">
          {(provided) => (
            <div
              className="flex-1 p-4 overflow-auto"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {components.length === 0 ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center text-gray-500 bg-gray-50">
                  <p>Drag components from the library to start building your page</p>
                </div>
              ) : (
                components.map((component, index) => (
                  <Draggable key={component.id} draggableId={component.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={cn(
                          "relative mb-4 border rounded-md group",
                          selectedComponent === component.id ? "border-primary ring-2 ring-primary ring-opacity-20" : "border-gray-200",
                          snapshot.isDragging ? "shadow-lg" : "shadow-sm"
                        )}
                      >
                        <div 
                          className={cn(
                            "absolute -top-3 -right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-full shadow-md p-1 z-10",
                            selectedComponent === component.id && "opacity-100"
                          )}
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => handleComponentDelete(component.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div 
                          className="p-2"
                          {...provided.dragHandleProps}
                          onClick={() => handleComponentSelect(component.id)}
                        >
                          {renderComponent(component)}
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
      
      {/* Component Settings Panel */}
      <div className={cn(
        "w-72 bg-white border-l border-gray-200 transition-all duration-300 shadow-sm",
        !selectedComponent && "opacity-50"
      )}>
        {selectedComponentData ? (
          <ComponentSettings
            component={selectedComponentData}
            onUpdate={(newProps) => handleComponentUpdate(selectedComponentData.id, newProps)}
          />
        ) : (
          <div className="p-4 text-center text-gray-500">
            <p>Select a component to edit its properties</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditorCanvas;
