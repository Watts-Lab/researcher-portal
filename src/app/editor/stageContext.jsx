//import { set } from 'node_modules/cypress/types/lodash';
import { createContext, useState, useEffect, useRef } from 'react'
import { stringify } from 'yaml'
import {
  useGame,
  useStage,
  usePlayer,
  useRound,
  useStageTimer,
} from "@empirica/core/player/classic/react";

// export const StageContext = createContext({
//     currentStageIndex: "default",
//     elapsed: "default"
// });

const StageContext = createContext()

const StageProvider = ({ children }) => {
  const [currentStageIndex, setCurrentStageIndex] = useState('default')
  const [elapsed, setElapsed] = useState(0)
  const [treatment, setTreatment] = useState(null)
  const [templatesMap, setTemplatesMap] = useState(new Map())
  const player = usePlayer()
  const timerInterval = useRef(null);

  // for updating code editor, requires reload
  function editTreatment(newTreatment) {
    setTreatment(newTreatment)
    localStorage.setItem('code', stringify(newTreatment))
    window.location.reload()
  }

    // Update elapsed time dynamically
    useEffect(() => {
      const start = Date.now() - elapsed * 1000; // Adjust start time to match current elapsed time
  
      // Clear any existing interval to avoid duplication
      if (timerInterval.current) clearInterval(timerInterval.current);
  
      timerInterval.current = setInterval(() => {
        const secondsElapsed = Math.floor((Date.now() - start) / 1000); // Calculate seconds
        setElapsed(secondsElapsed);
      }, 1000);
  
      return () => clearInterval(timerInterval.current); // Cleanup the interval
    }, [elapsed]);

  const contextValue = {
    currentStageIndex,
    setCurrentStageIndex,
    elapsed,
    setElapsed,
    treatment,
    setTreatment,
    editTreatment,
    player,
    templatesMap,
    setTemplatesMap,
  }

  return (
    <StageContext.Provider value={contextValue}>
      {children}
    </StageContext.Provider>
  )
}

export { StageContext, StageProvider }

// import React, { createContext, useState, useContext } from 'react';

// // Create the context
// const StageContext = createContext();

// // Create a custom hook for easy access to the context
// const useStageContext = () => useContext(StageContext);

// // Create the provider component
// const StageProvider = ({ children }) => {
//   const [state, setState] = useState({
//     currentStageIndex: 'default',
//     elapsed: 'default'
//   });

//   const setCurrentStageIndex = (value) => {
//     setState((prevState) => ({
//       ...prevState,
//       currentStageIndex: value
//     }));
//   };

//   const setElapsed = (value) => {
//     setState((prevState) => ({
//       ...prevState,
//       elapsed: value
//     }));
//   };

//   return (
//     <StageContext.Provider value={{ ...state, setCurrentStageIndex, setElapsed }}>
//       {children}
//     </StageContext.Provider>
//   );
// };

// export { StageProvider, useStageContext };
