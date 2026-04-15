import { useState } from 'react';
import { Upload, ChevronDown, Edit, Trash2 } from 'lucide-react';

const Dashboard = () => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    // handle file drop logic
  };

  const designs = [
    { id: 1, product: 'Esports Gaming Logo', title: 'Esports', category: 'Esports', price: 530, image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=100' },
    { id: 2, product: 'Gaming Designs Logo', title: 'Gaming Designs', category: 'Thumbnails', price: 500, image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=100' },
    { id: 3, product: 'Esports Logo 2', title: 'Esports', category: 'Logos', price: 250, image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&q=80&w=100' },
    { id: 4, product: 'Normal Needs Logo', title: 'Normal Needs', category: 'Esports', price: 250, image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&q=80&w=100' },
    { id: 5, product: 'Overlays Pack', title: 'Overlays', category: 'Overlays', price: 220, image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&q=80&w=100' },
  ];

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <header className="mb-10 text-center md:text-left">
           <h1 className="text-3xl font-display font-bold text-white uppercase flex items-center justify-center md:justify-start gap-3">
             <span className="text-primary tracking-wider">SOFT HUB</span> - ADMIN DASHBOARD
           </h1>
        </header>

        <section className="mb-12">
          <h2 className="text-xl font-display font-semibold text-white mb-6 uppercase tracking-wide">Upload New Design</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 glass-panel p-6">
            <div 
              className={`border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-8 transition-colors ${
                 dragActive ? 'border-primary bg-primary/10' : 'border-gray-600 hover:border-gray-500 bg-dark-900/50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="text-gray-400 mb-4 h-12 w-12" />
              <p className="text-gray-300 font-medium mb-2">Drag & Drop</p>
              <span className="text-xs text-gray-500 mb-4">or</span>
              <button className="btn-primary text-sm px-6 py-2 rounded-full">Choose File</button>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
                <input 
                  type="text" 
                  className="w-full bg-dark-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
                <div className="relative">
                  <select className="w-full bg-dark-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white appearance-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors">
                    <option>Category</option>
                    <option>Gaming Logos</option>
                    <option>Gaming Thumbnails</option>
                    <option>Gaming Posts</option>
                    <option>Normal Logos</option>
                    <option>Normal Thumbnails</option>
                    <option>Normal Posts</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Price</label>
                <input 
                  type="text" 
                  placeholder="$300"
                  className="w-full bg-dark-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                />
              </div>
              
              <button className="btn-accent w-full mt-2">Publish Design</button>
            </div>
          </div>
        </section>

        <section className="mb-12">
           <h2 className="text-xl font-display font-semibold text-white mb-6 uppercase tracking-wide">Manage Designs</h2>
           
           <div className="glass-panel overflow-hidden">
             <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                 <thead>
                   <tr className="border-b border-gray-800 bg-dark-900/50">
                     <th className="py-4 px-6 text-sm font-medium text-gray-400">Product</th>
                     <th className="py-4 px-6 text-sm font-medium text-gray-400">Title</th>
                     <th className="py-4 px-6 text-sm font-medium text-gray-400">Category</th>
                     <th className="py-4 px-6 text-sm font-medium text-gray-400">Price</th>
                     <th className="py-4 px-6 text-sm font-medium text-gray-400 text-right">Actions</th>
                   </tr>
                 </thead>
                 <tbody>
                   {designs.map((design) => (
                     <tr key={design.id} className="border-b border-gray-800/50 hover:bg-dark-800/30 transition-colors">
                       <td className="py-3 px-6 text-sm">
                         <div className="flex items-center gap-3">
                           <img src={design.image} alt={design.title} className="w-10 h-10 rounded object-cover" />
                           <span className="text-white truncate max-w-[150px] block">{design.product}</span>
                         </div>
                       </td>
                       <td className="py-3 px-6 text-sm text-gray-300">{design.title}</td>
                       <td className="py-3 px-6 text-sm text-gray-300">{design.category}</td>
                       <td className="py-3 px-6 text-sm text-accent font-semibold">${design.price}</td>
                       <td className="py-3 px-6 text-sm text-right">
                         <div className="flex items-center justify-end gap-2">
                           <button className="p-1.5 bg-primary/20 text-primary hover:bg-primary hover:text-white rounded transition-colors">
                             <Edit size={16} />
                           </button>
                           <button className="p-1.5 bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white rounded transition-colors">
                             <Trash2 size={16} />
                           </button>
                         </div>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           </div>
        </section>

        <section className="space-y-4">
          <div className="glass-panel p-4 flex justify-between items-center cursor-pointer hover:bg-dark-800/80 transition-colors">
            <h2 className="text-lg font-display font-medium text-white tracking-wide uppercase">Database Summary</h2>
            <ChevronDown className="text-gray-400" />
          </div>
          <div className="glass-panel p-4 flex justify-between items-center cursor-pointer hover:bg-dark-800/80 transition-colors">
            <h2 className="text-lg font-display font-medium text-white tracking-wide uppercase">Settings</h2>
            <ChevronDown className="text-gray-400" />
          </div>
        </section>

      </div>
    </div>
  );
};

export default Dashboard;
