import React from "react";
import { Button, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

function Home({ helloFWF, onClick }) {
  return (
    <>
      <Typography variant="h5" gutterBottom>
        Fun with Flags
      </Typography>
      {helloFWF && helloFWF.success && (
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
      )}
    </>
  );
}

Home.propTypes = {
  helloFWF: PropTypes.any, // TODO: think about creating a js util file that contain the shapes from network calls
  onClick: PropTypes.func,
};

export default Home;
