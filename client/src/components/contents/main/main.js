import React from "react";
import Clock from "./clock";

const Main = () => {
  

  return (
    <div className="flex flex-col w-4/5 h-screen">
      <div className="text-center items-center h-full">
        <Clock />
      </div>
    </div>
  );
};

export default Main;
