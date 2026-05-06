import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Package, TrendingUp, Plus, Trash2,
  Edit3, X, Check, AlertCircle, ShoppingBag, DollarSign,
  BarChart2, Eye, Upload, ChevronDown, LogOut, Sparkles
} from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

// ─── Données mock pour les ventes (à remplacer par ton API) ───
const MOCK_SALES = [
  { month: 'Jan', revenue: 128000, orders: 14 },
  { month: 'Fév', revenue: 195000, orders: 22 },
  { month: 'Mar', revenue: 87000, orders: 9 },
  { month: 'Avr', revenue: 243000, orders: 28 },
  { month: 'Mai', revenue: 312000, orders: 35 },
  { month: 'Jun', revenue: 275000, orders: 31 },
];

const MOCK_RECENT_ORDERS = [
  { id: '#0042', product: 'Huile de Baobab Premium', category: 'Parfum & Huile', amount: 18500, status: 'livré', date: '28 avr.' },
  { id: '#0041', product: 'Coffret Prestige', category: 'Coffret', amount: 45000, status: 'en cours', date: '27 avr.' },
  { id: '#0040', product: 'Bracelet Wax Doré', category: 'Accessoires', amount: 12000, status: 'livré', date: '26 avr.' },
  { id: '#0039', product: 'Service à Thé Bogolan', category: 'Vaisselle', amount: 32000, status: 'annulé', date: '25 avr.' },
  { id: '#0038', product: 'Eau de Parfum Terranga', category: 'Parfum & Huile', amount: 22500, status: 'livré', date: '24 avr.' },
];

const CATEGORIES = ["Parfum & Huile", "Accessoires", "Vaisselle", "Coffret"];

const STATUS_STYLES = {
  livré: 'bg-emerald-50 text-emerald-700',
  'en cours': 'bg-orange-50 text-orange-700',
  annulé: 'bg-red-50 text-red-600',
};

