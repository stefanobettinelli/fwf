import React from "react";
import { Button, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import LoginButton from "../LoginButton/LoginButton";
import LogoutButton from "../LogoutButton/LogoutButton";
import { useAuth0 } from "@auth0/auth0-react";

function Home({ helloFWF, onClick }) {
  const { user, isLoading, isAuthenticated } = useAuth0();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Typography variant="h5" gutterBottom>
        Fun with Flags
      </Typography>
      {helloFWF && helloFWF.success && (
        <>
          <Link to="/game">
            <Button
              disableElevation
              variant="contained"
              color="primary"
              onClick={onClick}
            >
              Quick play
            </Button>
          </Link>
          {isAuthenticated ? <LogoutButton /> : <LoginButton />}
          {isAuthenticated && `Logged as ${user.name}`}
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
