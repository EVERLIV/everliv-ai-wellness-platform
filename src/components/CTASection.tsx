
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-16 bg-green-50 border-t border-green-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 font-heading">
            Начните свой путь к оптимальному здоровью и долголетию сегодня
          </h2>
          <p className="text-md text-gray-600 mb-8 max-w-2xl mx-auto">
            Присоединяйтесь к тысячам людей, которые уже используют EVERLIV для достижения своих целей в области здоровья.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
            <Link to="/signup">
              <Button className="rounded-3xl bg-primary hover:bg-secondary text-white font-medium px-8 py-6 text-lg">
                Начать бесплатно
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" className="rounded-3xl border-primary text-primary hover:bg-primary hover:text-white font-medium px-8 py-6 text-lg">
                Связаться с нами
                <ArrowRight className="ml-1 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
