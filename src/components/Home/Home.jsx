import React, { useState, useEffect } from "react";
import { Button, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import LoginButton from "../LoginButton/LoginButton";
import LogoutButton from "../LogoutButton/LogoutButton";
import { useAuth0 } from "@auth0/auth0-react";
import useStyles from "./styles";

function Home({ helloFWF, onClick, onRankedClick, accessToken }) {
  const { user, isLoading, isAuthenticated } = useAuth0();
  const classes = useStyles();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const userId = user?.sub;
  const nickname = user?.nickname;

  return (
    <>
      <Typography variant="h5" gutterBottom>
        Fun with Flags
      </Typography>
      {helloFWF && helloFWF.success && (
        <>
          <Link to="/games">
            <Button
              classes={{ root: classes.buttonRoot }}
              disableElevation
              variant="contained"
              color="primary"
              onClick={onClick}
            >
              Quick play
            </Button>
          </Link>
          {isAuthenticated && (
            <Link to="/games">
              <Button
                classes={{ root: classes.buttonRoot }}
                disableElevation
                variant="contained"
                color="primary"
                onClick={() => onRankedClick(accessToken, userId, nickname)}
              >
                Play ranked
              </Button>
            </Link>
          )}
          {isAuthenticated ? <LogoutButton /> : <LoginButton />}
        </>
      )}
    </>
  );
}

Home.propTypes = {
  helloFWF: PropTypes.any, // TODO: think about creating a js util file that contain the shapes from network calls
  onClick: PropTypes.func,
};

export default Home;
