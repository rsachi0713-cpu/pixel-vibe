import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase/config';
import { ArrowLeft, ExternalLink, MessageSquare, X } from 'lucide-react';
import ProductComments from '../components/ProductComments';

export default function CategoryPortfolio() {
  const { category } = useParams();
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetchPortfolio();
    checkUser();
  }, [category]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    if (user) {
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
      setIsAdmin(profile?.role === 'admin');
    }
  };

  const fetchPortfolio = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('portfolio')
        .select('*')
        .eq('cat', category)
        .order('id', { ascending: false });

      if (error) {
        console.error('Fetch error:', error);
        // Fallback to unordered if id is also missing (unlikely but safe)
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('portfolio')
          .select('*')
          .eq('cat', category);
        
        if (fallbackError) throw fallbackError;
        setPortfolio(fallbackData || []);
      } else {
        setPortfolio(data || []);
      }
    } catch (e) {
      console.error('Error:', e);
      // alert('Database Error: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryTitle = (cat) => {
    return cat.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
  };

  return (
    <div className="min-h-screen bg-[#050510] text-white p-6 md:p-12 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#00f5d4] opacity-5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#f72585] opacity-5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-12 relative z-10">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all group mb-8"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-['Rajdhani'] font-bold tracking-widest uppercase">Back to Home</span>
        </button>

        <div className="space-y-2">
          <span className="text-cyan font-['Rajdhani'] font-black uppercase tracking-[5px] text-xs">Category Explorer</span>
          <h1 className="text-4xl md:text-6xl font-['Orbitron'] font-black uppercase tracking-tight">
            {getCategoryTitle(category)} <span className="text-cyan">Portfolio</span>
          </h1>
          <p className="text-gray-400 font-['Rajdhani'] tracking-widest uppercase text-xs pt-2">
            Showing all {portfolio.length} designs in this category
          </p>
        </div>
      </div>

      {/* GRID */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10 mb-20">
        {loading ? (
          <div className="col-span-full py-20 text-center text-gray-500 font-['Rajdhani'] uppercase tracking-widest animate-pulse">Loading {getCategoryTitle(category)} collection...</div>
        ) : portfolio.length === 0 ? (
          <div className="col-span-full py-20 text-center text-gray-500 font-['Rajdhani'] uppercase tracking-widest">No designs found in this category.</div>
        ) : (
          portfolio.map(item => (
            <div 
              key={item.id} 
              className="relative aspect-video rounded-3xl overflow-hidden cursor-pointer group border border-white/5 hover:border-cyan/30 transition-all bg-[#0d0d22]"
              onClick={() => setSelectedItem(item)}
            >
              <div 
                className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
                style={{ backgroundImage: `url(${item.image_url})` }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="absolute bottom-6 left-6 right-6 translate-y-2 group-hover:translate-y-0 transition-transform">
                <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-cyan/10 text-cyan rounded-md border border-cyan/20">{item.sub}</span>
                <h3 className="text-xl font-['Orbitron'] font-black text-white mt-3 truncate">{item.title}</h3>
                <div className="flex items-center gap-4 mt-4 opacity-0 group-hover:opacity-100 transition-all delay-100">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1">
                    <ExternalLink size={10} /> View details
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* LIGHTBOX (Copied logic from Home.jsx for consistency) */}
      {selectedItem && (
        <div 
          className="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => setSelectedItem(null)}
        >
          <button 
            onClick={(e) => { e.stopPropagation(); setSelectedItem(null); }}
            className="absolute top-8 left-8 flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white border border-white/10 backdrop-blur-md transition-all group lg:flex hidden"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-['Rajdhani'] font-bold tracking-widest uppercase">Back to List</span>
          </button>

          <button 
            onClick={(e) => { e.stopPropagation(); setSelectedItem(null); }}
            className="absolute top-8 right-8 w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white border border-white/10 backdrop-blur-md transition-all"
          >
            <X size={24} />
          </button>

          <div 
            className="relative w-full max-w-6xl max-h-[90vh] grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in zoom-in-95 duration-500 overflow-y-auto lg:overflow-visible custom-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="lg:col-span-8 flex flex-col items-center w-full">
              {selectedItem.image_url ? (
                <div className="relative w-full h-full flex items-center justify-center watermark-container">
                  <img 
                    src={selectedItem.image_url} 
                    alt={selectedItem.title} 
                    className="w-full h-full object-contain rounded-2xl shadow-[0_20px_80px_rgba(0,0,0,0.8)] border border-white/5" 
                  />
                  {!selectedItem.is_free && (
                    <div className="watermark-overlay">
                      <span className="watermark-text">AVARY EDITZ</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full aspect-video rounded-3xl flex items-center justify-center relative overflow-hidden bg-[#0d0d22]">
                  <div className="text-5xl font-['Orbitron'] font-black text-white/10">PREVIEW</div>
                </div>
              )}
            </div>

            <div className="lg:col-span-4 flex flex-col gap-6 w-full h-full">
              <div className="text-left space-y-4">
                <span className="px-4 py-1.5 rounded-full border border-white/10 text-xs font-['Rajdhani'] font-bold tracking-widest uppercase text-cyan">
                  {selectedItem.sub || selectedItem.cat}
                </span>
                <h2 className="text-3xl md:text-4xl font-['Orbitron'] font-black text-white leading-tight">{selectedItem.title}</h2>
                <p className="text-gray-400 font-['Rajdhani'] tracking-wide text-sm">Premium design crafted with precision for high-end gaming and creative brands.</p>
              </div>

              <ProductComments productId={selectedItem.id} currentUser={user} isAdmin={isAdmin} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

