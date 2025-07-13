
import { FaLeaf } from 'react-icons/fa';

const WellnessOptions = () => {
  const offerings = [
    {
      title: "Ayurveda",
      description: "Harness the power of ancient Ayurvedic remedies to restore balance and vitality in your life.",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
      icon: "🌿",
      tagline: "Find Your Balance",
    },
    {
      title: "Yoga & Naturopathy",
      description: "Embrace the union of body and mind through Yoga and natural therapies for a healthier you.",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-600",
      icon: "🧘",
      tagline: "Connect Mind & Body",
    },
    {
      title: "Unani",
      description: "Explore the time-tested Unani system that promotes holistic health with natural healing techniques.",
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-600",
      icon: "🌱",
      tagline: "Holistic Healing",
    },
    {
      title: "Siddha",
      description: "Discover Siddha medicine, a traditional system that emphasizes balance and natural treatments.",
      bgColor: "bg-red-50",
      textColor: "text-red-600",
      icon: "🌼",
      tagline: "Ancient Wisdom, Modern Health",
    },
    {
      title: "Homeopathy",
      description: "Unlock the gentle power of Homeopathy to address ailments and improve overall well-being.",
      bgColor: "bg-teal-50",
      textColor: "text-teal-600",
      icon: "💧",
      tagline: "Gentle, Effective Care",
    },
  ];

  return (
    <div className="max-w-8xl mx-auto py-16 px-4 sm:px-6 lg:px-8 ">
      <div className="text-center mb-16">
        <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-6">
          <FaLeaf className="mr-2 text-green-600" />
          Traditional Healing Systems
        </div>
        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          Discover the Power of
          <span className="block text-green-600">Natural Healing</span>
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Explore a wide variety of time-honored practices designed to promote holistic wellness 
          and rejuvenate your body and mind through ancient wisdom.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8">
        {offerings.map((offering, index) => (
          <div key={index} className={`p-4 sm:p-6 ${offering.bgColor} rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300`}>
            <div className="text-4xl sm:text-5xl mb-4 text-center">{offering.icon}</div>
            <h3 className="text-lg sm:text-2xl font-semibold text-gray-800 mb-2 text-center">{offering.title}</h3>
            <p className="text-gray-600 text-sm sm:text-base text-center mb-4">{offering.description}</p>
            <p className={`text-center font-bold ${offering.textColor} mt-4`}>
              {offering.tagline}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WellnessOptions;
