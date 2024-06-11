import React from "react";
import Clock from "./clock";
import RecentlyView from "./recentlyView";

const Main = () => {
  return (
    <div className="flex flex-col w-full h-screen pl-64">
      <div className="text-center items-center h-full">
        <Clock />
        <RecentlyView />
      </div>
    </div>
  );
};

export default Main;