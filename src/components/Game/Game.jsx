import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Button,
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
    <Card>
      {currentQuestionFlag && (
        <CardMedia
          image={currentQuestionFlag}
          classes={{ root: classes.imageRoot }}
        />
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
        {currentQuestion?.index > 0 && (
          <Button
            onClick={handlePrev}
            classes={{ root: classes.buttonRoot }}
            variant="contained"
            disableElevation
          >
            Prev
          </Button>
        )}
        {currentQuestion?.index < 9 && (
          <Button
            onClick={handleNext}
            classes={{ root: `${classes.buttonRoot} ${classes.buttonNext}` }}
            color="primary"
            variant="contained"
            disableElevation
          >
            Next
          </Button>
        )}
      </CardActions>
    </Card>
  );
}

Game.propTypes = {
  game: PropTypes.shape({}), // TODO: define a proper game proptype
};

export default Game;
