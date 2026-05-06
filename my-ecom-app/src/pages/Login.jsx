import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // Utilise le AuthContext pour se connecter
        await login(formData.username, formData.password);
        navigate('/');
        window.location.reload();
      } else {
        // Inscription
        const response = await fetch('http://127.0.0.1:8000/api/register/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          setIsLogin(true);
          setError('Compte créé ! Connectez-vous.');
        } else {
          const data = await response.json();
          setError(data.detail || 'Erreur lors de la création du compte.');
        }
      }
    } catch (err) {
      setError('Identifiants incorrects. Réessayez.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white p-10 lg:p-14 rounded-[4rem] border border-gray-100 shadow-2xl shadow-gray-200/50 relative overflow-hidden"
      >
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-orange-50 rounded-full blur-3xl opacity-50"></div>

        <div className="text-center mb-12 relative z-10">
          <div className="w-16 h-16 bg-gray-900 rounded-3xl flex items-center justify-center text-white font-black text-2xl mx-auto mb-6 rotate-3">
            H
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-gray-900">
            {isLogin ? 'BONRETOUR.' : 'BIENVENUE.'}
          </h1>
          <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.3em] mt-2">
            HackireShop Privilège
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-2 text-xs font-bold uppercase tracking-widest border border-red-100"
          >
            <AlertCircle size={16} /> {error}
          </motion.div>
        )}

        <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">
              Nom d'utilisateur
            </label>
            <div className="relative group">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-orange-600 transition-colors" size={18} />
              <input
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                placeholder="Ex: modou_style"
                className="w-full pl-14 pr-6 py-5 bg-gray-50 border border-transparent rounded-[2rem] focus:bg-white focus:border-orange-200 focus:ring-4 focus:ring-orange-50 outline-none transition-all font-medium"
              />
            </div>
          </div>

          {!isLogin && (
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">
                Email (Optionnel)
              </label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="votre@email.sn"
                className="w-full px-8 py-5 bg-gray-50 border border-transparent rounded-[2rem] outline-none font-medium"
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">
              Mot de passe
            </label>
            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-orange-600 transition-colors" size={18} />
              <input
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-14 pr-6 py-5 bg-gray-50 border border-transparent rounded-[2rem] focus:bg-white focus:border-orange-200 focus:ring-4 focus:ring-orange-50 outline-none transition-all font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${loading ? 'bg-gray-400' : 'bg-gray-900 hover:bg-orange-600'} text-white py-5 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 group transition-all shadow-xl`}
          >
            {loading ? 'Traitement...' : isLogin ? 'Se connecter' : 'Créer un compte'}
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="flex items-center gap-4 my-10">
          <div className="flex-grow h-[1px] bg-gray-100"></div>
          <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Hackire Fashion</span>
          <div className="flex-grow h-[1px] bg-gray-100"></div>
        </div>

        <p className="text-center text-gray-400 font-bold text-[10px] uppercase tracking-widest">
          {isLogin ? "Pas encore de compte ?" : "Déjà membre ?"}
          <button
            type="button"
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            className="ml-2 text-orange-600 font-black hover:underline"
          >
            {isLogin ? "S'inscrire" : 'Connexion'}
          </button>
        </p>
      </motion.div>
    </div>
  );
}