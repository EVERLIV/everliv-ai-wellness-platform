
import React from "react";
import EditorCanvas from "@/components/editor/EditorCanvas";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { DragDropContext } from "react-beautiful-dnd";

const PageBuilder = () => {
  const handleDragEnd = (result: any) => {
    // This function will be passed down to the EditorCanvas component
    if (!result.destination) return;
    // The actual drag handling is done in EditorCanvas
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200 p-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm" className="gap-1">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="h-6 border-r border-gray-300 mx-2"></div>
          <h1 className="text-lg font-medium">Page Builder</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">Preview</Button>
          <Button size="sm">Publish</Button>
        </div>
      </header>
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex-1 flex">
          <EditorCanvas />
        </div>
      </DragDropContext>
    </div>
  );
};

export default PageBuilder;
