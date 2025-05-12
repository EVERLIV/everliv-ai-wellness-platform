
import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import BlogCard, { BlogPost } from "@/components/blog/BlogCard";

const mockPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Интервальное голодание: научный подход к омоложению',
    excerpt: 'Узнайте, как интервальное голодание может активировать механизмы самовосстановления организма и замедлить процессы старения.',
    category: 'Питание',
    coverImage: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&q=80&w=800',
    author: {
      name: 'Елена Соколова',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    date: '10 мая 2024',
    readTime: '7 мин чтения'
  },
  {
    id: '2',
    title: 'Как холодовой стресс активирует защитные механизмы организма',
    excerpt: 'Исследования показывают, что регулярное воздействие холода может улучшить иммунитет, метаболизм и даже продлить жизнь.',
    category: 'Терапия',
    coverImage: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?auto=format&q=80&w=800',
    author: {
      name: 'Михаил Громов',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    date: '2 мая 2024',
    readTime: '5 мин чтения'
  },
  {
    id: '3',
    title: 'Биомаркеры старения: что важно отслеживать после 35 лет',
    excerpt: 'Регулярный мониторинг ключевых биомаркеров может помочь выявить и предотвратить возрастные изменения на ранних стадиях.',
    category: 'Диагностика',
    coverImage: 'https://images.unsplash.com/photo-1579165466949-3180a3d056d5?auto=format&q=80&w=800',
    author: {
      name: 'Анна Петрова',
      avatar: 'https://randomuser.me/api/portraits/women/65.jpg'
    },
    date: '25 апреля 2024',
    readTime: '9 мин чтения'
  },
  {
    id: '4',
    title: 'Сон и долголетие: почему качественный отдых так важен',
    excerpt: 'Последние научные данные о связи между качеством сна и продолжительностью жизни. Практические советы для улучшения сна.',
    category: 'Образ жизни',
    coverImage: 'https://images.unsplash.com/photo-1511295742362-92c96b312d31?auto=format&q=80&w=800',
    author: {
      name: 'Сергей Волков',
      avatar: 'https://randomuser.me/api/portraits/men/22.jpg'
    },
    date: '18 апреля 2024',
    readTime: '6 мин чтения'
  },
  {
    id: '5',
    title: 'Нейропластичность: как тренировать мозг для долгой активности',
    excerpt: 'Научные методы и упражнения для поддержания когнитивных функций и предотвращения возрастных нарушений памяти.',
    category: 'Нейронаука',
    coverImage: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&q=80&w=800',
    author: {
      name: 'Ирина Соловьева',
      avatar: 'https://randomuser.me/api/portraits/women/28.jpg'
    },
    date: '10 апреля 2024',
    readTime: '8 мин чтения'
  },
  {
    id: '6',
    title: 'Персонализированная медицина: будущее здравоохранения уже наступило',
    excerpt: 'Как искусственный интеллект и генетический анализ меняют подход к диагностике и лечению заболеваний.',
    category: 'Технологии',
    coverImage: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&q=80&w=800',
    author: {
      name: 'Александр Иванов',
      avatar: 'https://randomuser.me/api/portraits/men/54.jpg'
    },
    date: '3 апреля 2024',
    readTime: '10 мин чтения'
  }
];

const categories = [
  "Все", "Питание", "Терапия", "Диагностика", "Образ жизни", "Нейронаука", "Технологии"
];

const BlogPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Все');

  const filteredPosts = mockPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                       post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'Все' || post.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24 bg-gray-50">
        <section className="py-16 bg-gradient-to-b from-primary/10 to-transparent">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Блог EVERLIV</h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Актуальные исследования, практические советы и экспертные мнения в области здорового долголетия
            </p>
            
            <div className="mt-8 max-w-lg mx-auto relative">
              <Input 
                type="text" 
                placeholder="Поиск статей..." 
                className="w-full pl-12 pr-4 py-3 text-lg rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
          </div>
        </section>
        
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
              {categories.map(category => (
                <Button 
                  key={category}
                  variant={activeCategory === category ? "default" : "outline"}
                  className="rounded-full"
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
            
            {filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map(post => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <h3 className="text-xl font-semibold mb-2">По вашему запросу ничего не найдено</h3>
                <p className="text-gray-600 mb-6">Попробуйте изменить поисковый запрос или категорию</p>
                <Button onClick={() => { setSearchTerm(''); setActiveCategory('Все'); }}>
                  Показать все статьи
                </Button>
              </div>
            )}
            
            <div className="mt-12 text-center">
              <Button variant="outline" size="lg">
                Загрузить еще статьи
              </Button>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <Card className="max-w-4xl mx-auto">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold mb-2">Подпишитесь на нашу рассылку</h2>
                  <p className="text-gray-600">
                    Получайте свежие статьи, исследования и практические советы по здоровому долголетию
                  </p>
                </div>
                
                <form className="flex flex-col md:flex-row gap-4">
                  <Input 
                    type="email" 
                    placeholder="Ваш email" 
                    className="md:flex-grow" 
                    required
                  />
                  <Button type="submit" className="whitespace-nowrap">
                    Подписаться
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPage;
