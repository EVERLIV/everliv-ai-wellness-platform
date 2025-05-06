
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  image: string;
  date: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
}

const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "5 ключевых биомаркеров, которые нужно отслеживать для долголетия",
    excerpt: "Узнайте о главных показателях крови, которые могут предсказать ваше долголетие и как их оптимизировать для лучших результатов.",
    category: "research",
    image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80",
    date: "12 мая 2023",
    author: {
      name: "Др. Елена Иванова",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100",
      role: "Медицинский эксперт"
    }
  },
  {
    id: "2",
    title: "Как интерпретировать свой анализ крови: руководство для непрофессионалов",
    excerpt: "Практическое руководство, которое поможет вам разобраться в результатах лабораторных исследований без медицинского образования.",
    category: "guide",
    image: "https://images.unsplash.com/photo-1579165466741-7f35e4755660?auto=format&fit=crop&q=80",
    date: "3 июня 2023",
    author: {
      name: "Михаил Смирнов",
      avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&q=80&w=100",
      role: "Медицинский аналитик"
    }
  },
  {
    id: "3",
    title: "История успеха: как Анна победила хроническую усталость с помощью EVERLIV",
    excerpt: "Реальная история пользователя, которая смогла выявить скрытые проблемы со здоровьем и вернуться к полноценной жизни.",
    category: "success",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80",
    date: "17 июля 2023",
    author: {
      name: "Анна Петрова",
      avatar: "https://images.unsplash.com/photo-1561406636-b80293969660?auto=format&fit=crop&q=80&w=100",
      role: "Пользователь EVERLIV"
    }
  },
  {
    id: "4",
    title: "Новейшие исследования о метформине и его влиянии на долголетие",
    excerpt: "Обзор последних научных данных о потенциале метформина как геропротектора и его безопасности для здоровых людей.",
    category: "research",
    image: "https://images.unsplash.com/photo-1585435557481-3f9dae9a5eff?auto=format&fit=crop&q=80",
    date: "21 августа 2023",
    author: {
      name: "Др. Алексей Соколов",
      avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=100",
      role: "Научный консультант"
    }
  }
];

interface BlogListProps {
  category?: string;
}

const BlogList = ({ category = "all" }: BlogListProps) => {
  const filteredPosts = category === "all" 
    ? blogPosts 
    : blogPosts.filter(post => post.category === category);

  return (
    <div className="space-y-8">
      {filteredPosts.map((post) => (
        <Card key={post.id} className="overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/3">
              <img 
                src={post.image} 
                alt={post.title}
                className="w-full h-full object-cover aspect-video md:aspect-auto"
              />
            </div>
            <div className="md:w-2/3 flex flex-col">
              <CardHeader>
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <span className="capitalize">{post.category}</span>
                  <span className="mx-2">•</span>
                  <span>{post.date}</span>
                </div>
                <CardTitle className="text-xl font-bold hover:text-everliv-600 transition-colors">
                  <Link to={`/blog/${post.id}`}>
                    {post.title}
                  </Link>
                </CardTitle>
                <CardDescription className="line-clamp-2">{post.excerpt}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="flex items-center">
                  <img 
                    src={post.author.avatar} 
                    alt={post.author.name}
                    className="w-10 h-10 rounded-full mr-3 object-cover"
                  />
                  <div>
                    <p className="text-sm font-medium">{post.author.name}</p>
                    <p className="text-xs text-muted-foreground">{post.author.role}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link to={`/blog/${post.id}`}>
                  <Button variant="outline" className="text-everliv-600 border-everliv-600 hover:bg-everliv-50">
                    Читать статью
                  </Button>
                </Link>
              </CardFooter>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default BlogList;
