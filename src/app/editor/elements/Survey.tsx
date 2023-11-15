import React from "react";

export default function Survey({ surveyName, onSubmit }) {
  return (
    <div>
      <h1> Survey </h1>
      <p> Survey Name: {surveyName} </p>
      <p> onSubmit: {onSubmit} </p>
    </div>
  );
}
