import { useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';

const featuredProducts = [
  { id: '1', title: 'Esports Gaming Logo', type: 'gaming', price: '250', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80', badge: 'GAMING DESIGNS' },
  { id: '2', title: 'Madr Right Character', type: 'post', price: '300', image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&q=80' },
  { id: '3', title: 'Neon Overlays', type: 'gaming', price: '150', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80', isFree: true },
];

const categories = [
  { id: 'gaming-thumb', title: 'Gaming Thumbnails', type: 'gaming', color: 'purple', icon: 'image' },
  { id: 'gaming-logo', title: 'Gaming Logos', type: 'gaming', color: 'primary', icon: 'gamepad' },
  { id: 'gaming-post', title: 'Gaming Posts', type: 'gaming', color: 'accent', icon: 'layout' },
  { id: 'normal-thumb', title: 'Normal Thumbnails', type: 'normal', color: 'purple', icon: 'image' },
  { id: 'normal-logo', title: 'Normal Logos', type: 'normal', color: 'accent', icon: 'pen' },
  { id: 'normal-post', title: 'Normal Posts', type: 'normal', color: 'purple', icon: 'layout' },
];

const Home = () => {
  return (
    <div className="pt-20 pb-16">
      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="absolute inset-0 z-0 overflow-hidden rounded-3xl opacity-20">
            <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary rounded-full mix-blend-screen filter blur-[100px] opacity-70"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent rounded-full mix-blend-screen filter blur-[100px] opacity-70"></div>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-5xl md:text-7xl font-display font-extrabold text-white mb-6 leading-tight">
              LEVEL UP YOUR <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">DESIGNS</span>
            </h1>
            <p className="text-lg text-gray-300 mb-8 max-w-xl mx-auto md:mx-0">
              Premium Gaming & Creative Designs for Sale. Access high-quality templates, logos, thumbnails, and posts. Free options available!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
              <button className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2 text-lg px-8 py-3">
                EXPLORE DESIGNS
              </button>
              <button className="btn-accent w-full sm:w-auto flex items-center justify-center gap-2 text-lg px-8 py-3">
                HIRE ME
              </button>
            </div>
          </div>
          
          <div className="flex-1 relative hidden md:block">
            <div className="relative w-full aspect-square max-w-md mx-auto">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-3xl transform rotate-3 scale-105 border border-white/10 backdrop-blur-sm"></div>
              <img 
                src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80" 
                alt="Featured Design" 
                className="absolute inset-0 w-full h-full object-cover rounded-3xl shadow-2xl transform -rotate-3 transition-transform duration-500 hover:rotate-0"
              />
              <div className="absolute -bottom-6 -left-6 bg-dark-800/90 backdrop-blur-md p-4 rounded-xl border border-gray-700 shadow-xl">
                <span className="block text-primary font-bold text-xl">ESPORTS</span>
                <span className="text-xs text-gray-400">PREMIUM BRANDING</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Designs Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-display font-bold text-white relative inline-block">
            Featured Designs
            <div className="absolute -bottom-2 left-0 w-1/2 h-1 bg-primary rounded-full"></div>
          </h2>
          <div className="hidden sm:flex items-center gap-2">
            <button className="p-2 rounded-full bg-dark-800 border border-gray-700 hover:bg-gray-700 transition-colors">
              <ChevronLeft size={20} />
            </button>
            <button className="p-2 rounded-full bg-dark-800 border border-gray-700 hover:bg-gray-700 transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-dark-800/30 border-y border-gray-800">
        <div className="mb-12">
          <h2 className="text-3xl font-display font-bold text-white relative inline-block mb-4">
            Categories Section
            <div className="absolute -bottom-2 left-0 w-1/2 h-1 bg-accent rounded-full"></div>
          </h2>
          <p className="text-gray-400 max-w-2xl">Find the perfect design for your needs. We categorize our creations into Gaming and Normal styles.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
