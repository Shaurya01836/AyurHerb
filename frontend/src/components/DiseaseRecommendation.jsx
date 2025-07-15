import { useState, useEffect } from "react";
import { Loader2, Leaf, Search, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
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
    <div className="w-full">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
          <Search className="w-4 h-4" />
          <span>AI-Powered Diagnosis</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-3">
          Find Your Natural Remedy
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Describe your symptoms or search for a specific condition to discover 
          traditional herbal treatments and natural remedies.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="relative mb-6">
          <textarea
            className="w-full h-32 border-2 border-gray-200 rounded-2xl p-6 focus:outline-none focus:ring-4 focus:ring-green-400/30 focus:border-green-400 resize-none transition-all duration-300 text-lg"
            placeholder="Describe your symptoms or name a disease (e.g. cold, cough, fever, headache, insomnia...)"
            value={query}
            onChange={handleChange}
            required
          />
          <div className="absolute top-4 right-4 text-gray-400">
            <Search className="w-5 h-5" />
          </div>
        </div>

        {suggestions.length > 0 && (
          <div className="mb-6">
            <ul className="bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden max-h-48 overflow-y-auto">
              {suggestions.map((item, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionClick(item)}
                  className="flex items-center gap-3 px-6 py-4 hover:bg-green-50 cursor-pointer transition-colors duration-200 text-gray-700 font-medium border-b border-gray-100 last:border-b-0"
                >
                  <Leaf className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="capitalize">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <h4 className="text-lg font-semibold text-gray-800">
              Popular Conditions:
            </h4>
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            {["Cold", "Cough", "Fever", "Insomnia", "Acidity", "Headache", "Stress", "Digestion"].map(
              (condition) => (
                <button
                  key={condition}
                  onClick={() => handleSuggestionClick(condition)}
                  className="bg-gradient-to-r from-green-100 to-emerald-100 hover:from-green-200 hover:to-emerald-200 text-green-700 py-3 px-6 rounded-full transition-all duration-300 font-medium shadow-sm hover:shadow-md"
                >
                  {condition}
                </button>
              )
            )}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transition-all duration-300 text-white py-4 px-8 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Analyzing...</span>
            </div>
          ) : (
            "Get Herbal Recommendations"
          )}
        </button>
      </form>

      {recommendations.length > 0 && (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-3">
              <CheckCircle className="w-4 h-4" />
              <span>Found {recommendations.length} Recommendation{recommendations.length > 1 ? 's' : ''}</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">
              Natural Remedies for Your Condition
            </h3>
          </div>
          
          <div className="grid gap-6">
            {recommendations.map((item, i) => (
              <div
                key={i}
                className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Leaf className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-gray-800 mb-1">
                      {item.herb || "Unnamed Herb"}
                    </h4>
                    <p className="text-green-600 font-medium">
                      Natural Remedy
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-white/60 rounded-xl p-4">
                    <h5 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Used For:
                    </h5>
                    <p className="text-gray-700">{item.usedFor || "N/A"}</p>
                  </div>
                  
                  <div className="bg-white/60 rounded-xl p-4">
                    <h5 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                      Preparation:
                    </h5>
                    <p className="text-gray-700">{item.preparation || "N/A"}</p>
                  </div>
                  
                  <div className="bg-white/60 rounded-xl p-4">
                    <h5 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
                      Dosage:
                    </h5>
                    <p className="text-gray-700">{item.dosage || "N/A"}</p>
                  </div>
                  
                  {item.caution && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                      <h5 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Important Caution:
                      </h5>
                      <p className="text-red-700">{item.caution}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-blue-800">Medical Disclaimer</span>
            </div>
            <p className="text-blue-700 text-sm">
              These recommendations are for informational purposes only. Always consult with a healthcare professional 
              before starting any herbal treatment, especially if you have existing medical conditions or are taking medications.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default DiseaseRecommendation;
