import React, { useState, useEffect, useMemo } from 'react';



const GEMINI_API_KEY = //API KEY//;
const GEMINI_API_URL =  //API URL//;



const languageTopics = {
  "TM1 Rules": [
    "All Topics",
    "Arithmetic Operations",
    "Comparison Operations",
    "Logical Operations",
    "String Operations",
    "Attribute Operations",
    "Rule Structure Operations",
    "Cube Value Operations",
    "Debugging Operations",
    "Performance Operations"
  ],
  "Python": [
    "All Topics",
    "Data Structures (Lists, Dictionaries)",
    "Object-Oriented Programming (OOP)",
    "Functions and Lambdas",
    "Error Handling",
    "File I/O"
  ],
  "JavaScript": [
    "All Topics",
    "Data Types & Variables",
    "Functions & Scope",
    "Arrays & Objects",
    "DOM Manipulation",
    "Asynchronous JS (Promises, async/await)"
  ],
  "SQL": [
    "All Topics",
    "Basic Queries (SELECT, WHERE)",
    "Joins (INNER, LEFT, RIGHT)",
    "Aggregate Functions (GROUP BY)",
    "Subqueries",
    "Data Modification (INSERT, UPDATE)"
  ],
  "Java": [
    "All Topics",
    "Core Concepts (OOP, Classes)",
    "Data Structures (Arrays, ArrayList, HashMap)",
    "Exception Handling",
    "Interfaces & Inheritance"
  ],
  "C++": [
    "All Topics",
    "Pointers & Memory",
    "Classes & Objects (OOP)",
    "STL (Standard Template Library)",
    "Structs vs. Classes"
  ]
};


const getStaticReview = (percentage) => {
  if (percentage >= 90) return "Excellent! You have a perfect understanding of this topic.";
  if (percentage >= 80) return "Great job! You have a strong grasp of the material. Keep up the good work!";
  if (percentage >= 70) return "Good effort. You understand most concepts, but a little review on the missed questions would be beneficial.";
  if (percentage >= 50) return "You passed, but there are some clear gaps in your knowledge. Be sure to review the correct answers.";
  if (percentage >= 30) return "You struggled with this topic. It's highly recommended to review the material before trying again.";
  if (percentage >= 10) return "This topic seems new to you. Let's review the fundamentals and build from there.";
  return "It looks like you had a tough time. Don't worry! Review the answers and let's try again.";
};



const QUESTION_TYPES = [
  { id: "Coding", label: "Coding" },
  { id: "Multiple Choice", label: "Multiple Choice" },
  { id: "True or False", label: "True or False" },
  { id: "Short Answer", label: "Short Answer" },
];


