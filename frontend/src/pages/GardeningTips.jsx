import React, { useState } from "react";
import Navbar from "../components/Navbar";

const gardeningTips = [
  {
    id: 1,
    title: "Watering Tips",
    description: "Water early in the morning or late in the evening to reduce evaporation.",
    details: "Avoid watering the leaves to prevent fungal growth and always use deep watering to encourage strong roots.",
    image: "https://ideogram.ai/assets/progressive-image/balanced/response/uBUZ7jNtTbuPXoyz1MuI9A",
  },
  {
    id: 2,
    title: "Soil Preparation",
    description: "Healthy soil is the foundation of a thriving garden.",
    details: "Add organic compost to enrich the soil and maintain a balanced pH level. Consider mulching to retain moisture.",
    image: "https://ideogram.ai/assets/image/lossless/response/YvtKd_jpSG24V4a99hJdcQ",
  },
  {
    id: 3,
    title: "Fertilizing Frequency",
    description: "Fertilize every 4-6 weeks during the growing season to maintain soil health.",
    details: "Use a balanced fertilizer or organic alternatives like compost tea. Make sure to follow instructions to avoid over-fertilization.",
    image: "https://cdn.shopify.com/s/files/1/0569/9675/7697/files/use-homemade-plant-fertilizer-garden_1024x1024.jpg?v=1655088627",
  },
  {
    id: 4,
    title: "Pest Control",
    description: "Protect your plants from pests with natural remedies.",
    details: "Use neem oil, garlic spray, or companion planting to deter pests without harming beneficial insects.",
    image: "https://media.istockphoto.com/id/1092812454/photo/woman-spraying-flowers-in-the-garden.jpg?s=612x612&w=0&k=20&c=eelbPD_-Tmr-Al0-z9hTLzASK3chsdeiOCopB_ATDFU=",
  },
  {
    id: 5,
    title: "Sunlight Management",
    description: "Ensure your plants receive the appropriate amount of sunlight.",
    details: "Most vegetables need at least 6 hours of direct sunlight per day. Consider growing shade-tolerant plants in low-light areas.",
    image: "https://cdn.shopify.com/s/files/1/0069/5854/6980/files/4._Shade_Cloths_fb65f336-36ad-4efd-8e7d-a96985d472f7_600x600.jpg?v=1717095057Q",
  },
];

const recommendedTools = [
  {
    name: "Pruning Shears",
    description: "Ideal for trimming plants and small branches.",
    image: "https://ideogram.ai/assets/image/lossless/response/woGiiwlrRhiFoYYqplspXw",
  },
  {
    name: "Watering Can",
    description: "Perfect for controlled watering in delicate areas.",
    image: "https://ideogram.ai/assets/image/lossless/response/RAjtwyNZSHOdlUOuiSS90A",
  },
  {
    name: "Garden Trowel",
    description: "A versatile hand tool for digging small holes, transplanting, and planting seeds.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlisQsYXbXv7cmHR8LOxQ4ACkS0JKVlmk9qw&s",
  },
  {
    name: "Soil pH Meter",
    description: "A tool to measure the acidity or alkalinity of your soil, helping maintain plant health.",
    image: "https://img.crocdn.co.uk/images/products2/pr/20/00/04/50/pr2000045066.jpg?width=940&height=940",
  },
];

