import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Composants
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SplashScreen from './components/SplashScreen';
import AdminDashboard from './components/AdminDashboard';
import PrivateRoute from './components/PrivateRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Cart from './pages/Cart';
import Products from './pages/Products';

function App() {
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {loading && <SplashScreen key="splash" />}
      </AnimatePresence>

      <div className="min-h-screen bg-[#fcfcfc] font-sans flex flex-col">
        {!loading && <Navbar />}

        <main className={`flex-grow transition-opacity duration-1000 ${loading ? 'opacity-0' : 'opacity-100 pt-32 lg:pt-40'}`}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>

              {/* ✅ Pages publiques — accessibles à tous */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/products" element={<Products />} />

              {/* 🔒 Pages privées — connecté uniquement */}
              <Route path="/cart" element={
                <PrivateRoute>
                  <Cart />
                </PrivateRoute>
              } />
              <Route path="/admin" element={
                <PrivateRoute>
                  <AdminDashboard onLogout={() => navigate('/')} />
                </PrivateRoute>
              } />

            </Routes>
          </AnimatePresence>
        </main>

        {!loading && <Footer />}
      </div>
    </>
  );
}

export default App;