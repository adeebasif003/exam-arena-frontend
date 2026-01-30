
import { Link } from 'react-router-dom';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:justify-start">
            <Link to="/" className="text-xl font-bold text-brand-700 dark:text-brand-400">
              MOCK TEST
            </Link>
          </div>
          
          <div className="mt-6 md:mt-0">
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              &copy; {year} MOCK TEST. All rights reserved.
            </p>
          </div>
          
          <div className="mt-6 md:mt-0 flex justify-center space-x-6">
            <Link to="/" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">
              Home
            </Link>
            <Link to="/login" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">
              Login
            </Link>
            <Link to="/signup" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
