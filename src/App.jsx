import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabase/config';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Auth from './pages/Auth';
import './index.css';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
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
          element={session ? <Home /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/admin" 
          element={session ? <Admin /> : <Navigate to="/login" />} 
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
