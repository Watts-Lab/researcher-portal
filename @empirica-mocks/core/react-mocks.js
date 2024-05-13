export function useGlobal() {
  // This is a mock function that returns a mock global object
  const global = {
    isMock: true,
    recruitingBatchConfig: undefined, //TODO
    
  };

  return global;
}

export function Loading() {
  return "Loading...";
}
