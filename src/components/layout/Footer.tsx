
import { Link } from "react-router-dom";
import { Github, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 font-semibold text-xl mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-sm">
                E
              </div>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-700 to-primary-500 dark:from-primary-400 dark:to-primary-600">
                Es3af
              </span>
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Your AI-Powered Medical Assistant. Ask complex medical questions and get accurate, instant answers.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-primary transition-colors" aria-label="Github">
                <Github size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-primary transition-colors" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-primary transition-colors" aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-sm uppercase tracking-wider text-gray-900 dark:text-gray-100 mb-4">
              Navigation
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors text-sm">
                  About
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors text-sm">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-sm uppercase tracking-wider text-gray-900 dark:text-gray-100 mb-4">
              Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors text-sm">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors text-sm">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors text-sm">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-sm uppercase tracking-wider text-gray-900 dark:text-gray-100 mb-4">
              Contact
            </h3>
            <ul className="space-y-2">
              <li className="text-gray-600 dark:text-gray-400 text-sm">
                Email: contact@es3af.com
              </li>
              <li className="text-gray-600 dark:text-gray-400 text-sm">
                Support: support@es3af.com
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © {currentYear} Es3af. All rights reserved.
            <br />
             Developed By <span className="text-primary-600 text-2xl"><a href="https://mina-emad.netlify.app" target="_blank">Mina Emad</a></span>
          </p>
          <div className="mt-4 md:mt-0">
            <ul className="flex space-x-8">
              <li>
                <a href="#" className="text-xs text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">
                  Terms
                </a>
              </li>
              <li>
                <a href="#" className="text-xs text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="text-xs text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">
                  Cookies
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
