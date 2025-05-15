
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import BlogManagement from "@/components/blog/BlogManagement";

const AdminBlog = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 pt-24">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <Link to="/admin/dashboard">
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
