
import { useState } from 'react';

interface Testimonial {
  content: string;
  author: string;
  role: string;
  avatar: string;
}

export default function TestimonialsSection() {
  const testimonials: Testimonial[] = [
    {
      content: "EVERLIV помог мне понять мои анализы крови и разработать план по улучшению показателей. Через 6 месяцев мои маркеры здоровья значительно улучшились. Это революционный подход к здоровью!",
      author: "Елена К.",
      role: "Пользователь EVERLIV",
      avatar: "https://randomuser.me/api/portraits/women/32.jpg",
    },
    {
      content: "Как врач, я рекомендую EVERLIV своим пациентам. Платформа предоставляет научно обоснованные рекомендации и помогает пациентам лучше понять свое здоровье, что приводит к более продуктивным визитам.",
      author: "Дмитрий М.",
      role: "Терапевт, к.м.н.",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    },
    {
      content: "В 55 лет я обнаружил признаки метаболических нарушений. EVERLIV помог мне составить план питания и физических нагрузок. Через год мои показатели вернулись в норму, и я чувствую себя на 10 лет моложе!",
      author: "Александр В.",
      role: "Пользователь EVERLIV",
      avatar: "https://randomuser.me/api/portraits/men/22.jpg",
    },
    {
      content: "Я всегда интересовалась превентивной медициной. EVERLIV стала идеальным инструментом для поддержания здоровья. Персонализированные рекомендации по добавкам особенно ценны.",
      author: "Мария Л.",
      role: "Пользователь EVERLIV",
      avatar: "https://randomuser.me/api/portraits/women/17.jpg",
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
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="heading-lg mb-6">Что говорят наши пользователи</h2>
          <p className="text-lg text-gray-600">
            Узнайте, как EVERLIV помогает людям улучшать здоровье и качество жизни с помощью персонализированных рекомендаций.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Main Testimonial */}
          <div className="bg-white rounded-2xl shadow-soft p-6 md:p-10 border border-gray-100">
            <div className="flex flex-col items-center text-center">
              <svg className="h-12 w-12 text-everliv-200 mb-6" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
              </svg>
              
              <blockquote className="mb-6 text-xl md:text-2xl text-gray-800 font-medium">
                "{testimonials[activeIndex].content}"
              </blockquote>
              
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
            </div>
          </div>
          
          {/* Navigation Controls */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 -ml-4 sm:-ml-6">
            <button 
              onClick={handlePrev}
              className="h-10 w-10 rounded-full bg-white shadow-soft flex items-center justify-center text-gray-600 hover:text-everliv-600 focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
          </div>
          <div className="absolute top-1/2 -translate-y-1/2 right-0 -mr-4 sm:-mr-6">
            <button 
              onClick={handleNext}
              className="h-10 w-10 rounded-full bg-white shadow-soft flex items-center justify-center text-gray-600 hover:text-everliv-600 focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
          
          {/* Dots navigation */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`h-2.5 w-2.5 rounded-full ${
                  activeIndex === index ? 'bg-everliv-600' : 'bg-gray-300'
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
