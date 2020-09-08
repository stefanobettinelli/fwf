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
  FormLabel,
  Radio,
  RadioGroup,
} from "@material-ui/core";

function Game({ game }) {
  const [currentQuestion, setCurrenctQuestion] = useState(null);
  const [selectedOption, setSelectedOptions] = useState(null);

  useEffect(() => {
    setCurrenctQuestion(game.questions[0]);
  }, []);

  console.log(currentQuestion);

  return (
    <Card>
      <CardContent>
        <CardMedia />
        <FormControl component="fieldset">
          <RadioGroup
            aria-label="gender"
            name="gender1"
            value={selectedOption}
            onChange={() => {}}
          >
            {currentQuestion &&
              currentQuestion.options.map((option) => (
                <FormControlLabel
                  value={option.id}
                  control={<Radio />}
                  label={option.name}
                />
              ))}
          </RadioGroup>
        </FormControl>
      </CardContent>
      <CardActions>
        {game.id}
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
