import React, { useState, useEffect } from "react";
import { FixedSizeList as List } from "react-window";
import RankItem from "./RankItem";
import { getRequest } from "../../networkManager";

function Rankings() {
  const [rankings, setRankings] = useState(null);

  useEffect(() => {
    const fetchRankings = async () => {
      const data = await getRequest("/rankings");
      setRankings(data.rankings);
    };
    fetchRankings();
  }, []);

  if (!rankings) return null;

  return (
    <List
      itemData={rankings}
      height={400}
      width="100%"
      itemSize={46}
      itemCount={rankings.length}
    >
      {RankItem}
    </List>
  );
}

export default Rankings;