// ─── Mini Bar Chart SVG ───
function MiniBarChart({ data }) {
  const max = Math.max(...data.map(d => d.revenue));
  return (
    <div className="flex items-end gap-1.5 h-20">
      {data.map((d, i) => (
        <div key={i} className="flex flex-col items-center gap-1 flex-1">
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${(d.revenue / max) * 100}%` }}
            transition={{ delay: i * 0.08, duration: 0.5, ease: 'easeOut' }}
            className="w-full bg-orange-500 rounded-t-md opacity-80 hover:opacity-100 transition-opacity cursor-pointer min-h-[4px]"
            title={`${d.month}: ${d.revenue.toLocaleString()} FCFA`}
          />
          <span className="text-[9px] text-gray-400 font-bold">{d.month}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Formulaire d'ajout / édition de produit ───
function ProductForm({ product, onClose, onSave }) {
  const isEdit = !!product;
  const [form, setForm] = useState({
    name: product?.name || '',
    category_name: product?.category_name || CATEGORIES[0],
    price: product?.price || '',
    stock: product?.stock || '',
    description: product?.description || '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(product?.image || null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = React.useRef();

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // Vérifie que c'est bien une image
    if (!file.type.startsWith('image/')) {
      setError('Veuillez sélectionner une image (JPG, PNG, WEBP...)');
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setError('');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!form.name || !form.price || !form.stock) {
      setError('Nom, prix et stock sont obligatoires.');
      return;
    }
    setSaving(true);
    try {
      // On utilise FormData pour envoyer le fichier image
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('category_name', form.category_name);
      formData.append('price', form.price);
      formData.append('stock', form.stock);
      formData.append('description', form.description);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const config = { headers: { 'Content-Type': 'multipart/form-data' } };

      if (isEdit) {
        await axios.put(`${API_BASE_URL}/api/products/${product.id}/`, formData, config);
      } else {
        await axios.post(`${API_BASE_URL}/api/products/`, formData, config);
      }
      onSave();
    } catch (err) {
      setError('Erreur lors de la sauvegarde.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-orange-500">
              {isEdit ? '✏️ Modifier' : '✦ Nouveau'}
            </p>
            <h2 className="text-2xl font-black tracking-tight mt-0.5">
              {isEdit ? 'Éditer le produit' : 'Ajouter un produit'}
            </h2>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition">
            <X size={16} className="text-gray-400" />
          </button>
        </div>

        {/* Body */}
        <div className="px-8 py-6 space-y-4 overflow-y-auto max-h-[65vh]">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 text-red-600 rounded-2xl px-4 py-3 text-sm font-semibold">
              <AlertCircle size={15} /> {error}
            </div>
          )}

          {/* Nom */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 block">Nom du produit *</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Ex: Huile de Baobab Premium"
              className="w-full px-5 py-3.5 border border-gray-200 rounded-2xl text-sm font-medium outline-none focus:border-orange-300 transition-colors"
            />
          </div>

          {/* Catégorie */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 block">Catégorie *</label>
            <div className="relative">
              <select
                name="category_name"
                value={form.category_name}
                onChange={handleChange}
                className="w-full px-5 py-3.5 border border-gray-200 rounded-2xl text-sm font-medium outline-none focus:border-orange-300 appearance-none bg-white transition-colors"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Prix & Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 block">Prix (FCFA) *</label>
              <input
                name="price"
                value={form.price}
                onChange={handleChange}
                type="number"
                placeholder="Ex: 15000"
                className="w-full px-5 py-3.5 border border-gray-200 rounded-2xl text-sm font-medium outline-none focus:border-orange-300 transition-colors"
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 block">Stock *</label>
              <input
                name="stock"
                value={form.stock}
                onChange={handleChange}
                type="number"
                placeholder="Ex: 20"
                className="w-full px-5 py-3.5 border border-gray-200 rounded-2xl text-sm font-medium outline-none focus:border-orange-300 transition-colors"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 block">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Courte description du produit..."
              className="w-full px-5 py-3.5 border border-gray-200 rounded-2xl text-sm font-medium outline-none focus:border-orange-300 resize-none transition-colors"
            />
          </div>

          {/* Upload Image */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 block">
              <Upload size={10} className="inline mr-1" /> Image du produit
            </label>

            {/* Zone drag & drop */}
            <div
              onClick={() => fileInputRef.current.click()}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="cursor-pointer border-2 border-dashed border-gray-200 hover:border-orange-300 rounded-2xl transition-colors overflow-hidden"
            >
              {imagePreview ? (
                <div className="relative group">
                  <img
                    src={imagePreview}
                    alt="preview"
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <p className="text-white text-xs font-black uppercase tracking-widest">Changer l'image</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center">
                    <Upload size={20} className="text-orange-500" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-black text-gray-700">Clique ou glisse une image ici</p>
                    <p className="text-[10px] text-gray-400 font-medium mt-0.5">JPG, PNG, WEBP — depuis ta machine ou ton téléphone</p>
                  </div>
                </div>
              )}
            </div>

            {/* Input fichier caché */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageChange}
              className="hidden"
            />

            {/* Bouton supprimer l'image */}
            {imagePreview && (
              <button
                onClick={() => { setImageFile(null); setImagePreview(null); }}
                className="mt-2 text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-600 transition-colors flex items-center gap-1"
              >
                <X size={10} /> Supprimer l'image
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-gray-100 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3.5 rounded-2xl border border-gray-200 text-sm font-black uppercase tracking-widest text-gray-400 hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex-1 py-3.5 rounded-2xl bg-gray-900 text-white text-sm font-black uppercase tracking-widest hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {saving
              ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }} className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
              : <Check size={15} />
            }
            {isEdit ? 'Enregistrer' : 'Ajouter'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Composant principal ───
export default function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/products/`);
      setProducts(res.data);
    } catch (err) {
      console.error('Erreur fetch produits', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/products/${id}/`);
      setProducts(prev => prev.filter(p => p.id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Erreur suppression', err);
    }
  };

  // ─── Stats calculées ───
  const totalRevenue = MOCK_SALES.reduce((s, d) => s + d.revenue, 0);
  const totalOrders = MOCK_SALES.reduce((s, d) => s + d.orders, 0);
  const outOfStock = products.filter(p => p.stock === 0).length;
  const maxBarRevenue = Math.max(...MOCK_SALES.map(d => d.revenue));

  const TABS = [
    { id: 'dashboard', label: 'Vue générale', icon: LayoutDashboard },
    { id: 'products', label: 'Produits', icon: Package },
    { id: 'sales', label: 'Ventes', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* ═══ SIDEBAR ═══ */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col fixed inset-y-0 left-0 z-30">
        {/* Logo */}
        <div className="px-8 py-8 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={12} className="text-orange-500" />
            <span className="text-[8px] font-black tracking-[0.5em] uppercase text-orange-500">Admin</span>
          </div>
          <h1 className="text-2xl font-black tracking-tighter">PENDA <span className="text-orange-600 italic">STORE</span></h1>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl text-left transition-all duration-200 text-sm font-black uppercase tracking-widest ${
                activeTab === id
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-400 hover:bg-gray-50 hover:text-gray-700'
              }`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </nav>

        {/* Logout */}
        {onLogout && (
          <div className="px-4 py-6 border-t border-gray-100">
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-black uppercase tracking-widest text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all"
            >
              <LogOut size={15} />
              Déconnexion
            </button>
          </div>
        )}
      </aside>

      {/* ═══ MAIN ═══ */}
      <main className="flex-1 ml-64 px-10 py-10 overflow-y-auto">
        <AnimatePresence mode="wait">

          {/* ─── DASHBOARD ─── */}
          {activeTab === 'dashboard' && (
            <motion.div key="dashboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <header className="mb-10">
                <p className="text-[9px] font-black uppercase tracking-[0.5em] text-orange-500 mb-2">✦ Vue générale</p>
                <h2 className="text-4xl font-black tracking-tighter">TABLEAU DE <span className="text-orange-600 italic">BORD</span>.</h2>
              </header>

              {/* KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
                {[
                  { label: 'Revenus totaux', value: `${totalRevenue.toLocaleString()}`, unit: 'FCFA', icon: DollarSign, color: 'text-orange-600' },
                  { label: 'Commandes', value: totalOrders, unit: 'total', icon: ShoppingBag, color: 'text-gray-900' },
                  { label: 'Produits actifs', value: products.length, unit: 'références', icon: Package, color: 'text-gray-900' },
                  { label: 'Ruptures de stock', value: outOfStock, unit: 'produits', icon: AlertCircle, color: outOfStock > 0 ? 'text-red-500' : 'text-gray-900' },
                ].map(({ label, value, unit, icon: Icon, color }) => (
                  <div key={label} className="bg-white rounded-[1.75rem] p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">{label}</p>
                      <div className={`w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center ${color}`}>
                        <Icon size={15} />
                      </div>
                    </div>
                    <p className={`text-3xl font-black tracking-tighter ${color}`}>{value}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{unit}</p>
                  </div>
                ))}
              </div>

              {/* Charts row */}
              <div className="grid grid-cols-3 gap-5 mb-10">
                {/* Bar chart */}
                <div className="col-span-2 bg-white rounded-[1.75rem] p-7 border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Revenus mensuels</p>
                      <p className="text-xl font-black tracking-tight mt-0.5">Évolution 2025</p>
                    </div>
                    <BarChart2 size={18} className="text-gray-300" />
                  </div>
                  <MiniBarChart data={MOCK_SALES} />
                </div>

                {/* Top catégories */}
                <div className="bg-white rounded-[1.75rem] p-7 border border-gray-100">
                  <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Top catégories</p>
                  <p className="text-xl font-black tracking-tight mb-6">Ventes</p>
                  <div className="space-y-4">
                    {[
                      { cat: 'Parfum & Huile', pct: 42, color: 'bg-orange-500' },
                      { cat: 'Coffret', pct: 28, color: 'bg-gray-900' },
                      { cat: 'Accessoires', pct: 18, color: 'bg-orange-300' },
                      { cat: 'Vaisselle', pct: 12, color: 'bg-gray-200' },
                    ].map(({ cat, pct, color }) => (
                      <div key={cat}>
                        <div className="flex justify-between text-xs font-black uppercase tracking-wide mb-1">
                          <span className="text-gray-600">{cat}</span>
                          <span className="text-gray-400">{pct}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            className={`h-full rounded-full ${color}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Commandes récentes */}
              <div className="bg-white rounded-[1.75rem] border border-gray-100 overflow-hidden">
                <div className="px-7 py-6 border-b border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-orange-500">Dernières commandes</p>
                    <p className="text-xl font-black tracking-tight mt-0.5">Activité récente</p>
                  </div>
                  <Eye size={16} className="text-gray-300" />
                </div>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-50">
                      {['Commande', 'Produit', 'Catégorie', 'Montant', 'Statut', 'Date'].map(h => (
                        <th key={h} className="px-7 py-3 text-left text-[9px] font-black uppercase tracking-widest text-gray-300">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_RECENT_ORDERS.map((order, i) => (
                      <motion.tr
                        key={order.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className="border-b border-gray-50 hover:bg-gray-50/70 transition-colors"
                      >
                        <td className="px-7 py-4 text-sm font-black text-gray-900">{order.id}</td>
                        <td className="px-7 py-4 text-sm font-semibold text-gray-700">{order.product}</td>
                        <td className="px-7 py-4 text-xs font-black uppercase tracking-widest text-orange-500">{order.category}</td>
                        <td className="px-7 py-4 text-sm font-black text-gray-900">{order.amount.toLocaleString()} <span className="text-orange-600 text-xs">FCFA</span></td>
                        <td className="px-7 py-4">
                          <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${STATUS_STYLES[order.status]}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-7 py-4 text-xs text-gray-400 font-semibold">{order.date}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* ─── PRODUITS ─── */}
          {activeTab === 'products' && (
            <motion.div key="products" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <header className="mb-10 flex items-end justify-between">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.5em] text-orange-500 mb-2">✦ Gestion</p>
                  <h2 className="text-4xl font-black tracking-tighter">LES <span className="text-orange-600 italic">PRODUITS</span>.</h2>
                  <p className="text-gray-400 text-sm font-medium mt-1">{products.length} références en catalogue</p>
                </div>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { setEditingProduct(null); setShowForm(true); }}
                  className="flex items-center gap-2 bg-gray-900 text-white px-7 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-orange-600 transition-colors shadow-xl"
                >
                  <Plus size={16} /> Ajouter un produit
                </motion.button>
              </header>

              {loading ? (
                <div className="flex justify-center py-24">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="w-8 h-8 border-4 border-gray-100 border-t-orange-600 rounded-full" />
                </div>
              ) : (
                <div className="bg-white rounded-[1.75rem] border border-gray-100 overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100">
                        {['Image', 'Produit', 'Catégorie', 'Prix', 'Stock', 'Actions'].map(h => (
                          <th key={h} className="px-7 py-4 text-left text-[9px] font-black uppercase tracking-widest text-gray-300">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <AnimatePresence>
                        {products.map((product, i) => (
                          <motion.tr
                            key={product.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ delay: i * 0.04 }}
                            className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors group"
                          >
                            {/* Image */}
                            <td className="px-7 py-4">
                              <div className="w-12 h-12 rounded-2xl overflow-hidden bg-gray-100">
                                {product.image
                                  ? <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                  : <div className="w-full h-full flex items-center justify-center text-gray-300"><Package size={18} /></div>
                                }
                              </div>
                            </td>

                            {/* Nom */}
                            <td className="px-7 py-4">
                              <p className="text-sm font-black text-gray-900">{product.name}</p>
                              {product.description && <p className="text-xs text-gray-400 font-medium truncate max-w-[180px]">{product.description}</p>}
                            </td>

                            {/* Catégorie */}
                            <td className="px-7 py-4">
                              <span className="text-[9px] font-black uppercase tracking-widest text-orange-600 bg-orange-50 px-3 py-1.5 rounded-full">
                                {product.category_name}
                              </span>
                            </td>

                            {/* Prix */}
                            <td className="px-7 py-4">
                              <span className="text-sm font-black text-gray-900">{Number(product.price).toLocaleString()}</span>
                              <span className="text-[10px] font-black text-orange-600 ml-1">FCFA</span>
                            </td>

                            {/* Stock */}
                            <td className="px-7 py-4">
                              <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${
                                product.stock === 0
                                  ? 'bg-red-50 text-red-600'
                                  : product.stock <= 5
                                  ? 'bg-orange-50 text-orange-600'
                                  : 'bg-gray-100 text-gray-600'
                              }`}>
                                {product.stock === 0 ? 'Épuisé' : `${product.stock} en stock`}
                              </span>
                            </td>

                            {/* Actions */}
                            <td className="px-7 py-4">
                              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => { setEditingProduct(product); setShowForm(true); }}
                                  className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-orange-100 hover:text-orange-600 flex items-center justify-center transition-all"
                                >
                                  <Edit3 size={13} />
                                </button>
                                <button
                                  onClick={() => setDeleteConfirm(product)}
                                  className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-red-100 hover:text-red-600 flex items-center justify-center transition-all"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>

                  {products.length === 0 && (
                    <div className="text-center py-20">
                      <p className="text-5xl mb-4">📦</p>
                      <p className="text-gray-300 font-black text-lg uppercase tracking-widest">Aucun produit</p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {/* ─── VENTES ─── */}
          {activeTab === 'sales' && (
            <motion.div key="sales" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <header className="mb-10">
                <p className="text-[9px] font-black uppercase tracking-[0.5em] text-orange-500 mb-2">✦ Analytics</p>
                <h2 className="text-4xl font-black tracking-tighter">LES <span className="text-orange-600 italic">VENTES</span>.</h2>
              </header>

              {/* Revenus par mois */}
              <div className="grid grid-cols-3 gap-5 mb-8">
                {MOCK_SALES.map((d, i) => (
                  <motion.div
                    key={d.month}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="bg-white rounded-[1.75rem] p-6 border border-gray-100 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">{d.month} 2025</p>
                      <div className="h-1.5 w-16 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-orange-500 rounded-full"
                          style={{ width: `${(d.revenue / maxBarRevenue) * 100}%` }}
                        />
                      </div>
                    </div>
                    <p className="text-2xl font-black tracking-tight text-gray-900">{d.revenue.toLocaleString()}</p>
                    <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mt-0.5">FCFA — {d.orders} cmds</p>
                  </motion.div>
                ))}
              </div>

              {/* Commandes détaillées */}
              <div className="bg-white rounded-[1.75rem] border border-gray-100 overflow-hidden">
                <div className="px-7 py-6 border-b border-gray-100">
                  <p className="text-[9px] font-black uppercase tracking-widest text-orange-500">Historique</p>
                  <p className="text-xl font-black tracking-tight mt-0.5">Toutes les commandes</p>
                </div>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-50">
                      {['ID', 'Produit', 'Catégorie', 'Montant', 'Statut', 'Date'].map(h => (
                        <th key={h} className="px-7 py-3 text-left text-[9px] font-black uppercase tracking-widest text-gray-300">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_RECENT_ORDERS.map((order, i) => (
                      <motion.tr
                        key={order.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className="border-b border-gray-50 hover:bg-gray-50/70"
                      >
                        <td className="px-7 py-4 text-sm font-black">{order.id}</td>
                        <td className="px-7 py-4 text-sm font-semibold text-gray-700">{order.product}</td>
                        <td className="px-7 py-4 text-xs font-black uppercase tracking-widest text-orange-500">{order.category}</td>
                        <td className="px-7 py-4 text-sm font-black">{order.amount.toLocaleString()} <span className="text-orange-600 text-xs">FCFA</span></td>
                        <td className="px-7 py-4">
                          <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${STATUS_STYLES[order.status]}`}>{order.status}</span>
                        </td>
                        <td className="px-7 py-4 text-xs text-gray-400 font-semibold">{order.date}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* ═══ MODALS ═══ */}
      <AnimatePresence>
        {showForm && (
          <ProductForm
            product={editingProduct}
            onClose={() => { setShowForm(false); setEditingProduct(null); }}
            onSave={() => { setShowForm(false); setEditingProduct(null); fetchProducts(); }}
          />
        )}

        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-[2rem] shadow-2xl p-8 max-w-sm w-full text-center"
            >
              <p className="text-4xl mb-4">🗑️</p>
              <h3 className="text-xl font-black tracking-tight mb-2">Supprimer ce produit ?</h3>
              <p className="text-gray-400 text-sm font-medium mb-6">
                <span className="font-black text-gray-700">"{deleteConfirm.name}"</span> sera définitivement supprimé.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-3.5 rounded-2xl border border-gray-200 text-sm font-black uppercase tracking-widest text-gray-400 hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm.id)}
                  className="flex-1 py-3.5 rounded-2xl bg-red-500 text-white text-sm font-black uppercase tracking-widest hover:bg-red-600 transition-colors"
                >
                  Supprimer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
