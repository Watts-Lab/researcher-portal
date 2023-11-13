import React from "react";

export default function Prompt({ file, saveKey }) {
  return (
    <div>
      <h1> SubmitButton </h1>
      <p> `File: ${file}` </p>
      <p> `saveKey: ${saveKey}` </p>
    </div>
  );
}
