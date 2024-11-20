import { useContext } from 'react';
import { isFunctionDeclaration } from "typescript";
import { StageContext } from '@/editor/stageContext';

// file is in deliberation-empirica/client/node_modules/@empirica/core/mocks.js


export function usePlayer() {
  // This is a mock function that returns a mock player object
  // console.log("loaded usePlayer() from react-mocks.js");
  const player = {
    isMock: true,
    introDone: true,
    exitStep: 0, //TODO,
    gameID: 21,
    position: 0, //TODO - set with toggle
    stage: {
      set: function (varName, value) {
        this[varName] = value;
      },
      get: function (varName) {
        return this[varName];
      },
    },
    get: function (varName) {
      return this[varName];
    },
    set: function (varName, value) {
      this[varName] = value;
    },
  };
  return player;
}

export function useGame() {
  // This is a mock function that returns a mock game object
  const game = {
    isMock: true,
    ended: false,
    get: function (varName) {
      return this[varName];
    },
    set: function (varName, value) {
      this[varName] = value;
    },
  };

  return game;
}

export function useStageTimer() {
  const stage = useContext(StageContext);
  console.log("useStageTimerMock", stage)
  
  // This is a mock function that returns a mock stage timer object
  const stageTimer = {
    isMock: true,
    elapsed: stage.elapsed * 1000 // multiply by 1000 for conditionalRender component
    // problem: this will be called every render cycle...
  };

  return stageTimer;
}

export function useStage() {
  // This is a mock function that returns a mock stage object

  const {
    currentStageIndex,
    setCurrentStageIndex,
    elapsed,
    setElapsed,
    treatment,
    setTreatment,
    templatesMap,
    setTemplatesMap,
  } = useContext(StageContext)
  // const stage1 = useContext(StageContext);
  // console.log("useStageMock", stage1)

  const stage = {
    isMock: true,
    get: function (varName) {
      //const currentStageIndex = int(localStorage.getItem("currentStageIndex"));
      
      //const treatmentString = localStorage.getItem("treatment");
      //const treatment = JSON.parse(treatmentString);
      if (varName === "elements") {
        var elements = treatment.treatments[0]?.gameStages[currentStageIndex]?.elements
        elements =  elements.flatMap((element) => {
          if (element.template) {
            return templatesMap.get(element.template);
          }
          return [element];
        });
        console.log("revised elements", elements)
        return elements;
      } else if (varName === "discussion") {
        return treatment.treatments[0]?.gameStages[currentStageIndex]?.discussion
      } else if (varName === "name") {
        return treatment.treatments[0]?.gameStages[currentStageIndex]?.name
      } else if (varName === "index") {
        return currentStageIndex
      }
    },
    
  };

  return stage;
}

export function usePlayers() {
  // This is a mock function that returns a mock players object
  const players = {
    isMock: true,
    get: function (varName) {
      return this[varName];
    },
    set: function (varName, value) {
      this[varName] = value;
    },
  };

  return players;
}

export function useGlobal() {
  // This is a mock function that returns a mock global object
  // UPDATE CDN IF TESTING LOCALLY / DEPLOYING
  const global = {
    isMock: true,
    recruitingBatchConfig: {
      cdn: 'prod',
    },
    resourceLookup: {
      cdn: 'prod',
    },
    cdnList: {
      test: "http://localhost:9091",
      local: "http://localhost:9090",
      prod: "https://s3.amazonaws.com/assets.deliberation-lab.org",
    },
    get: function (varName) {
      return this[varName];
    }
  };
  return global;
}

// Mock implementation of Loading
export function Loading() {
  return "Loading...";
}
