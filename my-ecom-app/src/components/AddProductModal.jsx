import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Upload, Plus } from 'lucide-react';
import axios from 'axios';

export default function AddProductModal({ isOpen, onClose, onRefresh }) {
  const [formData, setFormData] = useState({
    name: '', price: '', category: '1', stock: 5, description: '', image: null
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(); // FormData est obligatoire pour envoyer une image
    Object.keys(formData).forEach(key => data.append(key, formData[key]));

    try {
      const token = localStorage.getItem('access_token');
      await axios.post('http://127.0.0.1:8000/api/products/', data, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data' 
        }
      });
      onRefresh(); // Recharge la liste
      onClose();   // Ferme la modal
    } catch (err) {
      alert("Erreur lors de l'ajout. Vérifiez vos droits admin.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white w-full max-w-xl rounded-[3rem] p-10 relative shadow-2xl">
        <button onClick={onClose} className="absolute top-8 right-8 text-gray-400 hover:text-black"><X /></button>
        
        <h2 className="text-3xl font-black tracking-tighter mb-8">NOUVEAU <span className="text-orange-600 italic">MODÈLE</span></h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <input type="text" placeholder="Nom du produit" className="w-full p-4 bg-gray-50 rounded-2xl outline-none border border-gray-100 focus:border-orange-500" 
            onChange={(e) => setFormData({...formData, name: e.target.value})} required />
          
          <div className="grid grid-cols-2 gap-4">
            <input type="number" placeholder="Prix (FCFA)" className="p-4 bg-gray-50 rounded-2xl outline-none border border-gray-100" 
              onChange={(e) => setFormData({...formData, price: e.target.value})} required />
            <input type="number" placeholder="Stock" className="p-4 bg-gray-50 rounded-2xl outline-none border border-gray-100" 
              onChange={(e) => setFormData({...formData, stock: e.target.value})} required />
          </div>

          <textarea placeholder="Description" className="w-full p-4 bg-gray-50 rounded-2xl h-32 outline-none border border-gray-100" 
            onChange={(e) => setFormData({...formData, description: e.target.value})} />

          <div className="relative">
            <label className="flex items-center gap-4 p-4 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:border-orange-500 transition-colors">
              <Upload className="text-gray-400" />
              <span className="text-sm font-bold text-gray-500">{formData.image ? formData.image.name : "Choisir une photo"}</span>
              <input type="file" className="hidden" onChange={(e) => setFormData({...formData, image: e.target.files[0]})} required />
            </label>
          </div>

          <button className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-orange-600 transition-all flex items-center justify-center gap-2">
            <Plus size={20}/> Ajouter à la collection
          </button>
        </form>
      </motion.div>
    </div>
  );
}