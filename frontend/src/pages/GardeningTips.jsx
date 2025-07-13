import { useState } from "react";
import Navbar from "../components/Navbar";
import { Leaf, Droplets, Sun, Shield, Sprout, Play, ChevronDown, ChevronUp, Wrench, BookOpen, Video } from "lucide-react";

const gardeningTips = [
  {
    id: 1,
    title: "Watering Tips",
    description: "Water early in the morning or late in the evening to reduce evaporation.",
    details: "Avoid watering the leaves to prevent fungal growth and always use deep watering to encourage strong roots. Water at the base of plants to ensure the roots receive adequate moisture. Consider using a drip irrigation system for consistent watering.",
    image: "https://ideogram.ai/assets/progressive-image/balanced/response/uBUZ7jNtTbuPXoyz1MuI9A",
    icon: Droplets,
    category: "Watering"
  },
  {
    id: 2,
    title: "Soil Preparation",
    description: "Healthy soil is the foundation of a thriving garden.",
    details: "Add organic compost to enrich the soil and maintain a balanced pH level. Consider mulching to retain moisture. Test your soil regularly and amend it with the necessary nutrients. Good soil structure promotes healthy root development.",
    image: "https://ideogram.ai/assets/image/lossless/response/YvtKd_jpSG24V4a99hJdcQ",
    icon: Sprout,
    category: "Soil"
  },
  {
    id: 3,
    title: "Fertilizing Frequency",
    description: "Fertilize every 4-6 weeks during the growing season to maintain soil health.",
    details: "Use a balanced fertilizer or organic alternatives like compost tea. Make sure to follow instructions to avoid over-fertilization. Different plants have different nutrient needs, so research your specific plants. Organic fertilizers release nutrients slowly and improve soil structure.",
    image: "https://cdn.shopify.com/s/files/1/0569/9675/7697/files/use-homemade-plant-fertilizer-garden_1024x1024.jpg?v=1655088627",
    icon: Leaf,
    category: "Fertilizing"
  },
  {
    id: 4,
    title: "Pest Control",
    description: "Protect your plants from pests with natural remedies.",
    details: "Use neem oil, garlic spray, or companion planting to deter pests without harming beneficial insects. Encourage natural predators like ladybugs and birds. Regular inspection helps catch problems early. Healthy plants are more resistant to pest damage.",
    image: "https://media.istockphoto.com/id/1092812454/photo/woman-spraying-flowers-in-the-garden.jpg?s=612x612&w=0&k=20&c=eelbPD_-Tmr-Al0-z9hTLzASK3chsdeiOCopB_ATDFU=",
    icon: Shield,
    category: "Pest Control"
  },
  {
    id: 5,
    title: "Sunlight Management",
    description: "Ensure your plants receive the appropriate amount of sunlight.",
    details: "Most vegetables need at least 6 hours of direct sunlight per day. Consider growing shade-tolerant plants in low-light areas. Monitor sun patterns throughout the day and season. Use shade cloth for sensitive plants during peak summer heat.",
    image: "https://cdn.shopify.com/s/files/1/0069/5854/6980/files/4._Shade_Cloths_fb65f336-36ad-4efd-8e7d-a96985d472f7_600x600.jpg?v=1717095057Q",
    icon: Sun,
    category: "Lighting"
  },
];

const recommendedTools = [
  {
    name: "Pruning Shears",
    description: "Ideal for trimming plants and small branches.",
    image: "https://ideogram.ai/assets/image/lossless/response/woGiiwlrRhiFoYYqplspXw",
    category: "Cutting"
  },
  {
    name: "Watering Can",
    description: "Perfect for controlled watering in delicate areas.",
    image: "https://ideogram.ai/assets/image/lossless/response/RAjtwyNZSHOdlUOuiSS90A",
    category: "Watering"
  },
  {
    name: "Garden Trowel",
    description: "A versatile hand tool for digging small holes, transplanting, and planting seeds.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlisQsYXbXv7cmHR8LOxQ4ACkS0JKVlmk9qw&s",
    category: "Digging"
  },
  {
    name: "Soil pH Meter",
    description: "A tool to measure the acidity or alkalinity of your soil, helping maintain plant health.",
    image: "https://img.crocdn.co.uk/images/products2/pr/20/00/04/50/pr2000045066.jpg?width=940&height=940",
    category: "Testing"
  },
];

