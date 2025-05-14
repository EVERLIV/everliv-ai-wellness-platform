
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Trash2, Plus, ExternalLink, Eye, Copy } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Define types for our pages
interface Page {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  published: boolean;
}

const PageManagement = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      setLoading(true);
      
      // Use the "any" type temporarily until Supabase types are updated
      const { data, error } = await supabase
        .from('pages' as any)
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Cast the data to our Page type
      setPages(data as unknown as Page[] || []);
    } catch (error: any) {
      console.error('Error fetching pages:', error);
      toast({
        title: "Error loading pages",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (page?: Page) => {
    if (page) {
      setEditingPage(page);
      setTitle(page.title);
      setSlug(page.slug);
      setDescription(page.description || "");
    } else {
      setEditingPage(null);
      setTitle("");
      setSlug("");
      setDescription("");
    }
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setEditingPage(null);
  };

  const handleSlugChange = (value: string) => {
    // Convert to slug format (lowercase, replace spaces with dashes, remove special chars)
    const slugValue = value.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '');
    setSlug(slugValue);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const pageData = {
        title,
        slug,
        description,
        updated_at: new Date().toISOString()
      };

      if (editingPage) {
        // Use the "any" type temporarily until Supabase types are updated
        const { error } = await supabase
          .from('pages' as any)
          .update(pageData)
          .eq('id', editingPage.id);
          
        if (error) throw error;
        
        toast({
          title: "Page updated",
          description: "The page has been successfully updated"
        });
      } else {
        // Use the "any" type temporarily until Supabase types are updated
        const { error } = await supabase
          .from('pages' as any)
          .insert([{
            ...pageData,
            created_at: new Date().toISOString(),
            published: false
          }]);
          
        if (error) throw error;
        
        toast({
          title: "Page created",
          description: "The page has been successfully created"
        });
      }
      
      handleCloseDialog();
      fetchPages();
    } catch (error: any) {
      console.error('Error saving page:', error);
      toast({
        title: "Error saving page",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleDeletePage = async (pageId: string) => {
    if (!confirm("Are you sure you want to delete this page?")) return;
    
    try {
      // Use the "any" type temporarily until Supabase types are updated
      const { error } = await supabase
        .from('pages' as any)
        .delete()
        .eq('id', pageId);
      
      if (error) throw error;
      
      toast({
        title: "Page deleted",
        description: "The page has been successfully deleted"
      });
      
      fetchPages();
    } catch (error: any) {
      console.error('Error deleting page:', error);
      toast({
        title: "Error deleting page",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleTogglePublish = async (page: Page) => {
    try {
      // Use the "any" type temporarily until Supabase types are updated
      const { error } = await supabase
        .from('pages' as any)
        .update({ 
          published: !page.published,
          updated_at: new Date().toISOString()
        })
        .eq('id', page.id);
      
      if (error) throw error;
      
      toast({
        title: page.published ? "Page unpublished" : "Page published",
        description: `The page is now ${page.published ? "unpublished" : "published"}`
      });
      
      fetchPages();
    } catch (error: any) {
      console.error('Error updating page status:', error);
      toast({
        title: "Error updating page status",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDuplicatePage = async (page: Page) => {
    try {
      // Create a new title with "(Copy)" suffix
      const newTitle = `${page.title} (Copy)`;
      const newSlug = `${page.slug}-copy`;
      
      // Use the "any" type temporarily until Supabase types are updated
      const { error } = await supabase
        .from('pages' as any)
        .insert([{
          title: newTitle,
          slug: newSlug,
          description: page.description,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          published: false
        }]);
        
      if (error) throw error;
      
      toast({
        title: "Page duplicated",
        description: "A copy of the page has been created"
      });
      
      fetchPages();
    } catch (error: any) {
      console.error('Error duplicating page:', error);
      toast({
        title: "Error duplicating page",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Pages</h2>
        <Button onClick={() => handleOpenDialog()} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Page
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : pages.length === 0 ? (
        <div className="border border-dashed border-gray-300 rounded-lg p-12 text-center">
          <h3 className="text-xl font-medium mb-2">No pages found</h3>
          <p className="text-gray-500 mb-4">Create your first page to start building your website.</p>
          <Button onClick={() => handleOpenDialog()}>Create Page</Button>
        </div>
      ) : (
        <div className="bg-white rounded-md border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Title</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Slug</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Updated</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {pages.map((page) => (
                  <tr key={page.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium">{page.title}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">/{page.slug}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{formatDate(page.updated_at)}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        page.published 
                          ? "bg-green-100 text-green-800" 
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {page.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleTogglePublish(page)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          {page.published ? "Unpublish" : "Publish"}
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDuplicatePage(page)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        
                        <Button 
                          size="sm" 
                          variant="ghost"
                          asChild
                        >
                          <Link to={`/page-builder/${page.id}`}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                        
                        {page.published && (
                          <Button 
                            size="sm" 
                            variant="ghost"
                            asChild
                          >
                            <a href={`/${page.slug}`} target="_blank" rel="noopener noreferrer">
                              <Eye className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                        
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleDeletePage(page.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingPage ? "Edit Page" : "Create New Page"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title" 
                  value={title} 
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (!editingPage) handleSlugChange(e.target.value);
                  }}
                  placeholder="Page Title"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <div className="flex items-center">
                  <span className="text-gray-500 mr-1">/</span>
                  <Input 
                    id="slug" 
                    value={slug} 
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="page-url-slug"
                    pattern="[a-z0-9\-]+"
                    title="Only lowercase letters, numbers, and hyphens are allowed"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Input 
                  id="description" 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Page description"
                />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={handleCloseDialog}>Cancel</Button>
              <Button type="submit">{editingPage ? "Update" : "Create"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PageManagement;
