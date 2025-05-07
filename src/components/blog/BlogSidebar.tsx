
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

interface BlogSidebarProps {
  onCategoryChange: (category: string) => void;
}

const BlogSidebar = ({ onCategoryChange }: BlogSidebarProps) => {
  const [categories, setCategories] = useState([
    { id: "all", name: "Все статьи" },
    { id: "research", name: "Исследования" },
    { id: "guide", name: "Практические советы" },
    { id: "success", name: "Истории успеха" },
    { id: "interview", name: "Интервью с экспертами" },
    { id: "news", name: "Новости" }
  ]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [email, setEmail] = useState("");

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
    onCategoryChange(categoryId);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would handle the newsletter subscription
    // For now we'll just reset the field and show a confirmation
    alert(`Спасибо за подписку! ${email}`);
    setEmail("");
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 text-secondary font-heading">Категории</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={`w-full text-left py-2 px-3 rounded transition-colors duration-300 ${
                activeCategory === category.id 
                  ? "bg-accent text-secondary font-medium" 
                  : "text-gray-700 hover:bg-accent hover:text-secondary"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-secondary via-primary to-primary/90 p-6 rounded-xl text-white">
        <h3 className="text-lg font-semibold mb-3 font-heading">Подпишитесь на рассылку</h3>
        <p className="text-white/90 text-sm mb-4">Получайте свежие статьи и исследования о здоровье и долголетии</p>
        <form onSubmit={handleSubscribe}>
          <Input
            type="email"
            placeholder="Ваш email"
            className="w-full px-3 py-2 rounded mb-3 text-gray-900 text-sm bg-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit" className="w-full bg-white text-secondary hover:bg-gray-50">
            Подписаться
          </Button>
        </form>
      </div>
    </div>
  );
};

export default BlogSidebar;
