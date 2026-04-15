import { useState, useEffect, useRef } from 'react';
import './index.css';

function App() {
  const [scrolled, setScrolled] = useState(false);
  const [filter, setFilter] = useState('all');
  const [notif, setNotif] = useState({ show: false, msg: '' });
  
  const cursorRef = useRef(null);
  const ringRef = useRef(null);
  const revealRefs = useRef([]);
  let notifTimeout = useRef(null);

  // Portfolio items matching the HTML
  const portfolioItems = [
    {id:1,cat:'gaming-thumb',title:'Warzone Drop Zone',sub:'Gaming Thumb',color:'#00f5d4',bg:'linear-gradient(135deg,#0f0c29,#302b63,#24243e)',icon:'🎮'},
    {id:2,cat:'gaming-logo',title:'Phantom Esports',sub:'Gaming Logo',color:'#f72585',bg:'linear-gradient(135deg,#1a0533,#4a0e6e)',icon:'⚡'},
    {id:3,cat:'gaming-post',title:'Tournament Hype',sub:'Gaming Post',color:'#a855f7',bg:'linear-gradient(135deg,#0d0d0d,#1a1a2e,#16213e)',icon:'📡'},
    {id:4,cat:'normal-thumb',title:'Tech Review 2025',sub:'Normal Thumb',color:'#4cc9f0',bg:'linear-gradient(135deg,#0f2027,#203a43,#2c5364)',icon:'🖼️'},
    {id:5,cat:'normal-logo',title:'Blaze Brand Co.',sub:'Normal Logo',color:'#f77f00',bg:'linear-gradient(135deg,#1a0a00,#6b2f00)',icon:'✦'},
    {id:6,cat:'normal-post',title:'Minimal Story Post',sub:'Normal Post',color:'#06d6a0',bg:'linear-gradient(135deg,#0a1628,#0a4a3a)',icon:'📸'},
    {id:7,cat:'gaming-thumb',title:'Apex Ranked Push',sub:'Gaming Thumb',color:'#ff4d4d',bg:'linear-gradient(135deg,#1a0000,#6b0000)',icon:'🎮'},
    {id:8,cat:'gaming-logo',title:'Storm Guild FC',sub:'Gaming Logo',color:'#00c3ff',bg:'linear-gradient(135deg,#001a2e,#006b8e)',icon:'⚡'},
    {id:9,cat:'gaming-post',title:'Stream Overlay Pack',sub:'Gaming Post',color:'#f72585',bg:'linear-gradient(135deg,#160020,#3d0060)',icon:'📡'},
    {id:10,cat:'normal-logo',title:'Aether Collective',sub:'Normal Logo',color:'#ffd700',bg:'linear-gradient(135deg,#0a0800,#2a2000)',icon:'✦'},
    {id:11,cat:'normal-thumb',title:'Lifestyle Vlog',sub:'Normal Thumb',color:'#4cc9f0',bg:'linear-gradient(135deg,#001a3d,#003d8a)',icon:'🖼️'},
    {id:12,cat:'normal-post',title:'Brand Announcement',sub:'Normal Post',color:'#06d6a0',bg:'linear-gradient(135deg,#001a0e,#004d2a)',icon:'📸'},
  ];

  const services = [
    {icon:'🎮',title:'Gaming Thumbnails',desc:'High-impact YouTube & stream thumbnails engineered to stop the scroll and dominate search results.',price:'$25',color:'var(--cyan)'},
    {icon:'⚡',title:'Gaming Logos',desc:'Fierce esports logos and team branding that commands respect in any competitive arena.',price:'$80',color:'var(--pink)'},
    {icon:'📡',title:'Gaming Social Posts',desc:'Scroll-stopping social content designed to grow your gaming brand across all platforms.',price:'$30',color:'var(--purple)'},
    {icon:'🖼️',title:'Normal Thumbnails',desc:'Clean, professional thumbnails for lifestyle, business, and content creators who demand quality.',price:'$20',color:'#4cc9f0'},
    {icon:'✦',title:'Normal Logos',desc:'Modern, memorable logos for businesses, personal brands, and creative projects of all kinds.',price:'$60',color:'#f77f00'},
    {icon:'📸',title:'Social Media Posts',desc:'Eye-catching posts for Instagram, Twitter, and TikTok that elevate your brand presence.',price:'$25',color:'#06d6a0'},
  ];

  // Mouse move for custom cursor
  useEffect(() => {
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
  }, [filter]); // Re-run when filter changes because elements are re-rendered

  const triggerNotify = (msg) => {
    setNotif({ show: true, msg });
    if(notifTimeout.current) clearTimeout(notifTimeout.current);
    notifTimeout.current = setTimeout(() => {
      setNotif(prev => ({ ...prev, show: false }));
    }, 3500);
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
        <div className="logo">PIXEL VIBE</div>
        <div className="nav-links">
          <a href="#hero">Home</a>
          <a href="#portfolio">Portfolio</a>
          <a href="#services">Services</a>
          <a href="#about">About</a>
          <a href="#pricing">Pricing</a>
          <a href="#contact">Contact</a>
          <a href="#contact" className="nav-cta">Hire Me</a>
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
              <div className="mc-sub" style={{color: 'var(--cyan)'}}>24 Designs</div>
            </div>
            <div className="mini-card mc2">
              <span className="mc-icon">⚡</span>
              <div className="mc-label">Gaming Logos</div>
              <div className="mc-sub" style={{color: 'var(--pink)'}}>18 Designs</div>
            </div>
            <div className="mini-card mc3">
              <span className="mc-icon">📡</span>
              <div className="mc-label">Social Posts</div>
              <div className="mc-sub" style={{color: 'var(--purple)'}}>32 Designs</div>
            </div>
            <div className="mini-card mc4">
              <span className="mc-icon">✦</span>
              <div className="mc-label">Normal Logos</div>
              <div className="mc-sub" style={{color: 'var(--blue)'}}>15 Designs</div>
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
          {filteredPortfolio.map(item => (
            <div key={item.id} className="p-card reveal" ref={addToRefs} onClick={() => triggerNotify(`Viewing: ${item.title}`)}>
              <div className="p-card-bg" style={{ position:'absolute', inset:0, background: item.bg }}></div>
              <svg className="p-card-shapes" viewBox="0 0 300 240" xmlns="http://www.w3.org/2000/svg" style={{ color: item.color }}>
                <polygon points="150,20 260,80 230,200 70,200 40,80" fill="none" stroke="currentColor" strokeWidth="1"/>
                <circle cx="150" cy="120" r="40" fill="none" stroke="currentColor" strokeWidth="0.8"/>
                <line x1="40" y1="80" x2="260" y2="80" stroke="currentColor" strokeWidth="0.5"/>
                <circle cx="150" cy="120" r="8" fill="currentColor" opacity="0.4"/>
              </svg>
              <div className="p-card-overlay"></div>
              <div className="p-card-info">
                <span className="p-tag" style={{ color: item.color, borderColor: `${item.color}40` }}>{item.sub}</span>
                <div className="p-title">{item.title}</div>
              </div>
              <div className="p-action" style={{ color: item.color }}>↗</div>
            </div>
          ))}
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
                  <button className="s-btn" style={{ background: s.color }} onClick={() => triggerNotify(`${s.title} order initiated!`)}>Order Now</button>
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
            <div className="about-img-frame">
              <span className="avatar-icon">👾</span>
              <div style={{ position:'absolute', inset:0, background: 'linear-gradient(to top, rgba(0,245,212,0.08), transparent)' }}></div>
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
              <div className="pr-name">Starter</div>
              <div className="pr-price"><span>$</span>25</div>
              <div className="pr-period">per design</div>
              <ul className="pr-features">
                <li className="yes">1 Design Variation</li>
                <li className="yes">HD Resolution (1080p)</li>
                <li className="yes">Source File Included</li>
                <li className="yes">3-day Delivery</li>
                <li className="no">Unlimited Revisions</li>
                <li className="no">Priority Support</li>
              </ul>
              <button className="btn-ghost" style={{ width: '100%', justifyContent: 'center' }} onClick={() => triggerNotify('Starter plan selected! Redirecting to contact...')}>Get Started</button>
            </div>
            <div className="pr-card featured">
              <div className="pr-badge">Most Popular</div>
              <div className="pr-name">Pro</div>
              <div className="pr-price"><span>$</span>80</div>
              <div className="pr-period">per project</div>
              <ul className="pr-features">
                <li className="yes">3 Design Variations</li>
                <li className="yes">4K Resolution</li>
                <li className="yes">All Source Files</li>
                <li className="yes">1-day Delivery</li>
                <li className="yes">Unlimited Revisions</li>
                <li className="no">Priority Support</li>
              </ul>
              <button className="btn-primary" style={{ width: '100%' }} onClick={() => triggerNotify('Pro plan selected! Redirecting to contact...')}>Get Started</button>
            </div>
            <div className="pr-card">
              <div className="pr-name">Elite</div>
              <div className="pr-price"><span>$</span>200</div>
              <div className="pr-period">full package</div>
              <ul className="pr-features">
                <li className="yes">Unlimited Variations</li>
                <li className="yes">4K + Vector</li>
                <li className="yes">Complete Brand Kit</li>
                <li className="yes">Same-day Rush</li>
                <li className="yes">Unlimited Revisions</li>
                <li className="yes">Priority Support 24/7</li>
              </ul>
              <button className="btn-ghost" style={{ width: '100%', justifyContent: 'center' }} onClick={() => triggerNotify('Elite plan selected! Redirecting to contact...')}>Get Started</button>
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
              <div className="contact-item">
                <div className="c-icon" style={{ background: 'rgba(247,37,133,0.1)', color: 'var(--pink)' }}>💬</div>
                <div>
                  <div className="c-label">Discord</div>
                  <div className="c-val">PixelVibe#0001</div>
                </div>
              </div>
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
            <div className="contact-form reveal-right" ref={addToRefs}>
              <div className="form-row">
                <div className="form-group">
                  <label>Your Name</label>
                  <input type="text" placeholder="John Doe"/>
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" placeholder="john@email.com"/>
                </div>
              </div>
              <div className="form-group">
                <label>Service Needed</label>
                <select>
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
                <select>
                  <option>$25 - $50</option>
                  <option>$50 - $100</option>
                  <option>$100 - $200</option>
                  <option>$200+</option>
                </select>
              </div>
              <div className="form-group">
                <label>Project Description</label>
                <textarea placeholder="Describe your project, style preferences, references..."></textarea>
              </div>
              <button className="submit-btn" onClick={() => triggerNotify('Message sent! I will get back to you within 24 hours. ✓')}>Send Message →</button>
            </div>
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
    </>
  );
}

export default App;
