
import React from 'react';
import { BookOpen, GraduationCap, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const ScientificBasisSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-10 items-center">
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold mb-4">Научное обоснование</h2>
            <p className="text-gray-600 mb-6">
              Все методики и рекомендации платформы EVERLIV основаны на научных исследованиях и клинических испытаниях. 
              Наши специалисты постоянно следят за последними достижениями медицины и внедряют только доказанно эффективные подходы.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <div className="mr-4 mt-1">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Обширная база исследований</h3>
                  <p className="text-gray-600 text-sm">Мы опираемся на тысячи исследований из ведущих медицинских журналов</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="mr-4 mt-1">
                  <GraduationCap className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Экспертный совет</h3>
                  <p className="text-gray-600 text-sm">Наши методики проверяются советом врачей и ученых со степенями MD и PhD</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="mr-4 mt-1">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Доказанная эффективность</h3>
                  <p className="text-gray-600 text-sm">Мы включаем только те подходы, которые имеют научно доказанный эффект</p>
                </div>
              </div>
            </div>
            
            <Link to="/science">
              <Button className="rounded-full px-8">Узнать больше о науке</Button>
            </Link>
          </div>
          
          <div className="md:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80" 
              alt="Научные исследования" 
              className="rounded-lg shadow-lg w-full h-auto object-cover"
              style={{ maxHeight: '450px' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScientificBasisSection;
