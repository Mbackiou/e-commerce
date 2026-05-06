import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, useScroll, useSpring } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Sparkles, Star, Eye, Heart, ArrowUpRight, Zap } from 'lucide-react';
import { useCart } from '../context/CartContext';

const PREMIUM_PRODUCTS = [
  {
    id: 1,
    name: "Huile",
    price: 1000,
    category: "Parfum",
    image: "/images/huile1.jpeg",
    rating: 5,
    badge: "Best-seller"
  },
   {
    id: 5,
    name: "Gobelet",
    price: 4000,
    category: "Accessoires",
    image: "/images/goblet.jpeg",
    rating: 5,
    badge: "Best-seller"
  },
  {
    id: 2,
    name: "Coffret",
    price: 12500,
    category: "Vêtements",
    image: "/images/coffret.jpeg",
    rating: 4.8,
    badge: "Nouveau"
  },
  {
    id: 3,
    name: "Accessoires",
    price: 5000,
    category: "Accessoires",
    image: "/images/cheikh.jpg",
    rating: 4.9,
    badge: "Populaire"
  },
  {
    id: 4,
    name: "Vaisselle",
    price: 10000,
    category: "Vaisselle",
    image: "/images/vaiselle.jpeg",
    rating: 5,
    badge: "Exclusif"
  },
  {
    id: 6,
    name: "Lissete",
    price: 500,
    category: "Accessoires",
    image: "/images/lissete.jpeg",
    rating: 4.8,
    badge: "Nouveau"
  },
   {
    id: 7,
    name: "Ensemble",
    price: 8000,
    category: "Vêtements",
    image: "/images/ens.jpeg",
    rating: 4.8,
    badge: "Nouveau"
  },
  {
    id: 8,
    name: "Ensemble Robe",
    price: 7000,
    category: "Vêtements",
    image: "/images/ens2.jpeg",
    rating: 4.8,
    badge: "Nouveau"
  },
];

const MARQUEE_ITEMS = [
  "Élégance Africaine",
  "Livraison Partout au Sénégal",
  "Wave & Orange Money",
  "Se sentir bon, c'est déjà être élégant",
  "Pikine Icotaf Texaco",
];

