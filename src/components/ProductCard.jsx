import { Link } from 'react-router-dom';
import { Eye, Download } from 'lucide-react';

const ProductCard = ({ product }) => {
  const { id, title, type, price, image, isFree, badge } = product;

  // Type specific styles
  const typeStyles = {
    gaming: 'glow-card hover:border-primary hover:shadow-glow-primary',
    normal: 'glow-card-accent hover:border-accent hover:shadow-glow-accent',
    post: 'glow-card-purple hover:border-neonPurple hover:shadow-glow-purple',
  };

  const currentStyle = typeStyles[type?.toLowerCase()] || typeStyles.gaming;

  return (
    <div className={`p-4 rounded-xl flex flex-col h-full bg-dark-800/60 border border-gray-800 transition-all duration-300 hover:-translate-y-1 ${currentStyle}`}>
      <div className="relative aspect-square md:aspect-video lg:aspect-square overflow-hidden rounded-lg mb-4 bg-dark-900 group">
        <img 
          src={image || "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80"} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {badge && (
          <div className="absolute top-2 left-2 bg-dark-900/80 backdrop-blur-sm border border-gray-700 text-xs font-bold px-2 py-1 rounded">
             {badge}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <Link to={`/product/${id}`} className="p-3 bg-primary/80 backdrop-blur-sm rounded-full text-white hover:bg-primary transition-colors hover:scale-110">
            <Eye size={20} />
          </Link>
          {isFree && (
             <button className="p-3 bg-accent/80 backdrop-blur-sm rounded-full text-white hover:bg-accent transition-colors hover:scale-110">
               <Download size={20} />
             </button>
          )}
        </div>
      </div>
      
      <div className="flex-grow flex flex-col justify-between">
        <div className="mb-4">
          <h3 className="font-display font-semibold text-lg text-white mb-1 truncate">{title}</h3>
          <span className="text-sm text-gray-400 capitalize">{type}</span>
        </div>
        
        <div className="flex items-center justify-between mt-auto">
          <div className="text-xl font-bold font-display">
            {isFree ? (
              <span className="text-accent">FREE</span>
            ) : (
              <span className="text-primary">${price}</span>
            )}
          </div>
          <Link to={`/product/${id}`} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            isFree ? 'bg-accent/20 text-accent hover:bg-accent hover:text-white' : 'bg-primary/20 text-primary hover:bg-primary hover:text-white'
          }`}>
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
