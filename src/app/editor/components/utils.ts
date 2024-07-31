export function setCurrentStageIndex(index: number) {
    localStorage.setItem('currentStageIndex', index.toString())
}

// export function setTreatment(setTreatment: ) {
//     setTreatment(newTreatment)
//     localStorage.setItem('code', stringify(newTreatment))
//     window.location.reload()
//   }
//   // Todo: think about using 'useContext' here instead of passing editTreatment all the way down

//   useEffect(() => {
//     // Access localStorage only on the client side
//     if (typeof window !== 'undefined') {
//       const codeStr = localStorage.getItem('code') || ''
//       const parsedCode = parse(codeStr)
//       setTreatment(parsedCode)
//     }
//   }, [])

