import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("userProfile")) || {};
  
  const handleLogout = () => {
    localStorage.removeItem("userName");
    localStorage.removeItem("userProfile");
    navigate("/");
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="bg-white text-blue-600 font-bold text-xl px-3 py-1 rounded mr-2">
                CC
              </div>
              <span className="text-white font-bold text-xl">Campus Champs</span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => navigate("/dashboard")}
              className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Dashboard
            </button>
            
            <button 
              onClick={() => navigate("/certificate")}
              className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Certificate
            </button>
            
            <div className="relative group">
              <button className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Resources
              </button>
              <div className="absolute hidden group-hover:block bg-white shadow-lg rounded-md mt-2 w-48 py-1 z-10">
                <a href="https://www.deeplearning.ai/" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">AI</a>
                <a href="https://www.coursera.org/specializations/machine-learning-introduction" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">ML</a>
                <a href="https://web.dev/learn/" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Web Dev</a>
                <a href="https://docs.python.org/3/" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Python</a>
                <a href="https://en.cppreference.com/w/" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">C++</a>
                <a href="https://cloud.google.com/learn/certification/ai-ml" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Google AI Certifications</a>
              </div>
            </div>
            
            <a 
              href="https://gdg.community.dev/gdg-on-campus-indo-global-college-mohali-india/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Join
            </a>
            
            <button 
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Logout
            </button>
          </div>
          
          <div className="md:hidden flex items-center">
            <button className="text-white">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
