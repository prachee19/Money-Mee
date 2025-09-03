import React, { useState } from 'react';
import { HandCoins, X } from 'lucide-react';

// A new component for the falling coins animation
const MoneyAnimation = () => {
  // Create an array to map over for the coins
  const coins = Array.from({ length: 50 });

  return (
    <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {coins.map((_, index) => (
        <div
          key={index}
          className="absolute rounded-full bg-yellow-400/50"
          style={{
            width: `${Math.random() * 15 + 5}px`, // Random size between 5px and 20px
            height: `${Math.random() * 15 + 5}px`,
            left: `${Math.random() * 100}%`,
            animation: `fall ${Math.random() * 8 + 5}s linear infinite`, // Random duration
            animationDelay: `${Math.random() * 5}s`, // Random start delay
            top: '-20px', // Start above the screen
          }}
        ></div>
      ))}
    </div>
  );
};


// Landing Page Component
const LandingPage = () => {
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  return (
    <>
      {/* Keyframes for the animation */}
      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(0) rotate(0);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>

      <div className="bg-gray-50 min-h-screen font-sans text-gray-800 relative overflow-hidden">
        {/* The Money Animation component is added here */}
        <MoneyAnimation />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header Section */}
          <header className="flex justify-between items-center py-6">
            <div className="flex items-center gap-2">
              <HandCoins className="h-8 w-8 text-purple-600" />
              <h1 className="text-2xl font-bold text-gray-900">Money Mee</h1>
            </div>
            <nav className="hidden md:flex items-center gap-8 text-gray-600 font-medium">
              <a href="/" className="hover:text-purple-600 transition-colors">Home</a>
              <button onClick={() => setShowAboutModal(true)} className="hover:text-purple-600 transition-colors">About us</button>
              <button onClick={() => setShowContactModal(true)} className="hover:text-purple-600 transition-colors">Contact us</button>
            </nav>
            <div className="flex items-center gap-4">
              <a href="/login" className="font-medium text-gray-600 hover:text-purple-600 transition-colors">
                Login
              </a>
              <a href="/signup" className="bg-gray-800 text-white font-semibold px-5 py-2 rounded-lg hover:bg-gray-700 transition-colors shadow">
                Get Started
              </a>
            </div>
          </header>

          {/* Main Content / Hero Section */}
          <main className="text-center pt-20 pb-16">
            <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
              Take Control of Your Finances
            </h2>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-500">
              Your foundation for secure, intelligent financial management. Effortlessly
              track your income and expenses to achieve your financial goals.
            </p>
            <div className="mt-10 flex justify-center items-center gap-4">
              <a href="/signup" className="bg-purple-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                Start Tracking for Free
              </a>
            </div>
          </main>
        </div>
      </div>

      {/* About & Contact Modals */}
      {showAboutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full relative">
            <button onClick={() => setShowAboutModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800"><X size={24} /></button>
            <h3 className="text-2xl font-bold mb-4 text-gray-800">About Money Manager</h3>
            <p className="text-gray-600 mb-4">
           Money Mee is a smart and intuitive platform that helps users track their incomes and expenses, giving clear insights into spending habits.
This project empowers students and young professionals to take control of their finances, make informed decisions, and build better money management habits — all in a simple, user-friendly interface.
            </p>
            <p className="text-right mt-6 font-semibold text-gray-700">-- Prachi </p>
          </div>
        </div>
      )}
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full relative">
            <button onClick={() => setShowContactModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800"><X size={24} /></button>
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Contact Us</h3>
            <p className="text-gray-600"><strong>Email:</strong> <a href="mailto:moneymeeupdates@gmail.com" className="text-purple-600 hover:underline">moneymeeupdates@gmail.com</a></p>
          </div>
        </div>
      )}
    </>
  );
};

export default LandingPage;
