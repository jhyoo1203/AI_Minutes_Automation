import React from "react";
import { useSelector } from 'react-redux';

const Minutes = () => {
  const isCollapsed = useSelector(state => state.isCollapsed);

  return (
    <div className={`flex flex-col w-full ${isCollapsed ? "pl-40" : "pl-64"} h-screen`}>
      <div className="flex justify-center items-center h-full">
        <h1 className="text-4xl font-bold">Meeting Minutes</h1>
      </div>
    </div>
  );
};

export default Minutes;