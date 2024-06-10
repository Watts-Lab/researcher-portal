import React from "react";

export default function SubmitButton({ onSubmit, buttonText } : { onSubmit : any, buttonText : any}) {
  return (
    <div>
      <h1> SubmitButton </h1>
      <p> onSubmit: {onSubmit} </p>
      <p> Button Text: {buttonText} </p>
    </div>
  );
}
