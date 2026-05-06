import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, ShoppingCart, TrendingUp, Eye, 
  Plus, Trash2, Edit3, AlertCircle, RefreshCw 
} from 'lucide-react';
import axios from 'axios';
import AddProductModal from '../components/AddProductModal';


// Configuration de l'URL de ton API Docker en utilisant une variable d'environnement VITE_API_URL


const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function Admin() {
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' ou 'products'
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- CHARGEMENT DES DONNÉES (COMMANDES ET PRODUITS) ---
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // On récupère les deux sources de données en même temps
      const [ordersRes, productsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/orders/`),
        axios.get(`${API_BASE_URL}/products/`)
      ]);
      
      setOrders(ordersRes.data);
      setProducts(productsRes.data);
    } catch (err) {
      console.error("Erreur API:", err);
      setError("Impossible de joindre le serveur Django. Vérifiez que Docker est lancé.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- SUPPRESSION D'UN PRODUIT ---
  const handleDeleteProduct = async (id) => {
    if (window.confirm("Supprimer définitivement ce modèle ?")) {
      try {
        await axios.delete(`${API_BASE_URL}/products/${id}/`);
        // Mise à jour immédiate de l'interface
        setProducts(products.filter(p => p.id !== id));
      } catch (err) {
        alert("Erreur lors de la suppression.");
      }
    }
  };

  // --- CALCUL DES STATS ---
  const totalSales = orders.reduce((acc, curr) => acc + parseFloat(curr.total_amount || 0), 0);
  
  const stats = [
    { label: "Ventes Total", value: `${totalSales.toLocaleString()} F`, icon: TrendingUp, color: "text-green-600" },
    { label: "Commandes", value: orders.length, icon: ShoppingCart, color: "text-orange-600" },
    { label: "Articles", value: products.length, icon: Package, color: "text-blue-600" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 pb-20 pt-10 min-h-screen font-sans text-gray-900">
      
      {/* HEADER */}
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black tracking-tighter italic">
            ADMIN<span className="text-orange-600">PANEL</span>
          </h1>
          <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-[10px] mt-2">
            Gestion HackireShop • Connecté à PostgreSQL
          </p>
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={fetchData}
            className="p-4 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-all text-gray-600"
            title="Rafraîchir les données"
          >
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-orange-600 transition-all shadow-lg"
          >
            <Plus size={18} /> Nouveau Modèle
          </button>
        </div>
      </header>

      {/* CARTES DE STATISTIQUES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <stat.icon className={`${stat.color} mb-4`} size={24} />
            <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">{stat.label}</p>
            <p className="text-3xl font-black mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* SELECTEUR D'ONGLETS */}
      <div className="flex gap-8 mb-8 px-4 border-b border-gray-100">
        <button 
          onClick={() => setActiveTab('orders')}
          className={`pb-4 text-xs font-black uppercase tracking-widest transition-all relative ${activeTab === 'orders' ? 'text-orange-600' : 'text-gray-300'}`}
        >
          Commandes Client ({orders.length})
          {activeTab === 'orders' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600" />}
        </button>
        <button 
          onClick={() => setActiveTab('products')}
          className={`pb-4 text-xs font-black uppercase tracking-widest transition-all relative ${activeTab === 'products' ? 'text-orange-600' : 'text-gray-300'}`}
        >
          Inventaire Collection ({products.length})
          {activeTab === 'products' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600" />}
        </button>
      </div>

      {/* ZONE DE CONTENU */}
      <div className="bg-white rounded-[3rem] border border-gray-100 overflow-hidden shadow-sm min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-32 gap-4">
            <div className="w-10 h-10 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Accès au serveur Docker...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center p-32 text-center">
            <AlertCircle size={40} className="text-red-500 mb-4" />
            <p className="text-gray-600 font-bold">{error}</p>
            <button onClick={fetchData} className="mt-4 text-orange-600 text-xs font-black uppercase underline">Réessayer</button>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {activeTab === 'orders' ? (
              <motion.div key="orders" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {orders.length === 0 ? (
                  <div className="p-20 text-center text-gray-400 font-bold uppercase text-xs">Aucune commande reçue</div>
                ) : (
                  <table className="w-full text-left">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="p-6 text-[10px] font-black uppercase text-gray-400">ID / Client</th>
                        <th className="p-6 text-[10px] font-black uppercase text-gray-400">Date</th>
                        <th className="p-6 text-[10px] font-black uppercase text-gray-400">Montant</th>
                        <th className="p-6 text-[10px] font-black uppercase text-gray-400 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {orders.map(order => (
                        <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="p-6">
                            <span className="font-black text-gray-900">#ORD-{order.id}</span>
                            <span className="block text-[10px] text-gray-400 font-bold">{order.user_email || "Client invité"}</span>
                          </td>
                          <td className="p-6 text-sm font-bold text-gray-500">
                            {new Date(order.created_at).toLocaleDateString('fr-FR')}
                          </td>
                          <td className="p-6 font-black text-gray-900">
                            {Number(order.total_amount).toLocaleString()} F
                          </td>
                          <td className="p-6 text-right">
                            <span className="inline-block px-3 py-1 bg-orange-100 text-orange-600 rounded-lg text-[9px] font-black uppercase mr-4">
                              {order.status}
                            </span>
                            <button className="p-2 bg-gray-100 rounded-lg hover:bg-black hover:text-white transition-all">
                              <Eye size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </motion.div>
            ) : (
              <motion.div key="products" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8">
                {products.length === 0 ? (
                   <div className="col-span-full p-20 text-center text-gray-400 font-bold uppercase text-xs">L'inventaire est vide</div>
                ) : (
                  products.map(product => (
                    <div key={product.id} className="flex items-center gap-6 p-4 border border-gray-100 rounded-[2.5rem] hover:border-orange-200 transition-all group">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
                        <img 
                          src={product.image || "/placeholder.jpg"} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                          alt={product.name} 
                        />
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-black text-gray-900 uppercase tracking-tighter text-sm">{product.name}</h4>
                        <p className="text-orange-600 font-black text-xs">{Number(product.price).toLocaleString()} F</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-[9px] font-black bg-gray-100 px-2 py-1 rounded text-gray-500 uppercase">{product.category}</span>
                          <button onClick={() => handleDeleteProduct(product.id)} className="text-gray-300 hover:text-red-500 transition-colors ml-auto"><Trash2 size={16} /></button>
                          <button className="text-gray-300 hover:text-blue-500 transition-colors"><Edit3 size={16} /></button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* MODALE D'AJOUT */}
      <AddProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onRefresh={fetchData} 
      />
    </div>
  );
}