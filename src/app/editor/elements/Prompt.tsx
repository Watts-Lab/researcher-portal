import React from "react";

export default function Prompt({ file, saveKey } : {file : any, saveKey : any}) {
  return (
    <div>
      <h1> Prompt </h1>
      <p> File: {file} </p>
      <p> Save Key: {saveKey} </p>
    </div>
  );
}
