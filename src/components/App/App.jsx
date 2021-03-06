import React, { useEffect, useState } from "react";
import { Container, CssBaseline } from "@material-ui/core";

import useStyles from "./styles";
import { deleteRequest, getRequest, postRequest } from "../../networkManager";
import {
  Redirect,
  Route,
  Switch,
  useHistory,
  useLocation,
} from "react-router-dom";
import Home from "../Home/Home";
import Game from "../Game/Game";
import { ROUTES } from "../../constants";
import { getGameRoute } from "../../utils";
import ConfirmationDialog from "../ConfirmationDialog/ConfirmationDialog";
import AppNavigation from "../AppNavigation/AppNavigation";
import Rankings from "../Rankings/Rankings";
import { useAuth0 } from "@auth0/auth0-react";

function App() {
  const classes = useStyles();
  const history = useHistory();
  const [helloFWF, setHelloFWF] = useState(null);
  const [quickGame, setQuickGame] = useState(null);
  const [rankedGame, setRankedGame] = useState(null);
  const [deleteGame, setDeleteGame] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const location = useLocation();

  useEffect(() => {
    const getToken = async () => {
      const accessToken = await getAccessTokenSilently({
        audience: "https://flagsarefun.herokuapp.com/api/",
        scope: "post:ranked-games",
      });
      setAccessToken(accessToken);
    };
    if (isAuthenticated) getToken();
  }, [isAuthenticated]);

  useEffect(() => {
    const sayHello = async () => {
      const data = await getRequest("/hello");
      setHelloFWF(data);
    };
    sayHello();
  }, []);

  useEffect(() => {
    if (location.pathname === ROUTES.HOME) {
      setQuickGame(null);
      setRankedGame(null);
    }
  }, [location]);

  const createQuickGame = async () => {
    const data = await postRequest(ROUTES.GAMES);
    setQuickGame(data);
  };

  const createRankedGame = async (accessToken, userId, nickname) => {
    if (!accessToken || !userId || !nickname) return;
    const data = await postRequest(
      ROUTES.RANKED_GAMES,
      {
        Authorization: `Bearer ${accessToken}`,
      },
      { userId, nickname }
    );
    setRankedGame(data);
  };

  const onHomeNavigation = async () => {
    if (!quickGame) {
      history.push("/");
      return;
    }
    const gameResponse = await getRequest(`/games/${quickGame.id}`);
    if (gameResponse.game.end_time) history.push("/");
    else if (quickGame) setDeleteGame(true);
  };

  const onRankingsNavigation = () => {
    history.push("/rankings");
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
      <AppNavigation
        onHomeClick={onHomeNavigation}
        onRankingsClick={onRankingsNavigation}
      />
      <Container classes={{ root: classes.root }}>
        <Switch>
          <Route exact path="/">
            <Home
              helloFWF={helloFWF}
              onClick={createQuickGame}
              onRankedClick={createRankedGame}
              accessToken={accessToken}
            />
          </Route>
          <Route exact path="/rankings">
            <Rankings
              isAuthenticated={isAuthenticated}
              accessToken={accessToken}
            />
          </Route>
          {quickGame && (
            <Route
              path={`${ROUTES.GAMES}/:gameId/${ROUTES.QUESTION}/:questionId`}
            >
              <Game game={quickGame} />
            </Route>
          )}
          {rankedGame && (
            <Route
              path={`${ROUTES.RANKED_GAMES}/:gameId/${ROUTES.QUESTION}/:questionId`}
            >
              <Game game={rankedGame} />
            </Route>
          )}
          {quickGame && (
            <Redirect
              to={getGameRoute(
                ROUTES.GAMES,
                quickGame.id,
                quickGame.questions[0].id
              )}
            />
          )}
          {rankedGame && (
            <Redirect
              to={getGameRoute(
                ROUTES.RANKED_GAMES,
                rankedGame.id,
                rankedGame.questions[0].id
              )}
            />
          )}
        </Switch>
      </Container>
    </>
  );
}

export default App;
