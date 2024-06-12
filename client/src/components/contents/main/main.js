import React from "react";
import { useSelector } from 'react-redux';

import Clock from "./clock";
import RecentlyView from "./recentlyView";

const Main = () => {
  const isCollapsed = useSelector(state => state.isCollapsed);

  return (
    <div className={`flex flex-col w-full h-screen transition-all duration-75 ease-in-out ${isCollapsed ? "pl-40" : "pl-64"}`}>
      <div className="text-center items-center h-full">
        <Clock />
        <RecentlyView />
      </div>
    </div>
  );
};

export default Main;