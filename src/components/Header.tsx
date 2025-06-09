
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { Menu, X } from "lucide-react";
import Logo from "./header/Logo";
import DesktopNavigation from "./header/DesktopNavigation";
import UserProfileDropdown from "./header/UserProfileDropdown";
import MobileMenu from "./header/MobileMenu";

const Header: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isAdmin } = useIsAdmin();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <div className="hidden md:flex">
            <DesktopNavigation user={user} isAdmin={isAdmin} />
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <UserProfileDropdown user={user} isAdmin={isAdmin} onSignOut={handleSignOut} />
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">Войти</Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm">Регистрация</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            {user && (
              <UserProfileDropdown user={user} isAdmin={isAdmin} onSignOut={handleSignOut} />
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        setIsOpen={setIsMobileMenuOpen}
        user={user}
        isAdmin={isAdmin}
        handleSignOut={handleSignOut}
      />
    </header>
  );
};

export default Header;
