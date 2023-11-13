import React from "react";

export default function SubmitButton({ onSubmit, buttonText }) {
  return (
    <div>
      <h1> SubmitButton </h1>
      <p> `onSubmit: ${onSubmit}` </p>
      <p> `Button Text: ${buttonText}` </p>
    </div>
  );
}
