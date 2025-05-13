
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, X } from "lucide-react";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import TrialStatusBanner from "./dashboard/TrialStatusBanner";
import Logo from "./header/Logo";
import DesktopNavigation from "./header/DesktopNavigation";
import MobileMenu from "./header/MobileMenu";
import CacheControl from "./admin/CacheControl";

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { isAdmin } = useIsAdmin();
  const navigate = useNavigate();
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };
  
  // Get current path to determine if we're in admin section
  const isAdminPage = window.location.pathname.startsWith('/admin');
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <TrialStatusBanner />
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Logo />

        {/* Admin tools (only shown on admin pages) */}
        {isAdmin && isAdminPage && (
          <div className="ml-4 mr-auto">
            <CacheControl />
          </div>
        )}

        {/* Desktop Navigation */}
        <DesktopNavigation 
          user={user}
          isAdmin={isAdmin}
          handleSignOut={handleSignOut}
        />

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <Button variant="ghost" onClick={toggleMenu}>
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        user={user}
        isAdmin={isAdmin}
        handleSignOut={handleSignOut}
      />
    </header>
  );
};

export default Header;
