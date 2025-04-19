import React, { createContext, useContext, useEffect, useState } from "react";

interface Quote {
  text: string;
  author: string;
}

interface QuoteContextType {
  quote: Quote;
  isLoading: boolean;
  error: string | null;
  fetchNewQuote: () => Promise<void>;
}

const QuoteContext = createContext<QuoteContextType | undefined>(undefined);

// Fallback quotes in case API fails
const fallbackQuotes: Quote[] = [
  {
    text: "The present moment is filled with joy and happiness. If you are attentive, you will see it.",
    author: "Thich Nhat Hanh"
  },
  {
    text: "Do not dwell in the past, do not dream of the future, concentrate the mind on the present moment.",
    author: "Buddha"
  },
  {
    text: "Peace comes from within. Do not seek it without.",
    author: "Buddha"
  },
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs"
  },
  {
    text: "Happiness is not something ready-made. It comes from your own actions.",
    author: "Dalai Lama"
  }
];

export const QuoteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [quote, setQuote] = useState<Quote>(() => {
    // Try to load from localStorage first
    const savedQuote = localStorage.getItem("dailyQuote");
    const savedDate = localStorage.getItem("dailyQuoteDate");
    
    // If there's a saved quote from today, use it
    if (savedQuote && savedDate === new Date().toDateString()) {
      return JSON.parse(savedQuote);
    }
    
    // Otherwise use a random fallback quote
    return fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNewQuote = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch("https://api.quotable.io/random?tags=inspirational,mindfulness,wisdom");
      
      if (!response.ok) {
        throw new Error("Failed to fetch quote");
      }
      
      const data = await response.json();
      const newQuote: Quote = {
        text: data.content,
        author: data.author
      };
      
      setQuote(newQuote);
      
      // Save to localStorage with today's date
      localStorage.setItem("dailyQuote", JSON.stringify(newQuote));
      localStorage.setItem("dailyQuoteDate", new Date().toDateString());
    } catch (err) {
      console.error("Error fetching quote:", err);
      setError("Failed to fetch quote. Using a fallback quote instead.");
      
      // Use a random fallback quote
      const fallbackQuote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
      setQuote(fallbackQuote);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch a new quote on initial load if we don't have today's quote
  useEffect(() => {
    const savedDate = localStorage.getItem("dailyQuoteDate");
    if (savedDate !== new Date().toDateString()) {
      fetchNewQuote();
    }
  }, []);

  return (
    <QuoteContext.Provider value={{ quote, isLoading, error, fetchNewQuote }}>
      {children}
    </QuoteContext.Provider>
  );
};

export const useQuote = (): QuoteContextType => {
  const context = useContext(QuoteContext);
  if (context === undefined) {
    throw new Error("useQuote must be used within a QuoteProvider");
  }
  return context;
};
