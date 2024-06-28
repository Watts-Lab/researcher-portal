export function usePlayer() {
  // This is a mock function that returns a mock player object
  // console.log("loaded usePlayer() from react-mocks.js");
  const player = {
    isMock: true,
    introDone: true,
    exitStep: 0, //TODO,
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
  //TODO implement?
  // This is a mock function that returns a mock stage timer object
  const stageTimer = {
    isMock: true,
  };

  return stageTimer;
}

export function useStage() {
  // This is a mock function that returns a mock stage object
  const stage = {
    isMock: true,
    index: 0, //TODO
    get: function (varName) {
      return this[varName];
    },
    set: function (varName, value) {
      this[varName] = value;
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
