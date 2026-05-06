import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Search, Star, Heart, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { getProduits } from '../services/api';

export default function Products() {
  const { addToCart } = useCart();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("Tous");
  const [searchQuery, setSearchQuery] = useState("");
  const [liked, setLiked] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProduits();
        setProducts(data);
      } catch (error) {
        console.error("Erreur Django:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const CATEGORIES = ["Tous", "Parfum & Huile", "Accessoires", "Vaisselle", "Coffret"];

  const CATEGORY_ICONS = {
    "Tous": "✦",
    "Parfum & Huile": "🌸",
    "Accessoires": "💎",
    "Vaisselle": "🍽️",
    "Coffret": "🎁",
  };

  const filteredProducts = products.filter(p =>
    (filter === "Tous" || p.category_name === filter) &&
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleLike = (id) => setLiked(prev => ({ ...prev, [id]: !prev[id] }));

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
        className="w-10 h-10 border-4 border-gray-100 border-t-orange-600 rounded-full"
      />
      <p className="text-gray-400 font-black text-sm uppercase tracking-[0.3em]">
        Chargement de la collection...
      </p>
    </div>
  );

  return (
    <div className="min-h-screen pb-24 max-w-6xl mx-auto px-6">

      {/* ═══ HEADER ═══ */}
      <header className="mb-16 text-center space-y-4 pt-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-2"
        >
          <Sparkles size={12} className="text-orange-500" />
          <span className="text-[9px] font-black tracking-[0.5em] uppercase text-orange-500">
            Exclusivité Penda Store
          </span>
          <Sparkles size={12} className="text-orange-500" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl lg:text-7xl font-black tracking-tighter"
        >
          LA <span className="italic text-orange-600">COLLECTION</span>.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-400 text-sm font-medium"
        >
          {products.length} produits disponibles
        </motion.p>
      </header>

      {/* ═══ FILTRES ═══ */}
      <div className="flex flex-col items-center gap-8 mb-16">
        <div className="flex flex-wrap justify-center gap-3">
          {CATEGORIES.map((cat) => (
            <motion.button
              key={cat}
              onClick={() => setFilter(cat)}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                filter === cat
                  ? 'bg-gray-900 text-white shadow-xl scale-105'
                  : 'bg-white text-gray-400 border border-gray-100 hover:border-orange-200 hover:text-orange-600'
              }`}
            >
              <span>{CATEGORY_ICONS[cat]}</span>
              {cat}
            </motion.button>
          ))}
        </div>

        <div className="relative w-full max-w-md group">
          <Search
            className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-orange-600 transition-colors"
            size={17}
          />
          <input
            type="text"
            placeholder="Rechercher un produit..."
            className="w-full pl-14 pr-6 py-4 bg-white border border-gray-100 rounded-[2rem] outline-none font-medium text-sm transition-all shadow-sm focus:border-orange-200 focus:shadow-orange-100 focus:shadow-md"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {filter !== "Tous" && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400"
          >
            <span>{filteredProducts.length} résultat{filteredProducts.length > 1 ? 's' : ''} pour</span>
            <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full">{filter}</span>
            <button onClick={() => setFilter("Tous")} className="text-gray-300 hover:text-red-400 transition-colors ml-1">✕</button>
          </motion.div>
        )}
      </div>

      {/* ═══ GRILLE PRODUITS ═══ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-14">
        <AnimatePresence mode="popLayout">
          {filteredProducts.map((product, index) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              key={product.id}
              className="group"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-[3rem] bg-gray-50 mb-5 shadow-sm group-hover:shadow-2xl transition-all duration-500">

                {product.stock === 0 && (
                  <div className="absolute top-4 left-4 z-20 bg-gray-900 text-white text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                    Épuisé
                  </div>
                )}
                {product.stock > 0 && product.stock <= 5 && (
                  <div className="absolute top-4 left-4 z-20 bg-orange-600 text-white text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                    Plus que {product.stock}
                  </div>
                )}

                <button
                  onClick={() => toggleLike(product.id)}
                  className="absolute top-4 right-4 z-20 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-sm"
                >
                  <Heart
                    size={15}
                    fill={liked[product.id] ? "#ef4444" : "none"}
                    className={liked[product.id] ? "text-red-500" : "text-gray-300"}
                  />
                </button>

                <img
                  src={product.image}
                  className={`w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110 ${product.stock === 0 ? 'grayscale opacity-60' : ''}`}
                  alt={product.name}
                />

                {product.stock > 0 && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-400 flex items-end justify-center pb-8 px-8">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => addToCart(product)}
                      className="w-full bg-white text-gray-900 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-xl hover:bg-orange-600 hover:text-white transition-colors"
                    >
                      <ShoppingCart size={16} /> Ajouter au panier
                    </motion.button>
                  </div>
                )}
              </div>

              <div className="text-center px-3 space-y-1.5">
                <p className="text-orange-500 font-black text-[9px] uppercase tracking-[0.35em]">
                  {CATEGORY_ICONS[product.category_name] || "✦"} {product.category_name}
                </p>
                <h3 className="text-xl font-black text-gray-900 tracking-tight leading-none group-hover:text-orange-600 transition-colors">
                  {product.name}
                </h3>
                {product.description && (
                  <p className="text-gray-400 text-xs font-medium line-clamp-1">{product.description}</p>
                )}
                <div className="flex items-center justify-center gap-2 pt-1">
                  <span className="text-2xl font-black text-gray-900">{Number(product.price).toLocaleString()}</span>
                  <span className="text-xs font-black text-orange-600 uppercase">FCFA</span>
                </div>
                <div className="flex justify-center gap-0.5 pt-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={9} fill="#ea580c" className="text-orange-600" />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* ═══ ÉTAT VIDE ═══ */}
      {filteredProducts.length === 0 && !loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-24 border-2 border-dashed border-gray-100 rounded-[4rem]"
        >
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-gray-300 font-black text-xl uppercase tracking-widest italic">Aucun produit trouvé</p>
          <button
            onClick={() => { setFilter("Tous"); setSearchQuery(""); }}
            className="mt-6 px-8 py-3 bg-gray-900 text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-orange-600 transition-colors"
          >
            Voir tout
          </button>
        </motion.div>
      )}
    </div>
  );
}