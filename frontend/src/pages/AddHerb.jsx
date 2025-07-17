import React, { useState } from "react";
import AddHerbForm from "../components/Admin.Module/AddHerbForm";
import { createHerb, fetchHerbs } from "../services/api";
import { auth } from "../services/firebase";
import { useNavigate } from "react-router-dom";

const initialHerb = {
  imageSrc: "",
  multimedia1: "",
  multimedia2: "",
  multimedia3: "",
  multimedia4: "",
  name: "",
  region: "",
  type: "",
  sketchfabModelUrl: "",
  audioSrc: "",
  botanicalName: "",
  habitat: "",
  description: "",
  commonNames: "",
  medicinalUses: "",
  methodsOfCultivation: "",
};

const AddHerb = () => {
  const [herb, setHerb] = useState(initialHerb);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const user = auth.currentUser;
      await createHerb({
        ...herb,
        postedBy: user ? user.uid : "public",
        isAdmin: user && user.email === "admin@example.com", // Update admin logic as needed
      });
      setHerb(initialHerb);
      await fetchHerbs();
      navigate("/all-plants");
    } catch (err) {
      alert("Failed to add herb");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
      <AddHerbForm herb={herb} setHerb={setHerb} isSubmitting={isSubmitting} onSubmit={handleSubmit} />
    </div>
  );
};

export default AddHerb; 