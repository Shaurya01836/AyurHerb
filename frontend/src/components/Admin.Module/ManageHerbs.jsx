import React from "react";

const ManageHerbs = ({ herbs, onDelete }) => {
  return (
    <section className="bg-white shadow p-6 rounded-lg">
      <h2 className="text-3xl mb-4">Manage Herbs</h2>
      {herbs.length === 0 ? (
        <p className="text-gray-500">No herbs found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {herbs.map((herb) => (
            <div
              key={herb._id}
              className="bg-white border rounded-lg shadow-md overflow-hidden"
            >
              <img
                src={herb.imageSrc}
                alt={herb.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-bold mb-2">{herb.name}</h3>
                <p className="text-gray-700 mb-4 line-clamp-3">
                  {herb.description}
                </p>
                <a
                  href={herb.sketchfabModelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline block mb-2"
                >
                  View 3D Model
                </a>
                <button
                  onClick={() => onDelete(herb._id)}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default ManageHerbs;
