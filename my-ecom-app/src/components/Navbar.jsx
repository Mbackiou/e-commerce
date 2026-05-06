import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, User, Menu, X, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { getItemCount } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Détecter le scroll pour réduire la taille de la navbar
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Accueil', path: '/' },
    { name: 'Boutique', path: '/products' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-6 ${
      isScrolled ? 'py-4' : 'py-8'
    }`}>
      {/* Barre principale centrée avec max-width pour l'élégance */}
      <div className={`max-w-6xl mx-auto rounded-[2.5rem] transition-all duration-500 flex items-center justify-between px-8 h-20 ${
        isScrolled 
        ? 'bg-white/80 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white/20' 
        : 'bg-transparent'
      }`}>
        
        {/* LOGO GAUCHE */}
        <Link to="/" className="group flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center text-white font-black group-hover:bg-orange-600 transition-colors shadow-lg">
            H
          </div>
          <span className="text-xl font-black tracking-tighter hidden sm:block">
            Penda<span className="text-orange-600">Store</span>
          </span>
        </Link>

        {/* LIENS CENTRÉS (Desktop) */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path}
              className={`text-[10px] font-black uppercase tracking-[0.3em] transition-all relative group ${
                location.pathname === link.path ? 'text-orange-600' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {link.name}
              <span className={`absolute -bottom-2 left-1/2 -translate-x-1/2 h-1 bg-orange-600 rounded-full transition-all ${
                location.pathname === link.path ? 'w-4' : 'w-0 group-hover:w-4'
              }`} />
            </Link>
          ))}
        </div>

        {/* ACTIONS DROITE */}
        <div className="flex items-center gap-2">
          {/* Favoris (Optionnel) */}
          <button className="p-3 text-gray-400 hover:text-red-500 transition-colors hidden sm:block">
            <Heart size={20} />
          </button>
          
          {/* Compte Utilisateur */}
          <Link to="/login" className={`p-3 rounded-full transition-colors ${
            location.pathname === '/login' ? 'text-orange-600 bg-orange-50' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-900'
          }`}>
            <User size={20} />
          </Link>

          {/* Panier Stylisé */}
          <Link to="/cart" className="relative ml-2 group">
            <div className="p-4 bg-gray-900 text-white rounded-2xl group-hover:bg-orange-600 transition-all shadow-xl shadow-gray-200 group-hover:shadow-orange-200">
              <ShoppingBag size={20} className="group-hover:scale-110 transition-transform" />
            </div>
            {getItemCount() > 0 && (
              <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] w-6 h-6 rounded-full flex items-center justify-center font-black border-4 border-[#fcfcfc] animate-bounce">
                {getItemCount()}
              </span>
            )}
          </Link>

          {/* Menu Mobile Button */}
          <button 
            className="md:hidden ml-2 p-3 text-gray-900"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* OVERLAY MENU MOBILE */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-32 left-6 right-6 bg-white rounded-[3rem] p-10 shadow-2xl border border-gray-100 flex flex-col items-center gap-8 md:hidden z-50"
          >
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="text-3xl font-black text-gray-900 hover:text-orange-600 transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <div className="h-[1px] w-20 bg-gray-100"></div>
            <Link 
              to="/login" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-black uppercase tracking-widest text-gray-400 hover:text-orange-600"
            >
              Mon Compte
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}