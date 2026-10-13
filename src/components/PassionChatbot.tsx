
import React, { useState, useRef, useEffect } from 'react';
import { PaperAirplaneIcon, XMarkIcon, ChatBubbleLeftRightIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

// Define the initial options for starting and restarting the chat
const initialOptions = [
  { label: "What services do you offer?", next: "services" },
  { label: "What are your prices?", next: "pricing" },
  { label: "I have a question about a job vacancy.", next: "vacancies" },
  { label: "How can I contact you?", next: "contact" },
];

// Define the structure of the conversation tree
const conversationTree = {
  start: {
    bot: "Hello! I'm Passion, your friendly assistant. How can I help you today?",
    options: initialOptions,
  },
  restart: {
    bot: "No problem, let's start over. What can I help you with?",
    options: initialOptions,
  },
  services: {
    bot: "We offer a range of services to help your business grow. What are you interested in?",
    options: [
      { label: "Branding & Creative Design", next: "branding_details" },
      { label: "Website & App Development", next: "website_details" },
      { label: "Custom Software", next: "software_details" },
      { label: "Back to start.", next: "start" },
    ],
  },
  branding_details: {
    bot: "We create unique brand identities that stand out. This includes logo design, color palettes, and style guides to ensure your brand is consistent everywhere.",
    options: [
      { label: "Back to services.", next: "services" },
      { label: "How do I get started?", next: "get_started" },
    ],
  },
  website_details: {
    bot: "We build everything from simple landing pages to complex e-commerce stores. All our sites are mobile-friendly and optimized for search engines.",
    options: [
      { label: "Back to services.", next: "services" },
      { label: "How do I get started?", next: "get_started" },
    ],
  },
  software_details: {
    bot: "We create custom software solutions to streamline your business processes. This can include anything from inventory management systems to school portals.",
    options: [
      { label: "Back to services.", next: "services" },
      { label: "How do I get started?", next: "get_started" },
    ],
  },
  pricing: {
    bot: "Our pricing varies depending on the project. For example, a standard business website starts at around N$5,000. For a detailed quote, it's best to contact us directly.",
    options: [
      { label: "How do I contact you?", next: "contact" },
      { label: "Back to start.", next: "start" },
    ],
  },
  vacancies: {
    bot: "We're always looking for talented people to join our team! You can find all our open positions on the careers page. Is there a specific role you're interested in?",
    options: [
        { label: "Digital Marketing Specialist", next: "vacancy_marketing" },
        { label: "I have a different question.", next: "contact" },
        { label: "Back to start.", next: "start" },
    ],
  },
  vacancy_marketing: {
      bot: "The Digital Marketing Specialist role is a contract position. You'll be planning and managing campaigns, creating content, and using analytics to improve results. You can apply directly on the careers page.",
      options: [
          { label: "Go to Careers Page", url: "/careers" },
          { label: "Back to vacancies.", next: "vacancies" },
      ],
  },
  contact: {
    bot: "You can reach us through our contact form, send us an email, or chat with us on WhatsApp. What works best for you?",
    options: [
      { label: "Go to Contact Page", url: "/contact" },
      { label: "Chat on WhatsApp", url: "https://wa.me/264812345678" }, // Replace with your number
      { label: "Back to start.", next: "start" },
    ],
  },
  get_started: {
    bot: "That's great! To get started, please fill out our contact form with as much detail as possible, and we'll get back to you with a quote.",
    options: [
      { label: "Go to Contact Page", url: "/contact" },
      { label: "Back to services.", next: "services" },
    ],
  },
};

const PassionChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentNode, setCurrentNode] = useState('start');
  const [messages, setMessages] = useState<any[]>([]);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const startConversation = (node = 'start') => {
    setCurrentNode(node);
    setMessages([
      {
        sender: 'bot',
        text: conversationTree[node].bot,
        options: conversationTree[node].options,
      },
    ]);
  }

  useEffect(() => {
    startConversation();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleOptionClick = (option: any) => {
    const userMessage = { sender: 'user', text: option.label };
    
    // Special handling for 'Back to start' to use the restart flow
    if (option.next === 'start') {
      setMessages(prev => [...prev, userMessage]);
      setTimeout(() => startConversation('restart'), 500);
      return;
    }

    setMessages(prev => [...prev, userMessage]);

    if (option.url) {
      window.open(option.url, '_blank');
      return;
    }

    const nextNode = option.next;
    if (!conversationTree[nextNode]) return;

    const botResponse = {
      sender: 'bot',
      text: conversationTree[nextNode].bot,
      options: conversationTree[nextNode].options,
    };

    setTimeout(() => {
        setMessages(prev => [...prev, botResponse]);
        setCurrentNode(nextNode);
    }, 500);
  };
  
  const handleRestart = () => {
    startConversation('restart');
  };

  return (
    <>
      <div className="fixed bottom-8 right-8 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-primary text-white rounded-full p-4 shadow-lg hover:bg-primary/90 transition-transform transform hover:scale-110"
          aria-label="Toggle chat"
        >
          {isOpen ? <XMarkIcon className="h-8 w-8" /> : <ChatBubbleLeftRightIcon className="h-8 w-8" />}
        </button>
      </div>

      <div
        className={`fixed bottom-24 right-8 z-40 w-full max-w-sm h-auto max-h-[70vh] bg-white rounded-lg shadow-2xl flex flex-col transition-all duration-300 ease-in-out transform ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
        <div className="p-4 bg-primary text-white rounded-t-lg flex justify-between items-center">
            <h3 className="font-bold text-lg">Chat with Passion</h3>
            <button onClick={handleRestart} className="p-1 hover:bg-primary/75 rounded-full" aria-label="Restart chat">
                <ArrowPathIcon className="h-5 w-5" />
            </button>
        </div>
        <div className="flex-grow p-4 overflow-y-auto" style={{maxHeight: 'calc(70vh - 120px)'}}>
            <div ref={messagesEndRef} />
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`rounded-lg px-4 py-2 my-1 max-w-xs lg:max-w-sm break-words ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                    {msg.text}
                </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t overflow-y-auto">
          {messages[messages.length - 1]?.options?.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionClick(option)}
              className="w-full text-left bg-transparent border border-primary text-primary hover:bg-primary hover:text-white font-semibold py-2 px-4 rounded-lg mb-2 transition-colors duration-200 whitespace-normal h-auto"
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default PassionChatbot;
