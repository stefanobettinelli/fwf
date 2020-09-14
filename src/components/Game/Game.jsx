import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { getRequest, patchRequest } from "../../networkManager";
import Question from "../Question/Question";

function Game({ game }) {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [score, setScore] = useState(null);
  const [currentQuestionFlag, setCurrentQuestionFlag] = useState(null); // TODO: this should be moved to Question component

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

  return (
    <Question
      currentQuestionFlag={currentQuestionFlag}
      score={score}
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
