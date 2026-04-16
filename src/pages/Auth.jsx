import { useState } from 'react';
import { supabase } from '../supabase/config';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          if (error.message === 'Email not confirmed') {
            throw new Error("Please check your email inbox to verify your account first, or disable 'Confirm Email' in Supabase Settings.");
          }
          throw error;
        }
      } else {
        // Advanced Validations
        if (!fullName.trim()) throw new Error("Full Name is required.");
        if (password.length < 6) throw new Error("Password must be at least 6 characters long.");
        if (password !== confirmPassword) throw new Error("Passwords do not match.");

        // Optional: Restrict registration to your specific email only (uncomment if needed)
        /* 
        const allowedEmails = ['rsachi0713@gmail.com']; 
        if (!allowedEmails.includes(email)) {
          throw new Error("Registration is restricted to authorized creators only.");
        }
        */

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            }
          }
        });
        if (error) throw error;
        
        setSuccessMsg('Registration successful! If you have email confirmation ON, check your inbox. Otherwise, you can log in now.');
        setFullName('');
        setConfirmPassword('');
        
        setTimeout(() => {
          setIsLogin(true);
          setSuccessMsg('');
        }, 4000);
      }
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050510] flex items-center justify-center p-4 relative font-['Inter']">
      <style>{`
        * { cursor: default !important; }
        button, a { cursor: pointer !important; }
        input { cursor: text !important; }
      `}</style>
      {/* Decorative Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00f5d4] opacity-10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#f72585] opacity-10 rounded-full blur-[120px]"></div>

      <div className="bg-[#0a0a1f]/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl w-full max-w-md relative z-10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-['Orbitron'] font-black bg-clip-text text-transparent bg-gradient-to-r from-[#00f5d4] to-[#f72585]">
            PIXEL VIBE
          </h1>
          <p className="text-gray-400 mt-2 text-sm font-['Rajdhani'] tracking-wider uppercase">
            {isLogin ? 'Welcome back, Creator.' : 'Join the Elite Creators.'}
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-500 px-4 py-3 rounded-lg text-sm mb-6 font-semibold shadow-[0_0_15px_rgba(239,68,68,0.2)]">
            {errorMsg}
          </div>
        )}
        
        {successMsg && (
          <div className="bg-[#00f5d4]/10 border border-[#00f5d4]/30 text-[#00f5d4] px-4 py-3 rounded-lg text-sm mb-6 font-semibold shadow-[0_0_15px_rgba(0,245,212,0.2)]">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          {!isLogin && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="block text-xs font-['Rajdhani'] uppercase tracking-widest text-gray-400 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required={!isLogin}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00f5d4] transition-colors"
                placeholder="John Doe"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-['Rajdhani'] uppercase tracking-widest text-gray-400 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00f5d4] transition-colors"
              placeholder="hello@pixelvibe.design"
            />
          </div>

          <div>
            <label className="block text-xs font-['Rajdhani'] uppercase tracking-widest text-gray-400 mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00f5d4] transition-colors"
              placeholder="••••••••"
            />
            {!isLogin && (
              <p className="text-[10px] text-gray-500 mt-1 font-['Rajdhani'] uppercase tracking-wider">
                Must be at least 6 characters.
              </p>
            )}
          </div>

          {!isLogin && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="block text-xs font-['Rajdhani'] uppercase tracking-widest text-gray-400 mb-1.5">
                Confirm Password
              </label>
              <input
                type="password"
                required={!isLogin}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00f5d4] transition-colors"
                placeholder="••••••••"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#00f5d4] to-[#4361ee] text-black font-bold py-3.5 rounded-xl mt-6 font-['Rajdhani'] tracking-widest hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:hover:scale-100"
          >
            {loading ? 'PROCESSING...' : (isLogin ? 'ACCESS PLATFORM' : 'CREATE ACCOUNT')}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-400 font-['Rajdhani'] tracking-wide">
            {isLogin ? "Don't have an account? " : "Already established? "}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setErrorMsg('');
                setSuccessMsg('');
                setFullName('');
                setConfirmPassword('');
              }}
              className="text-[#00f5d4] font-bold hover:underline"
            >
              {isLogin ? 'Register Here' : 'Log In Here'}
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}
