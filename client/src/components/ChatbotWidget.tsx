import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Minimize2, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { searchFAQ, FAQ_DATABASE } from '@shared/faq';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

const BELLE_AVATAR = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663769530589/mj4LfT67DGuWqeKLojJiDY/belle-avatar-UoKsZcRcn7zffedg9vu6va.webp';

const SUGGESTED_QUESTIONS = [
  'What payment methods do you accept?',
  'How long does it take to charge?',
  'What is your pricing?',
];

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Hi! 👋 Welcome to EB Volt. How can I help you today? Feel free to ask about charging, payments, or anything else.',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestionsShown, setSuggestionsShown] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setSuggestionsShown(false);
    setIsLoading(true);

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Search FAQ for matching answer
    const matches = searchFAQ(inputValue);
    let botResponse = '';

    if (matches.length > 0) {
      // Found matching FAQ
      const topMatch = matches[0];
      botResponse = topMatch.answer;
    } else {
      // No match found - provide helpful fallback
      botResponse =
        "I couldn't find an exact answer to that question. Here are some popular topics I can help with:\n\n" +
        "• Payment methods (Mobile Money, USSD)\n" +
        "• Charging time and availability\n" +
        "• Account setup and history\n" +
        "• Pricing and refunds\n" +
        "• App troubleshooting\n\n" +
        "For other questions, please contact our support team at +233 595 602 717 on WhatsApp or email support@ebvolt.com";
    }

    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'bot',
      content: botResponse,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, botMessage]);
    setIsLoading(false);
  };

  const handleQuickQuestion = (question: string) => {
    setInputValue(question);
    setSuggestionsShown(false);
    // Trigger send after state update
    setTimeout(() => {
      const form = document.getElementById('chatbot-form') as HTMLFormElement;
      form?.dispatchEvent(new Event('submit', { bubbles: true }));
    }, 0);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-[#1D9E75] to-[#0F6E56] text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        aria-label="Open chat"
      >
        <MessageCircle size={24} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-24px)] flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1D9E75] to-[#0F6E56] text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={BELLE_AVATAR}
            alt="Belle"
            className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-md"
          />
          <div>
            <h3 className="font-semibold text-sm">Belle</h3>
            <p className="text-xs text-green-100">Always here to help</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-white/20 rounded transition-colors"
            aria-label={isMinimized ? 'Maximize' : 'Minimize'}
          >
            {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
          </button>
          <button
            onClick={() => {
              setIsOpen(false);
              setIsMinimized(false);
            }}
            className="p-1 hover:bg-white/20 rounded transition-colors"
            aria-label="Close chat"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Chat Content */}
      {!isMinimized && (
        <>
          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 max-h-96">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                    message.type === 'user'
                      ? 'bg-[#1D9E75] text-white rounded-br-none'
                      : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 border border-gray-200 rounded-lg rounded-bl-none px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span className="text-xs text-gray-500 ml-1">Belle is typing...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions (shown at start) */}
          {suggestionsShown && messages.length <= 1 && (
            <div className="px-4 py-3 bg-white border-t border-gray-200">
              <p className="text-xs text-gray-600 mb-2 font-medium">Popular questions:</p>
              <div className="space-y-2">
                {SUGGESTED_QUESTIONS.map((question, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickQuestion(question)}
                    className="w-full text-left text-xs p-2.5 rounded bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 transition-all border border-green-200 hover:border-green-300 text-gray-700 font-medium"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Form */}
          <form
            id="chatbot-form"
            onSubmit={handleSendMessage}
            className="p-4 bg-white border-t border-gray-200 flex gap-2"
          >
            <Input
              type="text"
              placeholder="Ask a question..."
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              disabled={isLoading}
              className="flex-1 text-sm"
            />
            <Button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="bg-[#1D9E75] hover:bg-[#0F6E56] text-white px-3"
              size="sm"
            >
              <Send size={16} />
            </Button>
          </form>
        </>
      )}
    </div>
  );
}
