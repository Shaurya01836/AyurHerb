import React from "react";
import Navbar from "../components/Navbar";
import DiseaseRecommendation from "../components/DiseaseRecommendation";
import { Leaf, Heart, Shield, Sparkles } from "lucide-react";

const HealthWellness = () => {
  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <div className="pt-24 pb-16 px-4 min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 bg-green-100 text-green-700 px-6 py-3 rounded-full mb-6">
              <Heart className="w-5 h-5" />
              <span className="font-semibold">Natural Healing</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-6 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Herbal Health & Wellness
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              Discover natural remedies and herbal treatments for common ailments. 
              Our AI-powered system provides personalized recommendations based on 
              traditional Ayurvedic wisdom and modern herbal medicine.
            </p>
            
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-500" />
                <span>Safe & Natural</span>
              </div>
              <div className="flex items-center gap-2">
                <Leaf className="w-4 h-4 text-green-500" />
                <span>Traditional Wisdom</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-green-500" />
                <span>AI-Powered</span>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white/60 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <Leaf className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Herbal Remedies</h3>
              <p className="text-gray-600 leading-relaxed">
                Access a comprehensive database of herbal treatments for various health conditions.
              </p>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Symptom Analysis</h3>
              <p className="text-gray-600 leading-relaxed">
                Describe your symptoms and get personalized herbal recommendations.
              </p>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Safety Guidelines</h3>
              <p className="text-gray-600 leading-relaxed">
                Get detailed dosage instructions and safety precautions for each remedy.
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border border-green-100 p-8 lg:p-12">
            <DiseaseRecommendation />
          </div>
        </div>
      </div>
    </>
  );
};

export default HealthWellness;
