import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white pt-24 pb-12 rounded-t-[4rem] relative overflow-hidden">
      {/* Texte Géant en Arrière-plan */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 opacity-[0.02] select-none pointer-events-none">
        <h2 className="text-[15vw] font-black tracking-tighter uppercase">Penda_Store</h2>
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-20">
          
          {/* COLONNE 1 : BRAND & BIO */}
          <div className="md:col-span-5 space-y-8">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white font-black group-hover:rotate-12 transition-transform shadow-lg shadow-orange-900/50">H</div>
              <span className="text-2xl font-black tracking-tighter">HACKIRA<span className="text-orange-600">SHOP</span></span>
            </Link>
            <p className="text-gray-400 font-medium leading-relaxed max-w-sm italic">
              "Se sentir bon transforme la simplicité en élégance naturelle." <br />
              Nous célébrons l'héritage du textile africain à travers des créations contemporaines et authentiques.
            </p>
            <div className="flex gap-4">
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <motion.a 
                  key={i} 
                  href="#" 
                  whileHover={{ y: -5, backgroundColor: '#ea580c' }}
                  className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center transition-colors border border-white/10"
                >
                  <Icon size={20} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* COLONNE 2 : LIENS RAPIDES */}
          <div className="md:col-span-3 space-y-8">
            <h4 className="text-orange-600 font-black uppercase text-[10px] tracking-[0.4em]">Navigation</h4>
            <ul className="space-y-4">
              {['Accueil', 'Boutique', 'Collections', 'À propos'].map((item) => (
                <li key={item}>
                  <Link to="/" className="text-gray-400 hover:text-white transition-colors font-bold text-sm flex items-center group">
                    {item} <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLONNE 3 : CONTACTS */}
          <div className="md:col-span-4 space-y-8">
            <h4 className="text-orange-600 font-black uppercase text-[10px] tracking-[0.4em]">Contact</h4>
            <div className="space-y-6">
              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-orange-600 border border-white/10 group-hover:bg-orange-600 group-hover:text-white transition-all">
                  <MapPin size={18} />
                </div>
                <p className="text-sm font-bold text-gray-300">Pikine, Icotaf</p>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-orange-600 border border-white/10 group-hover:bg-orange-600 group-hover:text-white transition-all">
                  <Phone size={18} />
                </div>
                <p className="text-sm font-bold text-gray-300">+221 78 351 73 19</p>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-orange-600 border border-white/10 group-hover:bg-orange-600 group-hover:text-white transition-all">
                  <Mail size={18} />
                </div>
                <p className="text-sm font-bold text-gray-300">thiounpenda12@icloud.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION BASSE : COPYRIGHT & NEWSLETTER */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">
            © {currentYear} HackireShop. Tous droits réservés.
          </p>
          
          <div className="flex items-center gap-8">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Paiement via :</span>
            <div className="flex gap-4 grayscale opacity-50 hover:opacity-100 transition-opacity">
              {/* On peut mettre ici des logos simplifiés de Wave/Orange Money */}
              <span className="text-xs font-black italic">WAVE</span>
              <span className="text-xs font-black italic">ORANGE</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}