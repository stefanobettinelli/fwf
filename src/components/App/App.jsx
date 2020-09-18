import React, { useEffect, useState } from "react";
import {
  BottomNavigation,
  BottomNavigationAction,
  Container,
  CssBaseline,
} from "@material-ui/core";
import { HomeRounded } from "@material-ui/icons";

import useStyles from "./styles";
import { deleteRequest, getRequest, postRequest } from "../../networkManager";
import {
  Redirect,
  Route,
  Switch,
  useLocation,
  useHistory,
} from "react-router-dom";
import Home from "../Home/Home";
import Game from "../Game/Game";
import { ROUTES } from "../../constants";
import { getGameRoute } from "../../utils";
import ConfirmationDialog from "../ConfirmationDialog/ConfirmationDialog";

function App() {
  const classes = useStyles();
  const history = useHistory();
  const [helloFWF, setHelloFWF] = useState(null);
  const [quickGame, setQuickGame] = useState(null);
  const [deleteGame, setDeleteGame] = useState(false);
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

  const onNavigationChange = async () => {
    if (!quickGame) {
      history.push("/");
      return;
    }
    const gameResponse = await getRequest(`/games/${quickGame.id}`);
    if (gameResponse.game.end_time) history.push("/");
    else if (quickGame) setDeleteGame(true);
  };

  const confirmDeleteGame = async () => {
    if (quickGame) {
      deleteRequest(`/games/${quickGame.id}`);
      history.push("/");
      setDeleteGame(false);
    }
  };

  const onClose = () => {
    setDeleteGame(false);
  };

  return (
    <>
      <CssBaseline />
      <ConfirmationDialog
        title="Switching to home will delete current current game"
        open={deleteGame}
        onConfirm={confirmDeleteGame}
        onClose={onClose}
        buttonLabel="Delete"
      />
      <BottomNavigation value="Home">
        <BottomNavigationAction
          label="Home"
          value="home"
          icon={<HomeRounded />}
          onClick={onNavigationChange}
        />
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
