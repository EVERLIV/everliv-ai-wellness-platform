
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const ContactCTA = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-everliv-800">
            Не нашли ответ на свой вопрос?
          </h2>
          <p className="text-lg mb-8 text-gray-600">
            Наша команда всегда готова помочь вам с любыми вопросами о платформе EVERLIV.
            Свяжитесь с нами, и мы ответим в течение 24 часов.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/contact">
              <Button className="bg-everliv-600 hover:bg-everliv-700 text-white" size="lg">
                Написать нам
              </Button>
            </Link>
            <Button variant="outline" className="border-everliv-600 text-everliv-600 hover:bg-everliv-50" size="lg">
              <a href="mailto:support@everliv.com">support@everliv.com</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactCTA;
