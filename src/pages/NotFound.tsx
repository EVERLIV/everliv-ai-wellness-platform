import React from "react";
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
const NotFound = () => {
  const location = useLocation();
  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);
  return <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow flex items-center justify-center bg-gray-50 py-20 px-4 my-0">
        <div className="text-center max-w-xl py-[100px]">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gray-800">404</h1>
          <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-gray-700">Страница не найдена</h2>
          <p className="text-lg text-gray-600 mb-8">
            Извините, страница, которую вы ищете, не существует или была перемещена.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button className="px-6">Вернуться на главную</Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" className="px-6">Связаться с поддержкой</Button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>;
};
export default NotFound;