function ProductCard({ product, index }) {
  const { addToCart } = useCart();

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
    >
      {/* Badge */}
      <div className="absolute top-4 left-4 z-20">
        <span className="bg-orange-600 text-white text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full">
          {product.badge}
        </span>
      </div>

      {/* Bouton cœur */}
      <button className="absolute top-4 right-4 z-20 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-300 hover:text-red-500 transition-all hover:scale-110 shadow-sm">
        <Heart size={15} />
      </button>

      {/* Image container */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-[2.5rem] bg-gray-50 mb-5 shadow-md group-hover:shadow-2xl transition-shadow duration-500">
        <img
          src={product.image}
          className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
          alt={product.name}
        />
        {/* Overlay hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-end p-6 gap-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => addToCart(product)}
            className="w-full bg-white text-gray-900 py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-xl hover:bg-orange-600 hover:text-white transition-colors"
          >
            <ShoppingCart size={16} /> Ajouter au panier
          </motion.button>
          <button className="text-white/80 font-bold text-[10px] uppercase tracking-[0.25em] flex items-center gap-1.5 hover:text-orange-400 transition-colors">
            <Eye size={13} /> Voir les détails
          </button>
        </div>
      </div>

      {/* Infos produit */}
      <div className="px-2">
        <p className="text-[9px] font-black uppercase tracking-[0.35em] text-orange-500 mb-1">{product.category}</p>
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-black text-gray-900 leading-tight group-hover:text-orange-600 transition-colors">{product.name}</h3>
          <button className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0 ml-2 group-hover:bg-orange-600 transition-colors mt-0.5">
            <ArrowUpRight size={14} className="text-white" />
          </button>
        </div>

        <div className="flex items-center justify-between mt-2">
          <p className="text-2xl font-black text-gray-900">{product.price.toLocaleString()} <span className="text-xs text-orange-600 font-black">FCFA</span></p>
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={9} fill={i < Math.floor(product.rating) ? "#ea580c" : "none"} className="text-orange-600" />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-300, 300], [12, -12]);
  const rotateY = useTransform(x, [-300, 300], [-12, 12]);

  function handleMouse(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left - rect.width / 2);
    y.set(event.clientY - rect.top - rect.height / 2);
  }

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <div className="pb-20 overflow-x-hidden">

      {/* ═══════════════ HERO ═══════════════ */}
      <section
        className="relative min-h-[92vh] flex items-center px-6 lg:px-16"
        onMouseMove={handleMouse}
        onMouseLeave={() => { x.set(0); y.set(0); }}
      >
        {/* Mot géant en fond */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <span className="text-[28vw] font-black text-gray-900/[0.025] tracking-tighter uppercase leading-none">
            PENDA
          </span>
        </div>

        {/* Cercles décoratifs */}
        <div className="absolute top-20 right-20 w-72 h-72 rounded-full border border-orange-100 pointer-events-none" />
        <div className="absolute top-32 right-32 w-48 h-48 rounded-full border border-orange-200/50 pointer-events-none" />
        <div className="absolute bottom-20 left-10 w-32 h-32 rounded-full bg-green-50 pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">

          {/* Texte gauche */}
          <motion.div
            className="lg:col-span-6 space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Badge localisation */}
            <motion.div variants={itemVariants} className="flex items-center gap-3 w-fit">
              <div className="flex items-center gap-2 bg-green-50 border border-green-100 text-green-700 px-5 py-2 rounded-full">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative rounded-full h-2.5 w-2.5 bg-green-600"></span>
                </span>
                <span className="text-[9px] font-black uppercase tracking-[0.4em]">Pikine Icotaf Texaco</span>
              </div>
            </motion.div>

            {/* Titre principal */}
            <motion.div variants={itemVariants}>
              <h1 className="text-[clamp(4rem,12vw,9rem)] font-black leading-[0.85] tracking-tighter text-gray-900">
                PENDA<br />
                <span className="relative inline-block">
                  <span className="text-orange-600 italic">STORE</span>
                  <span className="text-green-800">_SN</span>
                  <motion.div
                    className="absolute -bottom-2 left-0 h-3 bg-orange-600/20 w-full -z-10 rounded"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                  />
                </span>
              </h1>
            </motion.div>

            {/* Sous-titre */}
            <motion.p variants={itemVariants} className="text-gray-400 text-lg font-medium max-w-sm leading-relaxed pl-5 border-l-4 border-orange-500">
              L'élégance africaine revisitée.<br />
              <span className="text-gray-800 font-bold">Portez votre culture avec fierté.</span>
            </motion.p>

            {/* CTA + Avatars */}
            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-6">
              <button
                onClick={() => navigate('/products')}
                className="group flex items-center gap-3 px-10 py-5 bg-gray-900 text-white rounded-full font-black text-base hover:bg-orange-600 transition-all duration-300 shadow-xl hover:shadow-orange-200 hover:-translate-y-0.5"
              >
                La Boutique
                <ArrowUpRight size={18} className="group-hover:rotate-45 transition-transform" />
              </button>

              <div className="flex items-center gap-3">
                <div className="flex -space-x-3">
                  {['/images/cheikh.jpg', '/images/penda.png', '/images/parfum.jpg'].map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      className="w-11 h-11 rounded-full border-[3px] border-white shadow-sm object-cover"
                      alt={`client ${i + 1}`}
                    />
                  ))}
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Approuvé par</p>
                  <p className="text-sm font-black text-gray-900">+2 000 clients</p>
                </div>
              </div>
            </motion.div>

            {/* Stats rapides */}
            <motion.div variants={itemVariants} className="flex gap-8 pt-4 border-t border-gray-100">
              {[
                { val: "500+", label: "Produits" },
                { val: "2k+", label: "Clients" },
                { val: "24h", label: "Livraison" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-2xl font-black text-gray-900">{s.val}</p>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Image 3D droite */}
          <div className="lg:col-span-6 relative h-[580px] flex items-center justify-center">
            <motion.div
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              className="relative w-full max-w-[420px] aspect-[4/5]"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Image principale */}
              <div
                className="absolute inset-0 rounded-[4.5rem] overflow-hidden border-[16px] border-white shadow-2xl"
                style={{ transform: "translateZ(30px)" }}
              >
                <img src="/images/pendastore.jpeg" className="w-full h-full object-cover" alt="Penda Store" />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              {/* Flottant Bienvenue */}
              <motion.div
                style={{ transform: "translateZ(100px) translateX(-50px)" }}
                className="absolute top-16 -left-8 bg-white px-6 py-4 rounded-[2rem] shadow-2xl border border-orange-50 z-30"
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              >
                <p className="text-orange-600 font-black text-2xl leading-none">Bienvenue</p>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">Chez Penda Store</p>
              </motion.div>

              {/* Badge Qualité */}
              <motion.div
                style={{ transform: "translateZ(90px) translateX(20px)" }}
                className="absolute -bottom-8 -right-4 bg-green-800 text-white p-7 rounded-full shadow-2xl z-40 flex flex-col items-center border-8 border-white"
                animate={{ rotate: [0, 5, 0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              >
                <Star fill="white" size={18} />
                <p className="text-[8px] font-black uppercase mt-1">Top Qualité</p>
              </motion.div>

              {/* Badge prix flottant */}
              <motion.div
                style={{ transform: "translateZ(80px)" }}
                className="absolute top-1/2 -right-10 bg-orange-600 text-white px-5 py-3 rounded-2xl shadow-xl z-30"
                animate={{ y: [0, 6, 0] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut", delay: 1 }}
              >
                <p className="text-[8px] font-black uppercase tracking-widest opacity-80">Dès</p>
                <p className="text-xl font-black leading-none">2 500 <span className="text-xs">FCFA</span></p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════ MARQUEE ═══════════════ */}
      <div className="py-5 bg-gray-900 text-white overflow-hidden whitespace-nowrap flex border-y border-white/10 -rotate-1 my-16">
        <motion.div
          animate={{ x: [0, -1200] }}
          transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
          className="flex gap-16 text-4xl font-black uppercase italic flex-shrink-0"
        >
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((text, i) => (
            <span key={i} className="flex items-center gap-8">
              {text} <Sparkles className="text-orange-500" size={28} />
            </span>
          ))}
        </motion.div>
      </div>

      {/* ═══════════════ NOS PRODUITS ═══════════════ */}
      <section className="max-w-7xl mx-auto px-6 lg:px-16">

        {/* Header section */}
        <div className="flex flex-col lg:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-[9px] font-black uppercase tracking-[0.4em] text-orange-500 mb-3"
            >
              ✦ Sélection du moment
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-6xl lg:text-7xl font-black tracking-tighter text-gray-900 leading-none"
            >
              Nos<br /><span className="text-orange-600 italic">Produits</span>
            </motion.h2>
            <div className="flex gap-2 mt-4">
              <div className="h-2 w-16 bg-gray-900 rounded-full" />
              <div className="h-2 w-6 bg-orange-600 rounded-full" />
              <div className="h-2 w-3 bg-orange-300 rounded-full" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <p className="text-gray-400 font-bold max-w-[200px] text-right text-xs uppercase tracking-widest leading-relaxed">
              Sélectionnés avec soin pour vos plus beaux moments.
            </p>
            <button
              onClick={() => navigate('/products')}
              className="group flex-shrink-0 w-14 h-14 bg-gray-900 rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors"
            >
              <ArrowUpRight size={20} className="text-white group-hover:rotate-45 transition-transform" />
            </button>
          </div>
        </div>

        {/* Grille produits */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {PREMIUM_PRODUCTS.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        {/* CTA voir tout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-16"
        >
          <button
            onClick={() => navigate('/products')}
            className="group inline-flex items-center gap-3 border-2 border-gray-900 text-gray-900 px-12 py-5 rounded-full font-black text-sm uppercase tracking-widest hover:bg-gray-900 hover:text-white transition-all duration-300"
          >
            Voir toute la collection
            <ArrowUpRight size={16} className="group-hover:rotate-45 transition-transform" />
          </button>
        </motion.div>
      </section>

      {/* ═══════════════ BANDE CONFIANCE ═══════════════ */}
      <section className="mt-32 mx-6 lg:mx-16 bg-gray-900 rounded-[3rem] px-10 py-14 grid grid-cols-1 md:grid-cols-3 gap-10 text-white">
        {[
          { icon: <Zap size={28} />, title: "Livraison Express", desc: "Partout au Sénégal en 24h" },
          { icon: <Star size={28} />, title: "Qualité Garantie", desc: "Produits sélectionnés avec soin" },
          { icon: <Sparkles size={28} />, title: "Paiement Facile", desc: "Wave • Orange Money • Cash" },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="flex items-start gap-5"
          >
            <div className="w-14 h-14 bg-orange-600 rounded-2xl flex items-center justify-center flex-shrink-0">
              {item.icon}
            </div>
            <div>
              <h3 className="font-black text-lg mb-1">{item.title}</h3>
              <p className="text-gray-400 text-sm font-medium">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </section>

    </div>
  );
}
