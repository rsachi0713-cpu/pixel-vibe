import { Link } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Gamepad2 } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Marketplace', path: '/marketplace' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Services', path: '/services' },
    { name: 'About', path: '/about' },
  ];

  return (
    <nav className="fixed w-full z-50 top-0 start-0 border-b border-gray-800 bg-dark-900/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="p-2 bg-primary/20 rounded-lg group-hover:bg-primary/30 transition-colors">
                <Gamepad2 className="text-primary h-6 w-6" />
              </div>
              <span className="font-display font-bold text-2xl tracking-wider text-white">
                SOFT<span className="text-primary">HUB</span>
              </span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium uppercase tracking-wider transition-colors relative group"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
                </Link>
              ))}
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-white bg-dark-800 rounded-full border border-gray-700 transition-colors">
              <User size={20} />
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-accent/20 text-accent border border-accent/50 rounded-full hover:bg-accent hover:text-white transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_20px_rgba(16,185,129,0.5)]">
              <ShoppingCart size={18} />
              <span className="font-medium text-sm">Cart</span>
            </button>
          </div>

          <div className="md:hidden flex flex-col justify-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-dark-800 focus:outline-none"
            >
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={clsx("md:hidden transition-all duration-300 ease-in-out", isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden")}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-dark-800 border-b border-gray-800">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium uppercase tracking-wider"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <div className="flex items-center gap-4 px-3 py-4 border-t border-gray-700 mt-2">
             <button className="flex items-center gap-2 p-2 text-gray-300 hover:text-white bg-dark-700 rounded-full transition-colors">
                <User size={20} />
              </button>
             <button className="flex flex-1 items-center justify-center gap-2 px-4 py-2 bg-accent/20 text-accent border border-accent/50 rounded-full hover:bg-accent hover:text-white transition-all">
                <ShoppingCart size={18} />
                <span className="font-medium">Cart (0)</span>
              </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
