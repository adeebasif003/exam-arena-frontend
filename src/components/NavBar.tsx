
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X, User } from "lucide-react";

export function NavBar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!isAuthenticated) return '/';
    return user?.role === 'student' ? '/student/dashboard' : '/faculty/dashboard';
  };

  return (
    <nav className="bg-white shadow-md dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-brand-700 dark:text-brand-400">MOCK TEST</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="text-gray-700 hover:text-brand-600 px-3 py-2 rounded-md text-sm font-medium dark:text-gray-300 dark:hover:text-white">
              Home
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to={getDashboardLink()} className="text-gray-700 hover:text-brand-600 px-3 py-2 rounded-md text-sm font-medium dark:text-gray-300 dark:hover:text-white">
                  Dashboard
                </Link>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="ml-4">
                      <User className="h-4 w-4 mr-2" />
                      {user?.name}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer" onClick={() => navigate(getDashboardLink())}>
                      Dashboard
                    </DropdownMenuItem>
                    {user?.role === 'faculty' && (
                      <>
                        <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/faculty/questions')}>
                          Questions
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/faculty/performance')}>
                          Student Performance
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-brand-600 px-3 py-2 rounded-md text-sm font-medium dark:text-gray-300 dark:hover:text-white">
                  Login
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="ml-4">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-brand-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 pb-3 px-2">
          <div className="flex flex-col space-y-1">
            <Link 
              to="/" 
              className="text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md text-base font-medium dark:text-gray-300 dark:hover:bg-gray-700"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link 
                  to={getDashboardLink()} 
                  className="text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md text-base font-medium dark:text-gray-300 dark:hover:bg-gray-700" 
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                {user?.role === 'faculty' && (
                  <>
                    <Link 
                      to="/faculty/questions" 
                      className="text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md text-base font-medium dark:text-gray-300 dark:hover:bg-gray-700"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Questions
                    </Link>
                    <Link 
                      to="/faculty/performance" 
                      className="text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md text-base font-medium dark:text-gray-300 dark:hover:bg-gray-700" 
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Student Performance
                    </Link>
                  </>
                )}
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }} 
                  className="text-left text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md text-base font-medium dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md text-base font-medium dark:text-gray-300 dark:hover:bg-gray-700" 
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md text-base font-medium dark:text-gray-300 dark:hover:bg-gray-700" 
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default NavBar;
