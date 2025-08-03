import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MenuCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
}

const MenuCard: React.FC<MenuCardProps> = ({ icon, title, description, href }) => {
  return (
    <Link 
      to={href}
      className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 active:scale-95 transition-transform cursor-pointer block"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
        <ArrowRight className="w-5 h-5 text-gray-400" />
      </div>
    </Link>
  );
};

export default MenuCard;