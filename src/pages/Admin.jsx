import { useState, useEffect } from 'react';
import { supabase } from '../supabase/config';
import { 
  LayoutDashboard, Image as ImageIcon, Settings, MessageSquare, 
  Tag, CreditCard, Plus, Edit2, Trash2, Search, Bell, Menu, X,
  Users, RefreshCw
} from 'lucide-react';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('portfolio');
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: '' });

  const [portfolio, setPortfolio] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ views: 0, inquiries: 0, services: 6 });
  
  const [newItem, setNewItem] = useState({ title: '', cat: 'gaming-thumb', color: '#00f5d4', is_free: false });
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    loadPortfolio();
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');
      
      if (error) {
         if (error.code === 'PGRST116' || error.message.includes('not found')) {
            alert('CRITICAL: "profiles" table not found in Supabase! Please create it in your Supabase dashboard.');
         }
         throw error;
      }
      setUsers(data || []);
    } catch (e) {
      console.error('Error fetching users:', e);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ status: newStatus })
        .eq('id', userId);
      
      if (error) throw error;
      
      setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus } : u));
      showToast(`User status updated to ${newStatus}!`);
    } catch (e) {
      console.error('Error updating status:', e);
      showToast('Error updating status');
    }
  };

  const loadPortfolio = async () => {
    try {
      const { data: pData, error: pError } = await supabase.from('portfolio').select('*');
      if (pError) throw pError;
      setPortfolio(pData || []);

      const { data: mData, error: mError } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
      if (mError) throw mError;
      setMessages(mData || []);

      const totalViews = (pData || []).reduce((acc, item) => acc + (parseInt(item.views) || 0), 0);
      setStats({
        views: totalViews,
        inquiries: mData?.length || 0,
        services: 6
      });

      setLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  const handleSaveItem = async () => {
    if(!newItem.title) return;
    setUploading(true);
    try {
      let imageUrl = editingItem ? editingItem.image_url : '';
      
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('portfolio')
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('portfolio')
          .getPublicUrl(filePath);
          
        imageUrl = publicUrl;
      }

      if (editingItem) {
        const { error } = await supabase
          .from('portfolio')
          .update({
            title: newItem.title,
            cat: newItem.cat,
            color: newItem.color,
            sub: newItem.cat.replace('-', ' '),
            image_url: imageUrl,
            is_free: newItem.is_free
          })
          .eq('id', editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('portfolio').insert([{
          title: newItem.title,
          cat: newItem.cat,
          color: newItem.color || '#00f5d4',
          bg: 'linear-gradient(135deg,#0d0d0d,#1a1a2e,#16213e)',
          sub: newItem.cat.replace('-', ' '),
          image_url: imageUrl,
          icon: '✦',
          status: 'Active',
          views: '0',
          is_free: newItem.is_free
        }]);
        if (error) throw error;
      }

      setNewItem({ title: '', cat: 'gaming-thumb', color: '#00f5d4', is_free: false });
      setImageFile(null);
      setEditingItem(null);
      setIsAddModalOpen(false);
      showToast(editingItem ? 'Item updated!' : 'Item successfully saved!');
      loadPortfolio();
    } catch (e) {
      console.error('Error saving:', e);
      showToast('Error saving item. ' + e.message);
    } finally {
      setUploading(false);
    }
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setNewItem({ title: item.title, cat: item.cat, color: item.color, is_free: item.is_free || false });
    setIsAddModalOpen(true);
  };

  const showToast = (msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: '' }), 3000);
  };

  const handleDelete = async (id) => {
    if(window.confirm('Are you sure you want to delete this item?')) {
      const { error } = await supabase.from('portfolio').delete().eq('id', id);
      if (error) {
        console.error('Error deleting:', error);
        showToast('Error deleting item.');
      } else {
        loadPortfolio();
      }
    }
  };

  const tabs = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'portfolio', icon: ImageIcon, label: 'Portfolio Items' },
    { id: 'services', icon: Tag, label: 'Services' },
    { id: 'pricing', icon: CreditCard, label: 'Pricing Plans' },
    { id: 'messages', icon: MessageSquare, label: 'Inquiries' },
    { id: 'users', icon: Users, label: 'User Management' },
  ];

  return (
    <div className="min-h-screen bg-[#050510] text-gray-300 flex font-['Inter'] relative">
      <style>{`
        * { cursor: default !important; }
        button, a, select, summary, input[type=radio], input[type=checkbox] { cursor: pointer !important; }
        input, textarea { cursor: text !important; }
      `}</style>
      
      <div className={`fixed bottom-6 right-6 z-[100] transform transition-all duration-500 flex items-center gap-3 px-6 py-4 rounded-xl shadow-[0_10px_40px_rgba(0,245,212,0.2)] bg-[#0d0d22] border border-[#00f5d4]/30 ${toast.show ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 pointer-events-none'}`}>
        <div className="w-8 h-8 rounded-full bg-[#00f5d4]/10 flex items-center justify-center text-[#00f5d4]">✓</div>
        <span className="font-['Rajdhani'] font-bold tracking-wider text-white text-lg">{toast.msg}</span>
      </div>

      <div className={`fixed inset-y-0 left-0 bg-[#0a0a1f] border-r border-[#00f5d4]/20 w-64 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out z-20 md:relative md:translate-x-0`}>
        <div className="p-6">
          <div 
            onClick={() => window.location.href = '/'}
            className="flex flex-col items-center text-center mb-10 cursor-pointer group"
          >
            <img src="/logo.png" alt="Logo" className="w-16 h-16 object-contain mb-3 group-hover:scale-110 transition-transform" />
            <div className="font-['Orbitron'] font-black text-xl tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-[#00f5d4] to-[#f72585]">
              PIXEL VIBE
            </div>
            <span className="text-white text-[10px] tracking-widest uppercase font-sans opacity-50">ADMIN AREA</span>
          </div>
          
          <div className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === tab.id 
                      ? 'bg-gradient-to-r from-[#00f5d4]/20 to-transparent text-[#00f5d4] border-l-2 border-[#00f5d4]' 
                      : 'hover:bg-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  <Icon size={18} />
                  <span className="font-['Rajdhani'] font-semibold tracking-wider text-sm">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden relative">
        {/* ADD MODAL */}
        {isAddModalOpen && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#0d0d22] border border-[#00f5d4]/30 rounded-2xl w-full max-w-md p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-['Orbitron'] font-bold text-white">{editingItem ? 'Edit Item' : 'Add New Item'}</h3>
                <button onClick={() => { setIsAddModalOpen(false); setEditingItem(null); setNewItem({ title: '', cat: 'gaming-thumb', color: '#00f5d4', is_free: false }); }} className="text-gray-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-['Rajdhani'] uppercase tracking-widest text-gray-400 mb-1">Project Title</label>
                  <input type="text" value={newItem.title} onChange={e=>setNewItem({...newItem, title: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#00f5d4]" placeholder="E.g. Epic Gaming Thumb" />
                </div>
                <div>
                  <label className="block text-xs font-['Rajdhani'] uppercase tracking-widest text-gray-400 mb-1">Category</label>
                  <select value={newItem.cat} onChange={e=>setNewItem({...newItem, cat: e.target.value})} className="w-full bg-[#0a0a1f] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#00f5d4]">
                    <option value="gaming-thumb">Gaming Thumbnails</option>
                    <option value="gaming-logo">Gaming Logos</option>
                    <option value="gaming-post">Gaming Social Posts</option>
                    <option value="normal-thumb">Normal Thumbnails</option>
                    <option value="normal-logo">Normal Logos</option>
                    <option value="normal-post">Normal Social Posts</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-['Rajdhani'] uppercase tracking-widest text-gray-400 mb-1">Theme Color</label>
                  <input type="color" value={newItem.color} onChange={e=>setNewItem({...newItem, color: e.target.value})} className="w-full h-10 bg-white/5 border border-white/10 rounded-lg p-1" />
                </div>
                <div className="flex items-center gap-3 bg-white/5 p-3 rounded-lg border border-white/5">
                  <input 
                    type="checkbox" 
                    id="is_free" 
                    checked={newItem.is_free} 
                    onChange={e => setNewItem({...newItem, is_free: e.target.checked})}
                    className="w-5 h-5 rounded border-white/10 text-[#00f5d4] focus:ring-offset-0 focus:ring-0"
                  />
                  <label htmlFor="is_free" className="text-xs font-['Rajdhani'] uppercase tracking-widest text-white font-bold cursor-pointer">Mark as FREE SAMPLE</label>
                </div>
                <div>
                  <label className="block text-xs font-['Rajdhani'] uppercase tracking-widest text-gray-400 mb-1">Project Image</label>
                  <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#00f5d4]" />
                </div>
                <button 
                  onClick={handleSaveItem} 
                  disabled={uploading}
                  className="w-full bg-gradient-to-r from-[#00f5d4] to-[#4361ee] text-black font-bold py-3 rounded-xl mt-4 font-['Rajdhani'] tracking-widest hover:scale-[1.02] transition-transform disabled:opacity-50"
                >
                  {uploading ? 'PROCESSING...' : (editingItem ? 'UPDATE ITEM' : 'SAVE ITEM')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TOPBAR */}
        <header className="h-20 bg-[#0a0a1f]/80 backdrop-blur-md border-b border-white/5 px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-white" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <Menu />
            </button>
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm w-64 focus:outline-none focus:border-[#00f5d4]/50 text-white transition-colors"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <button className="relative text-gray-400 hover:text-[#00f5d4] transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#f72585] rounded-full animate-pulse"></span>
            </button>
            <div className="flex items-center gap-3 border-l border-white/10 pl-6">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#00f5d4] to-[#4361ee] flex items-center justify-center font-bold text-black font-['Orbitron']">
                A
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-bold text-white font-['Rajdhani'] tracking-widest">ADMIN USER</div>
                <button onClick={() => supabase.auth.signOut()} className="text-xs text-red-500 hover:text-red-400 font-bold uppercase transition-colors">LOGOUT</button>
              </div>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-bold text-white font-['Orbitron'] tracking-wider mb-6">Overview</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                  { label: 'Total Views', value: stats.views.toLocaleString(), trend: 'Overall', color: '#00f5d4' },
                  { label: 'Portfolio Items', value: portfolio.length || '0', trend: 'Live', color: '#f72585' },
                  { label: 'Received Inquiries', value: stats.inquiries, trend: 'New', color: '#7209b7' },
                  { label: 'Active Services', value: stats.services, trend: 'Ready', color: '#4361ee' }
                ].map((stat, i) => (
                  <div key={i} className="bg-[#0d0d22] border border-white/5 p-6 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity" style={{ background: stat.color, transform: 'translate(30%, -30%)' }}></div>
                    <div className="text-gray-400 text-sm font-semibold tracking-wider font-['Rajdhani'] mb-2 uppercase">{stat.label}</div>
                    <div className="flex items-end justify-between">
                      <div className="text-3xl font-black font-['Orbitron'] text-white">{stat.value}</div>
                      <div className="text-xs font-bold px-2 py-1 rounded-md" style={{ color: stat.color, background: `${stat.color}15` }}>{stat.trend}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Portfolio Tab */}
          {activeTab === 'portfolio' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white font-['Orbitron'] tracking-wider">Portfolio Manager</h2>
                  <p className="text-sm text-gray-500 mt-1">Add, edit, or delete your design showcase items.</p>
                </div>
                <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 bg-gradient-to-r from-[#00f5d4] to-[#4361ee] text-black px-6 py-2.5 rounded-xl font-bold font-['Rajdhani'] tracking-widest text-sm hover:scale-105 transition-transform shadow-[0_4px_20px_rgba(0,245,212,0.3)]">
                  <Plus size={16} /> ADD NEW ITEM
                </button>
              </div>

              <div className="bg-[#0d0d22] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white/5 border-b border-white/5 text-xs text-gray-400 font-['Rajdhani'] tracking-widest uppercase">
                        <th className="p-4 font-semibold">Project Name</th>
                        <th className="p-4 font-semibold">Category</th>
                        <th className="p-4 font-semibold">Type</th>
                        <th className="p-4 font-semibold">Views</th>
                        <th className="p-4 font-semibold">Status</th>
                        <th className="p-4 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {portfolio.length === 0 && (
                        <tr>
                          <td colSpan="5" className="p-8 text-center text-gray-500">No items found in Supabase Database.</td>
                        </tr>
                      )}
                      {portfolio.map((item) => (
                        <tr key={item.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              {item.image_url ? (
                                <img src={item.image_url} alt="" className="w-10 h-10 rounded-lg object-cover border border-white/10" />
                              ) : (
                                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-[10px] font-bold" style={{background: `${item.color}20`, color: item.color}}>NO IMG</div>
                              )}
                              <span className="font-semibold text-white">{item.title}</span>
                            </div>
                          </td>
                           <td className="p-4 text-sm text-gray-400">{item.cat}</td>
                          <td className="p-4">
                            {item.is_free ? (
                              <span className="text-[10px] bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-500 border border-yellow-500/30 px-2 py-0.5 rounded-md font-bold uppercase">FREE</span>
                            ) : (
                              <span className="text-[10px] text-gray-600 font-bold uppercase">PAID</span>
                            )}
                          </td>
                          <td className="p-4 text-sm text-gray-400">{item.views || '0'}</td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.status === 'Active' ? 'bg-[#00f5d4]/10 text-[#00f5d4]' : 'bg-gray-800 text-gray-400'}`}>
                              {item.status || 'Active'}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => openEditModal(item)} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"><Edit2 size={16} /></button>
                              <button onClick={() => handleDelete(item.id)} className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Inquiries Tab */}
          {activeTab === 'messages' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-bold text-white font-['Orbitron'] tracking-wider mb-6 text-center md:text-left uppercase">Recent Inquiries</h2>
              <div className="grid grid-cols-1 gap-4">
                {messages.length === 0 ? (
                  <div className="p-12 text-center text-gray-500 bg-[#0d0d22] border border-dashed border-white/10 rounded-2xl">No inquiries found yet.</div>
                ) : (
                  messages.map((m) => (
                    <div key={m.id} className="bg-[#0d0d22] border border-white/5 p-6 rounded-2xl hover:border-[#00f5d4]/30 transition-all border-l-4" style={{ borderColor: `rgba(0, 245, 212, ${activeTab === 'messages' ? 0.3 : 0.1})` }}>
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <span className="text-white font-bold font-['Rajdhani'] text-lg uppercase tracking-wider">{m.name}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-[#00f5d4]/10 text-[#00f5d4] font-bold">{m.service}</span>
                          </div>
                          <div className="text-sm text-gray-500">{m.email} • {new Date(m.created_at).toLocaleDateString()}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Budget Preference</div>
                          <div className="text-[#f72585] font-bold font-['Rajdhani'] uppercase">{m.budget}</div>
                        </div>
                      </div>
                      <div className="mt-4 p-4 bg-white/5 rounded-xl text-gray-400 text-sm leading-relaxed italic">
                        "{m.description || 'No message provided'}"
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* USERS TAB - FIXED */}
        {activeTab === 'users' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center bg-[#0d0d22] p-8 rounded-3xl border border-white/5 shadow-2xl">
              <div>
                <h2 className="text-3xl font-['Orbitron'] font-black text-white">USER <span className="text-yellow-500">WORKSPACE</span></h2>
                <p className="text-gray-500 font-['Rajdhani'] text-xs font-bold uppercase tracking-[4px] mt-2">Manage creator memberships and status overrides</p>
              </div>
              <button 
                onClick={fetchUsers}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-[#00f5d4] transition-all border border-[#00f5d4]/20 font-['Rajdhani'] font-bold tracking-widest text-xs"
              >
                <RefreshCw size={18} className={loadingUsers ? 'animate-spin' : ''} />
                REFRESH DATABASE
              </button>
            </div>

            <div className="bg-[#0d0d22] rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="px-8 py-6 text-[11px] font-black text-gray-500 uppercase tracking-[3px]">IDENTITY</th>
                    <th className="px-8 py-6 text-[11px] font-black text-gray-500 uppercase tracking-[3px]">JOINED DATE</th>
                    <th className="px-8 py-6 text-[11px] font-black text-gray-500 uppercase tracking-[3px] text-center">PRIVILEGE</th>
                    <th className="px-8 py-6 text-[11px] font-black text-gray-500 uppercase tracking-[3px] text-right">OPERATIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-white/[0.03] transition-all group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className={`relative w-12 h-12 rounded-2xl flex items-center justify-center font-['Orbitron'] font-black text-black text-sm transition-all duration-500 ${user.status === 'pro' ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-[0_0_25px_rgba(234,179,8,0.4)] rotate-3' : 'bg-gradient-to-br from-cyan to-blue -rotate-3'}`}>
                            {user.avatar_url ? (
                              <img src={user.avatar_url} className="w-full h-full object-cover rounded-2xl" alt="P" />
                            ) : (
                              user.full_name?.[0]?.toUpperCase() || 'U'
                            )}
                          </div>
                          <div>
                            <div className="text-white font-black font-['Rajdhani'] tracking-[2px] text-base uppercase">{user.full_name || 'ANONYMOUS'}</div>
                            <div className="text-gray-500 font-['Rajdhani'] text-[11px] font-medium">{user.email || 'No email associated'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-gray-400 font-bold font-['Rajdhani'] text-xs uppercase tracking-widest leading-none">
                        {new Date(user.created_at).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[2.5px] border ${user.status === 'pro' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30' : 'bg-cyan/10 text-cyan border-cyan/30'}`}>
                          {user.status === 'pro' ? '💎 PRO' : 'FREE'}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end">
                          {user.status !== 'pro' ? (
                            <button 
                              onClick={() => handleStatusChange(user.id, 'pro')}
                              className="px-6 py-3 rounded-xl bg-yellow-500 text-black font-['Rajdhani'] font-black text-[10px] uppercase tracking-[2px] hover:scale-105 active:scale-95 transition-all shadow-[0_10px_30px_rgba(234,179,8,0.2)]"
                            >
                              GRANT PRO ACCESS
                            </button>
                          ) : (
                            <button 
                              onClick={() => handleStatusChange(user.id, 'free')}
                              className="px-6 py-3 rounded-xl bg-white/5 text-gray-500 hover:text-white font-['Rajdhani'] font-black text-[10px] uppercase tracking-[2px] transition-all border border-white/5 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20"
                            >
                              REVOKE ACCESS
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan="4" className="px-8 py-20 text-center text-gray-600 font-['Rajdhani'] uppercase tracking-[4px] text-sm">No creators found in the data grid.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

          {/* Under Construction handling for other tabs */}
          {['services', 'pricing'].includes(activeTab) && (
            <div className="animate-in fade-in flex flex-col items-center justify-center h-[60vh] text-center border-2 border-dashed border-white/10 rounded-3xl bg-[#0d0d22]">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                <Settings className="text-[#00f5d4] animate-[spin_4s_linear_infinite]" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-white font-['Orbitron'] tracking-widest mb-2 uppercase">{activeTab} Manager</h2>
              <p className="text-gray-500 max-w-sm">This module is connected to Supabase successfully. Full management screens coming soon.</p>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
