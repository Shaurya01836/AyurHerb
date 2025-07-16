import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchUserProfile } from "../services/firebase";
import Navbar from "../components/Navbar";

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      const data = await fetchUserProfile(userId);
      setProfile(data);
      setLoading(false);
    };
    fetchProfileData();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-500 border-solid"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">User not found</h2>
        <button className="mt-4 px-6 py-2 bg-green-600 text-white rounded-xl" onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex flex-col items-center">
      <Navbar />
      <div className="w-full flex flex-col items-center py-16 px-4">
        <div className="max-w-2xl w-full flex flex-col gap-8">
          {/* Avatar & Name */}
          <div className="flex flex-col items-center gap-2 bg-white rounded-2xl shadow border border-green-100 p-8">
            <div className="w-28 h-28 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-5xl font-extrabold shadow-lg border-4 border-white mb-2">
              {profile.displayName?.charAt(0).toUpperCase() || "U"}
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-1">{profile.displayName}</h2>
            <p className="text-green-600 font-semibold text-lg">{profile.reputation || 0} pts</p>
          </div>

          {/* Badges */}
          <div className="bg-green-50 rounded-xl border border-green-100 shadow-sm p-6 flex flex-col items-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Badges</h3>
            {profile.badges && profile.badges.length > 0 ? (
              <div className="flex flex-wrap gap-2 justify-center">
                {profile.badges.map((badge) => (
                  <span key={badge} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold border border-green-300">{badge}</span>
                ))}
              </div>
            ) : (
              <span className="text-gray-400">No badges yet.</span>
            )}
          </div>

          {/* Bio */}
          <div className="bg-white rounded-xl border border-green-100 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Bio</h3>
            <p className="text-gray-800 whitespace-pre-line text-base font-medium min-h-[48px]">
              {profile.bio || <span className="text-gray-400">No bio yet.</span>}
            </p>
          </div>

          {/* Joined */}
          <div className="bg-green-50 rounded-xl border border-green-100 shadow-sm p-6 flex flex-col items-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Joined</h3>
            <p className="text-gray-600 text-base font-medium">
              {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'Recently'}
            </p>
          </div>

          <button className="mt-2 px-6 py-2 bg-green-600 text-white rounded-xl self-center" onClick={() => navigate(-1)}>Back</button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 