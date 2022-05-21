import { React, useState, useEffect} from "react";

import "./clock.css";


 

function Clock() {
  const [tick, setTick] = useState(new Date());

  useEffect(() => {
    setInterval(() => {
      setTick(new Date());
    }, 1000);
  }, []);

  return (
    <h2>{tick.toLocaleTimeString()}</h2>
  );
}

export default Clock;
