import React from "react";

const AddHerbForm = ({ herb, setHerb, isSubmitting, onSubmit }) => {
  const updateField = (field, value) => {
    setHerb((prev) => ({ ...prev, [field]: value }));
  };

  const inputProps = [
    { name: "imageSrc", placeholder: "Image Source" },
    { name: "multimedia1", placeholder: "Multimedia 1" },
    { name: "multimedia2", placeholder: "Multimedia 2" },
    { name: "multimedia3", placeholder: "Multimedia 3" },
    { name: "multimedia4", placeholder: "Multimedia 4" },
    { name: "name", placeholder: "Name" },
    { name: "region", placeholder: "Region" },
    { name: "type", placeholder: "Type" },
    { name: "sketchfabModelUrl", placeholder: "Sketchfab Model URL" },
    { name: "audioSrc", placeholder: "Audio Source" },
    { name: "botanicalName", placeholder: "Botanical Name" },
  ];

  const textAreas = [
    { name: "habitat", placeholder: "Habitat" },
    { name: "description", placeholder: "Description" },
    { name: "commonNames", placeholder: "Common Names" },
    { name: "medicinalUses", placeholder: "Medicinal Uses" },
    { name: "methodsOfCultivation", placeholder: "Methods of Cultivation" },
  ];

  return (
    <section className="bg-white shadow p-6 rounded-lg">
      <h2 className="text-3xl mb-4">Add New Herb</h2>
      <form
        onSubmit={onSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {inputProps.map(({ name, placeholder }) => (
          <input
            key={name}
            type="text"
            placeholder={placeholder}
            value={herb[name]}
            onChange={(e) => updateField(name, e.target.value)}
            className="p-2 border rounded w-full mb-4"
          />
        ))}

        {textAreas.map(({ name, placeholder }) => (
          <textarea
            key={name}
            placeholder={placeholder}
            value={herb[name]}
            onChange={(e) => updateField(name, e.target.value)}
            className="p-2 border rounded w-full mb-4"
          />
        ))}

        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded col-span-1 md:col-span-2 hover:bg-green-500 transition-colors"
        >
          {isSubmitting ? "Adding..." : "Add Herb"}
        </button>
      </form>
    </section>
  );
};

export default AddHerbForm;
