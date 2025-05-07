
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { ComponentData } from "./EditorCanvas";
import { componentRegistry } from "./componentRegistry";
import { ChevronDown, ChevronUp, Settings, Palette, LayoutGrid, Type, Layers, AlignLeft, AlignCenter, AlignRight, ArrowRight } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

interface ComponentSettingsProps {
  component: ComponentData;
  onUpdate: (newProps: Record<string, any>) => void;
}

const ComponentSettings: React.FC<ComponentSettingsProps> = ({ component, onUpdate }) => {
  const { type, props } = component;
  const componentDefinition = componentRegistry[type];
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    content: true,
    layout: true,
    style: true,
    advanced: false
  });

  if (!componentDefinition) {
    return <div className="p-4">Неизвестный тип компонента: {type}</div>;
  }

  const handleChange = (property: string, value: any) => {
    onUpdate({ [property]: value });
  };

  const toggleSection = (section: string) => {
    setOpenSections({
      ...openSections,
      [section]: !openSections[section]
    });
  };

  // Group properties by category for better organization
  const groupProperties = () => {
    const groups: Record<string, Record<string, any>> = {
      content: {},
      layout: {},
      style: {},
      advanced: {}
    };
    
    Object.entries(props).forEach(([key, value]) => {
      // Simple categorization based on property name
      if (key.includes("text") || key.includes("title") || key.includes("description") || key.includes("content") || key.includes("label") || key.includes("name")) {
        groups.content[key] = value;
      } else if (key.includes("width") || key.includes("height") || key.includes("padding") || key.includes("margin") || key.includes("align") || key.includes("position") || key.includes("gap")) {
        groups.layout[key] = value;
      } else if (key.includes("color") || key.includes("background") || key.includes("border") || key.includes("shadow") || key.includes("opacity") || key.includes("radius")) {
        groups.style[key] = value;
      } else {
        groups.advanced[key] = value;
      }
    });
    
    return groups;
  };

  const propertyGroups = groupProperties();

  // Color options
  const colorOptions = [
    { label: "Белый", value: "white" },
    { label: "Серый", value: "gray-100" },
    { label: "Черный", value: "black" },
    { label: "Первичный", value: "primary" },
    { label: "Вторичный", value: "secondary" },
    { label: "Успех", value: "success" },
    { label: "Предупреждение", value: "warning" },
    { label: "Ошибка", value: "error" },
    { label: "Информация", value: "info" }
  ];

  // Size options
  const sizeOptions = [
    { label: "XS", value: "xs" },
    { label: "SM", value: "sm" },
    { label: "MD", value: "md" },
    { label: "LG", value: "lg" },
    { label: "XL", value: "xl" },
    { label: "2XL", value: "2xl" },
    { label: "3XL", value: "3xl" }
  ];

  // Renders a specialized control based on property key pattern
  const getSpecializedControl = (propName: string, propValue: any) => {
    // Color picker
    if (propName.includes("color") || propName.includes("background") || propName.includes("bg")) {
      return (
        <div className="grid grid-cols-9 gap-1 mt-1">
          {colorOptions.map(color => (
            <div
              key={color.value}
              className={cn(
                `h-6 w-6 rounded-full cursor-pointer border bg-${color.value}`,
                propValue === color.value ? "ring-2 ring-primary ring-offset-2" : ""
              )}
              title={color.label}
              onClick={() => handleChange(propName, color.value)}
            />
          ))}
          <div className="col-span-9 mt-2">
            <Input
              type="text"
              value={propValue}
              onChange={(e) => handleChange(propName, e.target.value)}
              placeholder="Custom value"
              className="h-8 text-xs"
            />
          </div>
        </div>
      );
    }
    
    // Text alignment
    if (propName === "align" || propName.includes("textAlign")) {
      return (
        <div className="flex space-x-1 mt-1">
          <button
            onClick={() => handleChange(propName, "left")}
            className={cn(
              "flex-1 flex items-center justify-center h-8 rounded border",
              propValue === "left" ? "bg-primary/10 border-primary" : "bg-gray-50 border-gray-200 hover:bg-gray-100"
            )}
          >
            <AlignLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleChange(propName, "center")}
            className={cn(
              "flex-1 flex items-center justify-center h-8 rounded border",
              propValue === "center" ? "bg-primary/10 border-primary" : "bg-gray-50 border-gray-200 hover:bg-gray-100"
            )}
          >
            <AlignCenter className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleChange(propName, "right")}
            className={cn(
              "flex-1 flex items-center justify-center h-8 rounded border",
              propValue === "right" ? "bg-primary/10 border-primary" : "bg-gray-50 border-gray-200 hover:bg-gray-100"
            )}
          >
            <AlignRight className="h-4 w-4" />
          </button>
        </div>
      );
    }

    // Spacings (margin, padding)
    if (propName.includes("padding") || propName.includes("margin")) {
      return (
        <div className="space-y-2 mt-1">
          <Slider 
            value={[typeof propValue === 'number' ? propValue : 0]}
            onValueChange={([value]) => handleChange(propName, value)}
            max={100}
            step={1}
            className="py-2"
          />
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>0</span>
            <span>50</span>
            <span>100</span>
          </div>
        </div>
      );
    }

    // Size selector
    if (propName.includes("size")) {
      return (
        <Select value={propValue} onValueChange={(value) => handleChange(propName, value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sizeOptions.map(size => (
              <SelectItem key={size.value} value={size.value}>
                {size.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    return null;
  };

  // Render different form controls based on property type
  const renderControl = (propName: string, propValue: any) => {
    // Check for specialized controls first
    const specialControl = getSpecializedControl(propName, propValue);
    if (specialControl) return specialControl;
    
    // Infer property type based on current value
    switch (typeof propValue) {
      case "string":
        // Special handling for longer text
        if (propName.includes("text") && propValue.length > 50) {
          return (
            <Textarea
              value={propValue}
              onChange={(e) => handleChange(propName, e.target.value)}
              className="min-h-[100px]"
            />
          );
        }
        
        // Special handling for URLs or hrefs
        if (propName.includes("href") || propName.includes("url") || propName.includes("src")) {
          return (
            <Input
              type="url"
              value={propValue}
              onChange={(e) => handleChange(propName, e.target.value)}
              placeholder={`Enter ${propName}...`}
            />
          );
        }
        
        // Special handling for specific props we know need selects
        if (propName === "variant") {
          return (
            <Select value={propValue} onValueChange={(value) => handleChange(propName, value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="destructive">Destructive</SelectItem>
                <SelectItem value="outline">Outline</SelectItem>
                <SelectItem value="secondary">Secondary</SelectItem>
                <SelectItem value="ghost">Ghost</SelectItem>
                <SelectItem value="link">Link</SelectItem>
              </SelectContent>
            </Select>
          );
        }
        
        // Default to a simple input for strings
        return (
          <Input
            value={propValue}
            onChange={(e) => handleChange(propName, e.target.value)}
            placeholder={`Enter ${propName}...`}
          />
        );
        
      case "number":
        return (
          <Input
            type="number"
            value={propValue}
            onChange={(e) => handleChange(propName, parseFloat(e.target.value) || 0)}
            placeholder={`Enter ${propName}...`}
          />
        );
        
      case "boolean":
        return (
          <div className="flex items-center space-x-2">
            <Switch 
              checked={propValue} 
              onCheckedChange={(checked) => handleChange(propName, checked)}
            />
            <Label>{propValue ? "Да" : "Нет"}</Label>
          </div>
        );
        
      default:
        return <div className="text-sm text-gray-500">Неподдерживаемый тип свойства</div>;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 flex items-center">
        <span className="mr-2">{componentDefinition.icon}</span>
        <h2 className="font-medium text-lg">{componentDefinition.label}</h2>
      </div>
      
      <Tabs defaultValue="content" className="flex-1 flex flex-col">
        <div className="px-4 border-b border-gray-100">
          <TabsList className="w-full">
            <TabsTrigger value="content" className="flex-1 gap-1">
              <Type className="h-4 w-4" />
              <span className="hidden sm:inline">Контент</span>
            </TabsTrigger>
            <TabsTrigger value="style" className="flex-1 gap-1">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Стиль</span>
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex-1 gap-1">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Настройки</span>
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="content" className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-5">
              <Collapsible 
                open={openSections.content}
                onOpenChange={() => toggleSection('content')}
                className="rounded-md border"
              >
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left">
                  <div className="font-medium text-sm text-gray-700 flex items-center">
                    <Type className="h-4 w-4 mr-2" />
                    Содержимое
                  </div>
                  {openSections.content ? 
                    <ChevronUp className="h-4 w-4 text-gray-500" /> : 
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  }
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <Separator className="mb-4" />
                  <div className="px-4 pb-4 space-y-4">
                    {Object.entries(propertyGroups.content).length > 0 ? (
                      Object.entries(propertyGroups.content).map(([propName, propValue]) => (
                        <div key={propName} className="space-y-2">
                          <Label htmlFor={`prop-${propName}`} className="capitalize text-xs">
                            {propName.replace(/([A-Z])/g, ' $1').trim()}
                          </Label>
                          {renderControl(propName, propValue)}
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-gray-500 italic">Нет настраиваемого контента</div>
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="style" className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-5">
              <Collapsible 
                open={openSections.layout}
                onOpenChange={() => toggleSection('layout')}
                className="rounded-md border"
              >
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left">
                  <div className="font-medium text-sm text-gray-700 flex items-center">
                    <LayoutGrid className="h-4 w-4 mr-2" />
                    Размеры и расположение
                  </div>
                  {openSections.layout ? 
                    <ChevronUp className="h-4 w-4 text-gray-500" /> : 
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  }
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <Separator className="mb-4" />
                  <div className="px-4 pb-4 space-y-4">
                    {Object.entries(propertyGroups.layout).length > 0 ? (
                      Object.entries(propertyGroups.layout).map(([propName, propValue]) => (
                        <div key={propName} className="space-y-2">
                          <Label htmlFor={`prop-${propName}`} className="capitalize text-xs">
                            {propName.replace(/([A-Z])/g, ' $1').trim()}
                          </Label>
                          {renderControl(propName, propValue)}
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-gray-500 italic">Нет настраиваемых размеров</div>
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>
              
              <Collapsible 
                open={openSections.style}
                onOpenChange={() => toggleSection('style')}
                className="rounded-md border"
              >
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left">
                  <div className="font-medium text-sm text-gray-700 flex items-center">
                    <Palette className="h-4 w-4 mr-2" />
                    Внешний вид
                  </div>
                  {openSections.style ? 
                    <ChevronUp className="h-4 w-4 text-gray-500" /> : 
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  }
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <Separator className="mb-4" />
                  <div className="px-4 pb-4 space-y-4">
                    {Object.entries(propertyGroups.style).length > 0 ? (
                      Object.entries(propertyGroups.style).map(([propName, propValue]) => (
                        <div key={propName} className="space-y-2">
                          <Label htmlFor={`prop-${propName}`} className="capitalize text-xs">
                            {propName.replace(/([A-Z])/g, ' $1').trim()}
                          </Label>
                          {renderControl(propName, propValue)}
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-gray-500 italic">Нет настраиваемых стилей</div>
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="advanced" className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-5">
              <Collapsible 
                open={openSections.advanced}
                onOpenChange={() => toggleSection('advanced')}
                className="rounded-md border"
              >
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left">
                  <div className="font-medium text-sm text-gray-700 flex items-center">
                    <Layers className="h-4 w-4 mr-2" />
                    Расширенные настройки
                  </div>
                  {openSections.advanced ? 
                    <ChevronUp className="h-4 w-4 text-gray-500" /> : 
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  }
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <Separator className="mb-4" />
                  <div className="px-4 pb-4 space-y-4">
                    {Object.entries(propertyGroups.advanced).length > 0 ? (
                      Object.entries(propertyGroups.advanced).map(([propName, propValue]) => (
                        <div key={propName} className="space-y-2">
                          <Label htmlFor={`prop-${propName}`} className="capitalize text-xs">
                            {propName.replace(/([A-Z])/g, ' $1').trim()}
                          </Label>
                          {renderControl(propName, propValue)}
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-gray-500 italic">Нет дополнительных настроек</div>
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComponentSettings;
