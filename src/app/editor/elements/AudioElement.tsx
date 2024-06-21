import React from "react";

export default function AudioElement({ file } : {file : any}) {
  return (
    <div>
      <h1> Audio Element </h1>
      <p> File: {file} </p>
    </div>
  );
}
