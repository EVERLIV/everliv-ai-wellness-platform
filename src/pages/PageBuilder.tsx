
import React, { useState, useEffect } from "react";
import EditorCanvas from "@/components/editor/EditorCanvas";
import { Button } from "@/components/ui/button";
import { Link, useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Settings, 
  LayoutGrid, 
  Undo, 
  Redo, 
  Smartphone, 
  Tablet, 
  Monitor,
  ChevronLeft
} from "lucide-react";
import { DragDropContext } from "react-beautiful-dnd";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

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

interface PageContent {
  id?: string;
  page_id?: string;
  content?: any[];
  created_at?: string;
  updated_at?: string;
}

const PageBuilder = () => {
  const { pageId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [pageData, setPageData] = useState<Page | null>(null);
  const [pageContent, setPageContent] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showLibrary, setShowLibrary] = useState(true);
  
  useEffect(() => {
    if (pageId) {
      fetchPageData();
    }
  }, [pageId]);
  
  const fetchPageData = async () => {
    try {
      setLoading(true);
      
      // Fetch page data
      const { data: pageData, error: pageError } = await supabase
        .from('pages' as any)
        .select('*')
        .eq('id', pageId)
        .single();
      
      if (pageError) throw pageError;
      
      setPageData(pageData as unknown as Page);
      
      // Fetch page content if it exists
      const { data: contentData, error: contentError } = await supabase
        .from('page_contents' as any)
        .select('*')
        .eq('page_id', pageId)
        .single();
      
      if (contentError) {
        // If no content exists yet, just use an empty array
        if (contentError.code === 'PGRST116') {
          setPageContent([]);
        } else {
          throw contentError;
        }
      } else if (contentData) {
        // Safely access content property
        const typedContent = contentData as unknown as PageContent;
        setPageContent(typedContent.content || []);
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
      const { data: existingContent, error: checkError } = await supabase
        .from('page_contents' as any)
        .select('*')
        .eq('page_id', pageId)
        .single();
      
      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }
      
      const typedContent = existingContent as unknown as PageContent;
      
      if (typedContent && typedContent.id) {
        // Update existing record
        const { error } = await supabase
          .from('page_contents' as any)
          .update({ 
            content,
            updated_at: new Date().toISOString()
          })
          .eq('id', typedContent.id);
          
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
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Top header with back and page title */}
      <header className="bg-white border-b border-gray-200 p-2 flex items-center">
        <Link to="/dashboard" className="flex items-center text-gray-600 hover:text-gray-900">
          <ChevronLeft className="w-5 h-5 mr-1" />
          <span>Back to Dashboard</span>
        </Link>
        <div className="h-5 border-r border-gray-300 mx-3"></div>
        <h1 className="text-lg font-medium flex-1">
          {loading ? "Loading..." : pageData ? `Editing: ${pageData.title}` : "Page Builder"}
        </h1>
      </header>
      
      {/* Main toolbar with responsive controls and actions */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="icon" title="Undo" disabled>
            <Undo className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" title="Redo" disabled>
            <Redo className="w-4 h-4" />
          </Button>
          <div className="h-6 border-r border-gray-300 mx-1"></div>
          <div className="flex items-center border rounded overflow-hidden">
            <Button 
              variant="ghost"
              size="icon"
              className={cn("rounded-none border-r border-gray-200", 
                viewMode === "mobile" && "bg-gray-100")}
              title="Mobile view"
              onClick={() => setViewMode("mobile")}
            >
              <Smartphone className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost"
              size="icon"
              className={cn("rounded-none border-r border-gray-200", 
                viewMode === "tablet" && "bg-gray-100")}
              title="Tablet view"
              onClick={() => setViewMode("tablet")}
            >
              <Tablet className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost"
              size="icon"
              className={cn("rounded-none", 
                viewMode === "desktop" && "bg-gray-100")}
              title="Desktop view"
              onClick={() => setViewMode("desktop")}
            >
              <Monitor className="w-4 h-4" />
            </Button>
          </div>
          <Button 
            variant={showLibrary ? "default" : "outline"} 
            size="sm" 
            className="gap-1"
            onClick={() => setShowLibrary(!showLibrary)}
          >
            <LayoutGrid className="w-4 h-4" />
            {showLibrary ? "Hide" : "Show"} Library
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => window.open(`/${pageData?.slug}`, '_blank')}
            variant="outline" 
            size="sm"
            disabled={!pageData?.published}
            className="gap-1"
          >
            <Eye className="w-4 h-4" />
            Preview
          </Button>
          <Button 
            variant="default"
            size="sm" 
            disabled={loading}
            className="gap-1"
            onClick={() => handleSave(pageContent)}
          >
            <Save className="w-4 h-4" />
            Save
          </Button>
          <Button 
            variant="outline"
            size="sm" 
            className="gap-1"
          >
            <Settings className="w-4 h-4" />
            Page Settings
          </Button>
        </div>
      </div>
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex-1 flex">
          <EditorCanvas 
            initialComponents={pageContent}
            onChange={setPageContent}
            viewMode={viewMode}
            showLibrary={showLibrary}
          />
        </div>
      </DragDropContext>
    </div>
  );
};

export default PageBuilder;
