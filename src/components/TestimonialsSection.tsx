
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface Testimonial {
  content: string;
  author: string;
  role: string;
  avatar: string;
  beforeAfter?: {
    before: string;
    after: string;
  }
}

export default function TestimonialsSection() {
  const testimonials: Testimonial[] = [
    {
      content: "Последние 5 лет я страдал от хронической усталости. После 3 месяцев на EVERLIV с ледяными ваннами и дыхательными практиками, мои биомаркеры воспаления снизились на 60%, а энергия и концентрация вернулись!",
      author: "Александр В.",
      role: "Пользователь EVERLIV, 42 года",
      avatar: "https://randomuser.me/api/portraits/men/22.jpg",
      beforeAfter: {
        before: "СРБ: 12.4, ИЛ-6: высокий, кортизол: повышен",
        after: "СРБ: 1.8, ИЛ-6: норма, кортизол: в норме"
      }
    },
    {
      content: "Как врач-эндокринолог, я впечатлена детализацией анализов EVERLIV. Теперь рекомендую платформу пациентам для мониторинга их гормонального здоровья между визитами. Особенно полезны протоколы по голоданию.",
      author: "Елена К.",
      role: "Врач-эндокринолог, к.м.н.",
      avatar: "https://randomuser.me/api/portraits/women/32.jpg"
    },
    {
      content: "В 55 лет я обнаружил признаки метаболических нарушений. EVERLIV помог мне составить план питания и физических нагрузок. Через год мои показатели вернулись в норму, и я чувствую себя на 10 лет моложе!",
      author: "Дмитрий М.",
      role: "Пользователь EVERLIV",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
      beforeAfter: {
        before: "HbA1c: 6.4%, триглицериды: 2.8 ммоль/л",
        after: "HbA1c: 5.2%, триглицериды: 1.1 ммоль/л"
      }
    },
    {
      content: "Я всегда интересовалась превентивной медициной. EVERLIV стала идеальным инструментом для поддержания здоровья. Персонализированные рекомендации по добавкам и улучшению сна изменили мою жизнь.",
      author: "Мария Л.",
      role: "Пользователь EVERLIV",
      avatar: "https://randomuser.me/api/portraits/women/17.jpg",
      beforeAfter: {
        before: "Дефицит витамина D, нарушения сна",
        after: "Нормальный уровень витамина D, 7-8 часов качественного сна"
      }
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-6">Истории трансформации</h2>
          <p className="text-lg text-gray-600">
            Узнайте, как EVERLIV помогает людям улучшать здоровье и качество жизни с помощью персонализированных рекомендаций.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Main Testimonial */}
          <div className="bg-white rounded-2xl shadow-sm p-6 md:p-10 border border-gray-100">
            <div className="flex flex-col items-center text-center">
              <svg className="h-12 w-12 text-primary/30 mb-6" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
              </svg>
              
              <blockquote className="mb-6 text-xl md:text-2xl text-gray-800 font-medium">
                "{testimonials[activeIndex].content}"
              </blockquote>
              
              {testimonials[activeIndex].beforeAfter && (
                <div className="bg-gray-50 p-4 rounded-lg w-full max-w-lg mb-6">
                  <h4 className="font-medium mb-3 text-gray-700">Динамика показателей:</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-red-50 p-3 rounded">
                      <p className="font-medium text-red-700 mb-1">До:</p>
                      <p className="text-gray-700">{testimonials[activeIndex].beforeAfter?.before}</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded">
                      <p className="font-medium text-green-700 mb-1">После:</p>
                      <p className="text-gray-700">{testimonials[activeIndex].beforeAfter?.after}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex items-center">
                <img 
                  src={testimonials[activeIndex].avatar} 
                  alt={testimonials[activeIndex].author}
                  className="h-12 w-12 rounded-full object-cover mr-4"
                />
                <div className="text-left">
                  <div className="font-semibold text-gray-900">{testimonials[activeIndex].author}</div>
                  <div className="text-gray-600 text-sm">{testimonials[activeIndex].role}</div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-100 w-full">
                <Button 
                  variant="outline"
                  size="sm"
                  className="rounded-full text-xs"
                >
                  Поделиться этой историей
                </Button>
              </div>
            </div>
          </div>
          
          {/* Navigation Controls */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 -ml-4 sm:-ml-6">
            <Button 
              onClick={handlePrev}
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-600 hover:text-primary focus:outline-none"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </div>
          <div className="absolute top-1/2 -translate-y-1/2 right-0 -mr-4 sm:-mr-6">
            <Button 
              onClick={handleNext}
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-600 hover:text-primary focus:outline-none"
            >
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
          
          {/* Dots navigation */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`h-2.5 w-2.5 rounded-full ${
                  activeIndex === index ? 'bg-primary' : 'bg-gray-300'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
