import React, { useState } from "react";
import { createSpace } from "../../services/firebase";
import PropTypes from "prop-types";

const CreateSpaceModal = ({ onClose, currentUser }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setCoverImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) {
      setError("Space name is required.");
      return;
    }
    setLoading(true);
    try {
      await createSpace({
        name: name.trim(),
        description: description.trim(),
        coverImage,
        createdBy: currentUser?.uid,
        members: [currentUser?.uid],
      });
      onClose();
    } catch {
      setError("Failed to create space. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div
        className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto flex flex-col"
        style={{ boxShadow: "0 8px 32px 0 rgba(34,197,94,0.15)" }}
      >
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold z-10"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center">Create a Space</h2>
        {currentUser && (
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center text-white font-bold">
              {currentUser.displayName?.charAt(0) || currentUser.email?.charAt(0) || "U"}
            </div>
            <div>
              <div className="font-semibold text-gray-900">{currentUser.displayName || currentUser.email || "Anonymous"}</div>
              <div className="text-xs text-gray-500">{currentUser.email}</div>
            </div>
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block font-medium mb-1">Space Name</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              maxLength={50}
              placeholder="e.g. Herbal Remedies, Ayurveda, etc."
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Description</label>
            <textarea
              className="w-full border rounded px-3 py-2"
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              maxLength={200}
              placeholder="What is this space about?"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Cover Image (optional)</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {coverImage && (
              <img src={coverImage} alt="Cover Preview" className="mt-2 w-full h-32 object-cover rounded-lg" />
            )}
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3 rounded-xl mt-2 shadow hover:from-green-600 hover:to-emerald-700 transition-all"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Space"}
          </button>
        </form>
      </div>
    </div>
  );
};

CreateSpaceModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  currentUser: PropTypes.shape({
    uid: PropTypes.string,
    displayName: PropTypes.string,
    email: PropTypes.string,
  }),
};

export default CreateSpaceModal; 