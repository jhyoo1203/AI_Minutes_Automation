import React, { useState, useEffect } from "react";

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  const formattedTimeParts = time
    .toLocaleTimeString("en-US", { hour12: false })
    .split(":");

  const formattedTime = `${formattedTimeParts[0]}:${formattedTimeParts[1]} ${formattedTimeParts[2]}`;

  return (
    <>
      <p
        className="text-4xl font-bold mt-20"
        style={{ fontFamily: "Tiny5", textShadow: "2px 2px 2px #000000" }}
      >
        Welcome to Meeting Minutes!
      </p>
      <p
        className="mt-20 text-6xl font-bold"
        style={{ fontFamily: "Tiny5", textShadow: "2px 2px 2px #000000" }}
      >
        {formattedTime}
      </p>
    </>
  );
};

export default Clock;
