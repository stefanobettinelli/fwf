import {
  Card,
  CardActions,
  CardContent,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@material-ui/core";
import Score from "../Score/Score";
import QuestionActions from "../QuestionActions/QuestionActions";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import useStyles from "./styles";
import { getRequest, patchRequest } from "../../networkManager";
import useMediaQuery from "@material-ui/core/useMediaQuery";

function Question({
  score,
  currentQuestion,
  currentQuestionFlag,
  handleNext,
  handlePrev,
  handleFinish,
}) {
  const classes = useStyles();
  const [questionResource, setQuestionResource] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);

  const matches = useMediaQuery("(min-width:600px)");

  useEffect(() => {
    const getQuestionResource = async () => {
      if (!currentQuestion) return;
      const question = await getRequest(
        `/questions/${currentQuestion.question.id}`
      );
      setQuestionResource(question);
    };
    getQuestionResource();
  }, [currentQuestion]);

  const onOptionChange = (event) => {
    setSelectedOption(event.target.value);
    patchRequest(`/questions/${currentQuestion.question.id}`, {
      submittedAnswer: event.target.value,
    });
    // TODO:animations should be introduced in order to see the option being selected before switching to the next card
    // if (currentQuestion.index < 9) handleNext();
    // else handleFinish();
  };

  let cardRootStyle = "";
  if (matches) {
    cardRootStyle = classes.cardRootDesktop;
  } else {
    cardRootStyle = classes.cardRootMobile;
  }

  return (
    <Card classes={{ root: cardRootStyle }}>
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
            value={String(
              questionResource?.question.submitted_answer || selectedOption
            )}
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

Question.propTypes = {
  classes: PropTypes.any,
  currentQuestionFlag: PropTypes.any,
  score: PropTypes.any,
  value: PropTypes.any,
  onChange: PropTypes.func,
  currentQuestion: PropTypes.any,
  handlePrev: PropTypes.func,
  handleNext: PropTypes.func,
  handleFinish: PropTypes.func,
};

export default Question;
