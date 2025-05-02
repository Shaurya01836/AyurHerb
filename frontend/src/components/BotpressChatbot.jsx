import React, { useState } from 'react';
import {
  Webchat,
  WebchatProvider,
  Fab,
  getClient,
} from '@botpress/webchat';

const clientId = '0d887539-eecc-498b-92fa-3dc197b26c24'; // Replace with your actual Botpress Cloud Client ID

const configuration = {
  color: '#4CAF50', // Adjust the color to match your theme
};

const BotpressChatbot = ({ showChatbot, toggleChatbot }) => {
  const client = getClient({ clientId });

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!showChatbot && (
        <button
          onClick={toggleChatbot}
          className="bg-main-color text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition-colors duration-300 flex items-center justify-center"
          style={{ width: '50px', height: '50px' }}
        >
          <span className="material-icons" style={{ fontSize: '28px' }}>chat</span>
        </button>
      )}

      {showChatbot && (
        <WebchatProvider client={client} configuration={configuration}>
          <div
            style={{
              position: 'relative',
              width: '370px',
              height: '480px',
              backgroundColor: '#fff',
              borderRadius: '10px',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}
          >
            <Webchat />
            <button
              onClick={toggleChatbot}
              className="absolute top-2 right-2 bg-white text-black p-2 rounded-full shadow hover:bg-gray-200 transition-colors duration-300"
            >
              <span className="material-icons" style={{ fontSize: '20px' }}>close</span>
            </button>
          </div>
        </WebchatProvider>
      )}
    </div>
  );
};

export default BotpressChatbot;
