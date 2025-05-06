
const ContactInfo = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-everliv-800">Контактная информация</h2>
      
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-2 text-everliv-700">Служба поддержки</h3>
          <p className="text-gray-600 mb-2">Мы отвечаем на все запросы в течение 24 часов.</p>
          <p className="text-everliv-600 font-medium">support@everliv.com</p>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2 text-everliv-700">Для прессы и медиа</h3>
          <p className="text-gray-600 mb-2">Запросы на интервью и комментарии экспертов.</p>
          <p className="text-everliv-600 font-medium">press@everliv.com</p>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2 text-everliv-700">Партнерские отношения</h3>
          <p className="text-gray-600 mb-2">Для обсуждения сотрудничества с нами.</p>
          <p className="text-everliv-600 font-medium">partners@everliv.com</p>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2 text-everliv-700">Телефон</h3>
          <p className="text-everliv-600 font-medium">+7 (800) 123-45-67</p>
          <p className="text-gray-600 text-sm">Пн-Пт, 9:00 - 18:00 (МСК)</p>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2 text-everliv-700">Офис</h3>
          <p className="text-gray-600">
            123456, Россия, Москва<br />
            ул. Инновационная, д. 42<br />
            Технопарк "Сколково"
          </p>
        </div>
      </div>
      
      <div className="mt-12">
        <h3 className="text-lg font-semibold mb-4 text-everliv-700">Следите за нами</h3>
        <div className="flex space-x-4">
          {/* Social media icons */}
          <a href="#" className="bg-gray-100 hover:bg-everliv-100 p-3 rounded-full transition-colors">
            <svg className="w-5 h-5 text-everliv-600" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </a>
          <a href="#" className="bg-gray-100 hover:bg-everliv-100 p-3 rounded-full transition-colors">
            <svg className="w-5 h-5 text-everliv-600" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 5.89a8.32 8.32 0 0 1-2.57.7 4.63 4.63 0 0 0 2-2.52 9.29 9.29 0 0 1-2.85 1.1 4.56 4.56 0 0 0-7.93 3.13c0 .39 0 .73.08 1.09a12.94 12.94 0 0 1-9.47-4.84 4.57 4.57 0 0 0 1.41 6.13A4.53 4.53 0 0 1 1 9.86v.06a4.6 4.6 0 0 0 3.66 4.52 4.8 4.8 0 0 1-1.2.14 4.18 4.18 0 0 1-.87-.08 4.69 4.69 0 0 0 4.28 3.22 9.32 9.32 0 0 1-5.69 1.94 9 9 0 0 1-1.1-.06 12.94 12.94 0 0 0 7.01 2.04c8.43 0 13-7 13-13 0-.2 0-.39-.02-.59a9.23 9.23 0 0 0 2.27-2.36z" />
            </svg>
          </a>
          <a href="#" className="bg-gray-100 hover:bg-everliv-100 p-3 rounded-full transition-colors">
            <svg className="w-5 h-5 text-everliv-600" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zM8.339 18.337H5.667v-8.59h2.672v8.59zM7.003 8.574a1.548 1.548 0 1 1 0-3.096 1.548 1.548 0 0 1 0 3.096zm11.335 9.763h-2.669v-4.177c0-.996-.017-2.278-1.387-2.278-1.389 0-1.601 1.086-1.601 2.206v4.249h-2.667v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.779 3.203 4.092v4.711z" />
            </svg>
          </a>
          <a href="#" className="bg-gray-100 hover:bg-everliv-100 p-3 rounded-full transition-colors">
            <svg className="w-5 h-5 text-everliv-600" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2a10 10 0 0 0-3.16 19.5c.5.08.66-.23.66-.5v-1.69c-2.88.62-3.5-1.39-3.5-1.39-.47-1.17-1.16-1.47-1.16-1.47-.95-.65.07-.64.07-.64 1.05.07 1.63 1.06 1.63 1.06.93 1.58 2.43 1.13 3.01.86.1-.67.37-1.13.67-1.39-2.35-.25-4.82-1.17-4.82-5.2 0-1.15.39-2.08 1.03-2.82-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02.8-.23 1.65-.33 2.5-.34.85.01 1.7.11 2.5.34 1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.74 1.03 1.67 1.03 2.82 0 4.04-2.47 4.95-4.83 5.21.38.32.72.97.72 1.95l-.01 2.89c0 .27.16.59.67.5A10 10 0 0 0 12 2z" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