const GardeningTips = () => {
  const [activeTip, setActiveTip] = useState(null);

  const toggleTipDetails = (index) => {
    setActiveTip(activeTip === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <Navbar />
      {/* Header Section */}
      <header className="flex flex-col md:flex-row items-center justify-between mb-12 p-6 bg-green-100 rounded-lg shadow-lg">
        <div className="md:w-1/2 p-4 space-y-4">
          <h1 className="text-4xl font-extrabold text-green-800 md:text-5xl">Gardening Tips</h1>
          <p className="text-lg text-gray-700">
            Master the art of gardening with our essential tips and tricks. From soil preparation to plant care, 
            learn how to make your garden flourish and grow beautiful blooms.
          </p>
          <ul className="list-disc list-inside text-gray-600">
            <li>Choosing the right plants for your climate</li>
            <li>Soil enrichment techniques</li>
            <li>Watering schedules for different plant types</li>
            <li>Pest control without chemicals</li>
          </ul>
          <a href="#learn-more" className="inline-block mt-4 px-6 py-3 bg-green-700 text-white rounded-lg shadow hover:bg-green-800 transition-all">
            Learn More
          </a>
        </div>
        <div className="md:w-1/2 p-4">
          <img
            src="https://ideogram.ai/assets/progressive-image/balanced/response/NJw1wxWVT3WlWdd8iyDJtw"
            alt="Gardening"
            className="w-full h-auto object-cover rounded-lg shadow-md"
          />
        </div>
      </header>

      <div className="flex flex-col md:flex-row">
        {/* Main Gardening Tips Content */}
        <div className="md:w-2/3 pr-0 md:pr-6">
          {/* Gardening Tips Section */}
          <section className="mb-12">
            {gardeningTips.map((tip, index) => (
              <div
                key={tip.id}
                className="mb-8 bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-1/3 mb-4 md:mb-0">
                    <img
                      src={tip.image}
                      alt={tip.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="w-full md:w-2/3 pl-0 md:pl-4">
                    <h2 className="text-xl font-semibold text-green-700">{tip.title}</h2>
                    <p className="mt-2 text-gray-600">{tip.description}</p>
                    <button
                      className="mt-4 text-green-600 font-bold"
                      onClick={() => toggleTipDetails(index)}
                    >
                      {activeTip === index ? "Hide Details" : "Show Details"}
                    </button>
                    {activeTip === index && (
                      <p className="mt-2 text-gray-700">{tip.details}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </section>

          {/* Recommended Tools Section */}
          <section className="mb-12">
            <h2 className="text-3xl font-semibold text-green-700 mb-6">
              Recommended Tools & Resources
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {recommendedTools.map((tool, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-lg shadow-md flex items-center"
                >
                  <img
                    src={tool.image}
                    alt={tool.name}
                    className="w-20 h-20 object-cover mr-4 rounded-lg"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-green-600">{tool.name}</h3>
                    <p className="text-gray-700">{tool.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar for YouTube Video */}
        <div className="md:w-1/3">
          <div className="mb-12 bg-green-50 p-6 rounded-lg shadow-md">
            <h2 className="text-3xl font-semibold text-green-700 mb-4">
              Gardening Videos
            </h2>
            <iframe
              width="100%"
              height="250"
              src="https://www.youtube.com/embed/Kg5NR6S52FM?si=Hf-o-fPgvNJhmNxV"
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerpolicy="strict-origin-when-cross-origin"
              allowfullscreen
              className="rounded-lg shadow-lg mb-7"
            ></iframe>
            <iframe
              width="100%"
              height="250"
              src="https://www.youtube.com/embed/BO8yuSTc3fo?si=-9kcleW7ZN0xyuWc"
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerpolicy="strict-origin-when-cross-origin"
              allowfullscreen
              className="rounded-lg shadow-lg mb-7"
            ></iframe>
            <iframe
              width="100%"
              height="250"
              src="https://www.youtube.com/embed/B0DrWAUsNSc?si=nJHzM10gEqfYUXSk"
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerpolicy="strict-origin-when-cross-origin"
              allowfullscreen
              className="rounded-lg shadow-lg mb-7"
            ></iframe>
            <iframe
              width="100%"
              height="250"
              src="https://www.youtube.com/embed/e4Tk-kcOmUA?si=bPa82t_Tv2oDx9Ss"
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerpolicy="strict-origin-when-cross-origin"
              allowfullscreen
              className="rounded-lg shadow-lg mb-7"
            ></iframe>
            <iframe
              width="100%"
              height="250"
              src="https://www.youtube.com/embed/XZhDdE434_o?si=hMusH07tSxrb1hdc"
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerpolicy="strict-origin-when-cross-origin"
              allowfullscreen
              className="rounded-lg shadow-lg"
            ></iframe>
            </div>
          </div>
        </div>
      </div>
  
  );
};

export default GardeningTips;
