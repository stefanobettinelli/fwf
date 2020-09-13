import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { FormControlLabel, Radio } from "@material-ui/core";
import { getRequest, patchRequest } from "../../networkManager";
import Question from "../Question/Question";

function Game({ game }) {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [score, setScore] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [currentQuestionFlag, setCurrentQuestionFlag] = useState(null);

  useEffect(() => {
    if (!currentQuestion && score === null) {
      setCurrentQuestion({ index: 0, question: game.questions[0] });
    }
  }, [currentQuestion, game, score]);

  useEffect(() => {
    const getFlagUrl = async () => {
      if (!currentQuestion) return;
      const data = await getRequest(
        `/questions/${currentQuestion.question.id}/flag`
      );
      const flagUrl = atob(data.flagBase64);
      setCurrentQuestionFlag(flagUrl);
    };
    getFlagUrl();
  }, [currentQuestion]);

  const handleNext = () => {
    if (currentQuestion.index < 9) {
      const nextIndex = currentQuestion.index + 1;
      setCurrentQuestion({
        index: nextIndex,
        question: game.questions[nextIndex],
      });
    }
  };

  const handlePrev = () => {
    if (currentQuestion.index > 0) {
      const prevIndex = currentQuestion.index - 1;
      setCurrentQuestion({
        index: prevIndex,
        question: game.questions[prevIndex],
      });
    }
  };

  const handleFinish = async () => {
    const finishedGame = await patchRequest(`/games/${game.id}`);
    setScore(finishedGame.game.score);
    setCurrentQuestion(null);
  };

  const onOptionChange = (event) => {
    setSelectedOption(String(event.target.value));
    patchRequest(`/questions/${currentQuestion.question.id}`, {
      submittedAnswer: event.target.value,
    });
    // TODO:animations should be introduced in order to see the option being selected before switching to the next card
    // if (currentQuestion.index < 9) handleNext();
    // else handleFinish();
  };

  return (
    <Question
      currentQuestionFlag={currentQuestionFlag}
      score={score}
      value={selectedOption}
      onChange={onOptionChange}
      currentQuestion={currentQuestion}
      handlePrev={handlePrev}
      handleNext={handleNext}
      handleFinish={handleFinish}
    />
  );
}

Game.propTypes = {
  game: PropTypes.shape({}), // TODO: define a proper game proptype
};

export default Game;
