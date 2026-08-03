import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, KeyRound, Sparkles, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('yadavlakshya86@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    setErrorMessage('');

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email: email.trim(),
        password
      });

      if (res.data && res.data.token) {
        localStorage.setItem('prof_admin_token', res.data.token);
        localStorage.setItem('prof_admin_user', JSON.stringify(res.data.user));

        if (onLoginSuccess) {
          onLoginSuccess(res.data.user);
        }

        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      setErrorMessage(err.response?.data?.error || 'Invalid credentials. Only admin has access.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 relative overflow-hidden font-outfit">
      {/* Background Ambient Glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#FF5D73]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#FF5D73]/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md glass-panel p-8 md:p-10 rounded-3xl border border-[#222] bg-[#0a0a0a]/90 shadow-2xl relative z-10 space-y-6"
      >
        {/* Header Logo */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#FF5D73]/10 border border-[#FF5D73]/30 flex items-center justify-center mx-auto text-[#FF5D73] shadow-lg shadow-[#FF5D73]/10">
            <ShieldCheck size={30} />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-white pt-2">
            ProfessorOS Admin Portal
          </h1>
          <p className="text-xs text-[#7C7A7A]">
            Restricted Admin Control Center
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#A0A0A0] mb-2 uppercase tracking-wider">Admin Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 text-[#555]" size={16} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="yadavlakshya86@gmail.com"
                required
                className="w-full bg-[#141414] border border-[#333] rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-[#555] focus:outline-none focus:border-[#FF5D73] font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#A0A0A0] mb-2 uppercase tracking-wider">Admin Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 text-[#555]" size={16} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                required
                className="w-full bg-[#141414] border border-[#333] rounded-xl pl-10 pr-10 py-3 text-xs text-white placeholder-[#555] focus:outline-none focus:border-[#FF5D73] font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-[#555] hover:text-white"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !email || !password}
            className="w-full py-3.5 bg-gradient-to-r from-[#FF5D73] to-[#e04359] hover:opacity-90 font-semibold text-xs rounded-xl transition-all shadow-lg shadow-[#FF5D73]/20 flex items-center justify-center gap-2 disabled:opacity-40"
          >
            {isLoading ? 'Authenticating Admin...' : 'Authenticate Admin'} <ArrowRight size={16} />
          </button>
        </form>

        {/* Footer Admin Badge */}
        <div className="pt-4 border-t border-[#1e1e1e] text-center">
          <span className="text-[11px] text-[#555] flex items-center justify-center gap-1">
            <KeyRound size={12} className="text-[#FF5D73]" /> Access locked to Authorized Admin Only
          </span>
        </div>
      </motion.div>
    </div>
  );
}
