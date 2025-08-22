import { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import { Loader2, Leaf, Search, AlertTriangle, CheckCircle, Send } from "lucide-react";
import {
  collection,
  query as firestoreQuery,
  where,
  getDocs,
} from "firebase/firestore";
import { firestore } from "../services/firebase";

const InterestingFacts = () => (
  <div className="text-center p-8">
    <div className="inline-flex items-center gap-3 bg-green-100 text-green-700 px-6 py-3 rounded-full mb-6">
      <Leaf className="w-5 h-5" />
      <span className="font-semibold">Did You Know?</span>
    </div>
    <h2 className="text-3xl font-bold text-gray-800 mb-4">Interesting Herb Facts</h2>
    <div className="text-lg text-gray-600 max-w-2xl mx-auto space-y-4">
      <p>🌿 Turmeric, known for its bright yellow color, contains curcumin, a compound with powerful anti-inflammatory and antioxidant properties.</p>
      <p>🌿 The name rosemary has nothing to do with roses. It comes from the Latin "ros marinus," which means "dew of the sea."</p>
      <p>🌿 Lavender is not just for relaxation! It can also be used as a natural antiseptic and has been used for centuries to clean wounds.</p>
    </div>
  </div>
);

const HealthWellness = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [conversation, setConversation] = useState([]);
  const chatContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMessage = { type: "user", text: query };
    setConversation((prev) => [...prev, userMessage]);
    setLoading(true);
    setRecommendations([]);
    setQuery("");

    try {
      const q = firestoreQuery(
        collection(firestore, "herbalRecommendations"),
        where("disease", "==", query.toLowerCase())
      );
      const querySnapshot = await getDocs(q);

      let botMessage;
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const data = doc.data();
        if (data.recommendations && Array.isArray(data.recommendations)) {
          botMessage = { type: "bot", recommendations: data.recommendations };
          setRecommendations(data.recommendations);
        } else {
          botMessage = { type: "bot", text: "Sorry, no valid recommendations found for this condition." };
        }
      } else {
        botMessage = {
          type: "bot",
          text: "Sorry, we don't have specific recommendations for this condition at the moment. Please check the spelling or try another condition.",
        };
      }
      setConversation((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      const errorMessage = { type: "bot", text: "Something went wrong. Please try again." };
      setConversation((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col h-screen pt-16 bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-4xl mx-auto">
            {conversation.length === 0 && !loading && <InterestingFacts />}
            {conversation.map((message, index) => (
              <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
                <div className={`p-4 rounded-2xl max-w-lg ${message.type === 'user' ? 'bg-green-600 text-white' : 'bg-white shadow-md'}`}>
                  {message.text}
                  {message.recommendations && (
                    <div className="space-y-4">
                      {message.recommendations.map((item, i) => (
                        <div key={i} className="bg-green-50 p-4 rounded-lg">
                          <h4 className="font-bold text-gray-800">{item.herb}</h4>
                          <p><span className="font-semibold">Used for:</span> {item.usedFor}</p>
                          <p><span className="font-semibold">Preparation:</span> {item.preparation}</p>
                          <p><span className="font-semibold">Dosage:</span> {item.dosage}</p>
                          {item.caution && <p className="text-red-600"><span className="font-semibold">Caution:</span> {item.caution}</p>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start mb-4">
                <div className="p-4 rounded-2xl max-w-lg bg-white shadow-md">
                  <Loader2 className="w-6 h-6 animate-spin text-green-500" />
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="flex items-center gap-4">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask about a condition or symptom..."
                className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <button
                type="submit"
                className="bg-green-600 text-white p-3 rounded-full hover:bg-green-700 transition-colors"
                disabled={loading}
              >
                <Send size={20} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default HealthWellness;