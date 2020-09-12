import React, { useEffect, useState } from "react";
import {
  BottomNavigation,
  BottomNavigationAction,
  Container,
  CssBaseline,
} from "@material-ui/core";
import { HomeRounded } from "@material-ui/icons";

import useStyles from "./styles";
import { getRequest, postRequest } from "../../networkManager";
import { Link, Redirect, Route, Switch, useLocation } from "react-router-dom";
import Home from "../Home/Home";
import Game from "../Game/Game";
import { ROUTES } from "../../constants";
import { getGameRoute } from "../../utils";

function App() {
  const classes = useStyles();
  const [helloFWF, setHelloFWF] = useState(null);
  const [quickGame, setQuickGame] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const sayHello = async () => {
      const data = await getRequest("/hello");
      setHelloFWF(data);
    };
    sayHello();
  }, []);

  useEffect(() => {
    if (location.pathname === ROUTES.HOME) setQuickGame(null);
  }, [location]);

  const createQuickGame = async () => {
    const data = await postRequest(ROUTES.GAMES);
    setQuickGame(data);
  };

  return (
    <>
      <CssBaseline />
      <BottomNavigation value="Home" onChange={() => {}}>
        <Link to="/">
          <BottomNavigationAction
            label="Home"
            value="home"
            icon={<HomeRounded />}
          />
        </Link>
      </BottomNavigation>
      <Container classes={{ root: classes.root }}>
        <Switch>
          <Route exact path="/">
            <Home helloFWF={helloFWF} onClick={createQuickGame} />
          </Route>
          {quickGame && (
            <Route
              path={`${ROUTES.GAMES}/:gameId/${ROUTES.QUESTION}/:questionId`}
            >
              <Game game={quickGame} />
            </Route>
          )}
          {quickGame && (
            <Redirect
              to={getGameRoute(quickGame.id, quickGame.questions[0].id)}
            />
          )}
        </Switch>
      </Container>
    </>
  );
}

export default App;
