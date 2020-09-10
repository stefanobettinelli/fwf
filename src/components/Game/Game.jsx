import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@material-ui/core";
import { getRequest } from "../../networkManager";
import useStyles from "./styles";
import QuestionActions from "../QuestionActions/QuestionActions";

function Game({ game }) {
  const classes = useStyles();
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedOption, setSelectedOptions] = useState(null);
  const [currentQuestionFlag, setCurrentQuestionFlag] = useState(null);

  useEffect(() => {
    if (!currentQuestion)
      setCurrentQuestion({ index: 0, question: game.questions[0] });
  }, [currentQuestion, game]);

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

  return (
    <Card classes={{ root: classes.cardRoot }}>
      {currentQuestionFlag && (
        <img src={currentQuestionFlag} className={classes.imageRoot} />
      )}
      <CardContent>
        <FormControl component="fieldset">
          <RadioGroup
            aria-label="gender"
            value={selectedOption}
            onChange={(event) => {
              setSelectedOptions(String(event.target.value));
            }}
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
      </CardContent>
      <CardActions classes={{ root: classes.actions }}>
        <QuestionActions
          currentQuestion={currentQuestion}
          handlePrev={handlePrev}
          handleNext={handleNext}
          handleFinish={() => {}}
          classes={classes}
        />
      </CardActions>
    </Card>
  );
}

Game.propTypes = {
  game: PropTypes.shape({}), // TODO: define a proper game proptype
};

export default Game;
