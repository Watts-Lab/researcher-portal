import React, { createContext, useState, useEffect, useMemo } from 'react';

// Create TimerContext
export const TimerContext = createContext();

// TimerProvider component
export const TimerProvider = ({ children }) => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const start = Date.now() - elapsed * 1000; // Adjust start time based on current elapsed

    const interval = setInterval(() => {
      const secondsElapsed = Math.floor((Date.now() - start) / 1000);
      setElapsed(secondsElapsed);
    }, 1000);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [elapsed]);

  // Memoize the context value to prevent unnecessary re-creations
  const value = useMemo(() => ({ elapsed, setElapsed }), [elapsed]);

  return (
    <TimerContext.Provider value={value}>
      {children}
    </TimerContext.Provider>
  );
};