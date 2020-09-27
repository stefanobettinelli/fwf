import React from "react";
import { ListItem, ListItemText } from "@material-ui/core";
import PropTypes from "prop-types";

function RankItem({ data, index, style }) {
  if (!data) return null;

  const item = data[index];

  return (
    <ListItem button style={style} key={index}>
      <ListItemText primary={item.score} />
      <ListItemText primary={item.nickname} />
    </ListItem>
  );
}

RankItem.propTypes = {
  index: PropTypes.number.isRequired,
  style: PropTypes.object.isRequired,
};

export default RankItem;
