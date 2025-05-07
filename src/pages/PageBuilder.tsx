
import React from "react";
import EditorCanvas from "@/components/editor/EditorCanvas";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const PageBuilder = () => {
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
      
      <div className="flex-1 flex">
        <EditorCanvas />
      </div>
    </div>
  );
};

export default PageBuilder;
