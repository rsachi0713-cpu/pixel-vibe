import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabase/config';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Auth from './pages/Auth';
import PricingProcess from './pages/PricingProcess';
import Community from './pages/Community';
import CategoryPortfolio from './pages/CategoryPortfolio';
import './index.css';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Capture Referral Code from URL immediately (Synchronous)
  // Doing this before useEffect to prevent losing it during Navigate redirects
  const urlParams = new URLSearchParams(window.location.search);
  const refCode = urlParams.get('ref');
  if (refCode) {
    localStorage.setItem('avary_editz_ref', refCode);
    console.log('Referral code captured officially:', refCode);
  }

  useEffect(() => {
    // 2. Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // 3. Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050510] flex items-center justify-center text-white font-['Orbitron'] tracking-widest text-xl">
        <span className="animate-pulse bg-clip-text text-transparent bg-gradient-to-r from-[#00f5d4] to-[#f72585]">
          LOADING...
        </span>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/login" 
          element={!session ? <Auth /> : <Navigate to="/" />} 
        />
        <Route 
          path="/" 
          element={<Home />} 
        />
        <Route 
          path="/admin" 
          element={session ? <Admin /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/order-plan/:planName" 
          element={session ? <PricingProcess /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/community" 
          element={session ? <Community /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/portfolio/:category" 
          element={<CategoryPortfolio />} 
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
