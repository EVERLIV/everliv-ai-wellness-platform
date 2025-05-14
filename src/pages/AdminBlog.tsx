
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import BlogManagement from "@/components/blog/BlogManagement";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminBlog = () => {
  const { isAdmin, isLoading } = useIsAdmin();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isLoading && !isAdmin) {
      navigate("/dashboard");
    }
  }, [isAdmin, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-evergreen-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 pt-24">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm" className="gap-1">
                <ArrowLeft className="w-4 h-4" />
                Вернуться в панель управления
              </Button>
            </Link>
          </div>
          
          <div className="bg-white shadow rounded-lg p-6">
            <BlogManagement />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminBlog;
