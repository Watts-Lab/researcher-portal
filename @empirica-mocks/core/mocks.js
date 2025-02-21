import { useContext } from 'react';
import { isFunctionDeclaration } from "typescript";
// import { StageContext } from '@/editor/stageContext'; // # don't know why this doesn't work

// file is in deliberation-empirica/client/node_modules/@empirica/core/mocks.js
import { StageContext } from "../../src/app/editor/stageContext"
// "../../../../src/app/editor/stageContext"



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
  console.log("StageElapsed", stage.elapsed)
  
  
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
    refData,
    setRefData,
    selectedTreatmentIndex,
    setSelectedTreatmentIndex
  } = useContext(StageContext)
  // const stage1 = useContext(StageContext);
  // console.log("useStageMock", stage1)

  const stage = {
    isMock: true,
    get: function (varName) {
      //const currentStageIndex = int(localStorage.getItem("currentStageIndex"));
      
      //const treatmentString = localStorage.getItem("treatment");
      //const treatment = JSON.parse(treatmentString);
      var tempStage = null; // for template stages
      const stageTemplateName = treatment.treatments[0]?.gameStages[currentStageIndex]?.template || "";
      var fields = treatment.treatments[0]?.gameStages[currentStageIndex]?.fields || [];
      if (stageTemplateName !== "") {
        tempStage = templatesMap.get(stageTemplateName)[0]
      }
      console.log("tempStage", tempStage);

      //logic to fill in ${} props
      // move logic outside get()
      const variablePattern = /\${([^}]+)}/;
      {tempStage && 
        tempStage.elements.forEach(element => {
          Object.keys(element).forEach(key => {
            const value = element[key];

            if (typeof value === "string" && variablePattern.test(value)) {
              const match = value.match(variablePattern);
              if (match) {
                console.log("replaced " + match[1] + " with " + fields[match[1]]);
                element[key] = fields[match[1]];
              }
            }
          });
        });
      }

      if (varName === "elements") {
        // MAIN ==>
        // let elements = treatment.treatments[selectedTreatmentIndex]?.gameStages[currentStageIndex]?.elements;
        // if (Array.isArray(elements)) {
        //   elements = elements.flatMap((element) => {
        //     if (element.template) {
        //       return templatesMap.get(element.template);
        //     }
        //     return [element];
        //   });
        // } else {
        //   elements = [];
        // }
        // console.log("revised elements", elements)
        // return elements;

        var elements
        if (tempStage) {
          elements = tempStage.elements;
        } else {
          elements = treatment.treatments[0]?.gameStages[currentStageIndex]?.elements;
        }

        console.log("CURRELEMENTS", elements)
        
        // TODO: change to template if needed
        // map to templates first
        elements = elements.flatMap((element) => {
          if (element.template) {
            return templatesMap.get(element.template);
          } else {
            return element;
          }
        })

        //console.log("ELEMENTS_TO_DISPLAY", elements)
        // check all conditions
        elements =  elements.flatMap((element) => {
          if (element.conditions) {
            // TODO: update with other comparators
            const conditions = element.conditions;
            const comparator = conditions[0]?.comparator || "x";
            const reference = conditions[0]?.reference || "x";
            const value = conditions[0]?.value || "x";
            if (comparator === "x") {
              return [element];
            } else if (comparator === "exists") {
              if (refData[`stage_${currentStageIndex}`]?.[reference]) {
                const newElement = {...element};
                delete newElement.conditions;
                return [newElement];
              } else {
                return [];
              }
            } else if (comparator === "equals") {
              if (refData[`stage_${currentStageIndex}`]?.[reference] == value) {
                const newElement = {...element};
                delete newElement.conditions;
                return [newElement];
              } else {
                return [];
              }
            } else if (comparator === "doesNotEqual") {
              if (refData[`stage_${currentStageIndex}`]?.[reference] != value) {
                const newElement = {...element};
                delete newElement.conditions;
                return [newElement];
              } else {
                return [];
              }
            }
            
            const condition = conditions.find((condition) => {
              if (condition.field) {
                return fields[condition.field] === condition.value;
              }
              return true;
            });
            if (condition) {
              return [element];
            }
          }
          return [element];
        });
        return elements;
      } else if (varName === "discussion") {
        if (tempStage) {
          return tempStage.discussion || [];
        }
        return treatment.treatments[selectedTreatmentIndex]?.gameStages[currentStageIndex]?.discussion;
      } else if (varName === "name") {
        if (tempStage) {
          return tempStage.name;
        }
        return treatment.treatments[selectedTreatmentIndex]?.gameStages[currentStageIndex]?.name;
      } else if (varName === "index") {
        return currentStageIndex;
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
