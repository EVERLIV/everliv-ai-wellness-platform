import React, { useState, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { v4 as uuidv4 } from 'uuid';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface PageContent {
  id: string;
  type: string;
  content: any;
  position: number;
}

const PageBuilder = () => {
  const [pageContents, setPageContents] = useState<PageContent[]>([]);
  const [newContentType, setNewContentType] = useState('text');
  const [newContent, setNewContent] = useState('');

  const addContent = useCallback(() => {
    if (!newContent) {
      toast("Please enter some content", {
        description: "You must enter content before adding it to the page."
      });
      return;
    }

    const newPageContent: PageContent = {
      id: uuidv4(),
      type: newContentType,
      content: newContent,
      position: pageContents.length,
    };

    setPageContents(prev => [...prev, newPageContent]);
    setNewContent('');
    toast("Content added", {
      description: "The content has been added to the page."
    });
  }, [newContent, newContentType, pageContents.length]);

  const moveContent = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const existingContent = [...pageContents];
      const draggedItem = existingContent[dragIndex];

      existingContent.splice(dragIndex, 1);
      existingContent.splice(hoverIndex, 0, draggedItem);

      // Normalize positions
      const normalizedContent = existingContent.map((item, index) => ({
        ...item,
        position: index,
      }));

      setPageContents(normalizedContent);
      toast("Content moved", {
        description: "The content has been moved to its new position."
      });
    },
    [pageContents]
  );

  const deleteContent = useCallback((id: string) => {
    setPageContents(prev => prev.filter(content => content.id !== id));
    toast("Content deleted", {
      description: "The content has been successfully deleted."
    });
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Page Builder</h1>

        {/* Add New Content Section */}
        <div className="mb-4">
          <Label htmlFor="contentType">Content Type</Label>
          <Select onValueChange={setNewContentType}>
            <SelectTrigger id="contentType">
              <SelectValue placeholder="Select content type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">Text</SelectItem>
              <SelectItem value="image">Image</SelectItem>
              <SelectItem value="video">Video</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mb-4">
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            placeholder="Enter content"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            className="w-full"
          />
        </div>

        <Button onClick={addContent}>Add Content</Button>

        {/* Page Content Display */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Page Content</h2>
          {pageContents.map((content, index) => (
            <div key={content.id} className="border p-4 mb-2 rounded-md">
              <p>
                <strong>Type:</strong> {content.type}
              </p>
              <p>
                <strong>Content:</strong> {content.content}
              </p>
              <div className="flex justify-end mt-2">
                <Button size="sm" variant="destructive" onClick={() => deleteContent(content.id)}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DndProvider>
  );
};

export default PageBuilder;
