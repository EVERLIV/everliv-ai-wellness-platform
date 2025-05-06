
import { Button } from "@/components/ui/button";

const ContactForm = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-everliv-800">Отправьте нам сообщение</h2>
      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="firstName" className="text-gray-700 font-medium">Имя</label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-everliv-500 focus:border-everliv-500"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="lastName" className="text-gray-700 font-medium">Фамилия</label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-everliv-500 focus:border-everliv-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-gray-700 font-medium">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-everliv-500 focus:border-everliv-500"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="subject" className="text-gray-700 font-medium">Тема</label>
          <select
            id="subject"
            name="subject"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-everliv-500 focus:border-everliv-500"
          >
            <option value="">Выберите тему обращения</option>
            <option value="general">Общий вопрос</option>
            <option value="support">Техническая поддержка</option>
            <option value="billing">Вопросы оплаты</option>
            <option value="partnership">Партнерство</option>
            <option value="press">Пресса и медиа</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="message" className="text-gray-700 font-medium">Сообщение</label>
          <textarea
            id="message"
            name="message"
            rows={5}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-everliv-500 focus:border-everliv-500"
          ></textarea>
        </div>

        <div className="flex items-start">
          <input
            id="privacy"
            name="privacy"
            type="checkbox"
            className="mt-1 mr-2"
          />
          <label htmlFor="privacy" className="text-sm text-gray-600">
            Я согласен с <a href="/privacy-policy" className="text-everliv-600 hover:underline">Политикой конфиденциальности</a> и даю разрешение на обработку моих персональных данных
          </label>
        </div>

        <Button className="bg-everliv-600 hover:bg-everliv-700 text-white" size="lg">
          Отправить сообщение
        </Button>
      </form>
    </div>
  );
};

export default ContactForm;
