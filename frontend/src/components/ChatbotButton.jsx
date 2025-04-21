import React from "react";

const ChatbotButton = ({ showChatbot, toggleChatbot }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!showChatbot && (
        <button
          onClick={toggleChatbot}
          className="bg-main-color text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors duration-300 flex items-center justify-center"
          style={{ width: "50px", height: "50px" }}
        >
          <span className="material-icons" style={{ fontSize: "28px" }}>chat</span>
        </button>
      )}

      {showChatbot && (
        <div className="relative">
          <iframe
            width="350"
            height="430"
            allow="microphone;"
            src="https://console.dialogflow.com/api-client/demo/embedded/501ea8ff-d991-47ee-90f1-faaa49b0963f"
            className="border border-gray-300 rounded-lg shadow-lg"
            style={{ zIndex: 9999 }}
          ></iframe>
          <button
            onClick={toggleChatbot}
            className="absolute top-2 right-2 bg-white text-black p-2 rounded-full shadow-lg hover:bg-gray-200 transition-colors duration-300"
            style={{ zIndex: 10000 }}
          >
            <span className="material-icons" style={{ width: "20px", height: "5px" }}>
              close
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatbotButton;
