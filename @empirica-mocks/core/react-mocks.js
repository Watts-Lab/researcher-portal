export function useGlobal() {
  // This is a mock function that returns a mock global object
  const global = {
    isMock: true,
    recruitingBatchConfig: undefined, //TODO
    get: function (varName) {return this[varName]}

  };

  return global;
}

export function Loading() {
  return "Loading...";
}
