import { useState } from 'react';
import ProductCard from '../components/ProductCard';

const Portfolio = () => {
  const [filter, setFilter] = useState('ALL');

  const portfolioItems = [
    { id: 'p1', title: 'Thumbnails', type: 'gaming', price: '300', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80', badge: 'GAMING DESIGNS' },
    { id: 'p2', title: 'Logos', type: 'gaming', price: '250', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80' },
    { id: 'p3', title: 'Overlays', type: 'gaming', price: '250', image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&q=80' },
    { id: 'p4', title: 'Thumbnails', type: 'gaming', price: '500', image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&q=80', badge: 'GAMING DESIGNS' },
    { id: 'p5', title: 'Logos', type: 'gaming', price: '550', image: 'https://images.unsplash.com/photo-1614131557085-f5bb5b3c3b01?auto=format&fit=crop&q=80' },
    { id: 'p6', title: 'Overlays', type: 'gaming', price: '530', image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&q=80' },
  ];

  const filters = ['ALL', 'GAMING', 'LOGOS', 'POSTS'];

  const filteredItems = filter === 'ALL' 
    ? portfolioItems 
    : portfolioItems.filter(item => {
      if (filter === 'GAMING') return item.type === 'gaming';
      if (filter === 'LOGOS') return item.title.toLowerCase().includes('logo');
      if (filter === 'POSTS') return item.type === 'post';
      return true;
    });

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold text-white mb-6">Portfolio</h1>
          
          <div className="flex flex-wrap justify-center gap-4">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  filter === f 
                    ? 'btn-primary' 
                    : 'bg-dark-800 text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
             <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
