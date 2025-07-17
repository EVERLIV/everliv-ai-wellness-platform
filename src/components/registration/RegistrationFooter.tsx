
import { Link } from "react-router-dom";

const RegistrationFooter = () => {
  return (
    <footer className="bg-white border-t border-gray-100 py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
          <div className="mb-4 md:mb-0">
            © 2024 EVERLIV. Все права защищены.
          </div>
          <div className="flex space-x-6">
            <Link to="/terms" className="hover:text-primary transition-colors">Условия использования</Link>
            <Link to="/privacy" className="hover:text-primary transition-colors">Конфиденциальность</Link>
            <Link to="/contact" className="hover:text-primary transition-colors">Поддержка</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default RegistrationFooter;
