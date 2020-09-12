import { Button } from "@material-ui/core";
import PropTypes from "prop-types";
import React from "react";
import useStyles from "./styles";

function QuestionActions({
  currentQuestion,
  handlePrev,
  handleNext,
  handleFinish,
}) {
  const classes = useStyles();

  return (
    <>
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
          classes={{
            root: `${classes.buttonRoot} ${classes.buttonNext} ${
              currentQuestion.index === 0 && classes.buttonNextAlone
            }`,
          }}
          color="primary"
          variant="contained"
          disableElevation
        >
          Next
        </Button>
      )}
      {currentQuestion?.index === 9 && (
        <Button
          onClick={handleFinish}
          classes={{
            root: `${classes.buttonRoot} ${classes.buttonFinish}`,
          }}
          color="primary"
          variant="contained"
          disableElevation
        >
          Finish!
        </Button>
      )}
    </>
  );
}

QuestionActions.propTypes = {
  currentQuestion: PropTypes.any,
  handlePrev: PropTypes.func,
  handleNext: PropTypes.func,
  handleFinish: PropTypes.func,
};

export default QuestionActions;
