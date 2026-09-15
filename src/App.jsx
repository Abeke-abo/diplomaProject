import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Portfolio from "./components/Portfolio";
import FAQ from "./components/FAQ";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./components/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";

function App() {
  const { t } = useTranslation();

  return (
    <Router>
      <div className="min-h-screen bg-white font-sans text-slate-900">
        <Routes>
          <Route 
            path="/" 
            element={
              <>
                <Navbar />
                <main>
                  <Hero />
                  <Services />
                  <Portfolio />
                  <FAQ />
                  <Contact />
                </main>
                <Footer />
              </>
            } 
          />

          <Route path="/login" element={<Login />} />
          
          <Route path="/register" element={<Register />} />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route path="*" element={
            <div className="flex flex-col items-center justify-center h-screen bg-slate-50 text-center px-4">
              <h1 className="text-9xl font-black text-slate-200">404</h1>
              <p className="text-2xl font-bold text-slate-800 -mt-8">{t('notFound.title')}</p>
              <p className="text-slate-500 mt-2 mb-8">{t('notFound.subtitle')}</p>
              <a href="/" className="px-8 py-3 bg-slate-900 text-white rounded-full font-bold hover:bg-blue-600 transition-all shadow-lg">
                {t('notFound.home')}
              </a>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
