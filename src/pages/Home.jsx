import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, X, Menu, Edit2 } from 'lucide-react';
import '../index.css';
import { supabase } from '../supabase/config';

function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [filter, setFilter] = useState('all');
  const [notif, setNotif] = useState({ show: false, msg: '' });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [newAvatar, setNewAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  
  const cursorRef = useRef(null);
  const ringRef = useRef(null);
  const revealRefs = useRef([]);
  let notifTimeout = useRef(null);
  const navigate = useNavigate();

  const [portfolioItems, setPortfolioItems] = useState([]);
  const [loadingPortfolio, setLoadingPortfolio] = useState(true);
  const [user, setUser] = useState(null);
  const [userStatus, setUserStatus] = useState('free');
  const isPro = userStatus === 'pro';
  const [selectedItem, setSelectedItem] = useState(null);
  const [orderChoice, setOrderChoice] = useState(null); // { serviceTitle, color }
  const [orderQty, setOrderQty] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);

  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    service: 'Gaming Thumbnail',
    budget: 'Basic',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) {
        if (user.user_metadata?.full_name) setProfileName(user.user_metadata.full_name);
        syncProfile(user);
      }
    });

    const syncProfile = async (u) => {
      try {
        // First check if profile exists and get status
        const { data: profile, error: fetchError } = await supabase
          .from('profiles')
          .select('status')
          .eq('id', u.id)
          .single();
        
        if (profile) setUserStatus(profile.status || 'free');

        const { error } = await supabase
          .from('profiles')
          .upsert({
            id: u.id,
            email: u.email,
            full_name: u.user_metadata?.full_name || u.email?.split('@')[0],
            avatar_url: u.user_metadata?.avatar_url || null,
            status: profile?.status || u.user_metadata?.status || 'free',
            updated_at: new Date()
          }, { onConflict: 'id' });
        
        if (error) console.error('Sync error:', error);
      } catch (e) {
        console.error('Profile sync failed:', e);
      }
    };

    const fetchPortfolio = async () => {
      try {
        const { data, error } = await supabase.from('portfolio').select('*');
        if (error) throw error;
        setPortfolioItems(data || []);
      } catch (e) {
        console.error('Error fetching portfolio:', e);
      } finally {
        setLoadingPortfolio(false);
      }
    };
    fetchPortfolio();
  }, []);

  const getCount = (cat) => {
    return portfolioItems.filter(item => item.cat === cat).length;
  };

  const services = [
    {icon:'🎮',title:'Gaming Thumbnails',desc:'High-impact YouTube & stream thumbnails engineered to stop the scroll and dominate search results.',price:'',color:'var(--cyan)'},
    {icon:'⚡',title:'Gaming Logos',desc:'Fierce esports logos and team branding that commands respect in any competitive arena.',price:'',color:'var(--pink)'},
    {icon:'📡',title:'Gaming Social Posts',desc:'Scroll-stopping social content designed to grow your gaming brand across all platforms.',price:'',color:'var(--purple)'},
    {icon:'🖼️',title:'Normal Thumbnails',desc:'Clean, professional thumbnails for lifestyle, business, and content creators who demand quality.',price:'',color:'#4cc9f0'},
    {icon:'✦',title:'Normal Logos',desc:'Modern, memorable logos for businesses, personal brands, and creative projects of all kinds.',price:'',color:'#f77f00'},
    {icon:'📸',title:'Social Media Posts',desc:'Eye-catching posts for Instagram, Twitter, and TikTok that elevate your brand presence.',price:'',color:'#06d6a0'},
  ];

  // Mouse move for custom cursor
  useEffect(() => {
    document.body.classList.add('has-custom-cursor');
    let mx=0, my=0, rx=0, ry=0;
    
    const handleMouseMove = (e) => {
      mx = e.clientX; 
      my = e.clientY;
      if (cursorRef.current) {
        cursorRef.current.style.left = mx + 'px';
        cursorRef.current.style.top = my + 'px';
      }
    };
    
    let animId;
    const animRing = () => {
      rx += (mx - rx) * 0.12; 
      ry += (my - ry) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.left = rx + 'px';
        ringRef.current.style.top = ry + 'px';
      }
      animId = requestAnimationFrame(animRing);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    animRing();

    // Hover effect for interactive elements
    const interactiveElements = document.querySelectorAll('button, a, .mini-card, .p-card, .s-card, .pr-card');
    const handleMouseEnter = () => {
      if(cursorRef.current) { cursorRef.current.style.width='6px'; cursorRef.current.style.height='6px'; }
      if(ringRef.current) { ringRef.current.style.width='56px'; ringRef.current.style.height='56px'; ringRef.current.style.opacity='0.8'; }
    };
    const handleMouseLeave = () => {
      if(cursorRef.current) { cursorRef.current.style.width='12px'; cursorRef.current.style.height='12px'; }
      if(ringRef.current) { ringRef.current.style.width='36px'; ringRef.current.style.height='36px'; ringRef.current.style.opacity='0.5'; }
    };
    
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      document.body.classList.remove('has-custom-cursor');
      document.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }); // Run when elements might change



  // Navbar scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for reveals
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if(e.isIntersecting) {
          e.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });
    
    revealRefs.current.forEach(el => {
      if (el && !el.classList.contains('visible')) {
        obs.observe(el);
      }
    });
    
    return () => obs.disconnect();
  }, [filter, portfolioItems]); // Re-run when filter or data changes

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email) {
      triggerNotify('Please fill in your name and email.');
      return;
    }

    setSubmitting(true);
    try {
      // 1. Send to Formspree
      const response = await fetch('https://formspree.io/f/xwvalvoy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: contactForm.name,
          email: contactForm.email,
          service: contactForm.service,
          budget: contactForm.budget,
          message: contactForm.message
        })
      });

      if (!response.ok) throw new Error('Formspree submission failed');

      // 2. Also log to Supabase for backup (optional but good for tracking)
      await supabase.from('messages').insert([{
        name: contactForm.name,
        email: contactForm.email,
        service: contactForm.service,
        budget: contactForm.budget,
        description: contactForm.message
      }]);

      // 3. Clear Form & Show Success Modal
      setShowSuccess(true);
      setContactForm({ name: '', email: '', service: 'Gaming Thumbnail', budget: 'Basic', message: '' });

    } catch (e) {
      console.error('Submission error:', e);
      triggerNotify('Error sending message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const triggerNotify = (msg) => {
    setNotif({ show: true, msg });
    if(notifTimeout.current) clearTimeout(notifTimeout.current);
    notifTimeout.current = setTimeout(() => {
      setNotif(prev => ({ ...prev, show: false }));
    }, 3500);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdatingProfile(true);
    try {
      let avatarUrl = user.user_metadata?.avatar_url;

      if (newAvatar) {
        const fileExt = newAvatar.name.split('.').pop();
        const fileName = `${user.id}-${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('portfolio')
          .upload(`avatars/${fileName}`, newAvatar, { upsert: true });

        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('portfolio')
          .getPublicUrl(`avatars/${fileName}`);
        
        avatarUrl = publicUrl;
      }

      const { data, error } = await supabase.auth.updateUser({
        data: { 
          full_name: profileName,
          avatar_url: avatarUrl 
        }
      });

      if (error) throw error;
      
      setUser(data.user);
      setShowProfile(false);
      triggerNotify('Profile updated successfully!');
    } catch (e) {
      console.error('Update error:', e);
      triggerNotify('Error updating profile: ' + e.message);
    } finally {
      setUpdatingProfile(false);
    }
  };

  const onAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const filteredPortfolio = filter === 'all' ? portfolioItems : portfolioItems.filter(i => i.cat === filter);

  const addToRefs = (el) => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current.push(el);
    }
  };

  return (
    <>
      <div id="cursor" ref={cursorRef}></div>
      <div id="cursor-ring" ref={ringRef}></div>
      <div id="notif" style={{ display: notif.show ? 'flex' : 'none' }}>
        ✦ <span id="notif-text">{notif.msg}</span>
      </div>

      {/* NAV */}
      <nav id="navbar" className={scrolled ? 'scrolled' : ''}>
        <div className="logo cursor-pointer flex items-center gap-3" onClick={() => { navigate('/'); window.scrollTo({top: 0, behavior: 'smooth'}); }}>
          <img src="/logo.png" alt="Pixel Vibe Logo" className="w-8 h-8 md:w-10 md:h-10 object-contain" />
          <span className="font-['Orbitron'] font-black text-sm md:text-xl tracking-widest text-white">PIXEL VIBE</span>
        </div>
        <div className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <a href="#hero" onClick={() => setMobileMenuOpen(false)}>Home</a>
          <a href="#portfolio" onClick={() => setMobileMenuOpen(false)}>Portfolio</a>
          <a href="#services" onClick={() => setMobileMenuOpen(false)}>Services</a>
          <a href="#about" onClick={() => setMobileMenuOpen(false)}>About</a>
          <a href="#pricing" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
          <a href="#contact" className="md:hidden mt-4 py-3 bg-cyan text-black text-center font-bold rounded-xl" onClick={() => setMobileMenuOpen(false)}>HIRE ME</a>
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          <div className="hidden md:flex items-center">
            <a href="#contact" className="nav-cta">Hire Me</a>
          </div>

          {user && (
            <div 
              className="nav-profile cursor-pointer" 
              onClick={() => setShowProfile(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer' }}
            >
              <div className={`user-avatar overflow-hidden relative ${isPro ? 'ring-2 ring-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.5)]' : ''}`} style={{ 
                width: '32px', height: '32px', borderRadius: '8px', 
                background: isPro ? 'linear-gradient(135deg, #fbbf24, #d97706)' : 'linear-gradient(135deg, var(--cyan), var(--blue))',
                display: 'flex', alignItems: 'center', justifyCenter: 'center',
                fontSize: '0.9rem', fontWeight: '900', color: '#000',
                fontFamily: "'Orbitron', sans-serif"
              }}>
                {isPro && (
                  <div className="absolute top-0 right-0 w-2 h-2 bg-yellow-400 rounded-full border border-black z-10"></div>
                )}
                {user.user_metadata?.avatar_url ? (
                  <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span style={{ margin: 'auto' }}>{(user.user_metadata?.full_name || user.email)?.[0].toUpperCase()}</span>
                )}
              </div>
              <div className="user-info hide-mobile" style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: '800', fontFamily: "'Rajdhani', sans-serif", color: '#fff', letterSpacing: '1px', lineHeight: '1' }}>
                  {user.user_metadata?.full_name?.split(' ')[0] || 'CREATOR'}
                </span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setShowProfile(true); }}
                    style={{ background: 'none', border: 'none', padding: 0, color: 'var(--cyan)', fontSize: '0.55rem', fontWeight: '700', cursor: 'pointer', textAlign: 'left', fontFamily: "'Rajdhani', sans-serif" }}
                  >EDIT</button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); supabase.auth.signOut(); }} 
                    style={{ background: 'none', border: 'none', padding: 0, color: 'var(--pink)', fontSize: '0.55rem', fontWeight: '700', cursor: 'pointer', textAlign: 'left', fontFamily: "'Rajdhani', sans-serif" }}
                  >LOGOUT</button>
                </div>
              </div>
            </div>
          )}

          <button 
            className="mobile-nav-toggle" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ fontSize: '1.2rem', padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section id="hero">
        <div className="hero-grid"></div>
        <div className="hero-orb orb1"></div>
        <div className="hero-orb orb2"></div>
        <div className="hero-orb orb3"></div>
        <div className="hero-content">
          <div className="hero-left">
            <div className="hero-badge">
              <span className="badge-dot"></span>
              <span className="badge-text" style={{ cursor: 'none' }}>Available for Work</span>
            </div>
            <h1 className="hero-title">
              <span className="line1">LEVEL UP</span>
              <span className="line2">YOUR DESIGNS</span>
              <span className="line3">PREMIUM CREATIVE STUDIO</span>
            </h1>
            <p className="hero-sub">Premium gaming & creative designs crafted to dominate. Thumbnails, logos, overlays, social posts — built to convert and built to last.</p>
            <div className="hero-btns">
              <button className="btn-primary" onClick={() => document.getElementById('portfolio').scrollIntoView({behavior:'smooth'})}>View My Work →</button>
              <button className="btn-ghost" onClick={() => document.getElementById('contact').scrollIntoView({behavior:'smooth'})}>Hire Me</button>
            </div>
          </div>
          <div className="hero-right">
            <div className="mini-card mc1">
              <span className="mc-icon">🎮</span>
              <div className="mc-label">Gaming Thumbs</div>
              <div className="mc-sub" style={{color: 'var(--cyan)'}}>{getCount('gaming-thumb')} Designs</div>
            </div>
            <div className="mini-card mc2">
              <span className="mc-icon">⚡</span>
              <div className="mc-label">Gaming Logos</div>
              <div className="mc-sub" style={{color: 'var(--pink)'}}>{getCount('gaming-logo')} Designs</div>
            </div>
            <div className="mini-card mc3">
              <span className="mc-icon">📡</span>
              <div className="mc-label">Social Posts</div>
              <div className="mc-sub" style={{color: 'var(--purple)'}}>{getCount('gaming-post')} Designs</div>
            </div>
            <div className="mini-card mc4">
              <span className="mc-icon">✦</span>
              <div className="mc-label">Normal Logos</div>
              <div className="mc-sub" style={{color: 'var(--blue)'}}>{getCount('normal-logo')} Designs</div>
            </div>
          </div>
        </div>
        <div className="scroll-hint">
          <div className="scroll-line"></div>
          <span className="scroll-text">Scroll</span>
        </div>
      </section>

      {/* PORTFOLIO */}
      <section id="portfolio">
        <div className="sec-header reveal" ref={addToRefs}>
          <span className="sec-tag" style={{color: 'var(--cyan)'}}>My Work</span>
          <div className="sec-title">Design <span className="glow-cyan">Portfolio</span></div>
        </div>
        <div className="filter-bar reveal" ref={addToRefs}>
          <button 
            className={`filter-btn ${filter === 'all' ? 'on' : 'off'}`} 
            style={filter === 'all' ? { background: 'linear-gradient(135deg, var(--cyan), var(--blue))', color: '#000' } : {}}
            onClick={() => setFilter('all')}
          >All</button>
          <button className={`filter-btn ${filter === 'gaming-thumb' ? 'on' : 'off'}`} style={filter === 'gaming-thumb' ? { background: 'linear-gradient(135deg, var(--cyan), var(--blue))', color: '#000' } : {}} onClick={() => setFilter('gaming-thumb')}>Gaming Thumbs</button>
          <button className={`filter-btn ${filter === 'gaming-logo' ? 'on' : 'off'}`} style={filter === 'gaming-logo' ? { background: 'linear-gradient(135deg, var(--cyan), var(--blue))', color: '#000' } : {}} onClick={() => setFilter('gaming-logo')}>Gaming Logos</button>
          <button className={`filter-btn ${filter === 'gaming-post' ? 'on' : 'off'}`} style={filter === 'gaming-post' ? { background: 'linear-gradient(135deg, var(--cyan), var(--blue))', color: '#000' } : {}} onClick={() => setFilter('gaming-post')}>Gaming Posts</button>
          <button className={`filter-btn ${filter === 'normal-thumb' ? 'on' : 'off'}`} style={filter === 'normal-thumb' ? { background: 'linear-gradient(135deg, var(--cyan), var(--blue))', color: '#000' } : {}} onClick={() => setFilter('normal-thumb')}>Normal Thumbs</button>
          <button className={`filter-btn ${filter === 'normal-logo' ? 'on' : 'off'}`} style={filter === 'normal-logo' ? { background: 'linear-gradient(135deg, var(--cyan), var(--blue))', color: '#000' } : {}} onClick={() => setFilter('normal-logo')}>Normal Logos</button>
          <button className={`filter-btn ${filter === 'normal-post' ? 'on' : 'off'}`} style={filter === 'normal-post' ? { background: 'linear-gradient(135deg, var(--cyan), var(--blue))', color: '#000' } : {}} onClick={() => setFilter('normal-post')}>Normal Posts</button>
        </div>
        
        <div className="portfolio-grid" id="portfolioGrid">
          {loadingPortfolio ? (
            <div className="col-span-full py-12 text-center text-gray-500 font-['Rajdhani'] uppercase tracking-widest animate-pulse">Loading amazing designs...</div>
          ) : filteredPortfolio.length === 0 ? (
            <div className="col-span-full py-12 text-center text-gray-500 font-['Rajdhani'] uppercase tracking-widest">No items found. Add some from the Admin Panel!</div>
          ) : (
            filteredPortfolio.map(item => (
              <div key={item.id} className="p-card reveal" ref={addToRefs} onClick={() => setSelectedItem(item)}>
                <div className="p-card-bg" style={{ 
                  position:'absolute', 
                  inset:0, 
                  background: item.bg || `linear-gradient(135deg, ${item.color}20, #0a0a1f)`,
                  backgroundImage: item.image_url ? `url(${item.image_url})` : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}></div>
                {!item.image_url && (
                  <svg className="p-card-shapes" viewBox="0 0 300 240" xmlns="http://www.w3.org/2000/svg" style={{ color: item.color }}>
                    <polygon points="150,20 260,80 230,200 70,200 40,80" fill="none" stroke="currentColor" strokeWidth="1"/>
                    <circle cx="150" cy="120" r="40" fill="none" stroke="currentColor" strokeWidth="0.8"/>
                    <line x1="40" y1="80" x2="260" y2="80" stroke="currentColor" strokeWidth="0.5"/>
                    <circle cx="150" cy="120" r="8" fill="currentColor" opacity="0.4"/>
                  </svg>
                )}
                <div className="p-card-overlay" style={{ background: item.image_url ? 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)' : undefined }}></div>
                <div className="p-card-info">
                  <span className="p-tag" style={{ color: item.color, borderColor: `${item.color}40` }}>{item.sub}</span>
                  <div className="p-title">{item.title}</div>
                </div>
                <div className="p-action" style={{ color: item.color }}>↗</div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* SERVICES */}
      <section id="services">
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="sec-header reveal" ref={addToRefs}>
            <span className="sec-tag" style={{ color: 'var(--purple)' }}>What I Offer</span>
            <div className="sec-title">My <span className="glow-purple">Services</span></div>
          </div>
          <div className="services-grid" id="servicesGrid">
            {services.map((s, i) => (
              <div 
                key={i} 
                className="s-card reveal" 
                ref={addToRefs}
                style={{ transitionDelay: `${i * 0.08}s` }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor=`${s.color}40`; e.currentTarget.style.boxShadow=`0 24px 60px ${s.color}15`; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor='rgba(255,255,255,0.06)'; e.currentTarget.style.boxShadow='none'; }}
              >
                <span className="s-icon">{s.icon}</span>
                <div className="s-title">{s.title}</div>
                <div className="s-desc">{s.desc}</div>
                <div className="s-footer">
                  <span className="s-price" style={{ color: s.color }}>{s.price}</span>
                  <button className="s-btn" style={{ background: s.color }} onClick={() => setOrderChoice({ title: s.title, color: s.color })}>Order Now</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about">
        <div className="about-inner">
          <div className="about-visual reveal-left" ref={addToRefs}>
            <div className="about-img-frame overflow-hidden">
              <img src="/me.jpg" alt="Pixel Vibe Creator" className="w-full h-full object-cover" />
            </div>
            <div className="about-glow-badge">
              <div className="badge-role">Graphic Designer</div>
              <div className="badge-spec">Gaming & Creative Specialist</div>
            </div>
            <div className="about-stats-floating">
              <div className="stat-num">200+</div>
              <div className="stat-label">Projects</div>
            </div>
          </div>
          <div className="about-text reveal-right" ref={addToRefs}>
            <span className="sec-tag" style={{ color: 'var(--cyan)', textAlign: 'left', display: 'block' }}>About Me</span>
            <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 900, fontSize: 'clamp(1.8rem, 2.5vw, 2.8rem)', color: '#fff', lineHeight: 1.15, marginBottom: '1.5rem' }}>
              Turning Ideas Into<br/><span className="glow-cyan">Visual Power</span>
            </h2>
            <p>I'm a passionate graphic designer specializing in gaming and creative design. I create premium visuals that make content stand out — from intense gaming thumbnails that drive clicks to clean brand logos that leave a lasting impression.</p>
            <p>Every pixel is intentional. Every design is crafted with purpose, precision, and a deep understanding of what captures attention in today's visual landscape.</p>
            <div className="about-skills">
              <span className="skill-pill" style={{ background: 'rgba(0,245,212,0.08)', borderColor: 'rgba(0,245,212,0.3)', color: 'var(--cyan)' }}>Adobe Photoshop</span>
              <span className="skill-pill" style={{ background: 'rgba(247,37,133,0.08)', borderColor: 'rgba(247,37,133,0.3)', color: 'var(--pink)' }}>Illustrator</span>
              <span className="skill-pill" style={{ background: 'rgba(114,9,183,0.08)', borderColor: 'rgba(114,9,183,0.3)', color: '#a855f7' }}>After Effects</span>
              <span className="skill-pill" style={{ background: 'rgba(67,97,238,0.08)', borderColor: 'rgba(67,97,238,0.3)', color: 'var(--blue)' }}>Figma</span>
              <span className="skill-pill" style={{ background: 'rgba(255,165,0,0.08)', borderColor: 'rgba(255,165,0,0.3)', color: '#ffa500' }}>Canva Pro</span>
              <span className="skill-pill" style={{ background: 'rgba(0,200,100,0.08)', borderColor: 'rgba(0,200,100,0.3)', color: '#00c864' }}>Blender</span>
            </div>
            <div className="stats-row">
              <div className="stat-box"><div className="num" style={{ color: 'var(--cyan)' }}>200+</div><div className="lbl">Projects</div></div>
              <div className="stat-box"><div className="num" style={{ color: 'var(--pink)' }}>50+</div><div className="lbl">Clients</div></div>
              <div className="stat-box"><div className="num" style={{ color: 'var(--purple)' }}>3+</div><div className="lbl">Years Exp</div></div>
              <div className="stat-box"><div className="num" style={{ color: 'var(--blue)' }}>100%</div><div className="lbl">Satisfaction</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing">
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="sec-header reveal" ref={addToRefs}>
            <span className="sec-tag" style={{ color: 'var(--pink)' }}>Investment</span>
            <div className="sec-title">Transparent <span className="glow-pink">Pricing</span></div>
          </div>
          <div className="pricing-grid reveal" ref={addToRefs}>
            <div className="pr-card">
              <div className="pr-price">FREE</div>
              <div className="pr-period">Limited availability</div>
              <ul className="pr-features">
                {/* No features as requested */}
              </ul>
              <button className="btn-ghost" style={{ width: '100%', justifyContent: 'center' }} onClick={() => navigate('/order-plan/free')}>Get Started</button>
            </div>
            <div className="pr-card featured">
              <div className="pr-badge">Most Popular</div>
              <div className="pr-price">BASIC</div>
              <div className="pr-period">per design</div>
              <ul className="pr-features">
                <li className="yes">1 Design Variation</li>
                <li className="yes">High Quality Design</li>
                <li className="yes">1-Day Delivery</li>
                <li className="yes">Unlimited Revisions</li>
              </ul>
              <button className="btn-primary" style={{ width: '100%' }} onClick={() => navigate('/order-plan/basic')}>Get Started</button>
            </div>
            <div className="pr-card">
              <div className="pr-price" style={{ fontSize: '2.5rem' }}>STANDARD</div>
              <div className="pr-period">Best value</div>
              <ul className="pr-features">
                <li className="yes">5 Design Variations</li>
                <li className="yes">High Quality Design</li>
                <li className="yes">2-Day Delivery</li>
                <li className="yes">Unlimited Revisions</li>
              </ul>
              <button className="btn-ghost" style={{ width: '100%', justifyContent: 'center' }} onClick={() => navigate('/order-plan/standard')}>Get Started</button>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact">
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="sec-header reveal" ref={addToRefs}>
            <span className="sec-tag" style={{ color: 'var(--blue)' }}>Get In Touch</span>
            <div className="sec-title">Start a <span className="glow-cyan">Project</span></div>
          </div>
          <div className="contact-inner">
            <div className="contact-info reveal-left" ref={addToRefs}>
              <h3>Let's Create Something Epic</h3>
              <p>Have a project in mind? I'd love to hear about it. Drop me a message and I'll get back to you within 24 hours.</p>
              <div className="contact-item">
                <div className="c-icon" style={{ background: 'rgba(0,245,212,0.1)', color: 'var(--cyan)' }}>📧</div>
                <div>
                  <div className="c-label">Email</div>
                  <div className="c-val">hello@pixelvibe.design</div>
                </div>
              </div>
              <a href="https://wa.me/94753951531" target="_blank" rel="noreferrer" className="contact-item" style={{textDecoration:'none', transition:'transform 0.3s'}}>
                <div className="c-icon wa-highlight" style={{ background: 'rgba(37,211,102,0.15)', color: '#25d366' }}>
                  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="22px" width="22px" xmlns="http://www.w3.org/2000/svg"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"></path></svg>
                </div>
                <div>
                  <div className="c-label">WhatsApp</div>
                  <div className="c-val">+94 75 395 1531</div>
                </div>
              </a>
              <div className="contact-item">
                <div className="c-icon" style={{ background: 'rgba(114,9,183,0.1)', color: 'var(--purple)' }}>⏱</div>
                <div>
                  <div className="c-label">Response Time</div>
                  <div className="c-val">Within 24 hours</div>
                </div>
              </div>
              <div className="contact-item">
                <div className="c-icon" style={{ background: 'rgba(67,97,238,0.1)', color: 'var(--blue)' }}>📍</div>
                <div>
                  <div className="c-label">Timezone</div>
                  <div className="c-val">Available Worldwide</div>
                </div>
              </div>
            </div>
            <form className="contact-form reveal-right" ref={addToRefs} onSubmit={handleContactSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Your Name</label>
                  <input 
                    type="text" 
                    placeholder="John Doe" 
                    required
                    value={contactForm.name}
                    onChange={e => setContactForm({...contactForm, name: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    placeholder="john@email.com" 
                    required
                    value={contactForm.email}
                    onChange={e => setContactForm({...contactForm, email: e.target.value})}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Service Needed</label>
                <select 
                  value={contactForm.service}
                  onChange={e => setContactForm({...contactForm, service: e.target.value})}
                >
                  <option>Gaming Thumbnail</option>
                  <option>Gaming Logo</option>
                  <option>Gaming Social Post</option>
                  <option>Normal Thumbnail</option>
                  <option>Normal Logo</option>
                  <option>Normal Social Post</option>
                  <option>Full Brand Package</option>
                </select>
              </div>
              <div className="form-group">
                <label>Budget Range</label>
                <select
                  value={contactForm.budget}
                  onChange={e => setContactForm({...contactForm, budget: e.target.value})}
                >
                  <option>Basic</option>
                  <option>Standard</option>
                  <option>Premium</option>
                  <option>Enterprise</option>
                </select>
              </div>
              <div className="form-group">
                <label>Project Description</label>
                <textarea 
                  placeholder="Describe your project, style preferences, references..."
                  value={contactForm.message}
                  onChange={e => setContactForm({...contactForm, message: e.target.value})}
                ></textarea>
              </div>
              <button 
                type="submit" 
                className="submit-btn" 
                disabled={submitting}
              >
                {submitting ? 'SENDING...' : 'Send Message →'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-inner">
          <div className="footer-brand">
            <span className="logo">PIXEL VIBE</span>
            <p>Premium gaming & creative design studio. Building visuals that dominate the digital space.</p>
            <div className="socials" style={{ marginTop: '1.5rem' }}>
              <a className="social-btn" href="#">𝕏</a>
              <a className="social-btn" href="#">in</a>
              <a className="social-btn" href="#">▶</a>
              <a className="social-btn" href="#">◉</a>
            </div>
          </div>
          <div className="footer-col">
            <h4>Work</h4>
            <a href="#portfolio">Portfolio</a>
            <a href="#services">Services</a>
            <a href="#pricing">Pricing</a>
          </div>
          <div className="footer-col">
            <h4>Categories</h4>
            <a href="#">Gaming Thumbnails</a>
            <a href="#">Gaming Logos</a>
            <a href="#">Social Posts</a>
            <a href="#">Normal Logos</a>
          </div>
          <div className="footer-col">
            <h4>Contact</h4>
            <a href="#">hello@pixelvibe.design</a>
            <a href="#">Discord</a>
            <a href="#">Instagram</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 Pixel Vibe. All rights reserved.</p>
          <p style={{ color: 'rgba(255,255,255,0.15)' }}>Designed with ⚡ by Pixel Vibe</p>
        </div>
      </footer>
      {/* LIGHTBOX */}
      {selectedItem && (
        <div 
          className="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => setSelectedItem(null)}
        >
          <button 
            onClick={(e) => { e.stopPropagation(); setSelectedItem(null); }} 
            className="absolute top-8 left-8 flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white border border-white/10 backdrop-blur-md transition-all group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-['Rajdhani'] font-bold tracking-widest uppercase">Back to Portfolio</span>
          </button>

          <button 
            onClick={(e) => { e.stopPropagation(); setSelectedItem(null); }} 
            className="absolute top-8 right-8 w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white border border-white/10 backdrop-blur-md transition-all"
          >
            <X size={24} />
          </button>
          
          <div 
            className="relative w-full max-w-5xl max-h-[90vh] flex flex-col items-center animate-in zoom-in-95 duration-500"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedItem.image_url ? (
               <img 
                 src={selectedItem.image_url} 
                 alt={selectedItem.title} 
                 className="w-full h-full object-contain rounded-2xl shadow-[0_20px_80px_rgba(0,0,0,0.8)] border border-white/5"
               />
            ) : (
              <div className="w-full aspect-video rounded-3xl flex items-center justify-center relative overflow-hidden" style={{ background: selectedItem.bg || '#0d0d22' }}>
                <svg className="w-64 h-64 opacity-20" viewBox="0 0 300 240" xmlns="http://www.w3.org/2000/svg" style={{ color: selectedItem.color }}>
                  <polygon points="150,20 260,80 230,200 70,200 40,80" fill="none" stroke="currentColor" strokeWidth="1"/>
                  <circle cx="150" cy="120" r="40" fill="none" stroke="currentColor" strokeWidth="0.8"/>
                </svg>
                <div className="absolute text-5xl font-['Orbitron'] font-black text-white/10">PREVIEW</div>
              </div>
            )}
            
            <div className="mt-8 text-center space-y-2">
              <span className="px-4 py-1.5 rounded-full border border-white/10 text-xs font-['Rajdhani'] font-bold tracking-widest uppercase" style={{ color: selectedItem.color }}>
                {selectedItem.sub}
              </span>
              <h2 className="text-3xl md:text-5xl font-['Orbitron'] font-black text-white">{selectedItem.title}</h2>
              <p className="text-gray-400 font-['Rajdhani'] tracking-wide max-w-lg">Premium design crafted with precision for high-end gaming and creative brands.</p>
            </div>
          </div>
        </div>
      )}

      {/* ORDER CHOICE MODAL */}
      {orderChoice && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300" onClick={() => setOrderChoice(null)}>
          <div className="bg-[#0d0d22] border border-white/10 p-8 rounded-3xl w-full max-w-md relative z-[120] text-center shadow-[0_0_60px_rgba(0,0,0,0.5)]" onClick={e => e.stopPropagation()}>
            <h3 className="text-2xl font-['Orbitron'] font-black text-white mb-2">Order <span style={{ color: orderChoice.color }}>{orderChoice.title}</span></h3>
            <p className="text-gray-400 font-['Rajdhani'] mb-6 tracking-wider uppercase text-sm">How would you like to proceed with your order?</p>
            
            {/* Quantity Selector */}
            <div className="flex flex-col items-center mb-8 p-4 bg-white/5 rounded-2xl border border-white/5">
              <span className="text-gray-500 text-[10px] font-bold tracking-[3px] uppercase mb-3">Select Quantity</span>
              <div className="flex items-center gap-6">
                <button 
                  onClick={() => setOrderQty(Math.max(1, orderQty - 1))}
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all text-xl font-bold"
                >
                  −
                </button>
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-['Orbitron'] font-black text-white">{orderQty}</span>
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">{orderQty > 1 ? 'Units' : 'Unit'}</span>
                </div>
                <button 
                  onClick={() => setOrderQty(orderQty + 1)}
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all text-xl font-bold"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <button 
                onClick={() => {
                  setContactForm({ ...contactForm, service: orderChoice.title });
                  setOrderChoice(null);
                  document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full flex items-center justify-center gap-3 bg-white/5 border border-white/10 hover:border-white/30 text-white font-bold py-4 rounded-2xl font-['Rajdhani'] tracking-widest transition-all"
              >
                📧 VIA CONTACT FORM
              </button>
              
              <a 
                href={`https://wa.me/94753951531?text=${encodeURIComponent(
                  `🔥 *NEW ORDER FROM PIXEL VIBE*\n\n` +
                  `━━━━━━━━━━━━━━━━━━━━\n` +
                  `📌 *Category:* ${orderChoice.title}\n` +
                  `📦 *Quantity:* ${orderQty} ${orderQty > 1 ? 'Designs' : 'Design'}\n` +
                  `👤 *Status:* Ready to start\n` +
                  `━━━━━━━━━━━━━━━━━━━━\n\n` +
                  `Hello! I'm interested in ordering ${orderQty} ${orderChoice.title}. Please let me know the next steps.`
                )}`}
                target="_blank" 
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-[#25d366] to-[#128c7e] text-white font-bold py-4 rounded-2xl font-['Rajdhani'] tracking-widest transition-all no-underline shadow-[0_10px_30px_rgba(37,211,102,0.3)]"
                onClick={() => { setOrderChoice(null); setOrderQty(1); }}
              >
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="20px" width="20px"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"></path></svg>
                VIA WHATSAPP
              </a>
            </div>
            
            <button onClick={() => setOrderChoice(null)} className="mt-8 text-gray-500 hover:text-white text-xs font-['Rajdhani'] uppercase tracking-widest font-bold">Cancel</button>
          </div>
        </div>
      )}

      {/* SUCCESS MODAL */}
      {showSuccess && (
        <div 
          className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-in fade-in duration-300"
          onClick={() => setShowSuccess(false)}
        >
          <div 
            className="bg-[#0d0d22] border border-cyan/30 p-10 rounded-3xl w-full max-w-sm relative z-[2010] text-center shadow-[0_0_100px_rgba(0,245,212,0.15)] animate-in zoom-in-90 duration-500"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-20 h-20 bg-cyan/10 border border-cyan/20 rounded-full flex items-center justify-center mx-auto mb-6 relative">
              <div className="absolute inset-0 rounded-full bg-cyan/20 animate-ping"></div>
              <span className="text-3xl text-cyan relative z-10">✓</span>
            </div>
            <h3 className="text-2xl font-['Orbitron'] font-black text-white mb-2 tracking-tight">MESSAGE <span className="text-cyan">SENT!</span></h3>
            <p className="text-gray-400 font-['Rajdhani'] mb-10 tracking-wider uppercase text-xs leading-relaxed">
              Your inquiry has been received.<br/>I'll get back to you within 24 hours.
            </p>
            <button 
              onClick={() => setShowSuccess(false)} 
              className="w-full bg-gradient-to-r from-cyan to-blue text-black font-black py-4 rounded-xl font-['Rajdhani'] tracking-[3px] uppercase text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-[0_10px_30px_rgba(0,245,212,0.3)] cursor-pointer"
              style={{ cursor: 'pointer' }}
            >
              CONTINUE
            </button>
          </div>
        </div>
      )}

      {user && (
        <ProfileModal 
          show={showProfile}
          onClose={() => setShowProfile(false)}
          user={user}
          isPro={isPro}
          profileName={profileName}
          setProfileName={setProfileName}
          onAvatarChange={onAvatarChange}
          avatarPreview={avatarPreview}
          updatingProfile={updatingProfile}
          handleUpdateProfile={handleUpdateProfile}
        />
      )}
    </>
  );
}

const ProfileModal = ({ show, onClose, user, isPro, profileName, setProfileName, onAvatarChange, avatarPreview, updatingProfile, handleUpdateProfile }) => {
  if (!show) return null;
  const joinedDate = new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  
  return (
    <div 
      className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div 
        className="bg-[#0a0a1f] border border-cyan/20 p-6 md:p-10 rounded-[2.5rem] w-full max-w-sm md:max-w-md relative z-[3010] shadow-[0_0_100px_rgba(0,245,212,0.15)] animate-in zoom-in-95 duration-500 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan/10 blur-[60px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink/10 blur-[60px] rounded-full"></div>

        <div className="flex justify-between items-center mb-10 relative z-10">
          <div className="flex flex-col">
            <h3 className="text-xl md:text-2xl font-['Orbitron'] font-black text-white tracking-widest">CREATOR <span className="text-cyan">PROFILE</span></h3>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[4px]">Verified Workspace</span>
          </div>
          <button 
            onClick={onClose} 
            className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all border border-white/5"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-8 relative z-10">
          {/* Profile Image with Glow */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative group cursor-pointer">
              <div className={`absolute -inset-1 rounded-[2.2rem] blur opacity-40 group-hover:opacity-100 transition duration-500 ${isPro ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' : 'bg-gradient-to-r from-cyan to-blue'}`}></div>
              <div className={`relative w-24 h-24 md:w-28 md:h-28 rounded-[2rem] bg-[#0d0d22] border-2 flex items-center justify-center overflow-hidden ${isPro ? 'border-yellow-500/50' : 'border-white/10'}`}>
                {avatarPreview || user.user_metadata?.avatar_url ? (
                  <img src={avatarPreview || user.user_metadata.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl md:text-4xl text-cyan/70 font-black font-['Orbitron']">{(profileName || user.email)?.[0].toUpperCase()}</span>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300 backdrop-blur-sm">
                  <div className="flex flex-col items-center gap-1">
                    <Edit2 size={24} className="text-white" />
                    <span className="text-[8px] font-bold text-white uppercase tracking-widest">EDIT</span>
                  </div>
                </div>
              </div>
              <input 
                type="file" 
                accept="image/*" 
                onChange={onAvatarChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {/* User Stats Plate */}
          <div className="grid grid-cols-2 gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
            <div className="text-center border-r border-white/5">
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Joined</div>
              <div className="text-xs font-bold text-white font-['Rajdhani'] uppercase tracking-widest">{joinedDate}</div>
            </div>
            <div className="text-center">
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Status</div>
              <div className={`text-xs font-bold font-['Rajdhani'] uppercase tracking-widest ${isPro ? 'text-yellow-500' : 'text-cyan'}`}>
                {isPro ? '💎 Pro Member' : 'Free Member'}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="form-group">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[3px] mb-3 block">Display Identity</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={profileName}
                  onChange={e => setProfileName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white font-['Rajdhani'] font-bold tracking-widest focus:outline-none focus:border-cyan/50 focus:bg-white/10 transition-all"
                  placeholder="Enter creator name..."
                />
              </div>
            </div>
          </div>

          {/* Solid Submit Button - No Glow */}
          <button 
            type="submit" 
            disabled={updatingProfile}
            className="w-full relative group transition-transform active:scale-95"
          >
            <div className="bg-[#00f5d4] py-4 rounded-xl flex items-center justify-center gap-3 border border-[#00f5d4]">
              <span className="text-black font-black font-['Rajdhani'] tracking-[4px] uppercase text-sm">
                {updatingProfile ? 'SYNCING...' : 'SAVE PROFILE'}
              </span>
              {!updatingProfile && <span className="text-black text-xl">→</span>}
            </div>
          </button>
        </form>

        <button 
          onClick={() => { supabase.auth.signOut(); onClose(); }}
          className="w-full mt-8 text-center text-pink/40 hover:text-pink transition-colors font-bold font-['Rajdhani'] tracking-[3px] uppercase text-[9px]"
        >
          Terminate current session
        </button>
      </div>
    </div>
  );
}

export default Home;
