import { useContext } from 'react';
import { isFunctionDeclaration } from "typescript";
// import { StageContext } from '@/editor/stageContext'; # don't know why this doesn't work

// file is in deliberation-empirica/client/node_modules/@empirica/core/mocks.js
import { StageContext } from "../../../../../src/app/editor/stageContext"



export function usePlayer() {
  // This is a mock function that returns a mock player object
  // console.log("loaded usePlayer() from react-mocks.js");
  const player = {
    isMock: true,
    introDone: true,
    exitStep: 0, //TODO,
    gameID: 21,
    position: 0, //TODO - set with toggle
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
    elapsed: stage.elapsed // problem: this will be called every render cycle...
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
        return treatment.gameStages[currentStageIndex]?.elements
      } else if (varName === "discussion") {
        return treatment.gameStages[currentStageIndex]?.discussion
      } else if (varName === "name") {
        return treatment.gameStages[currentStageIndex]?.name
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
