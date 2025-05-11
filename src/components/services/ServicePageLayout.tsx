
import React, { ReactNode } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';
import { ServicePageProps, BenefitProps, ServiceHeroProps } from './ServicePageLayout.d';

const ServicePageLayout: React.FC<ServicePageProps> = ({
  hero,
  benefits,
  scientificBackground,
  protocols,
  casesStudies,
  visualElement,
  faq
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-primary/10 to-secondary/5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-secondary mb-4">
                  {hero.title}
                </h1>
                <h2 className="text-xl md:text-2xl font-medium text-primary mb-6">
                  {hero.subtitle}
                </h2>
                <p className="text-gray-700 text-lg mb-8">
                  {hero.description}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg">Записаться на консультацию</Button>
                  <Button variant="outline" size="lg">
                    Узнать подробнее
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex justify-center lg:justify-end">
                {hero.imageSrc ? (
                  <img 
                    src={hero.imageSrc} 
                    alt={hero.imageAlt || hero.title} 
                    className="rounded-lg shadow-lg max-h-[400px] object-cover"
                  />
                ) : (
                  <div className="bg-gray-200 rounded-lg w-full h-[400px] flex items-center justify-center">
                    <span className="text-gray-500">Изображение</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Преимущества и эффекты</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <Card key={index} className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col items-center text-center">
                    {benefit.icon && <div className="mb-4 text-primary">{benefit.icon}</div>}
                    <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Scientific Background Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Научное обоснование</h2>
            <div className="prose prose-lg max-w-none">
              {scientificBackground}
            </div>
          </div>
        </section>

        {/* Visualization Element */}
        {visualElement && (
          <section className="py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-center">
                {visualElement}
              </div>
            </div>
          </section>
        )}

        {/* Protocols Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Практические протоколы</h2>
            <div className="max-w-4xl mx-auto">
              {protocols}
            </div>
          </div>
        </section>

        {/* Case Studies Section */}
        <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Кейсы и результаты</h2>
            <div className="max-w-4xl mx-auto">
              {casesStudies}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        {faq && faq.length > 0 && (
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Часто задаваемые вопросы</h2>
              <div className="max-w-4xl mx-auto">
                <div className="space-y-6">
                  {faq.map((item, index) => (
                    <div key={index} className="border-b border-gray-200 pb-6">
                      <h3 className="text-xl font-semibold mb-3">{item.question}</h3>
                      <div className="text-gray-700">{item.answer}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-16 bg-secondary/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Готовы начать свой путь к долголетию?</h2>
            <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
              Запишитесь на персональную консультацию с нашими экспертами и получите индивидуальную программу оздоровления
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg">Записаться на консультацию</Button>
              <Button variant="outline" size="lg">Узнать о тарифах</Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ServicePageLayout;
