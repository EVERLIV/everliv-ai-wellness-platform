
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ComponentData } from "./EditorCanvas";
import { componentRegistry } from "./componentRegistry";
import { ChevronDown } from "lucide-react";

interface ComponentSettingsProps {
  component: ComponentData;
  onUpdate: (newProps: Record<string, any>) => void;
}

const ComponentSettings: React.FC<ComponentSettingsProps> = ({ component, onUpdate }) => {
  const { type, props } = component;
  const componentDefinition = componentRegistry[type];

  if (!componentDefinition) {
    return <div className="p-4">Unknown component type: {type}</div>;
  }

  const handleChange = (property: string, value: any) => {
    onUpdate({ [property]: value });
  };

  // Group properties by category for better organization
  const groupProperties = () => {
    const groups: Record<string, Record<string, any>> = {
      content: {},
      style: {},
      layout: {},
      advanced: {}
    };
    
    Object.entries(props).forEach(([key, value]) => {
      // Simple categorization based on property name
      if (key.includes("text") || key.includes("title") || key.includes("description") || key.includes("content")) {
        groups.content[key] = value;
      } else if (key.includes("color") || key.includes("background") || key.includes("border") || key.includes("shadow")) {
        groups.style[key] = value;
      } else if (key.includes("width") || key.includes("height") || key.includes("padding") || key.includes("margin") || key.includes("align")) {
        groups.layout[key] = value;
      } else {
        groups.advanced[key] = value;
      }
    });
    
    return groups;
  };

  const propertyGroups = groupProperties();

  // Render different form controls based on property type
  const renderControl = (propName: string, propValue: any) => {
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
          <Select 
            value={propValue ? "true" : "false"} 
            onValueChange={(value) => handleChange(propName, value === "true")}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Yes</SelectItem>
              <SelectItem value="false">No</SelectItem>
            </SelectContent>
          </Select>
        );
        
      default:
        return <div className="text-sm text-gray-500">Unsupported property type</div>;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-medium text-lg flex items-center">
          <span className="mr-2">{componentDefinition.icon}</span>
          {componentDefinition.label} Settings
        </h2>
      </div>
      
      <Tabs defaultValue="content" className="flex-1 flex flex-col">
        <div className="px-4 border-b border-gray-100">
          <TabsList className="w-full">
            <TabsTrigger value="content" className="flex-1">Content</TabsTrigger>
            <TabsTrigger value="style" className="flex-1">Style</TabsTrigger>
            <TabsTrigger value="advanced" className="flex-1">Advanced</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="content" className="p-4 space-y-5 flex-1 overflow-y-auto">
          <div className="rounded-md border p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-sm text-gray-700">Content</h3>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </div>
            <Separator className="mb-4" />
            {Object.entries(propertyGroups.content).map(([propName, propValue]) => (
              <div key={propName} className="space-y-2 mb-4">
                <Label htmlFor={`prop-${propName}`} className="capitalize text-xs">
                  {propName.replace(/([A-Z])/g, ' $1').trim()}
                </Label>
                {renderControl(propName, propValue)}
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="style" className="p-4 space-y-5 flex-1 overflow-y-auto">
          <div className="rounded-md border p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-sm text-gray-700">Layout</h3>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </div>
            <Separator className="mb-4" />
            {Object.entries(propertyGroups.layout).map(([propName, propValue]) => (
              <div key={propName} className="space-y-2 mb-4">
                <Label htmlFor={`prop-${propName}`} className="capitalize text-xs">
                  {propName.replace(/([A-Z])/g, ' $1').trim()}
                </Label>
                {renderControl(propName, propValue)}
              </div>
            ))}
          </div>
          
          <div className="rounded-md border p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-sm text-gray-700">Style</h3>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </div>
            <Separator className="mb-4" />
            {Object.entries(propertyGroups.style).map(([propName, propValue]) => (
              <div key={propName} className="space-y-2 mb-4">
                <Label htmlFor={`prop-${propName}`} className="capitalize text-xs">
                  {propName.replace(/([A-Z])/g, ' $1').trim()}
                </Label>
                {renderControl(propName, propValue)}
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="advanced" className="p-4 space-y-5 flex-1 overflow-y-auto">
          <div className="rounded-md border p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-sm text-gray-700">Advanced Settings</h3>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </div>
            <Separator className="mb-4" />
            {Object.entries(propertyGroups.advanced).map(([propName, propValue]) => (
              <div key={propName} className="space-y-2 mb-4">
                <Label htmlFor={`prop-${propName}`} className="capitalize text-xs">
                  {propName.replace(/([A-Z])/g, ' $1').trim()}
                </Label>
                {renderControl(propName, propValue)}
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComponentSettings;
