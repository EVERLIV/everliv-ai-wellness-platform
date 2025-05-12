
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  coverImage?: string;
  author: {
    name: string;
    avatar?: string;
  };
  date: string;
  readTime: string;
}

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      {post.coverImage && (
        <div className="w-full h-48 overflow-hidden">
          <img 
            src={post.coverImage} 
            alt={post.title} 
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <CardContent className="p-6">
        <div className="flex items-center text-sm text-gray-500 space-x-4 mb-3">
          <span className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {post.date}
          </span>
          <span className="flex items-center">
            <User className="h-4 w-4 mr-1" />
            {post.author.name}
          </span>
          <span>{post.readTime}</span>
        </div>
        <Link to={`/blog/${post.id}`}>
          <h3 className="text-xl font-semibold mb-2 hover:text-primary transition-colors">
            {post.title}
          </h3>
        </Link>
        <p className="text-gray-600 mb-4">
          {post.excerpt}
        </p>
        <div className="flex items-center justify-between">
          <span className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full">
            {post.category}
          </span>
          <Link to={`/blog/${post.id}`}>
            <Button variant="link" className="p-0 h-auto font-medium">
              Читать далее
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default BlogCard;
