import React, { useState, useEffect } from "react";
import { FixedSizeList as List } from "react-window";
import { Button } from "@material-ui/core";
import RankItem from "./RankItem";
import { deleteRequest, getRequest } from "../../networkManager";
import { ROUTES } from "../../constants";

function Rankings({ isAuthenticated, accessToken }) {
  const [rankings, setRankings] = useState(null);

  useEffect(() => {
    const fetchRankings = async () => {
      const data = await getRequest("/rankings");
      setRankings(data.rankings);
    };
    fetchRankings();
  }, []);

  const resetRankings = async () => {
    await deleteRequest(ROUTES.GAMES, {
      Authorization: `Bearer ${accessToken}`,
    });
    setRankings(null);
  };

  if (!rankings) return null;

  return (
    <>
      {/* TODO: this button will be reintroduced in the future */}
      {/*{isAuthenticated && (*/}
      {/*  <Button*/}
      {/*    disableElevation*/}
      {/*    variant="contained"*/}
      {/*    color="primary"*/}
      {/*    onClick={resetRankings}*/}
      {/*  >*/}
      {/*    Reset rankings*/}
      {/*  </Button>*/}
      {/*)}*/}
      <List
        itemData={rankings}
        height={400}
        width="100%"
        itemSize={46}
        itemCount={rankings.length}
      >
        {RankItem}
      </List>
    </>
  );
}

export default Rankings;
