
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Star } from 'lucide-react';

interface ServiceCardProps {
  service: {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    icon: React.ReactNode;
    image: string;
    features: string[];
    benefits: string[];
    link: string;
  };
  index: number;
}

const ServiceCard = ({ service, index }: ServiceCardProps) => {
  return (
    <div className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}>
      {/* Content */}
      <div className="lg:w-1/2 space-y-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-primary/10 rounded-xl text-primary">
            {service.icon}
          </div>
          <div>
            <h3 className="text-2xl md:text-3xl font-bold">{service.title}</h3>
            <p className="text-primary font-medium">{service.subtitle}</p>
          </div>
        </div>

        <p className="text-gray-700 text-lg leading-relaxed">
          {service.description}
        </p>

        {/* Features */}
        <div className="space-y-4">
          <h4 className="text-xl font-semibold">Возможности:</h4>
          <div className="grid grid-cols-1 gap-2">
            {service.features.map((feature, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="space-y-4">
          <h4 className="text-xl font-semibold">Преимущества:</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {service.benefits.map((benefit, i) => (
              <div key={i} className="flex items-start gap-3">
                <Star className="h-4 w-4 text-yellow-500 mt-1 flex-shrink-0" />
                <span className="text-gray-700 text-sm">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        <Link to={service.link}>
          <Button className="bg-primary hover:bg-primary/90 text-white">
            Попробовать сервис
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Image */}
      <div className="lg:w-1/2">
        <div className="relative">
          <img 
            src={service.image}
            alt={service.title}
            className="rounded-2xl shadow-2xl w-full h-[400px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