const gardeningVideos = [
  {
    title: "Beginner's Guide to Gardening",
    url: "https://www.youtube.com/embed/Kg5NR6S52FM?si=Hf-o-fPgvNJhmNxV",
    duration: "12:34"
  },
  {
    title: "Organic Pest Control Methods",
    url: "https://www.youtube.com/embed/BO8yuSTc3fo?si=-9kcleW7ZN0xyuWc",
    duration: "8:45"
  },
  {
    title: "Soil Preparation Techniques",
    url: "https://www.youtube.com/embed/B0DrWAUsNSc?si=nJHzM10gEqfYUXSk",
    duration: "15:20"
  },
  {
    title: "Watering Best Practices",
    url: "https://www.youtube.com/embed/e4Tk-kcOmUA?si=bPa82t_Tv2oDx9Ss",
    duration: "10:15"
  },
  {
    title: "Seasonal Garden Maintenance",
    url: "https://www.youtube.com/embed/XZhDdE434_o?si=hMusH07tSxrb1hdc",
    duration: "18:30"
  }
];

const GardeningTips = () => {
  const [activeTip, setActiveTip] = useState(null);

  const toggleTipDetails = (index) => {
    setActiveTip(activeTip === index ? null : index);
  };

  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <div className="pt-24 pb-16 px-4 min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 bg-green-100 text-green-700 px-6 py-3 rounded-full mb-6">
              <Sprout className="w-5 h-5" />
              <span className="font-semibold">Expert Gardening</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-6 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Gardening Tips & Tricks
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              Master the art of gardening with our comprehensive guide. From soil preparation to pest control, 
              discover proven techniques to make your garden flourish and grow beautiful, healthy plants.
            </p>
            
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-green-500" />
                <span>Watering Techniques</span>
              </div>
              <div className="flex items-center gap-2">
                <Sprout className="w-4 h-4 text-green-500" />
                <span>Soil Management</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-500" />
                <span>Natural Pest Control</span>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white/60 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Expert Knowledge</h3>
              <p className="text-gray-600 leading-relaxed">
                Learn from proven gardening techniques and best practices for optimal plant growth.
              </p>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                <Video className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Video Tutorials</h3>
              <p className="text-gray-600 leading-relaxed">
                Watch step-by-step video guides for visual learning and practical demonstrations.
              </p>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-4">
                <Wrench className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Essential Tools</h3>
              <p className="text-gray-600 leading-relaxed">
                Discover the must-have tools and equipment for successful gardening.
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Gardening Tips Section */}
            <div className="lg:col-span-2">
              <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border border-green-100 p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                    <Leaf className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800">Essential Gardening Tips</h2>
                </div>
                
                <div className="space-y-6">
                  {gardeningTips.map((tip, index) => {
                    const IconComponent = tip.icon;
                    return (
                      <div
                        key={tip.id}
                        className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300"
                      >
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                                {tip.category}
                              </span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">{tip.title}</h3>
                            <p className="text-gray-600 mb-4">{tip.description}</p>
                            
                            <button
                              className="flex items-center gap-2 text-green-600 font-semibold hover:text-green-700 transition-colors"
                              onClick={() => toggleTipDetails(index)}
                            >
                              {activeTip === index ? (
                                <>
                                  <ChevronUp className="w-4 h-4" />
                                  Hide Details
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="w-4 h-4" />
                                  Show Details
                                </>
                              )}
                            </button>
                            
                            {activeTip === index && (
                              <div className="mt-4 p-4 bg-white/60 rounded-xl">
                                <p className="text-gray-700 leading-relaxed">{tip.details}</p>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <img
                            src={tip.image}
                            alt={tip.title}
                            className="w-full h-48 object-cover rounded-xl shadow-md"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recommended Tools Section */}
              <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border border-green-100 p-8 mt-8">
                                 <div className="flex items-center gap-3 mb-8">
                   <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center">
                     <Wrench className="w-5 h-5 text-white" />
                   </div>
                   <h2 className="text-3xl font-bold text-gray-800">Essential Garden Tools</h2>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-6">
                  {recommendedTools.map((tool, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <img
                          src={tool.image}
                          alt={tool.name}
                          className="w-16 h-16 object-cover rounded-xl shadow-md"
                        />
                        <div className="flex-1">
                          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            {tool.category}
                          </span>
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-gray-800 mb-2">{tool.name}</h3>
                      <p className="text-gray-600">{tool.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar - Video Tutorials */}
            <div className="lg:col-span-1">
              <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border border-green-100 p-8 sticky top-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Play className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Video Tutorials</h2>
                </div>
                
                <div className="space-y-6">
                  {gardeningVideos.map((video, index) => (
                    <div key={index} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-4 shadow-lg border border-gray-100">
                      <div className="aspect-video mb-4">
                        <iframe
                          src={video.url}
                          title={video.title}
                          className="w-full h-full rounded-xl shadow-md"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      </div>
                      <h3 className="font-semibold text-gray-800 mb-1">{video.title}</h3>
                      <p className="text-sm text-gray-500">{video.duration}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GardeningTips;
