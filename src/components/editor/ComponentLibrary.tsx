
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { componentCategories } from "./componentRegistry";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const ComponentLibrary = () => {
  const categories = Object.keys(componentCategories);

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-medium text-lg">Components</h2>
        <div className="mt-3 relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input 
            placeholder="Search components..." 
            className="pl-8" 
          />
        </div>
      </div>
      
      <Tabs defaultValue={categories[0]} className="flex-1 flex flex-col">
        <div className="px-2 border-b border-gray-100 overflow-x-auto">
          <TabsList className="w-full justify-start h-auto py-1">
            {categories.map(category => (
              <TabsTrigger key={category} value={category} className="py-1 text-xs whitespace-nowrap">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        
        {categories.map(category => (
          <TabsContent 
            key={category} 
            value={category} 
            className="flex-1 overflow-y-auto p-2 mt-0"
          >
            <Droppable 
              droppableId="component-library" 
              isDropDisabled={true}
            >
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="grid grid-cols-2 gap-2"
                >
                  {componentCategories[category].map((component, index) => (
                    <Draggable
                      key={`${component.type}-template`}
                      draggableId={`${component.type}-template`}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`
                            flex flex-col items-center p-2 rounded-md border border-gray-200
                            ${snapshot.isDragging ? "shadow-md bg-white" : "bg-gray-50 hover:bg-gray-100"}
                            transition-colors cursor-grab
                          `}
                        >
                          <span className="text-xl mb-1">{component.icon}</span>
                          <span className="text-xs text-center">{component.label}</span>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ComponentLibrary;
