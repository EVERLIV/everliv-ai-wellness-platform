import React, { useState, useEffect } from "react";
import EditorCanvas from "@/components/editor/EditorCanvas";
import { Button } from "@/components/ui/button";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { DragDropContext } from "react-beautiful-dnd";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Define types for our page and content
interface Page {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  published: boolean;
}

const PageBuilder = () => {
  const { pageId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [pageData, setPageData] = useState<Page | null>(null);
  const [pageContent, setPageContent] = useState<any[]>([]);
  
  useEffect(() => {
    if (pageId) {
      fetchPageData();
    }
  }, [pageId]);
  
  const fetchPageData = async () => {
    try {
      setLoading(true);
      
      // Use any type temporarily until Supabase types are updated
      const { data, error } = await supabase
        .from('pages' as any)
        .select('*')
        .eq('id', pageId)
        .single();
      
      if (error) throw error;
      
      setPageData(data as unknown as Page);
      
      // Fetch page content if it exists
      const { data: contentData, error: contentError } = await supabase
        .from('page_contents' as any)
        .select('content')
        .eq('page_id', pageId)
        .single();
      
      if (contentData) {
        setPageContent(contentData.content || []);
      }
      
    } catch (error: any) {
      console.error('Error fetching page:', error);
      toast({
        title: "Error loading page",
        description: error.message,
        variant: "destructive"
      });
      
      // Navigate back to dashboard if page not found
      if (error.code === 'PGRST116') {
        navigate('/dashboard');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleDragEnd = (result: any) => {
    // This function will be passed down to the EditorCanvas component
    if (!result.destination) return;
    // The actual drag handling is done in EditorCanvas
  };
  
  const handleSave = async (components: any[]) => {
    try {
      setLoading(true);
      
      if (!pageId) {
        throw new Error("No page ID found");
      }
      
      const content = components;
      
      // Check if content record exists
      const { data: existingContent } = await supabase
        .from('page_contents' as any)
        .select('id')
        .eq('page_id', pageId)
        .single();
      
      if (existingContent) {
        // Update existing record
        const { error } = await supabase
          .from('page_contents' as any)
          .update({ 
            content,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingContent.id);
          
        if (error) throw error;
      } else {
        // Insert new record
        const { error } = await supabase
          .from('page_contents' as any)
          .insert([{
            page_id: pageId,
            content,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }]);
          
        if (error) throw error;
      }
      
      // Update page updated_at timestamp
      await supabase
        .from('pages' as any)
        .update({ updated_at: new Date().toISOString() })
        .eq('id', pageId);
      
      toast({
        title: "Page saved",
        description: "Your changes have been saved successfully"
      });
      
    } catch (error: any) {
      console.error('Error saving page:', error);
      toast({
        title: "Error saving page",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
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
          <h1 className="text-lg font-medium">
            {loading ? "Loading..." : pageData ? `Editing: ${pageData.title}` : "Page Builder"}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => window.open(`/${pageData?.slug}`, '_blank')}
            variant="outline" 
            size="sm"
            disabled={!pageData?.published}
          >
            Preview
          </Button>
          <Button 
            size="sm" 
            disabled={loading}
            className="gap-1"
            onClick={() => handleSave(pageContent)}
          >
            <Save className="w-4 h-4" />
            Save
          </Button>
        </div>
      </header>
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex-1 flex">
          <EditorCanvas 
            initialComponents={pageContent}
            onChange={setPageContent}
          />
        </div>
      </DragDropContext>
    </div>
  );
};

export default PageBuilder;
