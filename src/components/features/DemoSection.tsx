
import { Button } from "@/components/ui/button";

const DemoSection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-everliv-800">
            Увидеть платформу в действии
          </h2>
          <p className="text-lg mb-8 text-gray-600">
            Запишитесь на персональную демонстрацию с нашим экспертом, чтобы узнать, как EVERLIV может помочь именно вам.
          </p>
          <Button className="bg-everliv-600 hover:bg-everliv-700 text-white" size="lg">
            Записаться на демонстрацию
          </Button>
        </div>
      </div>
    </section>
  );
};

export default DemoSection;
