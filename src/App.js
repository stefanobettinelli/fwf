import React, { useState, useEffect } from "react";

function App() {
  const [helloFlask, setHelloFlask] = useState(null);

  useEffect(() => {
    fetch("/hello")
      .then((res) => res.json())
      .then((data) => setHelloFlask(data));
  }, []);

  return (
    <div>
      <h1>React works</h1>
      <h2>{helloFlask && helloFlask.status}</h2>
    </div>
  );
}

export default App;
