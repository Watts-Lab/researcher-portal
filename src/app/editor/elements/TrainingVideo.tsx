import React from "react";

export default function SubmitButton({ url } : { url : any}) {
  return (
    <div>
      <h1> Training Video </h1>
      <p> url: {url} </p>
    </div>
  );
    // return (
    // <div style={{ position: 'relative', width: '100%', paddingTop: '70%'}}>
    //   <h1> Training Video </h1>
    //   <div style={{ position: 'absolute', top: 0, left: 0, width: '90%', height: '90%' }}>
    //     <p> url: {url} </p>
    //   </div>
    // </div>
    // );
}

// case "video":
//   return (
//     <div style={{ position: 'relative', width: '100%', paddingTop: '70%'}}>
//       <div style={{ position: 'absolute', top: 0, left: 0, width: '90%', height: '90%' }}>
//         <TrainingVideo url={element.url}/>
//       </div>
//     </div>
//   );
