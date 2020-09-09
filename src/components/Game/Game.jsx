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
    if (!currentQuestion) setCurrentQuestion(game.questions[0]);
  }, [currentQuestion, game]);

  useEffect(() => {
    const getFlagUrl = async () => {
      if (!currentQuestion) return;
      const data = await getRequest(`/questions/${currentQuestion.id}/flag`);
      const flagUrl = atob(data.flagBase64);
      setCurrentQuestionFlag(flagUrl);
    };
    getFlagUrl();
  }, [currentQuestion]);

  return (
    <Card>
      {currentQuestionFlag && (
        <CardMedia
          image={currentQuestionFlag}
          classes={{ root: classes.root }}
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
              currentQuestion.options.map((option) => (
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
      <CardActions>
        <Button color="primary" variant="contained" disableElevation>
          Next
        </Button>
      </CardActions>
    </Card>
  );
}

Game.propTypes = {
  game: PropTypes.shape({}), // TODO: define a proper game proptype
};

export default Game;
