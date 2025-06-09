
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Bell, Plus } from "lucide-react";

const Header: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };
  
  if (!user) {
    return null;
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Left side - Dashboard title */}
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-blue-500 rounded"></div>
          <h1 className="text-lg font-semibold text-gray-900">My Dashboard</h1>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </Button>
          <Button className="gap-2 bg-red-500 hover:bg-red-600 text-white">
            <Plus className="h-4 w-4" />
            Upgrade
          </Button>
          <Button variant="outline" size="sm" onClick={handleSignOut}>
            Выйти
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
