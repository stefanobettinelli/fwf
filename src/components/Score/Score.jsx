import React from "react";
import useStyle from "./styles";

function Score({ score, outOf }) {
  const classes = useStyle();
  const scoreReaction = [
    "🤢",
    "😨",
    "🤥",
    "🤔",
    "😔",
    "🥳",
    "🤠",
    "🤓",
    "🧠",
    "🏆",
  ];

  return (
    <div className={classes.scoreRoot}>
      <h1>
        {score}/{outOf}
      </h1>
      <h1>{scoreReaction[score - 1]}</h1>
    </div>
  );
}

export default Score;
