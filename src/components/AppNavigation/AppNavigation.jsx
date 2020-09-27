import React, { useState } from "react";
import { BottomNavigation, BottomNavigationAction } from "@material-ui/core";
import { BarChart, HomeRounded } from "@material-ui/icons";
import * as PropTypes from "prop-types";

function AppNavigation({ onHomeClick, onRankingsClick }) {
  const [value, setValue] = useState(0);

  return (
    <BottomNavigation
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue);
      }}
    >
      <BottomNavigationAction
        label="Home"
        value="home"
        icon={<HomeRounded />}
        onClick={onHomeClick}
      />
      <BottomNavigationAction
        label="Rankings"
        value="rankings"
        icon={<BarChart />}
        onClick={onRankingsClick}
      />
    </BottomNavigation>
  );
}

AppNavigation.propTypes = { onClick: PropTypes.func };

export default AppNavigation;
