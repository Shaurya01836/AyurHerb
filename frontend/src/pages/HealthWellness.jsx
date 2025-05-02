import React from "react";
import Navbar from "../components/Navbar";
import DiseaseRecommendation from "../components/DiseaseRecommendation";

const HealthWellness = () => {
  return (
    <>
      <Navbar />
      <div className="pt-36 pb-20 px-4 min-h-screen bg-gradient-to-b from-white to-green-100 text-center">
        <h2 className="text-4xl sm:text-5xl font-extrabold mb-4 text-green-700">
          Herbal Disease & Symptom Checker 🌿
        </h2>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-10">
          Enter your symptoms or the name of a disease to get natural herbal
          remedies based on traditional wisdom and Ayurvedic knowledge.
        </p>
        <DiseaseRecommendation />
        {/* <UploadHerbalData /> */}
      </div>
      
    </>
  );
};

export default HealthWellness;
