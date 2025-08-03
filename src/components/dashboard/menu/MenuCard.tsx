import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/design-system/components/Card';

interface MenuCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
}

const MenuCard: React.FC<MenuCardProps> = ({ icon, title, description, href }) => {
  return (
    <Link to={href}>
      <Card 
        variant="elevated" 
        hover="lift" 
        interactive={true}
        className="group active:scale-95 transition-all"
      >
        <CardContent className="space-y-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-brand-secondary/10 rounded-lg flex items-center justify-center text-brand-secondary group-hover:bg-brand-secondary/20 transition-colors">
              {icon}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1 group-hover:text-brand-primary transition-colors">{title}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-brand-primary transition-colors" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default MenuCard;