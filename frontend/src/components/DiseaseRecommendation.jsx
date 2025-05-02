import React, { useState } from "react";
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
        alert("No recommendations found for that disease.");
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
          placeholder="Describe your symptoms or name a disease (e.g. cold, cough, fever,headache,insomnia,skin irritation)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          required
        />
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
