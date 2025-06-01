import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Trash2 } from "lucide-react";
import { useChatbot } from "../hooks/useChatbot";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { motion, AnimatePresence } from "framer-motion";

export const Chatbot: React.FC = () => {
  const { messages, loading, sendMessage, clearChat } = useChatbot();
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputMessage.trim() || loading) return;

    const message = inputMessage.trim();
    setInputMessage("");
    await sendMessage(message);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickQuestions = [
    "Bagaimana cara memilah sampah?",
    "Apa itu kompos dan bagaimana membuatnya?",
    "Di mana bank sampah terdekat?",
    "Jenis plastik apa yang bisa didaur ulang?",
    "Tips mengurangi sampah rumah tangga",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white shadow-sm border-b p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-primary-600 p-2 rounded-full">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">EcoBot</h1>
                <p className="text-sm text-gray-600">
                  Asisten AI untuk pengelolaan sampah
                </p>
              </div>
            </div>
            <button
              onClick={clearChat}
              className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              <span>Hapus Chat</span>
            </button>
          </div>
        </div>

        {/* Chat Container */}
        <div className="h-[calc(100vh-200px)] flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex items-start space-x-3 max-w-3xl ${
                    message.sender === "user"
                      ? "flex-row-reverse space-x-reverse"
                      : ""
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.sender === "user"
                        ? "bg-primary-600"
                        : "bg-gray-600"
                    }`}
                  >
                    {message.sender === "user" ? (
                      <User className="h-4 w-4 text-white" />
                    ) : (
                      <Bot className="h-4 w-4 text-white" />
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`rounded-lg px-4 py-2 max-w-xs lg:max-w-md ${
                      message.sender === "user"
                        ? "bg-primary-600 text-white"
                        : "bg-white border shadow-sm text-gray-900"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">
                      {message.text}
                    </p>
                    <p
                      className={`text-xs mt-1 ${
                        message.sender === "user"
                          ? "text-primary-100"
                          : "text-gray-500"
                      }`}
                    >
                      {new Date(message.timestamp).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-white border shadow-sm rounded-lg px-4 py-2">
                    <div className="flex items-center space-x-2">
                      <LoadingSpinner size="sm" />
                      <span className="text-sm text-gray-600">
                        EcoBot sedang mengetik...
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {messages.length <= 1 && (
            <div className="px-6 pb-4">
              <div className="bg-white rounded-lg border p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  Pertanyaan Populer:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {quickQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => setInputMessage(question)}
                      className="text-left text-sm text-gray-600 hover:text-primary-600 hover:bg-primary-50 p-2 rounded transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="border-t bg-white p-6">
            <div className="flex space-x-4">
              <div className="flex-1">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Tanya tentang pengelolaan sampah..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows={1}
                  disabled={loading}
                />
              </div>
              <motion.button
                onClick={handleSend}
                disabled={!inputMessage.trim() || loading}
                className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.8 }}
              >
                <Send className="h-5 w-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
