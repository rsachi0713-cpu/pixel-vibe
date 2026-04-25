import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Check, Zap, Shield, Rocket, Download, Eye, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../supabase/config';
import ProductComments from '../components/ProductComments';

const PricingProcess = () => {
  const { planName } = useParams();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [activeCat, setActiveCat] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const categories = [
    { id: 'all', label: 'All Designs' },
    { id: 'gaming-thumb', label: 'Gaming Thumbs' },
    { id: 'gaming-logo', label: 'Gaming Logos' },
    { id: 'gaming-post', label: 'Gaming Posts' },
    { id: 'normal-thumb', label: 'Normal Thumbs' },
    { id: 'normal-logo', label: 'Normal Logos' },
    { id: 'normal-post', label: 'Normal Posts' },
  ];

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) {
        supabase.from('profiles').select('status').eq('id', user.id).single()
          .then(({ data }) => setIsAdmin(data?.status === 'admin'));
      }
    });

    if (planName?.toLowerCase() === 'free') {
      loadFreeItems();
    } else {
      setLoading(false);
    }
  }, [planName]);

  const loadFreeItems = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('portfolio')
        .select('*')
        .eq('is_free', true);
      
      if (error) throw error;
      setItems(data || []);
    } catch (e) {
      console.error('Error fetching free items:', e);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = activeCat === 'all' 
    ? items 
    : items.filter(item => item.cat === activeCat);

  const handleDownload = async (url, title) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${title.replace(/\s+/g, '-').toLowerCase()}-avaryeditz.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (e) {
      console.error('Download error:', e);
      window.open(url, '_blank');
    }
  };

  const plans = {
    free: {
      name: 'FREE DESIGNS',
      price: 'FREE',
      color: '#00f5d4',
      features: ['High-Quality PNGs', 'Instant Download', 'Personal Use Only', 'Gaming & Normal styles'],
      icon: <Zap size={40} className="text-[#00f5d4]" />
    },
    basic: {
      name: 'BASIC PLAN',
      price: 'LKR',
      color: '#4361ee',
      features: ['1 Design Variation', 'High Quality Design', '1-Day Delivery', 'Unlimited Revisions', 'Commercial License'],
      icon: <Shield size={40} className="text-[#4361ee]" />
    },
    standard: {
      name: 'STANDARD PLAN',
      price: 'LKR',
      color: '#f72585',
      features: ['5 Design Variations', 'High Quality Design', '2-Day Delivery', 'Unlimited Revisions', 'Priority Support', 'Full Brand Kit'],
      icon: <Rocket size={40} className="text-[#f72585]" />
    }
  };

  const plan = plans[planName?.toLowerCase()] || plans.basic;

  const handleWhatsAppOrder = () => {
    const message = `🔥 *NEW PLAN ORDER: ${plan.name}*\n\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `📌 *Plan:* ${plan.name}\n` +
      `💰 *Price Type:* ${plan.price}\n` +
      `🕒 *Requested at:* ${new Date().toLocaleString()}\n` +
      `━━━━━━━━━━━━━━━━━━━━\n\n` +
      `Hello! I would like to start with the *${plan.name}*. Please let me know how to proceed.`;
    
    window.open(`https://wa.me/94753951531?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (planName?.toLowerCase() === 'free') {
    return (
      <div className="min-h-screen bg-[#050510] text-white pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-white mb-8 transition-colors font-['Rajdhani'] uppercase tracking-widest font-bold">
            <ArrowLeft size={20} />
            Back to Site
          </Link>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
            <div>
              <h1 className="text-5xl md:text-7xl font-['Orbitron'] font-black mb-4 uppercase tracking-tighter">
                FREE <span className="text-[#00f5d4]">DESIGNS</span>
              </h1>
              <p className="text-gray-400 font-['Rajdhani'] text-lg tracking-wide max-w-xl">
                Download high-quality assets for your personal projects. Mark as credit when using in public.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCat(cat.id)}
                  className={`px-4 py-2 rounded-lg font-['Rajdhani'] font-bold text-xs uppercase tracking-widest transition-all border ${
                    activeCat === cat.id 
                    ? 'bg-[#00f5d4] border-[#00f5d4] text-black shadow-[0_0_20px_rgba(0,245,212,0.3)]' 
                    : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-12 h-12 border-4 border-[#00f5d4]/20 border-t-[#00f5d4] rounded-full animate-spin"></div>
            </div>
          ) : filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredItems.map(item => (
                <div key={item.id} className="group relative bg-[#0a0a1f] border border-white/5 rounded-2xl overflow-hidden hover:border-[#00f5d4]/50 transition-all shadow-2xl">
                  <div className="aspect-video overflow-hidden relative group/img">
                    <img 
                      src={item.image_url} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                       <button 
                         onClick={() => setSelectedItem(item)}
                         className="p-3 bg-white text-black rounded-full transform translate-y-4 group-hover/img:translate-y-0 transition-transform duration-300 shadow-xl"
                       >
                         <Eye size={20} />
                       </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-['Orbitron'] font-bold text-white mb-1 uppercase tracking-wider">{item.title}</h3>
                        <span className="text-[10px] font-['Rajdhani'] font-bold text-[#00f5d4] tracking-[3px] uppercase">{item.cat.replace('-', ' ')}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                       <button 
                        onClick={() => setSelectedItem(item)}
                        className="flex-1 h-12 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white rounded-xl font-['Rajdhani'] font-black tracking-[4px] uppercase text-[10px] transition-all border border-white/10"
                      >
                        View
                      </button>
                      <button 
                        onClick={() => handleDownload(item.image_url, item.title)}
                        className="flex-1 h-12 flex items-center justify-center gap-2 bg-[#00f5d4]/10 hover:bg-[#00f5d4] text-[#00f5d4] hover:text-black rounded-xl font-['Rajdhani'] font-black tracking-[4px] uppercase text-[10px] transition-all border border-[#00f5d4]/20 hover:border-[#00f5d4]"
                      >
                        <Download size={14} /> 4K
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white/5 rounded-[2rem] border border-dashed border-white/10">
              <div className="text-gray-600 font-['Orbitron'] text-xl mb-4">NO FREE SAMPLES YET</div>
              <p className="text-gray-500 font-['Rajdhani'] uppercase tracking-widest text-sm">Check back later or contact us for custom designs.</p>
            </div>
          )}
        </div>

        {/* LIGHTBOX FOR FREE SAMPLES */}
        {selectedItem && (
          <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setSelectedItem(null)}>
            <button className="absolute top-8 right-8 w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white border border-white/10 transition-all" onClick={() => setSelectedItem(null)}>
              <X size={24} />
            </button>
            <div className="relative w-full max-w-6xl max-h-[90vh] grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in zoom-in-95 duration-500 overflow-y-auto lg:overflow-visible custom-scrollbar" onClick={e => e.stopPropagation()}>
              <div className="lg:col-span-8 flex flex-col items-center w-full">
                <div className="relative w-full h-full flex items-center justify-center">
                  <img src={selectedItem.image_url} alt={selectedItem.title} className="w-full h-full object-contain rounded-2xl shadow-2xl border border-white/5" />
                </div>
              </div>
              <div className="lg:col-span-4 flex flex-col gap-6 w-full h-full">
                <div className="text-left space-y-4">
                  <span className="px-4 py-1.5 rounded-full border border-white/10 text-xs font-['Rajdhani'] font-bold tracking-widest uppercase text-[#00f5d4]">
                    {selectedItem.cat.replace('-', ' ')}
                  </span>
                  <h2 className="text-3xl md:text-4xl font-['Orbitron'] font-black text-white leading-tight uppercase">{selectedItem.title}</h2>
                  <p className="text-gray-400 font-['Rajdhani'] tracking-wide text-sm">Premium free design variation. High quality 4K resolution guaranteed.</p>
                  <button 
                    onClick={() => handleDownload(selectedItem.image_url, selectedItem.title)}
                    className="w-full py-4 bg-[#00f5d4] text-black font-['Orbitron'] font-black text-sm tracking-[4px] uppercase rounded-2xl flex items-center justify-center gap-3 shadow-[0_20px_40px_rgba(0,245,212,0.2)] hover:scale-[1.02] transition-all"
                  >
                    <Download size={20} /> Download 4K
                  </button>
                </div>
                <ProductComments productId={selectedItem.id} currentUser={user} isAdmin={isAdmin} />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050510] text-white pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-white mb-12 transition-colors font-['Rajdhani'] uppercase tracking-widest font-bold">
          <ArrowLeft size={20} />
          Back to Site
        </Link>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-block p-4 rounded-3xl bg-white/5 border border-white/10">
              {plan.icon}
            </div>
            <div>
              <h1 className="text-5xl md:text-7xl font-['Orbitron'] font-black mb-4">
                {plan.name.split(' ')[0]} <span style={{ color: plan.color }}>{plan.name.split(' ')[1] || ''}</span>
              </h1>
              <p className="text-gray-400 font-['Rajdhani'] text-lg tracking-wide max-w-md">
                You've selected the {plan.name}. Follow the steps below to finalize your order and start your creative journey.
              </p>
            </div>

            <div className="space-y-4 pt-4">
              {plan.features.map((f, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                    <Check size={14} style={{ color: plan.color }} />
                  </div>
                  <span className="text-gray-300 font-['Rajdhani'] tracking-wider uppercase text-sm font-bold">{f}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-cyan/20 to-purple/20 blur-3xl opacity-30 rounded-full"></div>
            <div className="relative p-8 md:p-12 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-xl space-y-8">
              <div className="text-center space-y-2">
                <span className="text-gray-500 font-['Rajdhani'] font-bold tracking-[4px] uppercase text-xs">Final Step</span>
                <h3 className="text-3xl font-['Orbitron'] font-black text-white">READY TO GO?</h3>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={handleWhatsAppOrder}
                  className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-[#25d366] to-[#128c7e] text-white font-black py-5 rounded-2xl font-['Rajdhani'] tracking-[3px] uppercase shadow-[0_20px_40px_rgba(37,211,102,0.2)] hover:scale-[1.02] active:scale-95 transition-all text-sm"
                >
                  Confirm via WhatsApp
                </button>
                
                <button 
                  onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-white font-black py-5 rounded-2xl font-['Rajdhani'] tracking-[3px] uppercase transition-all text-sm"
                >
                  Email Inquiry
                </button>
              </div>

              <p className="text-center text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-loose">
                By clicking confirm, you will be redirected to our whatsapp business line.<br/>Estimated response time: &lt; 24 hours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingProcess;
