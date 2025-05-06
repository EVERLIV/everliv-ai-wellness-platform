
import { Button } from "@/components/ui/button";

interface BlogSidebarProps {
  onCategoryChange: (category: string) => void;
}

const BlogSidebar = ({ onCategoryChange }: BlogSidebarProps) => {
  const categories = [
    { id: "all", name: "Все статьи" },
    { id: "research", name: "Исследования" },
    { id: "guide", name: "Практические советы" },
    { id: "success", name: "Истории успеха" },
    { id: "interview", name: "Интервью с экспертами" }
  ];

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 text-everliv-800">Категории</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className="w-full text-left py-2 px-3 rounded hover:bg-everliv-50 text-gray-700 hover:text-everliv-600 transition-colors"
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-everliv-700 to-everliv-800 p-6 rounded-lg text-white">
        <h3 className="text-lg font-semibold mb-3">Подпишитесь на рассылку</h3>
        <p className="text-white/80 text-sm mb-4">Получайте свежие статьи и исследования о здоровье и долголетии</p>
        <input
          type="email"
          placeholder="Ваш email"
          className="w-full px-3 py-2 rounded mb-3 text-gray-900 text-sm"
        />
        <Button className="w-full bg-white text-everliv-800 hover:bg-gray-100">
          Подписаться
        </Button>
      </div>
    </div>
  );
};

export default BlogSidebar;
