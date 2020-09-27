import React from "react";
import { ListItem, ListItemText } from "@material-ui/core";
import PropTypes from "prop-types";
import useStyle from "./styles";

function RankItem({ data, index, style }) {
  const classes = useStyle();
  if (!data) return null;

  const item = data[index];

  return (
    <ListItem button style={style} key={index}>
      <ListItemText
        primary={index + 1}
        classes={{ root: classes.positionRoot }}
      />
      <ListItemText primary={item.nickname} />
      <ListItemText
        primary={item.score}
        classes={{ root: classes.scoreRoot }}
      />
    </ListItem>
  );
}

RankItem.propTypes = {
  index: PropTypes.number.isRequired,
  style: PropTypes.object.isRequired,
};

export default RankItem;
