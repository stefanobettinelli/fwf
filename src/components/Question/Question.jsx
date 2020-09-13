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
import React from "react";
import useStyles from "./styles";

function Question({
  score,
  currentQuestion,
  currentQuestionFlag,
  value,
  onChange,
  handleNext,
  handlePrev,
  handleFinish,
}) {
  const classes = useStyles();

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
          <RadioGroup aria-label="gender" value={value} onChange={onChange}>
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
