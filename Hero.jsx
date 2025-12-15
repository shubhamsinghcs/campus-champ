import React from "react";
import AdminGenerateQuestion from "./AdminGenerateQuestion";

const Hero = () => {
  const user = JSON.parse(localStorage.getItem("userProfile")) || {};
  const isAdmin = user.email?.toLowerCase().includes('@admin.com') || 
                 (user.role && user.role.toLowerCase() === 'admin');

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 py-8">
      <div className="max-w-4xl w-full">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">
          Welcome to Google Developer Groups on Campus IGC
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-6">
          Practice your skills with <span className="text-blue-600 font-semibold">Campus Champs</span>
        </p>
        
        {user.fullName && (
          <p className="text-sm text-gray-500 mb-6">
            Hi <span className="font-medium">{user.fullName}</span>, let's continue your journey!
          </p>
        )}

        <div className="bg-white shadow-md rounded-xl p-6 mb-8 max-w-2xl mx-auto">
          <p className="italic text-gray-700 text-lg">
            "When something is important enough, you do it even if the odds are not in your favor." 
            <span className="font-semibold block mt-2">— Elon Musk</span>
          </p>
        </div>

        <div className="w-full">
          <AdminGenerateQuestion isAdmin={isAdmin} />
        </div>
        
        {isAdmin && (
          <div className="mt-4 inline-flex items-center bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Admin Mode Enabled
          </div>
        )}
      </div>
    </div>
  );
};

export default Hero;
