import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Plus, Minus, ShoppingBag, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cart, removeFromCart, addToCart, getCartTotal, getItemCount } = useCart();
  const navigate = useNavigate();

  const livraison = 2000;
  const totalGeneral = getCartTotal() + livraison;

  const handleCommanderWhatsApp = () => {
    const numeroWhatsApp = "221783517319";

    const lignes = cart.map((item, index) => {
      const sousTotal = (item.price * item.quantity).toLocaleString();
      const description = item.description ? `   📝 ${item.description}` : '';
      const categorie = item.category_name ? `   🏷️ Catégorie : ${item.category_name}` : '';

      return `${index + 1}️⃣ *${item.name}*
${categorie}
${description}
   💵 Prix unitaire : ${item.price.toLocaleString()} FCFA
   🔢 Quantité : ${item.quantity}
   💰 Sous-total : ${sousTotal} FCFA`;
    }).join("\n━━━━━━━━━━━━━━━━━━━\n");

    const message = `🛍️ *NOUVELLE COMMANDE — Penda Store*

━━━━━━━━━━━━━━━━━━━
${lignes}
━━━━━━━━━━━━━━━━━━━

📦 Nombre d'articles : ${getItemCount()}
🚚 Livraison : ${livraison.toLocaleString()} FCFA
💳 *TOTAL À PAYER : ${totalGeneral.toLocaleString()} FCFA*

Merci de confirmer ma commande ! 🙏`;

    const lien = `https://wa.me/${"221774579038"}?text=${encodeURIComponent(message)}`;
    window.open(lien, '_blank');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 max-w-xl mx-auto">
        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag size={32} className="text-orange-600" />
        </motion.div>
        <h2 className="text-3xl font-black text-gray-900 mb-2">Votre panier est vide</h2>
        <p className="text-gray-400 font-medium mb-8 text-sm uppercase tracking-widest">Le style n'attend pas.</p>
        <button onClick={() => navigate('/products')} className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-black hover:bg-orange-600 transition-all">
          Découvrir la collection
        </button>
      </div>
    );
  }

  return (
    <div className="pb-20 max-w-5xl mx-auto px-6">

      <header className="mb-16 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-black tracking-tighter"
        >
          MON <span className="text-orange-600 italic">PANIER</span>.
        </motion.h1>
        <div className="h-1.5 w-12 bg-gray-900 mx-auto mt-4 rounded-full"></div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

        {/* LISTE DES ARTICLES */}
        <div className="lg:col-span-7 space-y-4">
          <AnimatePresence>
            {cart.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="flex items-center gap-6 bg-white p-5 rounded-[2.5rem] border border-gray-100 shadow-sm"
              >
                <div className="w-24 h-24 rounded-[1.5rem] overflow-hidden flex-shrink-0 bg-gray-50">
                  <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                </div>

                <div className="flex-grow min-w-0">
                  <p className="text-[9px] font-black uppercase tracking-widest text-orange-600 mb-1">{item.category_name}</p>
                  <h3 className="text-lg font-black text-gray-900 truncate">{item.name}</h3>
                  {item.description && (
                    <p className="text-xs text-gray-400 truncate mt-0.5">{item.description}</p>
                  )}
                  <p className="text-orange-600 font-black text-sm mt-1">{item.price.toLocaleString()} FCFA</p>

                  <div className="flex items-center gap-4 mt-3 bg-gray-50 w-fit px-3 py-1 rounded-xl">
                    <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-orange-600 transition-colors"><Minus size={14} /></button>
                    <span className="font-black text-sm">{item.quantity}</span>
                    <button onClick={() => addToCart(item)} className="text-gray-400 hover:text-orange-600 transition-colors"><Plus size={14} /></button>
                  </div>
                </div>

                <div className="text-right hidden sm:block">
                  <p className="text-lg font-black text-gray-900">{(item.price * item.quantity).toLocaleString()}</p>
                  <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">FCFA</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* RÉSUMÉ COMMANDE */}
        <div className="lg:col-span-5">
          <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-100/50">
            <h2 className="text-xl font-black mb-8 uppercase tracking-tighter">Récapitulatif</h2>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm font-bold text-gray-500">
                <span>Articles ({getItemCount()})</span>
                <span className="text-gray-900">{getCartTotal().toLocaleString()} FCFA</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-gray-500">
                <span>Livraison</span>
                <span className="text-gray-900">{livraison.toLocaleString()} FCFA</span>
              </div>
              <div className="border-t border-dashed border-gray-100 pt-4 flex justify-between items-end">
                <span className="text-sm font-black uppercase text-gray-400">Total à payer</span>
                <span className="text-3xl font-black text-orange-600">{totalGeneral.toLocaleString()} <span className="text-xs">FCFA</span></span>
              </div>
            </div>

            {/* Bouton WhatsApp */}
            <button
              onClick={handleCommanderWhatsApp}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all shadow-lg flex items-center justify-center gap-3"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Commander sur WhatsApp
            </button>

            {/* Badges de confiance */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-2xl">
                <ShieldCheck size={18} className="text-green-600 mb-1" />
                <span className="text-[8px] font-black uppercase text-gray-400 tracking-tighter">Sécurisé</span>
              </div>
              <div className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-2xl">
                <Truck size={18} className="text-orange-600 mb-1" />
                <span className="text-[8px] font-black uppercase text-gray-400 tracking-tighter">Express 24h</span>
              </div>
            </div>
          </div>

          <p className="mt-6 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Modes acceptés : Wave • Orange Money • Cash
          </p>
        </div>

      </div>
    </div>
  );
}
