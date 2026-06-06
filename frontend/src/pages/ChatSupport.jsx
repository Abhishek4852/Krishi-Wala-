// ChatSupport.jsx
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare } from 'react-feather';

import faqs from '../Addressjsondata/FAQ.json'; // ✅ Ensure this is correct



const ChatSupport = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [showInputBox, setShowInputBox] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);

    window.addEventListener("open-chat-support", handleOpen);

    return () => {
      window.removeEventListener("open-chat-support", handleOpen);
    };
  }, []);


  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .custom-scrollbar::-webkit-scrollbar {
        width: 16px !important;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: #d1fae5 !important;
        border-radius: 10px !important;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background-color: #10b981 !important;
        border-radius: 10px !important;
        border: 3px solid #d1fae5 !important;
      }
      .custom-scrollbar {
        scrollbar-width: auto !important; /* Wider scrollbar in Firefox */
        scrollbar-color: #10b981 #d1fae5 !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (userInput.trim()) {
      setMessages((prev) => [
        ...prev,
        { sender: 'user', text: userInput },
        { sender: 'bot', text: "Thank you! We'll get back to you soon." },
      ]);
      setUserInput('');
    }
  };

  const handleSelectCategory = (categoryKey) => {
    setSelectedCategory(categoryKey);
    setMessages((prev) => [
      ...prev,
      { sender: 'bot', text: `You selected: ${categoryKey}` },
    ]);
  };

  const handleQuestionClick = (question, answer) => {
    setMessages((prev) => [
      ...prev,
      { sender: 'user', text: question },
      { sender: 'bot', text: answer },
    ]);
  };

  return (
    <>
      <div className="fixed bottom-16 right-4 flex flex-col items-center z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-green-700 text-white p-3 rounded-full shadow-lg hover:bg-green-800"
        >
          <MessageSquare size={24} />
        </button>
        <span className="mt-2 text-xs text-white bg-green-700 font-bold rounded-full px-2 py-0.5 shadow-sm">
          Ask Krishi AI
        </span>
      </div>


      {isOpen && (
        <div className="fixed bottom-20 right-4 w-[90%] sm:w-full max-w-md bg-gradient-to-br from-blue-100 via-blue-50 to-blue-200 shadow-2xl rounded-3xl p-4 flex flex-col space-y-4 z-50 border-2 border-green-700 scroll-smooth custom-scrollbar">



          <h2 className="text-xl font-bold text-center text-green-700">
            🌾 Krishi AI Chat Support
          </h2>

          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-2 right-5 text-green-700 hover:text-red-500 text-4xl font-bold focus:outline-none"
            title="Close"
          >
            ×
          </button>
          <div className="flex-1 max-h-96 overflow-y-auto space-y-3 p-3 border border-green-200 rounded-xl bg-green-50 scroll-smooth custom-scrollbar">
            {/* Display Categories */}
            <p className="text-base font-bold text-gray-700 text-center mb-3">How can I help you?</p>
            {!selectedCategory ? (
              Object.keys(faqs).map((categoryKey, index) => (
                <div key={index}>
                  <button
                    onClick={() => handleSelectCategory(categoryKey)}
                    className="w-full text-left bg-green-100 hover:bg-green-200 text-green-800 font-medium text-sm px-4 py-2 rounded-lg shadow-sm transition duration-200"
                  >
                    ➤ {categoryKey}
                  </button>
                </div>
              ))
            ) : (
              <>
                {/* Display Questions */}
                {(faqs[selectedCategory].faqData || faqs[selectedCategory].faqs || []).map(
                  (faq, index) => (
                    <div key={index}>
                      <button
                        onClick={() => handleQuestionClick(faq.question, faq.answer)}
                        className="text-left text-green-800 hover:underline text-sm"
                      >
                        ❓ {faq.question}
                      </button>
                    </div>
                  )
                )}

                {/* "Other" Option */}
                {!showInputBox && (
                  <div className="mt-4">
                    <button
                      onClick={() => setShowInputBox(true)}
                      className="text-blue-600 hover:underline text-lg"
                    >
                      ➕ Other
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Chat Messages */}
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-start space-x-2 ${msg.sender === 'user' ? 'justify-end flex-row-reverse' : 'justify-start'
                  }`}
              >
                <div className="text-xl">{msg.sender === 'user' ? '🤵' : '🤖'}</div>
                <div
                  className={`p-3 text-sm rounded-2xl shadow-md ${msg.sender === 'user'
                      ? 'bg-blue-500 text-white rounded-br-none'
                      : 'bg-green-200 text-gray-800 rounded-bl-none'
                    }`}
                >
                  <span className="block font-semibold mb-1">
                    {msg.sender === 'user' ? 'You' : 'Bot'}
                  </span>
                  <p className="leading-snug">{msg.text}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input box */}
          {showInputBox && (
            <div className="flex gap-2 pt-2">
              <input
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Type your question..."
                className="flex-1 border text-black border-green-300 rounded-full px-5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <button
                onClick={handleSend}
                className="bg-green-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-green-700 transition"
              >
                Send
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ChatSupport;
