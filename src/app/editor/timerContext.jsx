import { createContext, useState, useEffect } from 'react'

export const TimerContext = createContext({
  elapsed: 0,
  setElapsed: () => {},
});

export const TimerProvider = ({ children }) => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <TimerContext.Provider value={{ elapsed, setElapsed }}>
      {children}
    </TimerContext.Provider>
  );
};