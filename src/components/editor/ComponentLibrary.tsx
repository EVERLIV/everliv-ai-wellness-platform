
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { componentCategories } from "./componentRegistry";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const ComponentLibrary = () => {
  const categories = Object.keys(componentCategories);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  
  // Filter components based on search query
  const filterComponents = (components: any[]) => {
    if (!searchQuery) return components;
    return components.filter(component => 
      component.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const handleTabChange = (value: string) => {
    setSelectedCategory(value);
  };

  // Log available component types to help debugging
  useEffect(() => {
    console.log("Component categories:", categories);
    categories.forEach(category => {
      console.log(`Category ${category} components:`, componentCategories[category].map(c => c.type));
    });
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-medium text-lg">Components</h2>
        <div className="mt-3 relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input 
            placeholder="Search components..." 
            className="pl-8" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <Tabs 
        value={selectedCategory} 
        onValueChange={handleTabChange} 
        className="flex-1 flex flex-col"
      >
        <div className="px-2 border-b border-gray-100 overflow-x-auto">
          <TabsList className="w-full justify-start h-auto py-1">
            {categories.map(category => (
              <TabsTrigger 
                key={category} 
                value={category} 
                className="py-1 text-xs whitespace-nowrap"
              >
                {category}
                <Badge 
                  variant="outline" 
                  className="ml-1 text-xs py-0 h-4"
                >
                  {filterComponents(componentCategories[category]).length}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        
        {categories.map(category => {
          const filteredComponents = filterComponents(componentCategories[category]);
          
          return (
            <TabsContent 
              key={category} 
              value={category} 
              className="flex-1 mt-0"
            >
              <ScrollArea className="h-full">
                <Droppable 
                  droppableId="component-library" 
                  isDropDisabled={true}
                >
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="grid grid-cols-2 gap-2 p-3"
                    >
                      {filteredComponents.map((component, index) => (
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
                                flex flex-col items-center justify-center p-3 rounded-md border 
                                ${snapshot.isDragging 
                                  ? "shadow-lg bg-primary/10 border-primary" 
                                  : "bg-white hover:bg-gray-50 border-gray-200"
                                }
                                transition-all cursor-grab min-h-[80px]
                              `}
                              data-component-type={component.type}
                            >
                              <span className="text-2xl mb-2">{component.icon}</span>
                              <span className="text-xs text-center font-medium">{component.label}</span>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="mt-1 text-xs p-1 h-auto opacity-60 hover:opacity-100"
                                onClick={() => {
                                  // Copy component type to clipboard
                                  navigator.clipboard.writeText(component.type)
                                    .then(() => {
                                      toast.success(`Тип компонента ${component.label} скопирован`);
                                    })
                                    .catch(() => {
                                      toast.error("Не удалось скопировать");
                                    });
                                }}
                                title="Скопировать тип компонента"
                              >
                                <Plus className="h-3 w-3 mr-1" />
                                Добавить вручную
                              </Button>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </ScrollArea>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
};

export default ComponentLibrary;
