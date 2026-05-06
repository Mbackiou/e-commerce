import React from 'react';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import { ArrowRight, Sparkles } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative min-h-[80vh] flex items-center pt-10 overflow-hidden">
      
      {/* ÉLÉMENTS 3D FLOTTANTS (Arrière-plan) */}
      <motion.div 
        animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute top-20 right-[15%] w-32 h-32 bg-gradient-to-br from-orange-400 to-red-600 rounded-3xl blur-2xl opacity-20"
      />
      <motion.div 
        animate={{ y: [0, 30, 0], rotate: [0, -15, 0] }}
        transition={{ duration: 7, repeat: Infinity }}
        className="absolute bottom-10 left-[10%] w-40 h-40 bg-green-400 rounded-full blur-3xl opacity-20"
      />

      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        
        {/* TEXTE (GAUCHE) */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center space-x-2 bg-orange-50 border border-orange-100 px-4 py-2 rounded-full mb-6">
            <Sparkles className="text-orange-600" size={16} />
            <span className="text-orange-600 font-bold text-xs uppercase tracking-widest">Édition Limitée 2026</span>
          </div>
          
          <h1 className="text-6xl lg:text-8xl font-black text-gray-900 leading-[0.9] mb-8">
            L'Art du <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-green-700">
              Sénégal
            </span>
          </h1>
          
          <p className="text-gray-600 text-lg max-w-md mb-10 leading-relaxed">
            HackireShop fusionne le textile ancestral et la haute couture moderne. 
            Portez une histoire, affirmez votre élégance.
          </p>

          <div className="flex flex-wrap gap-4">
            <button className="bg-orange-600 text-white px-10 py-5 rounded-2xl font-black text-lg shadow-2xl shadow-orange-200 hover:bg-black transition-all flex items-center group">
              Acheter Maintenant
              <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
            </button>
            <div className="flex -space-x-4 items-center ml-4">
              {[1, 2, 3].map((i) => (
                <img key={i} src={`https://i.pravatar.cc/100?img=${i+10}`} className="w-12 h-12 rounded-full border-4 border-white shadow-sm" />
              ))}
              <p className="ml-6 text-sm font-bold text-gray-400">+2k clients satisfaits</p>
            </div>
          </div>
        </motion.div>

        {/* VISUEL 3D (DROITE) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative"
        >
          <Tilt 
            tiltMaxAngleX={10} 
            tiltMaxAngleY={10} 
            perspective={1000} 
            transitionSpeed={1500}
            className="relative z-20"
          >
            <div className="relative rounded-[4rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] border-[12px] border-white">
              <img 
                src="https://images.unsplash.com/photo-1572495631021-26413a69602e?w=800" 
                alt="Modèle Sénégalais" 
                className="w-full h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              
              {/* Badge flottant sur l'image */}
              <div className="absolute bottom-10 left-10 bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-xl">
                <p className="text-orange-600 font-black text-sm uppercase mb-1">Tissu du mois</p>
                <p className="text-gray-900 font-bold text-xl font-serif italic">Basin Riche Royal</p>
              </div>
            </div>
          </Tilt>

          {/* Décoration derrière l'image */}
          <div className="absolute -top-10 -right-10 w-full h-full border-2 border-orange-200 rounded-[4rem] -z-10 translate-x-4 translate-y-4"></div>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;