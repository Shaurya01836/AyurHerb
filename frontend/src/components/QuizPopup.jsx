import React, { useState } from "react";

const QuizPopup = ({ isOpen, onClose, userName }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const questions = [
    {
      question: "Which plant is known as Holy Basil?",
      options: ["Tulsi", "Neem", "Aloe Vera", "Lavender"],
      answer: "Tulsi",
    },
    {
      question: "Which plant is used for its antibacterial properties?",
      options: ["Neem", "Cactus", "Hibiscus", "Rosemary"],
      answer: "Neem",
    },
    {
      question: "Which herb is commonly used in Italian cuisine?",
      options: ["Basil", "Cilantro", "Parsley", "Mint"],
      answer: "Basil",
    },
    {
      question: "Which plant is known for its calming effects?",
      options: ["Chamomile", "Peppermint", "Sage", "Ginger"],
      answer: "Chamomile",
    },
    {
      question: "What is the main use of Aloe Vera?",
      options: ["Decoration", "Culinary", "Medicinal", "Pesticide"],
      answer: "Medicinal",
    },
  ];

  const handleAnswer = (answer) => {
    setSelectedOption(answer);
    setShowAnswer(true);

    if (answer === questions[currentQuestion].answer) {
      setScore(score + 1);
    }

    setTimeout(() => {
      setAnswers([...answers, answer]);
      setSelectedOption(null);
      setShowAnswer(false);

      if (currentQuestion === questions.length - 1) {
        setIsQuizComplete(true);
      } else {
        setCurrentQuestion(currentQuestion + 1);
      }
    }, 1000);
  };

  const handleRestartQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setIsQuizComplete(false);
    setScore(0);
  };

  const getPostTemplate = () => {
    const percentage = Math.round((score / questions.length) * 100);
    return `🎉 ${userName || "Herb Expert"} just scored ${percentage}% in the Herbs & Plants Quiz! 🌿 Can you beat this score? 🏆 Take the quiz now and challenge yourself!`;
  };

  const handleShare = (platform) => {
    const url = encodeURIComponent("https://herb-sphere.vercel.app/");
    let shareUrl = "";

    if (platform === "twitter") {
      const text = encodeURIComponent(`${getPostTemplate()}\n\nTry now!`);
      shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
    } else if (platform === "linkedin") {
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    }

    window.open(shareUrl, "_blank");
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60 ${
        isOpen ? "" : "hidden"
      }`}
    >
      <div className="bg-white rounded-lg p-8 w-11/12 sm:w-10/12 md:w-3/4 lg:w-1/2 xl:w-1/3 shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl font-bold text-gray-700 hover:text-red-600 transition"
        >
          &times;
        </button>

        {!isQuizComplete ? (
          <>
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 h-2 rounded mb-4">
              <div
                className="h-full bg-green-500 rounded transition-all"
                style={{
                  width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                }}
              ></div>
            </div>

            <h2 className="text-xl font-semibold mb-4">
              {questions[currentQuestion].question}
            </h2>

            <div className="mb-4">
              {questions[currentQuestion].options.map((option, index) => {
                const isCorrect = option === questions[currentQuestion].answer;
                const isSelected = option === selectedOption;

                let bgColor = "bg-white";
                if (showAnswer && isSelected && isCorrect) bgColor = "bg-green-300";
                else if (showAnswer && isSelected && !isCorrect) bgColor = "bg-red-300";
                else if (showAnswer && isCorrect) bgColor = "bg-green-100";

                return (
                  <button
                    key={index}
                    onClick={() => !showAnswer && handleAnswer(option)}
                    disabled={showAnswer}
                    className={`block w-full text-left p-2 border border-gray-300 rounded mb-2 transition ${bgColor}`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <div className="animate-fade-in">
            <h2 className="text-xl font-semibold mb-2">
              Well done
            </h2>
            <p className="mb-4">
              Your Score: {score} out of {questions.length}
            </p>

            {score / questions.length >= 0.75 ? (
              <div>
                <p className="mb-4">
                  You scored more than 75%! 🎉 Share your results:
                </p>
                <button
                  onClick={() => handleShare("twitter")}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                  Share on X (Twitter)
                </button>
                {/* <button
                  onClick={() => handleShare("linkedin")}
                  className="mt-4 ml-4 px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 transition"
                >
                  Share on LinkedIn
                </button> */}
              </div>
            ) : (
              <p className="mb-4">Keep practicing to improve your score! 🌱</p>
            )}

            <button
              onClick={handleRestartQuiz}
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
            >
              Restart Quiz
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizPopup;
