
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ComponentData } from "./EditorCanvas";
import { componentRegistry } from "./componentRegistry";

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
        
        if (propName === "size") {
          return (
            <Select value={propValue} onValueChange={(value) => handleChange(propName, value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="sm">Small</SelectItem>
                <SelectItem value="lg">Large</SelectItem>
                <SelectItem value="icon">Icon</SelectItem>
              </SelectContent>
            </Select>
          );
        }
        
        if (propName === "align") {
          return (
            <Select value={propValue} onValueChange={(value) => handleChange(propName, value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="right">Right</SelectItem>
              </SelectContent>
            </Select>
          );
        }
        
        if (propName === "aspectRatio") {
          return (
            <Select value={propValue} onValueChange={(value) => handleChange(propName, value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="16:9">16:9</SelectItem>
                <SelectItem value="4:3">4:3</SelectItem>
                <SelectItem value="1:1">1:1</SelectItem>
                <SelectItem value="3:4">3:4</SelectItem>
                <SelectItem value="9:16">9:16</SelectItem>
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
      
      <Tabs defaultValue="properties" className="flex-1 flex flex-col">
        <div className="px-4 border-b border-gray-100">
          <TabsList className="w-full">
            <TabsTrigger value="properties" className="flex-1">Properties</TabsTrigger>
            <TabsTrigger value="styles" className="flex-1">Styles</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="properties" className="p-4 space-y-4 flex-1 overflow-y-auto">
          {Object.entries(props).map(([propName, propValue]) => (
            <div key={propName} className="space-y-2">
              <Label htmlFor={`prop-${propName}`} className="capitalize">
                {propName.replace(/([A-Z])/g, ' $1').trim()}
              </Label>
              {renderControl(propName, propValue)}
            </div>
          ))}
        </TabsContent>
        
        <TabsContent value="styles" className="p-4">
          <p className="text-sm text-gray-500">
            Style options will be available in the next version.
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComponentSettings;
