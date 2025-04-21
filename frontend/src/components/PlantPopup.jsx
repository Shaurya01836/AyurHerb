import React from "react";
import { Link } from "react-router-dom";

const PlantPopup = ({
  isOpen,
  plant,
  onClose,
  notes,
  setNotes,
  handleDownloadNotes,
  handleShare
}) => {
  if (!isOpen || !plant) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60">
      <div className="bg-white rounded-lg p-8 w-11/12 md:w-4/5 max-w-5xl overflow-y-auto relative shadow-lg transform transition-all duration-300">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl font-bold text-gray-700 hover:text-red-600 transition"
        >
          &times;
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Side: 3D Model and Multimedia */}
          <div className="flex flex-col">
            {/* 3D Model */}
            <iframe
              title={plant.name}
              src={plant.sketchfabModelUrl}
              frameBorder="0"
              allowFullScreen
              className="w-full h-72 rounded-lg mb-4 shadow-sm"
            ></iframe>

            {/* Multimedia Carousel */}
            <div className="overflow-x-auto whitespace-nowrap">
              {plant.multimedia.length > 0 ? (
                plant.multimedia.map((media, index) => (
                  <div key={index} className="inline-block mr-4">
                    {media.includes("youtube.com") || media.includes("youtu.be") ? (
                      <iframe
                        className="h-64 w-64 rounded-lg shadow-md"
                        src={media}
                        frameBorder="0"
                        allowFullScreen
                        title={`Video ${index + 1}`}
                      ></iframe>
                    ) : media.endsWith(".mp4") ? (
                      <video controls className="h-64 w-64 rounded-lg shadow-md" src={media}>
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <img
                        src={media}
                        alt={`Multimedia ${index + 1}`}
                        className="h-64 w-64 object-cover rounded-lg shadow-md"
                      />
                    )}
                  </div>
                ))
              ) : (
                <p>No multimedia content available</p>
              )}
            </div>
          </div>

          {/* Right Side: Plant Info and Notes */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{plant.name}</h2>

            <div className="overflow-y-auto max-h-52 mb-4 pr-4 text-gray-700 text-sm">
              <p><strong>Region:</strong> {plant.region}</p>
              <p><strong>Common Names:</strong> {plant.commonNames}</p>
              <p><strong>Type:</strong> {plant.type}</p>
              <p><strong>Habitat:</strong> {plant.habitat}</p>
              <p><strong>Botanical Name:</strong> {plant.botanicalName}</p>
              <p><strong>Medicinal Uses:</strong> {plant.medicinalUses}</p>
              <p><strong>Methods of Cultivation:</strong> {plant.methodsOfCultivation}</p>
              <p><strong>Extraction Process:</strong> {plant.ExtractionProcess}</p>
              <p><strong>Environmental Impact:</strong> {plant.environmentalImpact}</p>
              <p><strong>Reasons to Grow Outdoors:</strong> {plant.reasonsToGrowOutdoors}</p>
              <p><strong>Scientific Research & Studies:</strong> {plant.scientificResearchAndStudies}</p>
              <p><strong>Side Effects & Risks:</strong> {plant.sideEffectsAndRisks}</p>
              <p><strong>Reasons to Grow Indoors:</strong> {plant.reasonstoGrowIndoors}</p>
              <p><strong>Nutritional Benefits:</strong> {plant.nutritionalBenefits}</p>
              <p><strong>Products:</strong> {plant.Products}</p>
              <p><strong>Traditional Medicine:</strong> {plant.TraditionalMedicine}</p>
              <p><strong>Commercial & Industrial Uses:</strong> {plant.commercialAndIndustrialUses}</p>
              <p><strong>Consideration For Both Settings:</strong> {plant.considerationForBothSettings}</p>
            </div>

            {/* Audio */}
            <audio src={plant.audioSrc} controls className="w-full mt-2 bg-gray-100 rounded-full">
              Your browser does not support the audio element.
            </audio>

            {/* Notes */}
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-3">Notes:</h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-md"
                placeholder="Write your notes here..."
                rows={6}
              ></textarea>
            </div>

            {/* Actions */}
            <div className="flex items-center mt-4">
              <button onClick={handleDownloadNotes} className="text-sm px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors duration-200 mr-2">
                <i className="fa-solid fa-download mr-2"></i>Download
              </button>
              <button onClick={handleShare} className="text-sm px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors duration-200 mr-2">
                <i className="fa-solid fa-share mr-2"></i>Share
              </button>
              <Link to="/community">
                <button className="text-sm px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors duration-200">
                  <i className="fa-regular fa-comment mr-2"></i>Comment
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantPopup;
