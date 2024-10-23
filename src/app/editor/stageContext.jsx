//import { set } from 'node_modules/cypress/types/lodash';
import { createContext, useState } from 'react';

// export const StageContext = createContext({
//     currentStageIndex: "default",
//     elapsed: "default"
// });

const StageContext = createContext();

const StageProvider = ({ children }) => {
  const [currentStageIndex, setCurrentStageIndex] = useState('default');
  const [elapsed, setElapsed] = useState('default');
  const [treatment, setTreatment] = useState(null);
  

  const contextValue = {
    currentStageIndex,
    setCurrentStageIndex,
    elapsed,
    setElapsed,
    treatment,
    setTreatment
  };

  return (
    <StageContext.Provider value={contextValue}>
      {children}
    </StageContext.Provider>
  );
};

export { StageContext, StageProvider };

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