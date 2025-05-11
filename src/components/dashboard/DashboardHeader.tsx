
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User } from "lucide-react";

const DashboardHeader = () => {
  return (
    <div className="bg-white border-b border-gray-200 my-[20px]">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex gap-2">
          <Link to="/my-protocols">
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Мои протоколы
            </Button>
          </Link>
          <Link to="/profile">
            <Button variant="outline" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Мой профиль
            </Button>
          </Link>
          <Link to="/">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Вернуться на главную
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
