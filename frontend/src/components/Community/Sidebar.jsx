import React, { useEffect, useState } from "react";
import { fetchSpaces } from "../../services/firebase";
import { fetchLeaderboard } from "../../services/firebase";
import { Trophy, Star, Users, ChevronRight, BarChart2, CheckCircle, PieChart, Plus } from "lucide-react";

const Sidebar = ({ selectedSpaceId, onSelectSpace, onCreateSpace }) => {
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);

  useEffect(() => {
    fetchSpaces().then((data) => {
      setSpaces(data);
      setLoading(false);
    });
    fetchLeaderboard(3).then((data) => {
      setLeaderboard(data);
      setLoadingLeaderboard(false);
    });
  }, []);

  return (
    <aside className="flex flex-col gap-8">
      {/* Spaces Section */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl shadow-lg p-6 border border-green-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-green-700 font-bold text-lg">
            <Users className="w-5 h-5 text-green-500" />
            Spaces
          </div>
          <button
            className="flex items-center gap-1 text-green-500 hover:underline text-xs font-semibold"
            onClick={onCreateSpace}
            title="Create a new space"
          >
            <Plus className="w-4 h-4" /> Create
          </button>
        </div>
        {loading ? (
          <div className="text-center py-4 text-gray-400 text-sm">Loading...</div>
        ) : spaces.length === 0 ? (
          <div className="text-center py-4 text-gray-400 text-sm">No spaces yet.</div>
        ) : (
          <ul className="flex flex-col gap-1">
            <li>
              <button
                className={`w-full text-left px-3 py-2 rounded-lg font-semibold text-sm transition ${!selectedSpaceId ? "bg-green-200 text-green-900" : "hover:bg-green-100 text-green-700"}`}
                onClick={() => onSelectSpace(null)}
              >
                All Spaces
              </button>
            </li>
            {spaces.map((space) => (
              <li key={space.id}>
                <button
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition text-sm ${selectedSpaceId === space.id ? "bg-green-500 text-white font-bold" : "hover:bg-green-100 text-green-700"}`}
                  onClick={() => onSelectSpace(space)}
                >
                  <span className="truncate">{space.name}</span>
                  <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold">{(space.members || []).length}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* Leaderboard */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl shadow-lg p-6 border border-green-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-green-700 font-bold text-lg">
            <BarChart2 className="w-5 h-5 text-green-500" />
            Leaderboard
          </div>
        </div>
        <div className="divide-y divide-green-100">
          {loadingLeaderboard ? (
            <div className="text-center py-4 text-gray-400 text-sm">Loading...</div>
          ) : leaderboard.length === 0 ? (
            <div className="text-center py-4 text-gray-400 text-sm">No leaderboard data.</div>
          ) : (
            leaderboard.map((user, i) => (
              <div key={user.id} className={`flex items-center gap-3 py-3 ${i === 0 ? "font-bold" : ""}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-green-400 shadow-inner text-white font-bold text-lg`}>
                  {user.displayName?.charAt(0) || user.email?.charAt(0) || "U"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-gray-800 text-sm truncate">{user.displayName || user.email || "Anonymous"}</div>
                  <div className="text-xs text-green-500 font-semibold">{user.reputation || 0} pts</div>
                </div>
                {i === 0 && <span className="ml-2 px-2 py-0.5 bg-yellow-200 text-yellow-800 rounded-full text-xs">Top</span>}
              </div>
            ))
          )}
        </div>
      </div>
      {/* Weekly Challenge */}
      <div className="bg-gradient-to-br from-yellow-50 to-green-100 rounded-2xl shadow-lg p-6 border border-green-100 relative overflow-hidden">
        <div className="flex items-center gap-2 mb-3 text-emerald-700 font-bold text-lg">
          <CheckCircle className="w-5 h-5 text-emerald-500" />
          Weekly Challenge
        </div>
        <div className="text-gray-800 mb-4 font-medium">“Share your best immunity booster!”</div>
        <button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3 rounded-xl shadow hover:from-green-600 hover:to-emerald-700 transition-all flex items-center justify-center gap-2">
          <Star className="w-5 h-5 text-yellow-300" /> Submit Here
        </button>
        <div className="absolute right-0 top-0 opacity-10 text-8xl pointer-events-none select-none">⭐</div>
      </div>
      {/* Poll/Quiz */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl shadow-lg p-6 border border-green-100">
        <div className="flex items-center gap-2 mb-3 text-green-700 font-bold text-lg">
          <PieChart className="w-5 h-5 text-green-500" />
          Poll/Quiz
        </div>
        <div className="text-gray-800 mb-4 font-medium">“What's your favorite herb for anxiety?”</div>
        <button className="w-full bg-emerald-500 text-white font-semibold py-3 rounded-xl shadow hover:bg-emerald-600 transition-all flex items-center justify-center gap-2">
          Vote
        </button>
      </div>
    </aside>
  );
};

export default Sidebar; 