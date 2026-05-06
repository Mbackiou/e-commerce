import React from 'react';
import { motion } from 'framer-motion';

const SplashScreen = () => {
  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: -100 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center"
    >
      <div className="relative">
        {/* Cercles pulsants en arrière-plan */}
        <motion.div 
          animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-orange-200 rounded-full blur-3xl"
        />
        
        {/* LOGO ANIMÉ */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative text-5xl lg:text-7xl font-black tracking-tighter flex items-center"
        >
          <span className="text-orange-600">PENDA</span>
          <span className="text-green-800">STORE</span>
          <motion.span 
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 0.5, duration: 1 }}
            className="absolute -bottom-2 left-0 h-2 bg-gradient-to-r from-orange-600 to-green-800 rounded-full"
          />
        </motion.div>
      </div>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-10 text-gray-400 font-bold uppercase tracking-[0.5em] text-[10px]"
      >
       Se sentir bon, c’est déjà être élégant sans effort.
      </motion.p>
    </motion.div>
  );
};

export default SplashScreen;