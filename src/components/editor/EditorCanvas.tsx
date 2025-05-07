
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { PanelRight, Trash2, Move, Copy, Settings, LayoutGrid, Columns, LayoutTemplate } from "lucide-react";
import { Button } from "@/components/ui/button";
import ComponentLibrary from "./ComponentLibrary";
import ComponentSettings from "./ComponentSettings";
import { componentRegistry } from "./componentRegistry";
import { ScrollArea } from "@/components/ui/scroll-area";

export type ComponentData = {
  id: string;
  type: string;
  props: Record<string, any>;
  children?: ComponentData[];
};

interface EditorCanvasProps {
  initialComponents?: ComponentData[];
  onChange?: (components: ComponentData[]) => void;
  viewMode?: 'desktop' | 'tablet' | 'mobile';
  showLibrary?: boolean;
}

const EditorCanvas = ({ 
  initialComponents = [], 
  onChange,
  viewMode = 'desktop',
  showLibrary = true
}: EditorCanvasProps) => {
  const [components, setComponents] = useState<ComponentData[]>(initialComponents);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  
  useEffect(() => {
    // Initialize with provided components if any
    if (initialComponents.length > 0) {
      setComponents(initialComponents);
    }
  }, [initialComponents]);

  // Update parent component when components change
  useEffect(() => {
    if (onChange) {
      onChange(components);
    }
  }, [components, onChange]);

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
      setSelectedComponent(newComponentId); // Auto-select newly added component
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
    setSelectedComponent(componentId === selectedComponent ? null : componentId);
  };

  const handleComponentDelete = (componentId: string) => {
    setComponents(components.filter(comp => comp.id !== componentId));
    if (selectedComponent === componentId) setSelectedComponent(null);
  };

  const handleComponentDuplicate = (componentId: string) => {
    const component = components.find(comp => comp.id === componentId);
    if (component) {
      const newComponent = {
        ...JSON.parse(JSON.stringify(component)), // Deep clone
        id: `${component.type}-${Date.now()}`
      };
      const index = components.findIndex(comp => comp.id === componentId);
      const newComponents = [...components];
      newComponents.splice(index + 1, 0, newComponent);
      setComponents(newComponents);
      setSelectedComponent(newComponent.id);
    }
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

  const getCanvasWidth = () => {
    switch (viewMode) {
      case 'mobile':
        return 'w-[375px]';
      case 'tablet':
        return 'w-[768px]';
      default:
        return 'w-full';
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 w-full">
      {/* Component Library Sidebar */}
      <div className={cn(
        "transition-all duration-300 bg-white border-r border-gray-200 shadow-sm z-10",
        showLibrary ? "w-64" : "w-0 overflow-hidden"
      )}>
        {showLibrary && <ComponentLibrary />}
      </div>
      
      {/* Main Editor Canvas */}
      <div className="flex-1 flex flex-col">
        <Droppable droppableId="editor-canvas">
          {(provided) => (
            <div
              className={cn(
                "flex-1 p-4 overflow-auto flex flex-col items-center",
                viewMode !== 'desktop' && 'bg-gray-200'
              )}
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              <div className={cn(
                "bg-white min-h-[80vh] shadow-md transition-all duration-300",
                getCanvasWidth(),
                viewMode !== 'desktop' && 'border border-gray-300 rounded-lg'
              )}>
                {components.length === 0 ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center text-gray-500 bg-gray-50 h-full flex items-center justify-center">
                    <div>
                      <LayoutTemplate className="h-12 w-12 text-gray-400 mb-3 mx-auto" />
                      <p className="mb-2 font-semibold">Перетащите компоненты из библиотеки</p>
                      <p className="text-sm text-gray-400">Создайте вашу страницу с помощью готовых блоков</p>
                    </div>
                  </div>
                ) : (
                  <ScrollArea className="h-full">
                    <div className="p-4">
                      {components.map((component, index) => (
                        <Draggable key={component.id} draggableId={component.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={cn(
                                "relative mb-6 group border-2",
                                selectedComponent === component.id ? 
                                  "border-primary ring-2 ring-primary/20" : 
                                  "border-transparent hover:border-dashed hover:border-gray-300",
                                snapshot.isDragging ? "shadow-lg" : ""
                              )}
                            >
                              <div 
                                className={cn(
                                  "absolute -top-10 left-0 opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded shadow-md flex z-10",
                                  selectedComponent === component.id && "opacity-100"
                                )}
                              >
                                <div
                                  {...provided.dragHandleProps}
                                  className="p-2 border-r cursor-move hover:bg-gray-50"
                                  title="Переместить"
                                >
                                  <Move className="h-4 w-4 text-gray-500" />
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-gray-500 hover:text-gray-700"
                                  onClick={() => handleComponentDuplicate(component.id)}
                                  title="Дублировать"
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-gray-500 hover:text-gray-700"
                                  onClick={() => setSelectedComponent(component.id)}
                                  title="Настройки"
                                >
                                  <Settings className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-red-500 hover:text-red-600"
                                  onClick={() => handleComponentDelete(component.id)}
                                  title="Удалить"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                              
                              <div 
                                className={cn(
                                  "p-4 relative",
                                  selectedComponent === component.id ? "ring-2 ring-primary/10" : ""
                                )}
                                onClick={() => handleComponentSelect(component.id)}
                              >
                                {renderComponent(component)}
                                
                                {/* Grid overlay for selected component */}
                                {selectedComponent === component.id && (
                                  <div className="absolute inset-0 border border-dashed border-primary/30 pointer-events-none"></div>
                                )}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    </div>
                    {provided.placeholder}
                  </ScrollArea>
                )}
              </div>
            </div>
          )}
        </Droppable>
      </div>
      
      {/* Component Settings Panel */}
      <div className={cn(
        "w-80 bg-white border-l border-gray-200 transition-all duration-300 shadow-sm overflow-y-auto",
        !selectedComponent && "opacity-80"
      )}>
        {selectedComponentData ? (
          <ComponentSettings
            component={selectedComponentData}
            onUpdate={(newProps) => handleComponentUpdate(selectedComponentData.id, newProps)}
          />
        ) : (
          <div className="p-6 text-center text-gray-500">
            <Settings className="h-10 w-10 text-gray-300 mx-auto mb-4" />
            <p className="font-medium mb-2">Компонент не выбран</p>
            <p className="text-sm">Выберите компонент для редактирования свойств</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditorCanvas;