const IconHistory = React.memo(({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
));
const IconProfile = React.memo(({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
));
const IconLogout = React.memo(({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H3" />
  </svg>
));
const IconFlag = React.memo(({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6H5a2 2 0 00-2 2zm0 0h16" />
  </svg>
));
const IconFlagFilled = React.memo(({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6H5a2 2 0 00-2 2zm0 0h16" />
  </svg>
));
const IconCheck = React.memo(({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
));
const IconX = React.memo(({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
));
const IconChevronRight = React.memo(({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
));
const IconChevronLeft = React.memo(({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
));
const IconLightBulb = React.memo(({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m12.728 0l-.707.707M12 21v-1m-6.657-3.343l.707-.707M12 6a6 6 0 00-6 6c0 3.314 2.686 6 6 6s6-2.686 6-6a6 6 0 00-6-6z"></path></svg>
));
const IconClipboardList = React.memo(({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 8h.01M12 12h.01M12 16h.01M9 16H9.01M9 12h.01M15 12h.01M15 16h.01"></path></svg>
));
const IconCheckCircle = React.memo(({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
));
const IconXCircle = React.memo(({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
));
const IconRepeat = React.memo(({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 1l4 4-4 4M3 11V9a4 4 0 014-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 01-4 4H3"></path></svg>
));
const IconHome = React.memo(({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3M5 10H3a1 1 0 00-1 1v10a1 1 0 001 1h3m10-11h2a1 1 0 011 1v10a1 1 0 01-1 1h-3"></path></svg>
));
const IconUserCircle = React.memo(({ className = "w-24 h-24" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
  </svg>
));
const IconAnswered = React.memo(({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
));
const IconSkipped = React.memo(({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
));
const IconSparkles = React.memo(({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m1-15h4m-2 2v-4m6 17v4m-2-2h4M17 3v4M15 5h4M12 9v2m-2 2h4m-2 2v2"></path></svg>
));
const IconSend = React.memo(({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
));




const Loader = ({ text = "Loading..." }) => (
  <div className="flex flex-col items-center justify-center p-8">
    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    <p className="mt-4 text-lg font-semibold text-gray-700">{text}</p>
  </div>
);

const Card = ({ children, className = "" }) => (
  
  <div className={`bg-white shadow-xl shadow-blue-500/5 rounded-2xl p-6 ${className}`}>
    {children}
  </div>
);

const Modal = ({ children, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
    <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg mx-4 animate-scale-in">
      <div className="flex justify-end">
        <button onClick={onClose} className="text-gray-400 hover:text-gray-800 text-3xl">&times;</button>
      </div>
      {children}
    </div>
    <style>{`
      @keyframes scale-in {
        0% { transform: scale(0.95); opacity: 0; }
        100% { transform: scale(1); opacity: 1; }
      }
      .animate-scale-in { animation: scale-in 0.2s ease-out forwards; }
    `}</style>
  </div>
);

const Button = ({ children, onClick, className = "", type = "button", disabled = false, variant = "primary", iconLeft = null, iconRight = null }) => {
  const baseStyle = "px-5 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-200 transform hover:-translate-y-0.5";
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40",
    secondary: "bg-gray-600 hover:bg-gray-700 text-white shadow-lg shadow-gray-500/30 hover:shadow-xl hover:shadow-gray-500/40",
    outline: "bg-transparent text-blue-600 border-2 border-blue-600 hover:bg-blue-50",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100",
    danger: "bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40",
  };
  const disabledStyle = "bg-gray-300 cursor-not-allowed text-gray-500 shadow-none";
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${disabled ? disabledStyle : variants[variant]} ${className}`}
    >
      {iconLeft}
      {children}
      {iconRight}
    </button>
  );
};

// --- API Call ---
async function callGeminiAPI(contents, systemInstruction = null, jsonSchema = null, retries = 3, delay = 1000) {

  let apiPayload = { contents }; 

  if (systemInstruction) {
    apiPayload.systemInstruction = {
      parts: [{ text: systemInstruction }]
    };
  }
  
  if (jsonSchema) {
    apiPayload.generationConfig = {
      responseMimeType: "application/json",
      responseSchema: jsonSchema
    };
  }

  try {
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(apiPayload)
    });

    if (!response.ok) {
      if (response.status === 429 && retries > 0) { 
        console.warn(`Rate limit hit. Retrying in ${delay / 1000}s... (${retries} retries left)`);
        await new Promise(res => setTimeout(res, delay));
        return callGeminiAPI(contents, systemInstruction, jsonSchema, retries - 1, delay * 2);
      }
      const errorBody = await response.text();
      console.error("API Error Response:", errorBody);
      throw new Error(`API failed with status ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    const candidate = result.candidates?.[0];

    if (candidate && candidate.content?.parts?.[0]?.text) {
      const text = candidate.content.parts[0].text;
      if (jsonSchema) {
         try {
           
           const jsonMatch = text.match(/```json([\s\S]*?)```|({[\s\S]*})|(\[[\s\S]*\])/);
           if (!jsonMatch) {
             throw new Error("No JSON block found in response.");
           }
           const jsonString = jsonMatch[1] || jsonMatch[2] || jsonMatch[3];
           return JSON.parse(jsonString); 
         } catch(e) {
           console.error("Failed to parse JSON from API response:", e, "Response was:", text);
           throw new Error("Failed to parse JSON response from AI.");
         }
      } else {
        return text;
      }
    } else {
      console.error("Invalid API response structure:", result);
      throw new Error("Failed to get a valid response from AI.");
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (retries > 0) {
      console.warn(`Request failed. Retrying in ${delay / 1000}s... (${retries} retries left)`);
      await new Promise(res => setTimeout(res, delay));
      return callGeminiAPI(contents, systemInstruction, jsonSchema, retries - 1, delay * 2);
    } else {
      throw error;
    }
  }
}



const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};



const Navbar = React.memo(({ onLogout, onNavClick, currentUser }) => {
  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-sm w-full mb-8 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-blue-600 cursor-pointer" onClick={() => onNavClick('home')}>
          PracticeGen AI
        </h1>
        {currentUser && (
          <div className="flex items-center space-x-6">
            <span className="font-semibold text-gray-700 hidden md:block">Welcome, {currentUser.name}!</span>
            <button 
              onClick={() => onNavClick('history')} 
              className="font-semibold text-gray-700 hover:text-blue-600 flex items-center gap-2 transition-colors"
              title="Test History"
            >
              <IconHistory />
              <span className="hidden md:inline">History</span>
            </button>
            <button 
              onClick={() => onNavClick('profile')}
              className="font-semibold text-gray-700 hover:text-blue-600 flex items-center gap-2 transition-colors"
              title="Profile"
            >
              <IconProfile />
              <span className="hidden md:inline">Profile</span>
            </button>
            <div className="w-px h-6 bg-gray-300"></div>
            <Button onClick={onLogout} variant="outline" iconLeft={<IconLogout />} className="py-2 px-4">
              Logout
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
});

const LoginPage = ({ onLogin, onSignUp }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (isLogin) {
      
      if (!email || !password) {
        setError('Please enter both email and password.');
        return;
      }
      try {
        onLogin(email, password);
      } catch (err) {
        setError(err.message);
      }
    } else {
      
      if (!name || !email || !password || !confirmPassword) {
        setError('Please fill in all fields.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      try {
        onSignUp(name, email, password);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="text-center text-gray-600 mb-8">Welcome to PracticeGen AI</p>
        
        {error && <p className="text-red-500 text-center mb-4 bg-red-50 p-3 rounded-lg">{error}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-gray-700 font-semibold mb-2" htmlFor="name">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="John Doe"
              />
            </div>
          )}
          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>
          {!isLogin && (
            <div>
              <label className="block text-gray-700 font-semibold mb-2" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
              />
            </div>
          )}
          <Button type="submit" className="w-full text-lg py-3 !mt-6">
            {isLogin ? 'Login' : 'Sign Up'}
          </Button>
        </form>
        
        <p className="text-center text-gray-600 mt-6">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button 
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }} 
            className="text-blue-600 font-semibold ml-1 hover:underline"
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </Card>
    </div>
  );
};

const HomePage = ({ onTestSetup, onStartContinuous }) => {
  const [language, setLanguage] = useState('');
  const [topic, setTopic] = useState('');
  const [topics, setTopics] = useState([]);

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setLanguage(lang);
    setTopic('');
    setTopics(languageTopics[lang] || []);
  };

  const handleTopicChange = (e) => {
    const newTopic = e.target.value;
    setTopic(newTopic);
  };
  
  const handleStartTest = () => {
    if (language && topic) {
      onTestSetup(language, topic);
    } else {
      alert("Please select a language and a topic first.");
    }
  };
  
  const handleStartContinuous = () => {
     if (language && topic) {
      onStartContinuous(language, topic);
    } else {
      alert("Please select a language and a topic first.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="p-10 rounded-3xl bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-2xl mb-12">
        <h2 className="text-5xl font-bold mb-4">Welcome to PracticeGen AI!</h2>
        <p className="text-xl text-blue-100">
          Hone your skills with AI-generated challenges. Select a language and a topic to start your practice session.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <label htmlFor="language-select" className="block text-2xl font-semibold mb-3 text-gray-700">
            Step 1: Select Language
          </label>
          <p className="text-gray-500 mb-4">Choose your field of expertise.</p>
          <select 
            id="language-select"
            value={language}
            onChange={handleLanguageChange}
            className="w-full p-4 border border-gray-300 rounded-lg bg-white text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>-- Choose a language --</option>
            {Object.keys(languageTopics).map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </Card>
        
        <Card className={`transition-all duration-300 ${language ? 'opacity-100' : 'opacity-50'}`}>
          <label htmlFor="topic-select" className="block text-2xl font-semibold mb-3 text-gray-700">
            Step 2: Select Topic
          </label>
           <p className="text-gray-500 mb-4">Focus your practice on a specific area.</p>
          <select 
            id="topic-select"
            value={topic}
            onChange={handleTopicChange}
            disabled={!language}
            className="w-full p-4 border border-gray-300 rounded-lg bg-white text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          >
            <option value="" disabled>-- Choose a topic --</option>
            {topics.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </Card>
      </div>
      
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <Button onClick={handleStartTest} disabled={!language || !topic} variant="primary" className="text-lg py-4">
          Start Graded Test
        </Button>
        <Button onClick={handleStartContinuous} disabled={!language || !topic} variant="secondary" className="text-lg py-4" iconLeft={<IconSparkles />}>
          Start Continuous Learning
        </Button>
      </div>
    </div>
  );
};

const TestSetupModal = ({ language, topic, onClose, onStartTest }) => {
  const [numQuestions, setNumQuestions] = useState(10);
  const [difficulty, setDifficulty] = useState('Easy');
  const [questionTypes, setQuestionTypes] = useState([]);
  const [timeLimit, setTimeLimit] = useState(0); // 0 for no limit

  useEffect(() => {

    setQuestionTypes(['Coding']); 
  }, [language]);

  const handleTypeChange = (typeId) => {
    setQuestionTypes(prev => 
      prev.includes(typeId)
        ? prev.filter(t => t !== typeId)
        : [...prev, typeId]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (questionTypes.length === 0) {
      alert("Please select at least one question type.");
      return;
    }
    onStartTest({
      language,
      topic,
      numQuestions: parseInt(numQuestions, 10),
      difficulty,
      questionTypes,
      timeLimit: parseInt(timeLimit, 10)
    });
  };

  return (
    <Modal onClose={onClose}>
      <h3 className="text-3xl font-bold mb-4 text-gray-800">Test Setup</h3>
      <div className="bg-blue-50 p-3 rounded-lg mb-6">
        <p className="text-gray-700">
          Language: <span className="font-semibold text-blue-700">{language}</span>
        </p>
        <p className="text-gray-700">
          Topic: <span className="font-semibold text-blue-700">{topic}</span>
        </p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Question Types (Checkboxes) */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Question Types (Select all that apply)
            </label>
            <div className="grid grid-cols-2 gap-3">
              {QUESTION_TYPES.map(type => (
                <label key={type.id} className={`flex items-center p-3 border rounded-lg cursor-pointer ${questionTypes.includes(type.id) ? 'bg-blue-50 border-blue-400' : 'border-gray-300'}`}>
                  <input
                    type="checkbox"
                    checked={questionTypes.includes(type.id)}
                    onChange={() => handleTypeChange(type.id)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="ml-3 text-gray-700">{type.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Number of Questions */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2" htmlFor="numQuestions">
                Number of Questions (1-10)
              </label>
              <input
                type="number"
                id="numQuestions"
                name="numQuestions"
                min="1"
                max="10"
                value={numQuestions}
                onChange={(e) => setNumQuestions(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2" htmlFor="difficulty">
                Difficulty
              </label>
              <select 
                id="difficulty"
                name="difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>
          
          {/* Time Limit */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="timeLimit">
              Time Limit
            </label>
            <select 
              id="timeLimit"
              name="timeLimit"
              value={timeLimit}
              onChange={(e) => setTimeLimit(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="0">No time limit</option>
              <option value="5">5 Minutes</option>
              <option value="10">10 Minutes</option>
              <option value="15">15 Minutes</option>
              <option value="30">30 Minutes</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <Button onClick={onClose} variant="secondary">
            Cancel
          </Button>
          <Button type="submit">
            Continue
          </Button>
        </div>
      </form>
    </Modal>
  );
};

const QuestionDistributionModal = ({ testSettings, onClose, onStartTestConfirmed }) => {
  const { questionTypes, numQuestions } = testSettings;
  const [distribution, setDistribution] = useState(() => {
    const initialDist = {};
    const numPerType = Math.floor(numQuestions / questionTypes.length);
    let remainder = numQuestions % questionTypes.length;
    
    questionTypes.forEach((type, index) => {
      initialDist[type] = numPerType + (remainder > 0 ? 1 : 0);
      remainder--;
    });
    return initialDist;
  });
  
  const [error, setError] = useState('');
  
  const totalAllocated = useMemo(() => {
    return Object.values(distribution).reduce((acc, val) => acc + (parseInt(val, 10) || 0), 0);
  }, [distribution]);
  
  const handleChange = (type, value) => {
    const numValue = parseInt(value, 10) || 0;
    setDistribution(prev => ({
      ...prev,
      [type]: numValue
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (totalAllocated !== numQuestions) {
      setError(`Total questions must add up to ${numQuestions}. You have ${totalAllocated}.`);
      return;
    }
    setError('');
    onStartTestConfirmed(distribution);
  };
  
  return (
    <Modal onClose={onClose}>
      <h3 className="text-3xl font-bold mb-4 text-gray-800">Distribute Questions</h3>
      <p className="text-gray-600 mb-6">
        Please specify how many questions of each type you want. The total must add up to <span className="font-bold">{numQuestions}</span>.
      </p>
      
      {error && <p className="text-red-500 text-center mb-4 bg-red-50 p-3 rounded-lg">{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {questionTypes.map(type => (
            <div key={type} className="flex items-center justify-between">
              <label className="text-lg font-semibold text-gray-700">{type}</label>
              <input
                type="number"
                min="0"
                max={numQuestions}
                value={distribution[type]}
                onChange={(e) => handleChange(type, e.target.value)}
                className="w-24 p-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>
        
        <div className={`mt-6 p-3 rounded-lg text-center font-semibold ${totalAllocated === numQuestions ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          Total: {totalAllocated} / {numQuestions}
        </div>
        
        <div className="flex justify-end gap-4 mt-8">
          <Button onClick={onClose} variant="secondary">
            Back
          </Button>
          <Button type="submit" disabled={totalAllocated !== numQuestions}>
            Start Test
          </Button>
        </div>
      </form>
    </Modal>
  );
};


// --- Question Generation Logic ---
// Helper to shuffle an array
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// New function to generate a prompt for a specific type
const getGenerationPrompt = (type, settings, numQuestions) => {
  const { language, topic, difficulty } = settings;
  // Handle 0 questions request
  if (numQuestions <= 0) return null;
  
  // Base prompt
  let prompt = `Act as a senior ${language} instructor. You MUST return ONLY a valid JSON array of ${numQuestions} questions for the topic "${topic}" at "${difficulty}" difficulty. 
  For TM1 Rules, ask "how-to" questions, like "How do you add two measures?"
  Do not include any text before or after the JSON array.`;
  
  // Schema definition (for API and for our reference)
  let schema;

  switch (type) {
    case 'Coding':
      prompt += ` The question type is "Coding". Each object must have "id" (string), "questionType" (string, value "Coding"), "title" (string), "problem" (string with full description, constraints, and 2-3 examples with "Input:" and "Expected Output:"), "solution" (a correct code solution as a string), and "hint" (a short hint).`;
      schema = { type: "ARRAY", items: { type: "OBJECT", properties: { 
        id: { type: "STRING" }, 
        questionType: { type: "STRING" }, 
        title: { type: "STRING" }, 
        problem: { type: "STRING" },
        solution: { type: "STRING" },
        hint: { type: "STRING" }
      }, required: ["id", "questionType", "title", "problem", "solution", "hint"] }};
      break;
    case 'Multiple Choice':
      prompt += ` The question type is "Multiple Choice". Each object must have "id" (string), "questionType" (string, value "Multiple Choice"), "question" (string), "options" (array of 4 strings), "answer" (string - the correct option), and "hint" (a short hint).`;
      schema = { type: "ARRAY", items: { type: "OBJECT", properties: { 
        id: { type: "STRING" }, 
        questionType: { type: "STRING" }, 
        question: { type: "STRING" }, 
        options: { type: "ARRAY", items: { type: "STRING" } }, 
        answer: { type: "STRING" },
        hint: { type: "STRING" }
      }, required: ["id", "questionType", "question", "options", "answer", "hint"] }};
      break;
    case 'True or False':
      prompt += ` The question type is "True or False". Each object must have "id" (string), "questionType" (string, value "True or False"), "question" (string), "answer" (boolean), and "hint" (a short hint).`;
      schema = { type: "ARRAY", items: { type: "OBJECT", properties: { 
        id: { type: "STRING" }, 
        questionType: { type: "STRING" }, 
        question: { type: "STRING" }, 
        answer: { type: "BOOLEAN" },
        hint: { type: "STRING" }
      }, required: ["id", "questionType", "question", "answer", "hint"] }};
      break;
    case 'Short Answer':
      prompt += ` The question type is "Short Answer". Each object must have "id" (string), "questionType" (string, value "Short Answer"), "question" (string), "answer" (a string with the ideal brief answer), and "hint" (a short hint).`;
      schema = { type: "ARRAY", items: { type: "OBJECT", properties: { 
        id: { type: "STRING" }, 
        questionType: { type: "STRING" }, 
        question: { type: "STRING" }, 
        answer: { type: "STRING" },
        hint: { type: "STRING" }
      }, required: ["id", "questionType", "question", "answer", "hint"] }};
      break;
    default:
      throw new Error(`Invalid question type: ${type}`);
  }
  // Add a unique ID to each question prompt
  prompt += " Each 'id' must be a unique string (e.g., 'mc-1', 'code-1').";
  
  const systemInstruction = `You are a helpful assistant that only responds in valid JSON format based on the user's request. You must adhere strictly to the provided JSON schema.`;
  
  const contents = [{ role: 'user', parts: [{ text: prompt }] }];
  
  return { contents, systemInstruction, schema }; 
};

const SubmissionModal = ({ onClose, onSubmit, summary }) => {
  return (
    <Modal onClose={onClose}>
      <h2 className="text-2xl font-bold mb-4">Submit Test?</h2>
      <p className="text-gray-600 mb-8">Are you sure you want to submit? You cannot make any more changes.</p>
      
      <div className="grid grid-cols-3 gap-4 mb-8 text-center">
        <div>
          <p className="text-3xl font-bold text-green-600 flex items-center justify-center gap-2"><IconAnswered /> {summary.answered}</p>
          <p className="text-gray-500">Answered</p>
        </div>
        <div>
          <p className="text-3xl font-bold text-gray-500 flex items-center justify-center gap-2"><IconSkipped /> {summary.skipped}</p>
          <p className="text-gray-500">Skipped</p>
        </div>
        <div>
          <p className="text-3xl font-bold text-yellow-500 flex items-center justify-center gap-2"><IconFlagFilled /> {summary.flagged}</p>
          <p className="text-gray-500">Flagged</p>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onSubmit}>
          Yes, Submit
        </Button>
      </div>
    </Modal>
  );
};

const TestTimer = ({ timeLimitInMinutes, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(timeLimitInMinutes * 60);

  useEffect(() => {
    if (timeLimitInMinutes === 0) return; // No time limit

    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          onTimeUp();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLimitInMinutes, onTimeUp]);

  if (timeLimitInMinutes === 0) {
    return <div className="font-semibold text-lg text-gray-700">Time: Unlimited</div>;
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeColor = timeLeft < 60 ? "text-red-600" : "text-gray-700";

  return (
    <div className={`font-semibold text-lg ${timeColor} tabular-nums`}>
      Time Left: {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
    </div>
  );
};


const TestPage = ({ testSettings, questionQueue, onTestSubmit }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [answers, setAnswers] = useState({});
  const [timers, setTimers] = useState([]);
  const [testStartTime] = useState(new Date());
  const [flaggedQuestions, setFlaggedQuestions] = useState([]);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [hintCount, setHintCount] = useState(3);
  const [hint, setHint] = useState('');
  const [simulatedOutput, setSimulatedOutput] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  
  // This function fetches a question if it doesn't exist
  const fetchQuestion = async (index) => {
    if (questions[index]) {
      return; // Already fetched
    }
    
    setIsLoading(true);
    setHint('');
    setSimulatedOutput('');
    setError('');
    
    try {
      const type = questionQueue[index];
      if (!type) {
        throw new Error("No more questions in the queue.");
      }
      
      const { contents, systemInstruction, schema } = getGenerationPrompt(type, testSettings, 1);
      const [newQuestion] = await callGeminiAPI(contents, systemInstruction, schema); // Expecting an array of 1
      
      if (!newQuestion) {
        throw new Error("API did not return a question.");
      }
      
      setQuestions(prev => {
        const newQuestions = [...prev];
        newQuestions[index] = newQuestion;
        return newQuestions;
      });
      
    } catch (err) {
      setError(`Failed to load question ${index + 1}: ${err.message}`);
    }
    setIsLoading(false);
  };
  
  useEffect(() => {
    // Fetch the first question on load
    fetchQuestion(0);
    
    // Initialize timers array
    setTimers(Array(questionQueue.length).fill(null).map(() => ({ start: null, end: null })));
    setTimers(prev => {
      const newTimers = [...prev];
      if (newTimers.length > 0) newTimers[0].start = new Date();
      return newTimers;
    });
  }, [questionQueue, testSettings]); // Only run once on mount

  // --- Handlers ---
  const handleAnswerChange = (e) => {
    const { value, type } = e.target;
    if (type === 'radio') {
      setAnswers(prev => ({ ...prev, [currentQIndex]: value }));
    } else if (type === 'textarea') {
      setAnswers(prev => ({ ...prev, [currentQIndex]: value }));
    }
  };
  
  const toggleFlag = () => {
    setFlaggedQuestions(prev => 
      prev.includes(currentQIndex)
        ? prev.filter(i => i !== currentQIndex)
        : [...prev, currentQIndex]
    );
  };

  const goToQuestion = (index) => {
    if (index < 0 || index >= questionQueue.length) return;
    
    // Stop timer for current question
    setTimers(prev => {
      const newTimers = [...prev];
      if (newTimers[currentQIndex] && newTimers[currentQIndex].start && !newTimers[currentQIndex].end) {
        newTimers[currentQIndex].end = new Date();
      }
      // Start timer for new question if it hasn't been started
      if (newTimers[index] && !newTimers[index].start) {
        newTimers[index].start = new Date();
      }
      return newTimers;
    });
    
    // Fetch if needed, then set index
    fetchQuestion(index).then(() => {
      setCurrentQIndex(index);
    });
    setHint(''); // Clear hint when changing questions
    setSimulatedOutput(''); // Clear output
  };
  
  const handleGetHint = () => {
    if (hintCount === 0 || !questions[currentQIndex]) return;
    
    setHint(questions[currentQIndex].hint || "No hint available for this question.");
    setHintCount(prev => prev - 1);
  };
  
  const handleRunSimulated = async () => {
    const q = questions[currentQIndex];
    const userAnswer = answers[currentQIndex] || "";
    
    setIsSimulating(true);
    setSimulatedOutput("Simulating...");

    const systemInstruction = `You are a code evaluator. Respond ONLY with a valid JSON object matching the schema.`;
    const prompt = `Act as a code evaluator.
    Problem: ${q.problem}
    User's Code:
    ${userAnswer}
    
    Please evaluate the user's code against the problem.
    Respond ONLY with a valid JSON object with two keys: "is_correct" (boolean) and "output" (string).
    - If the code is correct, set "is_correct" to true and "output" to the correct expected output (e.g., "30").
    - If the code is incorrect, set "is_correct" to false and "output" to a brief error message or incorrect result (e.g., "Error: 'd.values' is not a function" or "Incorrect output: 10").
    - If the user provided no code, set "is_correct" to false and "output" to "No code provided."
    `;
    
    const schema = {
      type: "OBJECT",
      properties: {
        is_correct: { type: "BOOLEAN" },
        output: { type: "STRING" }
      },
      required: ["is_correct", "output"]
    };
    
    const payloadContents = [{ role: 'user', parts: [{ text: prompt }] }];

    try {
      const result = await callGeminiAPI(payloadContents, systemInstruction, schema);
      const outputPrefix = result.is_correct ? "Success:" : "Failed:";
      setSimulatedOutput(`${outputPrefix}\n${result.output}`);
    } catch (e) {
      setSimulatedOutput("Simulation failed. Please try again.");
    }
    setIsSimulating(false);
  };
  
  const handleSubmitTest = () => {
    // Stop timer for the very last question
    setTimers(prev => {
      const newTimers = [...prev];
      if (newTimers[currentQIndex] && newTimers[currentQIndex].start && !newTimers[currentQIndex].end) {
        newTimers[currentQIndex].end = new Date();
      }
      return newTimers;
    });
    
    // Finalize timers
    const timePerQuestion = timers.map((timer, index) => {
      const start = timer.start;
      const end = timer.end || (timer.start ? new Date() : null); 
      const duration = (start && end) ? Math.round((end - start) / 1000) : 0; // in seconds
      return { id: index + 1, time: `${duration} seconds` };
    });

    // Pass the *full* questions array, even if some are null (unfetched)
    onTestSubmit(questions, answers, testStartTime, timePerQuestion, flaggedQuestions);
    setShowSubmitModal(false);
  };
  
  // --- Render Functions ---
  const renderQuestion = () => {
    if (isLoading) {
      return <div className="min-h-[60vh] flex items-center justify-center"><Loader text={`Loading question ${currentQIndex + 1}...`} /></div>;
    }
    if (error) {
      return <Card className="min-h-[60vh] text-red-600 font-semibold bg-red-50 border-red-300">{error}</Card>;
    }
    if (!questions[currentQIndex]) {
      return <Card className="min-h-[60vh]">Error: Question data is missing.</Card>;
    }
    
    const q = questions[currentQIndex];
    const userAnswer = answers[currentQIndex];
    const type = q.questionType;

    return (
      <div className="min-h-[60vh]">
        {type === 'Coding' ? (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 h-[75vh]">
            <Card className="overflow-auto flex flex-col md:col-span-2">
              <div className="flex-shrink-0">
                <h3 className="text-2xl font-semibold mb-3">{q.title}</h3>
                <p className="whitespace-pre-wrap text-gray-700">{q.problem}</p>
              </div>
            </Card>
            <div className="flex flex-col md:col-span-3 gap-6">
              <Card className="flex flex-col flex-grow">
                <label htmlFor="code-editor" className="font-semibold mb-2 text-gray-700">Your Solution:</label>
                <textarea
                  id="code-editor"
                  className="flex-grow w-full p-3 border border-gray-300 rounded-md font-mono text-sm bg-gray-900 text-green-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`Write your ${testSettings.language} code here...`}
                  value={userAnswer || ''}
                  onChange={handleAnswerChange}
                />
                <div className="flex justify-between items-center gap-4 mt-4">
                  <Button variant="secondary" onClick={handleRunSimulated} disabled={isSimulating}>
                    {isSimulating ? "Simulating..." : "Run Simulated"}
                  </Button>
                  <Button variant="outline" onClick={handleGetHint} disabled={hintCount === 0} iconLeft={<IconLightBulb className="w-4 h-4" />}>
                    {`Hint (${hintCount} left)`}
                  </Button>
                </div>
              </Card>
              <Card className="flex-shrink-0 h-32">
                 <label className="font-semibold mb-2 text-gray-700">Simulated Output:</label>
                 <pre className="text-sm bg-gray-100 text-gray-800 p-3 rounded-md overflow-auto h-full">
                    <code>{simulatedOutput || "Click 'Run Simulated' to see output..."}</code>
                 </pre>
              </Card>
            </div>
          </div>
        ) : (
          <Card>
            <h3 className="text-2xl font-semibold mb-6">{q.question}</h3>
            {type === 'Multiple Choice' && (
              <div className="space-y-4">
                {q.options.map((option, index) => (
                  <label key={index} className={`flex items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer ${userAnswer === option ? 'bg-blue-50 border-blue-400' : 'border-gray-200'}`}>
                    <input type="radio" name={`q_${currentQIndex}`} value={option} checked={userAnswer === option} onChange={handleAnswerChange} className="w-5 h-5 mr-3 text-blue-600 focus:ring-blue-500"/>
                    <span className="text-gray-800 text-lg">{option}</span>
                  </label>
                ))}
              </div>
            )}
            {type === 'True or False' && (
              <div className="space-y-4">
                <label className={`flex items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer ${userAnswer === "True" ? 'bg-blue-50 border-blue-400' : 'border-gray-200'}`}>
                  <input type="radio" name={`q_${currentQIndex}`} value="True" checked={userAnswer === "True"} onChange={handleAnswerChange} className="w-5 h-5 mr-3 text-blue-600 focus:ring-blue-500"/>
                  <span className="text-gray-800 text-lg">True</span>
                </label>
                <label className={`flex items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer ${userAnswer === "False" ? 'bg-blue-50 border-blue-400' : 'border-gray-200'}`}>
                  <input type="radio" name={`q_${currentQIndex}`} value="False" checked={userAnswer === "False"} onChange={handleAnswerChange} className="w-5 h-5 mr-3 text-blue-600 focus:ring-blue-500"/>
                  <span className="text-gray-800 text-lg">False</span>
                </label>
              </div>
            )}
            {type === 'Short Answer' && (
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="6"
                placeholder="Your answer..."
                value={userAnswer || ''}
                onChange={handleAnswerChange}
              />
            )}
            {type !== 'Coding' && (
              <Button variant="outline" className="mt-6" onClick={handleGetHint} disabled={hintCount === 0} iconLeft={<IconLightBulb className="w-4 h-4" />}>
                {`Hint (${hintCount} left)`}
              </Button>
            )}
          </Card>
        )}
        {hint && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-300 text-yellow-800 rounded-lg flex gap-2">
            <IconLightBulb className="w-5 h-5 flex-shrink-0" />
            {hint}
          </div>
        )}
      </div>
    );
  };

  const submissionSummary = useMemo(() => {
    const answeredCount = Object.keys(answers).length;
    const skippedCount = questionQueue.length - answeredCount;
    const flaggedCount = flaggedQuestions.length;
    return { answered: answeredCount, skipped: skippedCount, flagged: flaggedCount };
  }, [answers, questionQueue, flaggedQuestions]);

  const isFlagged = flaggedQuestions.includes(currentQIndex);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold text-gray-800">
          Question {currentQIndex + 1} of {questionQueue.length}
        </h2>
        <div className="flex items-center gap-4">
          <TestTimer 
            timeLimitInMinutes={testSettings.timeLimit}
            onTimeUp={handleSubmitTest}
          />
          <Button 
            variant={isFlagged ? "secondary" : "outline"} 
            onClick={toggleFlag} 
            iconLeft={isFlagged ? <IconFlagFilled className="text-yellow-400" /> : <IconFlag />}
          >
            {isFlagged ? "Flagged" : "Flag"}
          </Button>
        </div>
      </div>
      
      {renderQuestion()}
      
      {/* Navigation */}
      <div className="flex flex-col items-center mt-6">
        <div className="flex justify-between items-center w-full mb-4">
          <Button 
            onClick={() => goToQuestion(currentQIndex - 1)}
            disabled={currentQIndex === 0}
            variant="outline"
            iconLeft={<IconChevronLeft />}
          >
            Previous
          </Button>
          
          {currentQIndex === questionQueue.length - 1 ? (
            <Button onClick={() => setShowSubmitModal(true)} variant="danger" className="text-lg px-6 py-3">
              Submit Test
            </Button>
          ) : (
            <Button onClick={() => goToQuestion(currentQIndex + 1)} iconRight={<IconChevronRight />}>
              Next
            </Button>
          )}
        </div>
        
        <div className="flex gap-2 flex-wrap justify-center p-4 bg-white rounded-lg shadow-md">
          {questionQueue.map((_, i) => {
            const isFlagged = flaggedQuestions.includes(i);
            const isAnswered = answers[i] !== undefined;
            const isCurrent = i === currentQIndex;
            const isLoaded = questions[i] !== undefined;
            
            let statusClass = "bg-gray-100 border border-gray-300 text-gray-600 hover:bg-gray-200";
            if (!isLoaded && i > currentQIndex) statusClass = "bg-gray-50 border border-gray-200 text-gray-400 cursor-not-allowed";
            else if (isFlagged) statusClass = "bg-yellow-100 border border-yellow-400 text-yellow-800 hover:bg-yellow-200";
            else if (isAnswered) statusClass = "bg-green-100 border border-green-300 text-green-800 hover:bg-green-200";
            if (isCurrent) statusClass = "bg-blue-600 text-white border-blue-600 ring-4 ring-blue-300";

            return (
              <button
                key={i}
                onClick={() => goToQuestion(i)}
                disabled={!isLoaded && i > currentQIndex} // Can't jump to future unloaded questions
                className={`w-10 h-10 rounded-full font-semibold flex items-center justify-center transition-colors ${statusClass}`}
                title={!isLoaded ? `Question ${i+1} (Not Loaded)` : (isFlagged ? `Question ${i+1} (Flagged)` : (isAnswered ? `Question ${i+1} (Answered)` : `Question ${i+1}`))}
              >
                {isFlagged && !isCurrent ? <IconFlagFilled className="w-4 h-4" /> : i + 1}
              </button>
            );
          })}
        </div>
      </div>
      
      {showSubmitModal && (
        <SubmissionModal
          onClose={() => setShowSubmitModal(false)}
          onSubmit={handleSubmitTest}
          summary={submissionSummary}
        />
      )}
    </div>
  );
};

const DashboardPage = ({ testResult, onDone, onRetakeTest }) => {
  const [isLoadingReview, setIsLoadingReview] = useState(true);
  const [aiReview, setAiReview] = useState('');
  
  const { questions, settings: testSettings } = testResult;
  // Filter out any null (unfetched) questions
  const validQuestions = questions.filter(q => q);
  const { startTime, timePerQuestion, answers, score, total } = testResult.result;

  const scoreable = score !== null;
  const percentage = scoreable && total > 0 ? Math.round((score / total) * 100) : 0;

  let praise = "";
  let scoreColor = "text-gray-700";
  if (scoreable) {
    if (percentage >= 85) {
      praise = "Very Good! Excellent work!";
      scoreColor = "text-green-600";
    } else if (percentage >= 75) {
      praise = "Good Job! You passed.";
      scoreColor = "text-blue-600";
    } else if (percentage >= 50) {
      praise = "You passed. Keep practicing!";
      scoreColor = "text-yellow-600";
    } else {
      praise = "You failed. Better luck next time!";
      scoreColor = "text-red-600";
    }
  } else {
    praise = "Coding test submitted.";
  }
  
  // Get static review based on percentage
  const staticReview = getStaticReview(percentage);

  useEffect(() => {
    const getAiReview = async () => {
      setIsLoadingReview(true);
      
      const systemInstruction = "You are a helpful and encouraging AI test reviewer.";
      const prompt = `Act as a friendly AI coding evaluator. A user just completed a test.
      - Test Details: ${testSettings.language} - ${testSettings.topic} (${testSettings.difficulty})
      - Score: ${scoreable ? `${score}/${total} (${percentage}%)` : 'N/A (Coding Test)'}
      - Submissions: ${JSON.stringify(validQuestions.map((q, i) => ({
          question: q.question || q.title,
          userAnswer: answers[i] || "No answer"
      })))}

      Please provide a concise, friendly, and helpful summary (max 2-3 short sentences) reviewing their performance. 
      Start with their score/performance (e.g., "${praise}").
      Then, identify one specific, actionable area for improvement.
      Be encouraging and constructive.
      Respond with ONLY the review text, no JSON.
      `;
      
      const payloadContents = [{ role: "user", parts: [{ text: prompt }] }];

      try {
        const review = await callGeminiAPI(payloadContents, systemInstruction, null); // No JSON schema
        setAiReview(review);
        // This mutation is a bit of a hack, but necessary to save the review to localStorage
        testResult.result.aiReview = review; 
      } catch (error) {
        console.error("AI Review Error:", error);
        setAiReview(staticReview); // Fallback to static review
        testResult.result.aiReview = staticReview;
      }
      setIsLoadingReview(false);
    };
    
    // Check if review is already fetched and saved
    if (!testResult.result.aiReview) {
      getAiReview();
    } else {
      setAiReview(testResult.result.aiReview);
      setIsLoadingReview(false);
    }
  }, [testResult, testSettings, score, total, validQuestions, answers, percentage, scoreable, praise, staticReview]);


  const totalTime = useMemo(() => {
    if (!timePerQuestion) return 0;
    return timePerQuestion.reduce((acc, t) => acc + parseFloat(t.time), 0);
  }, [timePerQuestion]);
  
  const totalTimeMin = (totalTime / 60).toFixed(1);
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h2 className="text-4xl font-bold text-gray-800">Test Results</h2>
          <p className={`text-xl mt-1 font-semibold ${scoreColor}`}>{praise}</p>
        </div>
        <div className="flex gap-4 mt-4 sm:mt-0">
          {percentage < 80 && (
            <Button onClick={onRetakeTest} variant="outline" iconLeft={<IconRepeat />}>
              Retake Test
            </Button>
          )}
          <Button onClick={onDone} variant="primary" iconLeft={<IconHome />}>
            Home
          </Button>
        </div>
      </div>
      
      {/* Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center">
          <h3 className="text-lg font-semibold text-gray-500 mb-2">Score</h3>
          {scoreable ? (
            <p className={`text-5xl font-bold ${scoreColor}`}>{`${score}/${total}`}</p>
          ) : (
            <p className="text-3xl font-bold text-gray-700">Review Pending</p>
          )}
          <p className="text-gray-500 mt-2">{testSettings.questionTypes.join(', ')}</p>
        </Card>
        <Card className="text-center">
          <h3 className="text-lg font-semibold text-gray-500 mb-2">Total Time</h3>
          <p className="text-5xl font-bold text-blue-600">{totalTimeMin}</p>
          <p className="text-gray-500 mt-2">Minutes</p>
        </Card>
        <Card className="text-center">
          <h3 className="text-lg font-semibold text-gray-500 mb-2">Difficulty</h3>
          <p className={`text-4xl font-bold ${
            testSettings.difficulty === 'Easy' ? 'text-green-500' :
            testSettings.difficulty === 'Medium' ? 'text-yellow-500' : 'text-red-500'
          }`}>{testSettings.difficulty}</p>
          <p className="text-gray-500 mt-2">{testSettings.language} - {testSettings.topic}</p>
        </Card>
      </div>

      {/* AI Review */}
      <Card>
        <div className="flex items-center gap-3 mb-4">
          <IconLightBulb className="w-8 h-8 text-yellow-500" />
          <h3 className="text-2xl font-semibold text-gray-800">Test Review</h3>
        </div>
        {isLoadingReview ? <Loader text="Generating review..." /> : (
          <p className="text-lg text-gray-700 whitespace-pre-wrap leading-relaxed">{aiReview}</p>
        )}
      </Card>
      
      {/* Results Breakdown */}
      <Card>
        <h3 className="text-2xl font-semibold text-gray-800 mb-6">Results Breakdown</h3>
        <div className="space-y-6">
          {validQuestions.map((q, i) => {
            const userAnswer = answers[i] || "No Answer";
            let isCorrect = null;
            let correctAnswer = q.answer;
            
            if (q.questionType === 'Multiple Choice' || q.questionType === 'True or False') {
              isCorrect = String(userAnswer).toLowerCase() === String(q.answer).toLowerCase();
            }
            if (q.questionType === 'Coding') {
              correctAnswer = q.solution || "No solution provided in question bank.";
            }
            
            const isSkipped = userAnswer === "No Answer";

            return (
              <div key={i} className={`p-4 rounded-lg border ${
                isCorrect === true ? 'border-green-300 bg-green-50' : 
                isCorrect === false ? 'border-red-300 bg-red-50' : 
                isSkipped ? 'border-gray-300 bg-gray-50' : 'border-gray-200 bg-white'
              }`}>
                <h4 className="text-lg font-semibold mb-3">Question {i+1}: {q.question || q.title}</h4>
                
                <p className="text-sm font-medium text-gray-700">Your Answer:</p>
                <div className={`flex items-center gap-2 mb-2 ${
                  isCorrect === false ? 'text-red-700' : 
                  isSkipped ? 'text-gray-500 italic' : 'text-gray-900'
                }`}>
                  {isCorrect === false ? <IconXCircle className="w-5 h-5" /> : null}
                  {isCorrect === true ? <IconCheckCircle className="w-5 h-5 text-green-600" /> : null}
                  {isSkipped ? <IconSkipped className="w-5 h-5" /> : null}
                  {q.questionType === "Coding" ? (
                    isSkipped ? <span className="italic">Skipped</span> : <pre className="text-sm bg-gray-800 text-white p-3 rounded-md overflow-x-auto"><code>{userAnswer}</code></pre>
                  ) : (
                    <span>{userAnswer}</span>
                  )}
                </div>
                
                {(isCorrect === false || isSkipped || q.questionType === "Coding") && (
                  <>
                    <p className="text-sm font-medium text-green-700">Correct Answer:</p>
                    {q.questionType === "Coding" ? (
                      <pre className="text-sm bg-gray-200 text-gray-900 p-3 rounded-md overflow-x-auto"><code>{String(correctAnswer)}</code></pre>
                    ) : (
                      <p className="text-green-800">{String(correctAnswer)}</p>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

const HistoryPage = ({ testHistory, onViewResult }) => {
  return (
    <Card>
      <h2 className="text-3xl font-semibold mb-6 text-gray-800">Test History</h2>
      {testHistory.length === 0 ? (
        <p className="text-gray-600">You haven't completed any tests yet.</p>
      ) : (
        <div className="space-y-4">
          {testHistory.slice().reverse().map((test, index) => { // Show newest first
            const { score, total } = test.result;
            let status = "Review";
            let statusColor = "bg-blue-100 text-blue-800";
            if (score !== null) {
              const perc = total > 0 ? (score / total) * 100 : 0;
              if (perc >= 50) {
                status = `Pass (${perc.toFixed(0)}%)`;
                statusColor = "bg-green-100 text-green-800";
              } else {
                status = `Fail (${perc.toFixed(0)}%)`;
                statusColor = "bg-red-100 text-red-800";
              }
            }
            
            return (
              <div key={index} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 border border-gray-200 rounded-lg hover:shadow-md hover:border-blue-300 transition-all">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {test.settings.language} - {test.settings.topic}
                  </h3>
                  <p className="text-gray-600">
                    {test.settings.difficulty} | {test.settings.questionTypes.join(', ')}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Taken on: {new Date(test.result.startTime).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-4 mt-4 sm:mt-0">
                   <span className={`px-3 py-1 rounded-full font-semibold text-sm ${statusColor}`}>
                    {status}
                  </span>
                  <Button onClick={() => onViewResult(test)} variant="outline" iconRight={<IconChevronRight />}>
                    View Result
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};

const ProfilePage = ({ currentUser, testHistory }) => {
  const stats = useMemo(() => {
    let totalPass = 0;
    let totalFail = 0;
    let scoreableTests = 0;
    let totalVeryGood = 0;
    let totalGood = 0;

    testHistory.forEach(test => {
      const { score, total } = test.result;
      if (score !== null && total > 0) {
        scoreableTests++;
        const perc = (score / total) * 100;
        if (perc >= 85) totalVeryGood++;
        if (perc >= 75) totalGood++;
        if (perc >= 50) totalPass++;
        else totalFail++;
      }
    });
    
    const passRate = scoreableTests > 0 ? Math.round((totalPass / scoreableTests) * 100) : 0;

    return {
      totalTests: testHistory.length,
      totalPass,
      totalFail,
      totalVeryGood,
      totalGood,
      passRate,
      failRate: scoreableTests > 0 ? 100 - passRate : 0,
    };
  }, [testHistory]);

  return (
    <Card>
      <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
        <IconUserCircle className="w-32 h-32 text-gray-400" />
        <div>
          <h2 className="text-4xl font-bold text-gray-800">{currentUser.name}</h2>
          <p className="text-xl text-gray-600">{currentUser.email}</p>
        </div>
      </div>
      
      <h3 className="text-2xl font-semibold mb-6 text-gray-800">Your Stats</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-blue-50">
          <h3 className="text-xl font-semibold mb-4">Performance Summary</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <IconClipboardList className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-3xl font-bold text-blue-700">{stats.totalTests}</p>
                <p className="text-gray-600">Total Tests Taken</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <IconCheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-3xl font-bold text-green-700">{stats.totalPass}</p>
                <p className="text-gray-600">Tests Passed (&gt;= 50%)</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <IconXCircle className="w-8 h-8 text-red-600" />
              <div>
                <p className="text-3xl font-bold text-red-700">{stats.totalFail}</p>
                <p className="text-gray-600">Tests Failed (&lt; 50%)</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-gray-50">
          <h3 className="text-xl font-semibold mb-4">Score Distribution</h3>
          {stats.totalTests > 0 ? (
            <>
              <p className="text-lg font-semibold text-gray-800">Pass Rate: {stats.passRate}%</p>
              <div className="w-full bg-gray-200 rounded-full h-4 mt-2 mb-6">
                <div 
                  className="bg-blue-600 h-4 rounded-full" 
                  style={{ width: `${stats.passRate}%` }}
                ></div>
              </div>
              
              <div className="space-y-2">
                <p className="flex justify-between">
                  <span className="font-semibold text-green-600">Very Good (85%+)</span>
                  <span>{stats.totalVeryGood} Tests</span>
                </p>
                <p className="flex justify-between">
                  <span className="font-semibold text-blue-600">Good (75%+)</span>
                  <span>{stats.totalGood} Tests</span>
                </p>
                <p className="flex justify-between">
                  <span className="font-semibold text-yellow-600">Pass (50%+)</span>
                  <span>{stats.totalPass} Tests</span>
                </p>
                <p className="flex justify-between">
                  <span className="font-semibold text-red-600">Fail (&lt; 50%)</span>
                  <span>{stats.totalFail} Tests</span>
                </p>
              </div>
            </>
          ) : (
            <p className="text-gray-600">No test data available yet.</p>
          )}
        </Card>
      </div>
    </Card>
  );
};

// --- [NEW] Continuous Learning Page ---
const ContinueLearningPage = ({ testSettings, onExit }) => {
  const [chatHistory, setChatHistory] = useState([]); // [{ role: 'user' | 'model', content: string }]
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [hint, setHint] = useState('');
  
  // Format for Gemini API
  const geminiChatHistory = useMemo(() => {
      // System prompt + chat history
      return [
        // This is now passed as systemInstruction
        ...chatHistory.map(msg => ({
          role: msg.role,
          parts: [{ text: msg.content }]
        }))
      ];
  }, [chatHistory]);
  
  const systemInstruction = `You are a strict but fair ${testSettings.language} tutor. Your goal is to teach a student about ${testSettings.topic}.
          1. Ask one question at a time (coding, multiple choice, or short answer).
          2. Wait for the user's answer.
          3. When you receive an answer, you MUST tell them if it is "Correct" or "Incorrect".
          4. Provide a brief, 2-sentence explanation for *why* it is correct or incorrect.
          5. After your explanation, you MUST ask the next question.
          6. Do not greet the user, just ask the first question.`;
  
  const callChatAPI = async (prompt) => {
    setIsLoading(true);
    setHint('');
    
    // Add user prompt to chat history
    const newUserMessage = { role: 'user', content: prompt };
    setChatHistory(prev => [...prev, newUserMessage]);
    
    // Construct payload
    const payloadContents = [
        ...geminiChatHistory, // History (user/model)
        { role: 'user', parts: [{ text: prompt }] } // New message
    ];

    try {
      const modelResponse = await callGeminiAPI(payloadContents, systemInstruction, null); // No JSON schema
      
      if (modelResponse) {
        setChatHistory(prev => [...prev, { role: 'model', content: modelResponse }]);
      } else {
        throw new Error("Invalid response structure from API.");
      }
      
    } catch (e) {
      console.error(e);
      setChatHistory(prev => [...prev, { role: 'model', content: "Sorry, I ran into an error. Please try again." }]);
    }
    setIsLoading(false);
  };
  
  useEffect(() => {
    // Initial prompt to kick off the chat
    const firstPrompt = `I'm ready to learn about ${testSettings.topic} in ${testSettings.language}. Please ask me my first question.`;
    callChatAPI(firstPrompt);
  }, [testSettings]); // Run only once
  
  const handleSubmitAnswer = (e) => {
    e.preventDefault();
    if (!currentAnswer || isLoading) return;
    callChatAPI(currentAnswer);
    setCurrentAnswer('');
  };
  
  const handleGetHint = async () => {
    setIsLoading(true);
    const hintPrompt = "Please give me a one-sentence hint for the last question you asked.";
    
    // We don't add the hint request to the main chat history
    const payloadContents = [
        ...geminiChatHistory, // user/model history
        { role: 'user', parts: [{ text: hintPrompt }] }
    ];
    
     try {
      const modelResponse = await callGeminiAPI(payloadContents, systemInstruction, null); // No JSON schema
      
      if (modelResponse) {
        setHint(modelResponse);
      } else {
        throw new Error("Invalid response structure from API.");
      }
      
    } catch (e) {
      console.error(e);
      setHint("Sorry, I couldn't get a hint right now.");
    }
    setIsLoading(false);
  };
  
  return (
    <Card>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Continuous Learning</h2>
        <Button onClick={onExit} variant="secondary">End Session</Button>
      </div>
      <p className="mb-4 text-gray-600">
        Topic: <span className="font-semibold">{testSettings.language} - {testSettings.topic}</span>
      </p>
      
      {/* Chat Window */}
      <div className="h-[60vh] bg-gray-50 border border-gray-200 rounded-lg p-4 overflow-y-auto space-y-4">
        {chatHistory.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-4 rounded-2xl max-w-[80%] whitespace-pre-wrap ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white border shadow-sm'}`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && chatHistory.length > 0 && (
           <div className="flex justify-start">
             <div className="p-4 rounded-2xl bg-white border shadow-sm flex space-x-2">
                <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
                <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
             </div>
           </div>
        )}
      </div>
      
      {/* Hint Box */}
       {hint && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-300 text-yellow-800 rounded-lg flex gap-2">
            <IconLightBulb className="w-5 h-5 flex-shrink-0" />
            {hint}
          </div>
        )}
      
      {/* Input Area */}
      <form onSubmit={handleSubmitAnswer} className="mt-6 flex items-center gap-4">
        <input 
          type="text"
          value={currentAnswer}
          onChange={(e) => setCurrentAnswer(e.target.value)}
          placeholder={isLoading ? "Waiting for AI..." : "Type your answer..."}
          disabled={isLoading}
          className="flex-grow p-4 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Button type="submit" disabled={isLoading} iconLeft={<IconSend />} className="h-full">
          Send
        </Button>
      </form>
      <Button variant="outline" onClick={handleGetHint} disabled={isLoading} className="w-full mt-4">
        Get a Hint (Unlimited)
      </Button>
    </Card>
  );
};


// --- Main App Component ---
export default function App() {
  const [currentPage, setCurrentPage] = useState('loading');
  const [currentUser, setCurrentUser] = useLocalStorage('currentUser', null);
  const [users, setUsers] = useLocalStorage('users', {});
  const [testHistory, setTestHistory] = useLocalStorage('testHistory', {});
  
  const [testSettings, setTestSettings] = useState(null); // Holds all settings
  const [testQuestions, setTestQuestions] = useState([]); // Holds generated questions
  const [questionQueue, setQuestionQueue] = useState([]); // For non-continuous mode
  const [currentTestResult, setCurrentTestResult] = useState(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [loadingText, setLoadingText] = useState("Loading...");
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [showDistributionModal, setShowDistributionModal] = useState(false);
  
  const [error, setError] = useState('');
  
  const userHistory = (currentUser && testHistory[currentUser.email]) || [];

  useEffect(() => {
    // This effect runs once on load to check auth status
    if (currentUser) {
      setCurrentPage('home');
    } else {
      setCurrentPage('login');
    }
    setIsLoading(false);
  }, []); // Empty dependency array ensures it runs only once

  const handleSignUp = (name, email, password) => {
    if (users[email]) {
      throw new Error('User already exists. Please login.');
    }
    // Store name and password
    setUsers(prev => ({ ...prev, [email]: { name, password } }));
    // Log the user in
    setCurrentUser({ name, email });
    // Initialize history for new user
    setTestHistory(prev => ({...prev, [email]: []}));
    // Set page after state update
    setCurrentPage('home');
  };

  const handleLogin = (email, password) => {
    const user = users[email];
    if (!user || user.password !== password) {
      throw new Error('Invalid email or password.');
    }
    // Log the user in
    setCurrentUser({ name: user.name, email });
    // Set page after state update
    setCurrentPage('home');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('login');
  };

  const handleNavClick = (page) => {
    setError('');
    setCurrentPage(page);
    // Reset test state if navigating away
    if (page === 'home') {
      setTestSettings(null);
      setCurrentTestResult(null);
      setTestQuestions([]);
      setQuestionQueue([]);
    }
  };

  const handleTestSetup = (language, topic) => {
    // Step 1: User selected language and topic
    setTestSettings({ language, topic });
    setShowSetupModal(true);
  };

  const handleTestSetupSubmit = (settings) => {
    // Step 2: User submitted difficulty, numQuestions, and types
    setTestSettings(settings);
    setShowSetupModal(false);
    // If more than one type, show distribution modal. Otherwise, start test.
    if (settings.questionTypes.length > 1) {
      setShowDistributionModal(true);
    } else {
      // Only one type, so distribution is simple
      const distribution = { [settings.questionTypes[0]]: settings.numQuestions };
      handleStartTestConfirmed(distribution);
    }
  };
  
  const handleStartContinuous = (language, topic) => {
    setTestSettings({ language, topic, difficulty: "Medium" }); // Set a default difficulty
    setCurrentPage('continuous-learning');
  };

  const handleStartTestConfirmed = async (distribution) => {
    // Step 3: User confirmed question distribution. Generate test from API.
    setShowDistributionModal(false);
    setIsLoading(true);
    setLoadingText("Generating your test...");
    setCurrentPage('loading'); // Show full page loader
    setError('');
    
    let allQuestions = [];
    try {
      const types = Object.keys(distribution);
      const promises = [];
      
      for (const type of types) {
        const numForType = distribution[type];
        if (numForType === 0) continue; // Skip if user wants 0 of this type
        
        const { contents, systemInstruction, schema } = getGenerationPrompt(type, testSettings, numForType);
        if (contents) {
          promises.push(callGeminiAPI(contents, systemInstruction, schema));
        }
      }
      
      setLoadingText("Fetching questions from AI...");
      const results = await Promise.all(promises);
      results.forEach(questions => {
        if (questions) {
          allQuestions = [...allQuestions, ...questions];
        }
      });

      const finalQuestions = shuffleArray(allQuestions).slice(0, testSettings.numQuestions);
      setTestQuestions(finalQuestions);
      setQuestionQueue(finalQuestions.map(q => q.questionType)); // Set queue for test page nav
      setCurrentPage('test');

    } catch (err) {
      setError("Failed to generate test questions. Please try again. " + err.message);
      setCurrentPage('home'); // Go back home on failure
    }
    setIsLoading(false);
  };


  const handleSubmitTest = async (questions, answers, startTime, timePerQuestion, flaggedQuestions) => {
    setIsLoading(true);
    setCurrentPage('loading'); // Show full page loader
    setLoadingText("Evaluating your test...");
    
    let score = null;
    let total = 0;
    
    const scoreableTypes = ['Multiple Choice', 'True or False'];
    
    // Filter out any null/undefined questions that were skipped and never fetched
    const validQuestions = questions.filter(q => q);
    
    const hasScoreableQuestions = validQuestions.some(q => scoreableTypes.includes(q.questionType));

    if (hasScoreableQuestions) {
      score = 0;
      // Iterate over the *original* queue length, checking against fetched questions
      for(let i = 0; i < questionQueue.length; i++) {
        const q = questions[i]; // This might be null if skipped
        if(q && scoreableTypes.includes(q.questionType)) {
          total++;
          const userAnswer = answers[i] || "No Answer"; // Ensure answer exists
          if (String(userAnswer).toLowerCase() === String(q.answer).toLowerCase()) {
            score++;
          }
        }
      }
    }

    const result = {
      startTime: startTime.toISOString(),
      timePerQuestion,
      answers,
      score,
      total,
      aiReview: null // This will be generated on the dashboard
    };
    
    const testData = {
      settings: testSettings,
      questions: validQuestions, // Only save the questions that were actually fetched
      result,
      flaggedQuestions
    };
    
    setCurrentTestResult(testData);

    // Save to history
    try {
      setTestHistory(prev => {
        const userEmail = currentUser.email;
        const oldHistory = prev[userEmail] || [];
        const newHistory = [testData, ...oldHistory]; // Add new test to the front
        return { ...prev, [userEmail]: newHistory };
      });
    } catch (e) {
      console.error("Failed to save to localStorage:", e);
      setError("Could not save test result. Your test is complete, but it may not appear in your history.");
    }
    
    setIsLoading(false);
    setCurrentPage('dashboard');
  };

  const handleDashboardDone = () => {
    handleNavClick('home');
  };

  const handleRetakeTest = () => {
    // We already have testSettings from the currentTestResult.
    // We need to re-trigger the setup process.
    const settings = currentTestResult.settings;
    setTestSettings(settings); // This holds language, topic, difficulty, numQ, types
    
    // If more than one type, show distribution modal. Otherwise, start test.
    if (settings.questionTypes.length > 1) {
      setShowDistributionModal(true);
    } else {
      const distribution = { [settings.questionTypes[0]]: settings.numQuestions };
      handleStartTestConfirmed(distribution);
    }
  };

  const handleViewHistoryResult = (test) => {
    setTestSettings(test.settings);
    setCurrentTestResult(test);
    setCurrentPage('dashboard');
  };
  
  const renderPage = () => {
    if (currentPage === 'loading') {
      return <div className="min-h-screen flex items-center justify-center bg-gray-100"><Loader text={loadingText} /></div>;
    }

    if (currentPage === 'login' || !currentUser) {
      return <LoginPage onLogin={handleLogin} onSignUp={handleSignUp} />;
    }

    // All pages below this point require a user
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navbar 
          onLogout={handleLogout} 
          onNavClick={handleNavClick} 
          currentUser={currentUser} 
        />
        <main className="max-w-7xl mx-auto px-6 py-8">
          {error && (
            <Card className="mb-4 bg-red-100 border-red-300 text-red-700">
              <p>{error}</p>
            </Card>
          )}
          {currentPage === 'home' && <HomePage onTestSetup={handleTestSetup} onStartContinuous={handleStartContinuous} />}
          {currentPage === 'test' && (
            <TestPage 
              testSettings={testSettings}
              questionQueue={questionQueue} // Pass the queue
              onTestSubmit={handleSubmitTest}
            />
          )}
          {currentPage === 'dashboard' && (
            <DashboardPage 
              testResult={currentTestResult} 
              onDone={handleDashboardDone} 
              onRetakeTest={handleRetakeTest}
            />
          )}
          {currentPage === 'history' && (
            <HistoryPage 
              testHistory={userHistory}
              onViewResult={handleViewHistoryResult}
            />
          )}
          {currentPage === 'profile' && (
            <ProfilePage 
              currentUser={currentUser}
              testHistory={userHistory}
            />
          )}
          {currentPage === 'continuous-learning' && (
            <ContinueLearningPage
              testSettings={testSettings}
              onExit={handleDashboardDone}
            />
          )}
        </main>

        {showSetupModal && (
          <TestSetupModal
            language={testSettings.language}
            topic={testSettings.topic}
            onClose={() => {
              setShowSetupModal(false);
              handleNavClick('home'); 
            }}
            onStartTest={handleTestSetupSubmit}
          />
        )}
        
        {showDistributionModal && (
          <QuestionDistributionModal
            testSettings={testSettings}
            onClose={() => {
              setShowDistributionModal(false);
              setShowSetupModal(true); // Go back to previous modal
            }}
            onStartTestConfirmed={handleStartTestConfirmed}
          />
        )}
      </div>
    );
  };

  return renderPage();
}