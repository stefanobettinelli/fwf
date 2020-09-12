import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardActions,
  CardContent,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@material-ui/core";
import { getRequest, patchRequest } from "../../networkManager";
import useStyles from "./styles";
import QuestionActions from "../QuestionActions/QuestionActions";
import Score from "../Score/Score";

function Game({ game }) {
  const classes = useStyles();
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedOption, setSelectedOptions] = useState(null);
  const [currentQuestionFlag, setCurrentQuestionFlag] = useState(null);
  const [score, setScore] = useState(null);

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
    setSelectedOptions(String(event.target.value));
    patchRequest(`/questions/${currentQuestion.question.id}`, {
      submittedAnswer: event.target.value,
    });
    // TODO:animations should be introduced in order to see the option being selected before switching to the next card
    // if (currentQuestion.index < 9) handleNext();
    // else handleFinish();
  };

  return (
    <Card classes={{ root: classes.cardRoot }}>
      {currentQuestionFlag && score === null && (
        <img
          src={currentQuestionFlag}
          className={classes.imageRoot}
          alt="flag"
        />
      )}
      <CardContent>
        <FormControl component="fieldset">
          <RadioGroup
            aria-label="gender"
            value={selectedOption}
            onChange={onOptionChange}
          >
            {currentQuestion &&
              currentQuestion.question.options.map((option) => (
                <FormControlLabel
                  key={option.id}
                  value={String(option.id)}
                  control={<Radio />}
                  label={option.name}
                />
              ))}
          </RadioGroup>
        </FormControl>
        {score && <Score score={score} outOf={10} />}
      </CardContent>
      <CardActions classes={{ root: classes.actions }}>
        <QuestionActions
          currentQuestion={currentQuestion}
          handlePrev={handlePrev}
          handleNext={handleNext}
          handleFinish={handleFinish}
        />
      </CardActions>
    </Card>
  );
}

Game.propTypes = {
  game: PropTypes.shape({}), // TODO: define a proper game proptype
};

export default Game;
