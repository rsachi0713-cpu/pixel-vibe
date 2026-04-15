import { useParams, Link } from 'react-router-dom';
import { Download, ShoppingCart, ArrowLeft } from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();

  // Mock product data - in a real app this would come from Firebase
  const product = {
    id: id || "1",
    title: "AETHER ESPORTS LOGO",
    type: "Gaming Logos",
    description: "Rigorous is an esports and gaming team. You can easily use this template to brand your gaming clan, youtube channel, or streaming persona. Designed with passion and fully customizable. Labels included.",
    price: 500,
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80",
    isFree: false
  };

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft size={20} />
          <span>Back to Home</span>
        </Link>
        
        <div className="glass-panel p-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white text-center mb-10">Product Details Page</h1>
          
          <div className="flex justify-center mb-10">
            <div className="relative w-full max-w-md aspect-square rounded-2xl overflow-hidden glass-panel p-2 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
              <img 
                src={product.image} 
                alt={product.title} 
                className="w-full h-full object-cover rounded-xl border border-gray-800"
              />
              <div className="absolute top-4 left-4 bg-dark-900/80 backdrop-blur-sm border border-gray-700 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider text-primary">
                {product.type}
              </div>
            </div>
          </div>

          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-display font-bold text-white mb-4 uppercase tracking-wide">{product.title}</h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-8">
              {product.description}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-gray-800 pt-8">
              <div className="flex items-center gap-3">
                <span className="text-xl font-medium text-gray-300">Price:</span>
                {product.isFree ? (
                  <span className="text-3xl font-bold text-accent font-display">FREE</span>
                ) : (
                  <span className="text-3xl font-bold text-accent font-display">${product.price}</span>
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                {product.isFree ? (
                  <button className="btn-accent flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3 py-4 text-base shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                    <Download size={20} />
                    DOWNLOAD FILE
                  </button>
                ) : (
                  <button className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto px-10 py-3 text-lg shadow-[0_0_20px_rgba(59,130,246,0.4)]">
                    <ShoppingCart size={20} />
                    BUY NOW
                  </button>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
