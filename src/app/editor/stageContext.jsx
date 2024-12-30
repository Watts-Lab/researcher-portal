//import { set } from 'node_modules/cypress/types/lodash';
import { createContext, useState, useEffect, useRef, useMemo } from 'react'
import { stringify } from 'yaml'
import {
  useGame,
  useStage,
  usePlayer,
  useRound,
  useStageTimer,
} from "@empirica/core/player/classic/react";
import { TimerProvider } from './TimerContext'; 

// export const StageContext = createContext({
//     currentStageIndex: "default",
//     elapsed: "default"
// });

const StageContext = createContext()

const StageProvider = ({ children }) => {
  const [currentStageIndex, setCurrentStageIndex] = useState('default')
  const [treatment, setTreatment] = useState(null)
  const [templatesMap, setTemplatesMap] = useState(new Map())
  const player = usePlayer()

  // for updating code editor, requires reload
  function editTreatment(newTreatment) {
    setTreatment(newTreatment)
    localStorage.setItem('code', stringify(newTreatment))
    window.location.reload()
  }
  const stageContextValue = useMemo(() => ({
    currentStageIndex,
    setCurrentStageIndex,
    treatment,
    setTreatment,
    editTreatment,
    player,
    templatesMap,
    setTemplatesMap,
  }), [currentStageIndex, treatment, player, templatesMap]);

  return (
    <StageContext.Provider value={stageContextValue}>
      <TimerProvider>
        {children}
      </TimerProvider>
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
