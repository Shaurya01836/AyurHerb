import React, { useState, useEffect } from "react";
import { Loader2, Leaf } from "lucide-react";
import {
  collection,
  query as firestoreQuery,
  where,
  getDocs,
} from "firebase/firestore";
import { firestore } from "../services/firebase";

function DiseaseRecommendation() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [allDiseases, setAllDiseases] = useState([]);

  useEffect(() => {
    const fetchDiseases = async () => {
      try {
        const snapshot = await getDocs(
          collection(firestore, "herbalRecommendations")
        );
        const diseases = snapshot.docs
          .map((doc) => doc.data().disease?.toLowerCase())
          .filter(Boolean);
        setAllDiseases(diseases);
      } catch (err) {
        console.error("Error fetching diseases:", err);
      }
    };

    fetchDiseases();
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 1) {
      const filtered = allDiseases.filter((disease) =>
        disease.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (disease) => {
    setQuery(disease);
    setSuggestions([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setRecommendations([]);

    try {
      const q = firestoreQuery(
        collection(firestore, "herbalRecommendations"),
        where("disease", "==", query.toLowerCase())
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const data = doc.data();

        if (data.recommendations && Array.isArray(data.recommendations)) {
          setRecommendations(data.recommendations);
        } else {
          console.warn("No valid recommendations array found");
        }
      } else {
        alert(
          "Sorry, we don't have specific recommendations for this condition at the moment. Please check the spelling or try another condition. For personalized advice, it's always best to consult a healthcare professional."
        );
      }
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      alert("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-2xl max-w-2xl mx-auto transition-all">
      <h2 className="text-3xl font-bold text-green-800 mb-6 text-center">
        🌱 Get Herbal Treatment Suggestions
      </h2>
      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full h-32 border-2 border-green-300 rounded-xl p-4 focus:outline-none focus:ring-4 focus:ring-green-400/50 resize-none transition"
          placeholder="Describe your symptoms or name a disease (e.g. cold, cough, fever...)"
          value={query}
          onChange={handleChange}
          required
        />
        {suggestions.length > 0 && (
          <ul className="bg-white border border-green-200 rounded-xl mt-2 shadow-lg overflow-hidden max-h-48 overflow-y-auto transition-all duration-200">
            {suggestions.map((item, index) => (
              <li
                key={index}
                onClick={() => handleSuggestionClick(item)}
                className="flex items-center gap-2 px-4 py-2 hover:bg-green-100 cursor-pointer transition-colors duration-150 text-green-700 font-medium"
              >
                <Leaf className="w-4 h-4 text-green-500" />
                <span>{item.charAt(0).toUpperCase() + item.slice(1)}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-8">
          <h4 className="text-lg font-semibold text-green-700 mb-3">
            Trending Conditions:
          </h4>
          <div className="flex flex-wrap gap-3 justify-center">
            {["Cold", "Cough", "Fever", "Insomnia", "Acidity"].map(
              (condition) => (
                <button
                  key={condition}
                  onClick={() => handleSuggestionClick(condition)}
                  className="bg-green-200 hover:bg-green-300 text-green-800 py-2 px-4 rounded-full transition font-medium"
                >
                  {condition}
                </button>
              )
            )}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 transition text-white py-3 px-6 rounded-full mt-5 font-semibold text-lg"
        >
          Get Recommendations
        </button>
      </form>

      {loading && (
        <div className="flex justify-center items-center mt-6 text-green-600">
          <Loader2 className="animate-spin mr-2" /> Fetching recommendations...
        </div>
      )}

      {recommendations.length > 0 && (
        <div className="mt-8 space-y-6">
          <h3 className="text-2xl font-semibold text-green-700 text-left">
            🍃 Recommendations:
          </h3>
          {recommendations.map((item, i) => (
            <div
              key={i}
              className="p-5 bg-green-50 rounded-xl shadow-md transition hover:shadow-lg"
            >
              <p className="text-lg font-semibold text-green-800 flex items-center mb-2">
                <Leaf className="w-5 h-5 mr-2" />
                <span>{item.herb || "Unnamed Herb"}</span>
              </p>
              <p>
                <strong>Used For:</strong> {item.usedFor || "N/A"}
              </p>
              <p>
                <strong>Preparation:</strong> {item.preparation || "N/A"}
              </p>
              <p>
                <strong>Dosage:</strong> {item.dosage || "N/A"}
              </p>
              {item.caution && (
                <p className="text-red-600 mt-1">
                  <strong>Caution:</strong> {item.caution}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DiseaseRecommendation;
