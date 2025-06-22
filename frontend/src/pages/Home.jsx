import React from "react";
import Laptop from "../assets/Laptop.png"
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-[#0f0f11] text-white font-sans">
      <header className="flex justify-between items-center px-8 py-5 bg-[#18181b] border-b border-gray-800 shadow-md">
        <h1 className="text-2xl font-extrabold tracking-wide text-[#5e63ff]">💰 Pocket Tracker</h1>
        <div className="space-x-3">
          <Link to="/login">
            <button className="px-5 py-2 text-sm font-medium bg-white text-[#18181b] rounded-full hover:bg-gray-100 transition-all">
              Login
            </button>
          </Link>
          <Link to="/register">
            <button className="px-5 py-2 text-sm font-medium bg-[#5e63ff] hover:bg-[#6d72ff] rounded-full transition-all text-white">
              Sign Up
            </button>
          </Link>
        </div>
      </header>

      <main className="flex flex-col md:flex-row items-center justify-between px-8 md:px-16 py-20">
        <div className="md:w-1/2 space-y-6">
          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight text-white">
            Smart Tracker <br /> Starts Here.
          </h2>
          <p className="text-gray-400 max-w-lg leading-relaxed">
            Track your expenses, manage savings, and reach your goals — all in one place with clean analytics and real-time insights.
          </p>
          <div className="flex flex-wrap gap-4 mt-6">
            <button className="px-5 py-3 bg-[#5e63ff] text-white font-semibold rounded-xl shadow-lg hover:bg-[#6d72ff] transition">
              ➕ Add Expense
            </button>
            <button className="px-5 py-3 bg-[#23232b] text-white font-semibold rounded-xl border border-[#5e63ff50] hover:shadow-md transition">
              🛠️ Update Expense
            </button>
            <button className="px-5 py-3 bg-[#5e63ff] text-white font-semibold rounded-xl shadow-lg hover:bg-[#6d72ff] transition">
              💹 Add Plan
            </button>
            <button className="px-5 py-3 bg-[#23232b] text-white font-semibold rounded-xl border border-[#5e63ff50] hover:shadow-md transition">
              🔄 Update Plan
            </button>
          </div>
        </div>
        <div className="md:w-1/2 mt-12 md:mt-0">
        <img src={Laptop} alt="" />
           {/* <Spline scene="https://prod.spline.design/EG0UTluKFqCLAh1R/scene.splinecode" /> */}
        </div>
      </main>

      <section className="px-6 md:px-16 py-16 bg-[#1c1c22] border-t border-gray-800">
        <h3 className="text-3xl font-bold mb-12 text-center text-white">Why Choose Pocket Tracker?</h3>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="bg-[#23232b] p-6 rounded-2xl shadow-md hover:shadow-[#5e63ff77] transition">
            <h4 className="text-xl font-semibold mb-2">📈 Track Instantly</h4>
            <p className="text-gray-400">Log your expenses in seconds with a smart and responsive interface.</p>
          </div>
          <div className="bg-[#23232b] p-6 rounded-2xl shadow-md hover:shadow-[#5e63ff77] transition">
            <h4 className="text-xl font-semibold mb-2">🎯 Smart Planning</h4>
            <p className="text-gray-400">Plan savings goals and get visual progress updates automatically.</p>
          </div>
          <div className="bg-[#23232b] p-6 rounded-2xl shadow-md hover:shadow-[#5e63ff77] transition">
            <h4 className="text-xl font-semibold mb-2">🗂️ Organized Categories</h4>
            <p className="text-gray-400">
              Group your expenses into categories like Food, Travel, Bills, and more for better clarity.
            </p>
          </div>
        </div>
      </section>

      <footer className="text-center py-6 text-sm text-gray-500 bg-[#18181b] border-t border-gray-800">
        &copy; {new Date().getFullYear()} Pocket Tracker. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
