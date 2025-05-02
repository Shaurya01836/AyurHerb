import React from "react";
import { doc, setDoc } from "firebase/firestore";
import { firestore } from "../services/firebase";

const herbalData = [
    {
      disease: "cough",
      recommendations: [
        {
          herb: "Tulsi",
          usedFor: "Cough, cold, and respiratory relief",
          preparation: "Boil leaves in water and drink as tea",
          dosage: "Twice a day after meals",
          caution: "Avoid during pregnancy in high doses"
        },
        {
          herb: "Ginger",
          usedFor: "Throat irritation, congestion",
          preparation: "Crush and mix with honey",
          dosage: "Once a day"
        }
      ]
    },
    {
      disease: "fever",
      recommendations: [
        {
          herb: "Neem",
          usedFor: "Reduce body temperature",
          preparation: "Boil leaves and drink",
          dosage: "Twice daily"
        },
        {
          herb: "Giloy",
          usedFor: "Boosts immunity and helps with fever",
          preparation: "Boil stem and drink water",
          dosage: "Once in morning"
        }
      ]
    },
    {
      disease: "cold",
      recommendations: [
        {
          herb: "Peppermint",
          usedFor: "Nasal congestion",
          preparation: "Use leaves in steam inhalation",
          dosage: "Before bed"
        },
        {
          herb: "Clove",
          usedFor: "Throat pain",
          preparation: "Suck clove or use clove oil",
          dosage: "2-3 times a day"
        }
      ]
    },
    {
      disease: "headache",
      recommendations: [
        {
          herb: "Lavender",
          usedFor: "Stress-induced headaches, migraines",
          preparation: "Inhale essential oil or use in a diffuser",
          dosage: "Inhale 3-4 times a day"
        },
        {
          herb: "Peppermint",
          usedFor: "Relieves tension headaches",
          preparation: "Apply diluted oil to temples",
          dosage: "Apply 2-3 times a day"
        }
      ]
    },
    {
      disease: "insomnia",
      recommendations: [
        {
          herb: "Chamomile",
          usedFor: "Sleep aid, relaxation",
          preparation: "Drink chamomile tea before bed",
          dosage: "Once before bedtime"
        },
        {
          herb: "Valerian root",
          usedFor: "Promotes deep sleep",
          preparation: "Take valerian root in capsule or tea form",
          dosage: "30 minutes before bedtime"
        }
      ]
    },
    {
      disease: "digestive issues",
      recommendations: [
        {
          herb: "Fennel",
          usedFor: "Indigestion, bloating, gas",
          preparation: "Chew fennel seeds or make fennel tea",
          dosage: "Twice a day after meals"
        },
        {
          herb: "Aloe Vera",
          usedFor: "Soothing and improving digestion",
          preparation: "Drink aloe vera juice or gel",
          dosage: "Once a day"
        }
      ]
    },
    {
      disease: "skin irritation",
      recommendations: [
        {
          herb: "Aloe Vera",
          usedFor: "Skin irritation, burns, and wounds",
          preparation: "Apply fresh aloe vera gel to affected area",
          dosage: "As needed"
        },
        {
          herb: "Turmeric",
          usedFor: "Reduces inflammation and redness",
          preparation: "Make a paste with water and apply to skin",
          dosage: "Once a day"
        }
      ]
    }
  ];
  

function UploadHerbalData() {
  const uploadData = async () => {
    try {
      for (const item of herbalData) {
        const docRef = doc(firestore, "herbalRecommendations", item.disease.toLowerCase());
        await setDoc(docRef, item);
        console.log(`Uploaded: ${item.disease}`);
      }
      alert("✅ All herbal data uploaded successfully!");
    } catch (error) {
      console.error("Error uploading data:", error);
      alert("❌ Failed to upload some data. Check console.");
    }
  };

  return (
    <div className="p-6 text-center">
      <h2 className="text-2xl font-bold mb-4">Upload Herbal Data</h2>
      <button
        onClick={uploadData}
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full text-lg"
      >
        Upload Herbal Data to Firestore
      </button>
    </div>
  );
}

export default UploadHerbalData;
