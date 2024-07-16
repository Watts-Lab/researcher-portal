import { createContext, useState } from 'react';

const StageContext = createContext();

const StageProvider = ({ children }) => {
  const [currentStageIndex, setCurrentStageIndex] = useState('default');
  const [elapsed, setElapsed] = useState('default');

  const contextValue = {
    currentStageIndex,
    setCurrentStageIndex,
    elapsed,
    setElapsed
  };

  return (
    <StageContext.Provider value={contextValue}>
      {children}
    </StageContext.Provider>
  );
};

export { StageContext, StageProvider };